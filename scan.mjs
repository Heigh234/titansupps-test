import { readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js']
const IGNORE = ['node_modules', '.next', '.git', 'dist', 'build']

function scan(dir, results = []) {
  for (const file of readdirSync(dir)) {
    if (IGNORE.includes(file)) continue
    const full = join(dir, file)
    if (statSync(full).isDirectory()) scan(full, results)
    else if (EXTENSIONS.includes(extname(file))) results.push(full)
  }
  return results
}

console.log(scan('./').join('\n'))