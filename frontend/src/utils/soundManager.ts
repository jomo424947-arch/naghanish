/**
 * soundManager.ts
 *
 * Zero-dependency Web Audio API sound synthesis engine.
 * Generates instant, crisp retro arcade sound effects and UI audio without loading external MP3 files.
 */

class SoundManager {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    // Check if user previously muted
    const stored = localStorage.getItem('naghanish_sound_enabled')
    if (stored !== null) {
      this.enabled = stored === 'true'
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled
    localStorage.setItem('naghanish_sound_enabled', String(this.enabled))
    if (this.enabled) {
      this.playClick()
    }
    return this.enabled
  }

  public setEnabled(val: boolean) {
    this.enabled = val
    localStorage.setItem('naghanish_sound_enabled', String(val))
  }

  /**
   * Subtle UI Button Click / Tap
   */
  public playClick() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05)

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }

  /**
   * Retro Arcade Jump (for Pixel Runner)
   */
  public playJump() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(150, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.15)
  }

  /**
   * Crisp Ball Bounce / Paddle Hit (for Pong & Brick Breaker)
   */
  public playBounce() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(440, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.08)
  }

  /**
   * Brick Smash (for Brick Breaker)
   */
  public playBrickSmash() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(800, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.06)

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.06)
  }

  /**
   * Snake Eating Food / Fruit Pickup
   */
  public playEat() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1040, this.ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.22, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.08)
  }

  /**
   * Laser Shoot (for Space Shooter)
   */
  public playLaser() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(900, this.ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.12)

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.12)
  }

  /**
   * Coin / Point Chime (Two-tone high chime)
   */
  public playCoin() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'

    osc.frequency.setValueAtTime(987.77, now) // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08) // E6

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(now + 0.3)
  }

  /**
   * Victory / Level Complete Fanfare
   */
  public playWin() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.1
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.25, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.25)
    })
  }

  /**
   * Game Over / Loss Sound
   */
  public playGameOver() {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const notes = [392.0, 369.99, 349.23, 311.13] // G4, F#4, F4, D#4
    notes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const startTime = this.ctx.currentTime + idx * 0.12
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, startTime)

      gain.gain.setValueAtTime(0.18, startTime)
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.22)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + 0.22)
    })
  }

  /**
   * Timer Tick / Countdown Beep
   */
  public playTick(high = false) {
    if (!this.enabled) return
    this.initContext()
    if (!this.ctx) return

    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(high ? 880 : 440, this.ctx.currentTime)

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + 0.05)
  }
}

export const sound = new SoundManager()
