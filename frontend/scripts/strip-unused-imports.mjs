/**
 * strip-unused-imports.mjs
 *
 * Removes import specifiers that ESLint reports as unused.
 * Run: node scripts/strip-unused-imports.mjs <eslint-report.json>
 */

import fs from 'node:fs'

const reportPath = process.argv[2] ?? 'eslint-report.json'
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))

/** Collect unused identifier names per file. */
const unusedByFile = new Map()
for (const file of report) {
  for (const msg of file.messages) {
    if (msg.ruleId !== '@typescript-eslint/no-unused-vars') continue
    const name = /^'(.+?)' is (defined|assigned a value) but never used/.exec(msg.message)?.[1]
    if (!name) continue
    if (!unusedByFile.has(file.filePath)) unusedByFile.set(file.filePath, new Set())
    unusedByFile.get(file.filePath).add(name)
  }
}

const IMPORT_RE = /^import\s+([\s\S]*?)\s+from\s+(['"][^'"]+['"])\s*;?\s*$/

let changedFiles = 0
let removedSpecifiers = 0

for (const [filePath, unusedNames] of unusedByFile) {
  const source = fs.readFileSync(filePath, 'utf8')
  const lines = source.split('\n')
  const output = []
  let touched = false

  for (let i = 0; i < lines.length; i++) {
    // Join multi-line import statements before matching.
    let stmt = lines[i]
    let consumed = 0
    if (/^import\s/.test(stmt) && !/\bfrom\s+['"]/.test(stmt)) {
      while (i + consumed + 1 < lines.length && !/\bfrom\s+['"]/.test(stmt)) {
        consumed++
        stmt += '\n' + lines[i + consumed]
      }
    }

    const match = IMPORT_RE.exec(stmt.trim())
    if (!match) {
      output.push(stmt)
      i += consumed
      continue
    }

    const [, clause, moduleSpecifier] = match
    const bracedMatch = /\{([\s\S]*)\}/.exec(clause)
    const defaultPart = clause
      .replace(/\{[\s\S]*\}/, '')
      .replace(/,\s*$/, '')
      .trim()
      .replace(/,$/, '')

    const named = bracedMatch
      ? bracedMatch[1]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []

    const localName = (spec) => spec.split(/\s+as\s+/).pop().trim()

    const keptNamed = named.filter((spec) => !unusedNames.has(localName(spec)))
    const keptDefault =
      defaultPart && !unusedNames.has(localName(defaultPart)) ? defaultPart : ''

    const removed = named.length - keptNamed.length + (defaultPart && !keptDefault ? 1 : 0)
    if (removed === 0) {
      output.push(stmt)
      i += consumed
      continue
    }

    touched = true
    removedSpecifiers += removed

    if (!keptDefault && keptNamed.length === 0) {
      i += consumed
      continue // drop the whole import statement
    }

    const parts = []
    if (keptDefault) parts.push(keptDefault)
    if (keptNamed.length > 0) parts.push(`{ ${keptNamed.join(', ')} }`)
    output.push(`import ${parts.join(', ')} from ${moduleSpecifier}`)
    i += consumed
  }

  if (touched) {
    fs.writeFileSync(filePath, output.join('\n'), 'utf8')
    changedFiles++
  }
}

console.log(`Updated ${changedFiles} files, removed ${removedSpecifiers} unused import specifiers.`)
