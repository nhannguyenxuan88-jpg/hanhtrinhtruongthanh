import { useState, useEffect } from 'react'
import { readingTimeSeconds } from '../lib/learning'

/**
 * Nút vào trắc nghiệm có cổng chống đọc lướt.
 *
 * VẤN ĐỀ NÓ GIẢI QUYẾT:
 * Trước đây bé có thể mở bài rồi bấm thẳng vào trắc nghiệm trong 1 giây, đoán
 * bừa cho tới khi trúng và vẫn nhận đủ sao. Nút này giữ bé ở lại trang đọc một
 * khoảng thời gian tối thiểu tính theo độ dài bài.
 *
 * Đây là hàng rào mềm, không phải khoá cứng: mục đích là tạo một khoảng dừng
 * để bé thực sự đọc, chứ không phải trừng phạt.
 */
export default function ReadingGateButton({
  text,
  onReady,
  tone,
  className = '',
  children,
}) {
  const requiredSeconds = readingTimeSeconds(text)
  const [remaining, setRemaining] = useState(requiredSeconds)

  // Bài đổi -> đếm lại từ đầu
  useEffect(() => {
    setRemaining(readingTimeSeconds(text))
  }, [text])

  useEffect(() => {
    if (remaining <= 0) return
    const timer = setInterval(() => {
      setRemaining(prev => (prev <= 1 ? 0 : prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [remaining])

  const locked = remaining > 0

  return (
    <button
      type="button"
      className={`${className} reading-gate-btn ${locked ? 'locked' : 'ready'}`}
      disabled={locked}
      onClick={onReady}
      aria-live="polite"
    >
      {locked ? tone.readingGate(remaining) : (children || tone.readingReady)}
    </button>
  )
}
