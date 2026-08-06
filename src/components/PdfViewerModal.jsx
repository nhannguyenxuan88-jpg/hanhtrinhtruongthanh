import PdfPageFlipViewer from './PdfPageFlipViewer'

/**
 * Modal xem sách gốc PDF với chế độ LẬT TRANG như sách thật (thay vì iframe
 * cuộn dài) — phù hợp với màn hình di động và máy tính bảng.
 * Được render ở CẢ hai view (bố mẹ và bé), vì tab Sách Giáo Khoa tồn tại ở cả hai.
 */
export default function PdfViewerModal({ pdf, onClose, onOpenPika }) {
  if (!pdf) return null
  return (
    <div className="pin-overlay sgk-pdf-overlay" onClick={onClose}>
      <div className="sgk-pdf-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="sgk-pdf-viewer-head">
          <div className="sgk-pdf-viewer-title">📕 {pdf.label}</div>
          <div className="sgk-pdf-viewer-actions">
            {onOpenPika && (
              <button
                type="button"
                className="btn btn-warning btn-sm"
                onClick={() => onOpenPika({ title: pdf.label, subject: 'SGK PDF' })}
              >
                🐥 Hỏi Pika
              </button>
            )}
            <a
              className="btn btn-secondary btn-sm"
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              ↗ Bản gốc
            </a>
            <button type="button" className="btn btn-danger btn-sm" onClick={onClose}>
              ✕ Đóng
            </button>
          </div>
        </div>
        <PdfPageFlipViewer url={pdf.url} />
      </div>
    </div>
  )
}
