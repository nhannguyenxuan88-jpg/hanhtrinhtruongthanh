import { useEffect, useState } from 'react'
import { textbookPdfFor, pdfFileExists } from '../lib/textbookPdfs'

/**
 * Nút "📕 Xem sách gốc" trên thẻ mỗi quyển sách.
 * Chỉ hiện khi file PDF thực sự tồn tại (đã chạy scripts/copy-textbooks.cjs),
 * để bé/bố mẹ không bấm vào nút chết.
 */
export default function SgkPdfButton({ book, onOpen }) {
  const [available, setAvailable] = useState(null)
  const pdf = textbookPdfFor(book)

  useEffect(() => {
    if (!pdf) return
    let cancelled = false
    pdfFileExists(pdf.file).then(ok => {
      if (!cancelled) setAvailable(ok)
    })
    return () => { cancelled = true }
  }, [pdf])

  if (!pdf || available !== true) return null

  return (
    <button
      type="button"
      className="sgk-pdf-btn"
      title={pdf.label}
      onClick={(e) => {
        e.stopPropagation()
        onOpen({ url: '/' + pdf.file, label: pdf.label })
      }}
    >
      📕 Xem sách gốc
    </button>
  )
}
