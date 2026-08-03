import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // pdfjs-dist v5 không tương thích với bộ prebundle của Vite (worker/lỗi
    // runtime khi mở PDF). Loại khỏi prebundle để dev server phục vụ bản ESM
    // gốc — đã kiểm chứng hoạt động đúng.
    exclude: ['pdfjs-dist'],
  },
})
