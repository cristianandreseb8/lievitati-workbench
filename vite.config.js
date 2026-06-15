import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function safePublicCopy() {
  return {
    name: 'safe-public-copy',
    apply: 'build',
    closeBundle() {
      const publicDir = path.resolve(__dirname, 'public')
      const outDir = path.resolve(__dirname, 'dist')
      function copyDir(src, dest) {
        let entries
        try { entries = fs.readdirSync(src) } catch { return }
        fs.mkdirSync(dest, { recursive: true })
        for (const entry of entries) {
          const srcPath = path.join(src, entry)
          const destPath = path.join(dest, entry)
          try {
            const stat = fs.statSync(srcPath)
            if (stat.isDirectory()) copyDir(srcPath, destPath)
            else fs.copyFileSync(srcPath, destPath)
          } catch { /* skip locked files */ }
        }
      }
      copyDir(publicDir, outDir)
    },
  }
}

export default defineConfig({
  base: "./",
  plugins: [react(), safePublicCopy()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  build: {
    copyPublicDir: false,
  },
})
