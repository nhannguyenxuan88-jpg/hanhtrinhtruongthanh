// Ánh xạ giữa sách trong app và file PDF bản gốc (đồng bộ bởi scripts/copy-textbooks.cjs).
//
// VÌ SAO CẦN:
// Nội dung bài học trong app là bản tóm tắt rút gọn + trắc nghiệm, phù hợp cho
// việc ôn tập nhanh. Nhưng để con đọc đúng sách với đầy đủ tranh minh hoạ đẹp
// mắt, bố mẹ cần xem được bản gốc PDF. Mỗi quyển sách trong app (theo id trong
// textbookData.js) được gắn với một file PDF tương ứng.
export const TEXTBOOK_PDFS = {
  // Tiếng Việt 2 - Kết nối tri thức 2026
  'tv2_t1': { file: 'textbooks/tv2-tap1.pdf', label: 'Tiếng Việt 2 - Tập 1 (bản gốc PDF)' },
  'tv2_t2': { file: 'textbooks/tv2-tap2.pdf', label: 'Tiếng Việt 2 - Tập 2 (bản gốc PDF)' },
  // Toán 2 - Kết nối tri thức 2026
  'toan2_t1': { file: 'textbooks/toan2-tap1.pdf', label: 'Toán 2 - Tập 1 (bản gốc PDF)' },
  'toan2_t2': { file: 'textbooks/toan2-tap2.pdf', label: 'Toán 2 - Tập 2 (bản gốc PDF)' },
  // Ngữ văn 8 - chương trình mới (2026)
  'van8_t1': { file: 'textbooks/van8-tap1.pdf', label: 'Ngữ văn 8 - Tập 1 (bản gốc PDF)' },
  'van8_t2': { file: 'textbooks/van8-tap2.pdf', label: 'Ngữ văn 8 - Tập 2 (bản gốc PDF)' },
  // Toán 8 - chương trình mới (2026)
  'toan8_t1': { file: 'textbooks/toan8-tap1.pdf', label: 'Toán 8 - Tập 1 (bản gốc PDF)' },
  'toan8_t2': { file: 'textbooks/toan8-tap2.pdf', label: 'Toán 8 - Tập 2 (bản gốc PDF)' },
  // Tiếng Anh 8 - Global Success
  'anh8_sgk': { file: 'textbooks/anh8-sgk.pdf', label: 'Tiếng Anh 8 - SGK Global Success (bản gốc PDF)' },
  'anh8_sbt': { file: 'textbooks/anh8-sbt.pdf', label: 'Tiếng Anh 8 - Sách bài tập (bản gốc PDF)' },
}

/** File PDF của một cuốn sách, hoặc null nếu chưa có bản gốc. */
export function textbookPdfFor(book) {
  if (!book) return null
  return TEXTBOOK_PDFS[book.id] || null
}

// Nhớ kết quả kiểm tra file để không gọi lại mỗi lần render
const availabilityCache = new Map()

/**
 * Kiểm tra file PDF có thật sự được phục vụ không (đã chạy script đồng bộ
 * chưa). Nút "Xem sách gốc" chỉ hiện khi file tồn tại — tránh nút chết khi
 * bố mẹ chưa tải PDF về.
 *
 * KHÔNG dùng HEAD request: một số dev server (Vite) trả 200 kèm index.html
 * (SPA fallback) cho file không tồn tại, đánh lừa mọi kiểm tra theo status.
 * Thay vào đó tải 8 byte đầu (Range request) và đối chiếu chữ ký "%PDF-".
 */
export async function pdfFileExists(file) {
  const key = '/' + file
  if (availabilityCache.has(key)) return availabilityCache.get(key)
  try {
    const res = await fetch(key, {
      headers: { Range: 'bytes=0-7' },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) {
      availabilityCache.set(key, false)
      return false
    }
    const reader = res.body.getReader()
    const { value } = await reader.read()
    reader.cancel().catch(() => {})
    const head = new TextDecoder().decode(value || new Uint8Array())
    const ok = head.startsWith('%PDF-')
    availabilityCache.set(key, ok)
    return ok
  } catch {
    availabilityCache.set(key, false)
    return false
  }
}
