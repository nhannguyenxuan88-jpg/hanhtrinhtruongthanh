import { useCallback, useEffect, useRef, useState } from 'react'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Đọc PDF theo kiểu LẬT TRANG như sách thật, thích hợp cho màn hình di động
// và máy tính bảng: một trang mỗi lần, vuốt tay hoặc chạm mép để sang trang.
//
// VÌ SAO KHÔNG DÙNG IFRAME:
// iframe là "cuộn một mạch" - trên điện thoại bé phải kéo từ đầu xuống cuối
// sách, không khác gì đọc file. Lật trang giữ nhịp đọc như sách giấy, kèm số
// trang để bé (và bố mẹ) biết đang ở đâu.
const MIN_SWIPE_PX = 50

export default function PdfPageFlipViewer({ url, onPageChange }) {
  const stageRef = useRef(null)      // vùng chứa, dùng để đo chiều rộng
  const canvasRef = useRef(null)
  const docRef = useRef(null)
  const renderTaskRef = useRef(null)
  const touchRef = useRef(null)

  const [doc, setDoc] = useState(null)
  const [page, setPage] = useState(1)
  const [rendering, setRendering] = useState(false)
  const [error, setError] = useState(null)
  const [flipDir, setFlipDir] = useState('next')

  // ---------- Mở file PDF (nạp chậm, không phình bundle chính) ----------
  useEffect(() => {
    let cancelled = false
    setDoc(null)
    setPage(1)
    setRendering(false)
    setError(null)

    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
        const d = await pdfjs.getDocument({ url }).promise
        if (cancelled) { d.destroy(); return }
        docRef.current = d
        setDoc(d)
      } catch (err) {
        console.error('Không mở được PDF:', err)
        if (!cancelled) {
          setError('Không đọc được file PDF. Hãy dùng nút "↗ Mở tab mới" phía trên.')
        }
      }
    })()

    return () => {
      cancelled = true
      renderTaskRef.current?.cancel()
      renderTaskRef.current = null
      docRef.current?.destroy()
      docRef.current = null
    }
  }, [url])

  // ---------- Vẽ một trang lên canvas, vừa khít bề ngang ----------
  const renderPage = useCallback(async (num) => {
    const d = docRef.current
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!d || !canvas || !stage) return

    try {
      setRendering(true)
      const pdfPage = await d.getPage(num)
      const base = pdfPage.getViewport({ scale: 1 })

      // Trích xuất văn bản chữ hiển thị trên trang PDF này cho Gia Sư Pika đọc
      let extractedText = ''
      try {
        const textContent = await pdfPage.getTextContent()
        extractedText = (textContent.items || []).map(item => item.str).join(' ').replace(/\s+/g, ' ').trim()
      } catch (e) {
        console.warn('Không trích xuất được chữ PDF trang', num, e)
      }

      if (onPageChange) {
        onPageChange({ page: num, totalPages: d.numPages, pageText: extractedText })
      }

      // Bề ngang vừa khung; chấp nhận cuộn dọc nếu trang cao hơn màn hình.
      const maxW = Math.max(stage.clientWidth, 1)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssScale = maxW / base.width
      const viewport = pdfPage.getViewport({ scale: cssScale * dpr })

      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      canvas.style.width = '100%'
      canvas.style.height = 'auto'

      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      renderTaskRef.current?.cancel()
      renderTaskRef.current = pdfPage.render({ canvasContext: ctx, viewport })
      await renderTaskRef.current.promise
      renderTaskRef.current = null
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') console.error('Không vẽ được trang PDF:', err)
    } finally {
      setRendering(false)
    }
  }, [onPageChange])

  useEffect(() => {
    if (doc) renderPage(page)
  }, [doc, page, renderPage])

  // Khi xoay màn hình / thay đổi kích thước -> vẽ lại trang hiện tại
  useEffect(() => {
    if (!doc || !stageRef.current) return
    const ro = new ResizeObserver(() => renderPage(page))
    ro.observe(stageRef.current)
    return () => ro.disconnect()
  }, [doc, page, renderPage])

  // ---------- Điều hướng trang ----------
  const go = useCallback((dir) => {
    if (!doc) return
    const next = Math.max(1, Math.min(doc.numPages, page + dir))
    if (next === page) return
    setFlipDir(dir > 0 ? 'next' : 'prev')
    setPage(next)
  }, [doc, page])

  // Vuốt ngang để lật trang
  const onTouchStart = (e) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e) => {
    if (!touchRef.current) return
    const dx = e.changedTouches[0].clientX - touchRef.current.x
    const dy = e.changedTouches[0].clientY - touchRef.current.y
    touchRef.current = null
    if (Math.abs(dx) > MIN_SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx < 0 ? 1 : -1)
    }
  }

  // Chạm mép trái/phải (như app sách giấy), bấm phím mũi tên trên máy bàn
  const onStageClick = (e) => {
    if (!doc) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width * 0.3) go(-1)
    else if (x > rect.width * 0.7) go(1)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // ---------- Trạng thái ----------
  if (error) {
    return (
      <div className="pdf-flip-empty">
        <span className="pdf-flip-empty-emoji">😢</span>
        <p>{error}</p>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="pdf-flip-empty">
        <span className="spinner"></span>
        <p>Đang mở sách…</p>
      </div>
    )
  }

  return (
    <div className="pdf-flip-root">
      <div
        ref={stageRef}
        className="pdf-flip-stage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onStageClick}
      >
        <div key={`${page}-${flipDir}`} className={`pdf-page-wrap flip-${flipDir}`}>
          <canvas ref={canvasRef} />
          {rendering && <div className="pdf-page-spinner"><span className="spinner-sm"></span></div>}
        </div>
      </div>

      <div className="pdf-nav-bar">
        <button type="button" className="pdf-nav-btn" onClick={() => go(-1)} disabled={page <= 1} aria-label="Trang trước">
          ‹
        </button>
        <span className="pdf-nav-counter">📖 Trang {page}/{doc.numPages}</span>
        <button type="button" className="pdf-nav-btn" onClick={() => go(1)} disabled={page >= doc.numPages} aria-label="Trang sau">
          ›
        </button>
      </div>
      <p className="pdf-swipe-hint">Vuốt tay hoặc chạm mép trang để lật 👆</p>
    </div>
  )
}
