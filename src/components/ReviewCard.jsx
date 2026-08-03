const KIND_META = {
  sgk: { emoji: '📗', label: 'Sách giáo khoa' },
  math: { emoji: '🧮', label: 'Toán tư duy' },
  book: { emoji: '📚', label: 'Đọc sách' },
}

/**
 * Một thẻ trong hàng đợi ôn tập.
 *
 * Chủ ý thiết kế: hiển thị lại ĐÚNG những câu con đã sai lần trước, ngay trên
 * thẻ. Con nhìn thấy chỗ mình hụt trước khi mở lại bài thì việc ôn mới có
 * trọng tâm, thay vì đọc lướt lại từ đầu cho xong.
 */
export default function ReviewCard({ item, tone, onOpen }) {
  const meta = KIND_META[item.kind] || { emoji: '📖', label: 'Bài học' }
  const pct = Math.round(item.accuracy * 100)

  const whenText = item.isDue
    ? 'Đến hẹn ôn lại'
    : item.daysUntilDue <= 1
      ? 'Ngày mai'
      : `Còn ${item.daysUntilDue} ngày`

  return (
    <div className={`review-card glass ${item.isDue ? 'is-due' : ''}`}>
      <div className="review-card-head">
        <span className="review-card-emoji">{meta.emoji}</span>
        <div className="review-card-title-box">
          <h5 className="review-card-title">{item.title || meta.label}</h5>
          <span className="review-card-sub">{item.subject || meta.label}</span>
        </div>
        <span className={`review-card-when ${item.isDue ? 'due' : ''}`}>{whenText}</span>
      </div>

      <div className="review-card-stat">
        <span className="review-accuracy-label">Đúng ngay lần đầu</span>
        <div className="review-accuracy-track">
          <div
            className={`review-accuracy-fill ${pct < 50 ? 'low' : pct < 80 ? 'mid' : 'high'}`}
            style={{ width: `${Math.max(4, pct)}%` }}
          />
        </div>
        <span className="review-accuracy-pct">{pct}%</span>
      </div>

      {item.wrongAnswers.length > 0 && (
        <details className="review-card-misses">
          <summary>Xem {item.wrongAnswers.length} câu đã sai lần trước</summary>
          <ul>
            {item.wrongAnswers.slice(0, 5).map((w, i) => (
              <li key={i}>
                <span className="miss-q">{w.q}</span>
                <span className="miss-a">✅ {w.correct}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <button type="button" className="btn btn-primary btn-block btn-sm" onClick={onOpen}>
        {tone.isTeen ? 'Mở lại bài' : 'Ôn lại bài này ➜'}
      </button>
    </div>
  )
}
