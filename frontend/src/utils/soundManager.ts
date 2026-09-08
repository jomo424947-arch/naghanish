/**
 * soundManager.ts
 *
 * Advanced Web Audio API synthesizer for Naghanish.
 * Features:
 * - Retro arcade SFX: click, jump, bounce, smash, eat, laser, coin, win, game over, tick, swoosh, combo, level-up.
 * - Procedural Cyber Ambient & Arcade Background Music (BGM) synthesizer (zero-latency, no external audio assets needed).
 * - Independent SFX & BGM Volume & Mute Controls with persistent state in localStorage.
 */

class SoundManager {
  private ctx: AudioContext | null = null
  private sfxEnabled: boolean = true
  private bgmEnabled: boolean = false
  private sfxVolume: number = 0.8
  private bgmVolume: number = 0.35

  // Background Music state
  private bgmOscillators: OscillatorNode[] = []
  private bgmGain: GainNode | null = null
  private bgmInterval: number | null = null
  private currentTrackIndex: number = 0

  constructor() {
    if (typeof window !== 'undefined') {
      const storedSfx = localStorage.getItem('naghanish_sound_enabled')
      if (storedSfx !== null) {
        this.sfxEnabled = storedSfx === 'true'
      }

      const storedBgm = localStorage.getItem('naghanish_bgm_enabled')
      if (storedBgm !== null) {
        this.bgmEnabled = storedBgm === 'true'
      }

      const storedVol = localStorage.getItem('naghanish_sfx_volume')
      if (storedVol !== null) {
        this.sfxVolume = parseFloat(storedVol) || 0.8
      }

      const storedBgmVol = localStorage.getItem('naghanish_bgm_volume')
      if (storedBgmVol !== null) {
        this.bgmVolume = parseFloat(storedBgmVol) || 0.35
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // ──────────────────────────── CONTROL METHODS ────────────────────────────

  public isEnabled(): boolean {
    return this.sfxEnabled
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled
  }

  public getSfxVolume(): number {
    return this.sfxVolume
  }

  public getBgmVolume(): number {
    return this.bgmVolume
  }

  public toggleSound(): boolean {
    this.sfxEnabled = !this.sfxEnabled
    localStorage.setItem('naghanish_sound_enabled', String(this.sfxEnabled))
    if (this.sfxEnabled) {
      this.playClick()
    }
    return this.sfxEnabled
  }

  public toggleBgm(): boolean {
    this.initContext()
    this.bgmEnabled = !this.bgmEnabled
    localStorage.setItem('naghanish_bgm_enabled', String(this.bgmEnabled))
    if (this.bgmEnabled) {
      this.startBgm()
    } else {
      this.stopBgm()
    }
    return this.bgmEnabled
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol))
    localStorage.setItem('naghanish_sfx_volume', String(this.sfxVolume))
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol))
    localStorage.setItem('naghanish_bgm_volume', String(this.bgmVolume))
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume * 0.15, this.ctx.currentTime)
    }
  }

  // ──────────────────────────── PROCEDURAL BGM ────────────────────────────

  /**
   * Starts a smooth cyberpunk ambient synth arpeggio in the background.
   */
  public startBgm() {
    if (!this.bgmEnabled) return
    this.initContext()
    if (!this.ctx) return

    this.stopBgm()

    this.bgmGain = this.ctx.createGain()
    this.bgmGain.gain.setValueAtTime(this.bgmVolume * 0.15, this.ctx.currentTime)
    this.bgmGain.connect(this.ctx.destination)

    // Notes scale: C minor pentatonic / synthwave vibe (C3, Eb3, F3, G3, Bb3, C4, Eb4, G4)
    const melody = [
      130.81, 155.56, 174.61, 196.0, 233.08, 261.63, 311.13, 392.0,
      311.13, 261.63, 233.08, 196.0, 174.61, 196.0, 233.08, 261.63,
    ]
    let step = 0

    // Play next note every 240ms
    this.bgmInterval = window.setInterval(() => {
      if (!this.ctx || !this.bgmGain || !this.bgmEnabled) return

      const freq = melody[step % melody.length]
      step++

      const osc = this.ctx.createOscillator()
      const noteGain = this.ctx.createGain()

      osc.type = step % 4 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      // Soft envelope for ambient non-intrusive sound
      noteGain.gain.setValueAtTime(0.001, this.ctx.currentTime)
      noteGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.04)
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22)

      osc.connect(noteGain)
      noteGain.connect(this.bgmGain)

      osc.start(this.ctx.currentTime)
      osc.stop(this.ctx.currentTime + 0.23)
    }, 240)
  }

  public stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval)
      this.bgmInterval = null
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1)
    }
  }

  // ──────────────────────────── SOUND EFFECTS (SFX) ────────────────────────────

  public playClick() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.12 * this.sfxVolume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }

  public playJump() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(150, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.15)
  }

  public playBounce() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(240, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.08)
  }

  public playBrickSmash() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(450, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.22 * this.sfxVolume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.1)
  }

  public playEat() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.09)

    gain.gain.setValueAtTime(0.18 * this.sfxVolume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.09)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.09)
  }

  public playLaser() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(900, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.12)

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.12)
  }

  public playCoin() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'

    osc.frequency.setValueAtTime(987.77, now)
    osc.frequency.setValueAtTime(1318.51, now + 0.08)

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(now + 0.3)
  }

  public playCombo() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [440, 554.37, 659.25, 880]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.06
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.15)
    })
  }

  public playSwoosh() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(200, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.1)
  }

  public playWin() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.1
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.25)
    })
  }

  public playGameOver() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [392.0, 369.99, 349.23, 311.13]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.12
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.18 * this.sfxVolume, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.22)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.22)
    })
  }

  public playTick(high = false) {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(high ? 880 : 440, this.ctx.currentTime)

    gain.gain.setValueAtTime(0.1 * this.sfxVolume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }

  public playLineClear() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.04
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)
      gain.gain.setValueAtTime(0.2 * this.sfxVolume, startTime)
      gain.gain.exponentialRampToValueAtTime(0.005, startTime + 0.15)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.15)
    })
  }

  public playExplosion() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.35)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(600, now)
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.35)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.35 * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.35)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)
    noise.start(now)

    const osc = this.ctx.createOscillator()
    const oscGain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3)
    oscGain.gain.setValueAtTime(0.4 * this.sfxVolume, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
    osc.connect(oscGain)
    oscGain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.3)
  }

  public playShieldUp() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(350, now)
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25)
    gain.gain.setValueAtTime(0.2 * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  public playBossAlert() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const pulses = [0, 0.12, 0.24]
    pulses.forEach((timeOffset) => {
      if (!this.ctx) return
      const now = this.ctx.currentTime + timeOffset
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.09)
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.09)
    })
  }

  public playPowerUp() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.08
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)
      gain.gain.setValueAtTime(0.22 * this.sfxVolume, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.2)
    })
  }

  public playPerfectHit() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc1.type = 'sine'
    osc2.type = 'triangle'
    osc1.frequency.setValueAtTime(1567.98, now)
    osc2.frequency.setValueAtTime(2093.0, now)
    gain.gain.setValueAtTime(0.2 * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.ctx.destination)
    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.2)
    osc2.stop(now + 0.2)
  }

  public playMiss() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(90, now)
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12)
    gain.gain.setValueAtTime(0.18 * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.12)
  }

  public playComboX2() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [523.25, 659.25]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.07
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)
      gain.gain.setValueAtTime(0.2 * this.sfxVolume, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.14)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.14)
    })
  }

  public playComboX4() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.05
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)
      gain.gain.setValueAtTime(0.22 * this.sfxVolume, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.16)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.16)
    })
  }

  public playComboX8() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5]
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.04
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, startTime)
      gain.gain.setValueAtTime(0.2 * this.sfxVolume, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.15)
    })
  }

  public playPortal() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)
    osc.frequency.exponentialRampToValueAtTime(330, now + 0.22)
    gain.gain.setValueAtTime(0.2 * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22)
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.22)
  }

  public playCountdown(finalBeat = false) {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = finalBeat ? 'triangle' : 'sine'
    osc.frequency.setValueAtTime(finalBeat ? 1760 : 880, now)
    gain.gain.setValueAtTime((finalBeat ? 0.28 : 0.18) * this.sfxVolume, now)
    gain.gain.exponentialRampToValueAtTime(0.005, now + (finalBeat ? 0.35 : 0.12))
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + (finalBeat ? 0.35 : 0.12))
  }

  public playMove() {
    if (!this.sfxEnabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(500, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.04)

    gain.gain.setValueAtTime(0.1 * this.sfxVolume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.04)
  }
}

export const sound = new SoundManager()
export const soundManager = sound
