/**
 * rewrite-mode-imports.mjs
 *
 * Points `NaghanishModeId` / `NAGHANISH_MODES` imports at `@constants/modes`
 * instead of the `ModeVisuals` component module.
 */

import fs from 'node:fs'
import path from 'node:path'

const SRC = path.resolve('src')
const MOVED = new Set(['NaghanishModeId', 'NAGHANISH_MODES'])

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (/\.tsx?$/.test(entry.name)) yield full
  }
}

const IMPORT_RE = /import\s+\{([^}]*)\}\s+from\s+'(@components\/common\/ModeVisuals|\.\/ModeVisuals)'\s*\n/g

let changed = 0
for (const file of walk(SRC)) {
  if (file.endsWith(path.join('common', 'ModeVisuals.tsx'))) continue

  const source = fs.readFileSync(file, 'utf8')
  let touched = false

  const next = source.replace(IMPORT_RE, (full, names) => {
    const specifiers = names
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const moved = specifiers.filter((s) => MOVED.has(s.split(/\s+as\s+/)[0].trim()))
    if (moved.length === 0) return full

    touched = true
    const kept = specifiers.filter((s) => !moved.includes(s))
    const lines = [`import { ${moved.join(', ')} } from '@constants/modes'`]
    if (kept.length > 0) {
      lines.push(`import { ${kept.join(', ')} } from '@components/common/ModeVisuals'`)
    }
    return lines.join('\n') + '\n'
  })

  if (touched) {
    fs.writeFileSync(file, next, 'utf8')
    changed++
    console.log('updated', path.relative(SRC, file))
  }
}

console.log(`\nRewrote imports in ${changed} files.`)
