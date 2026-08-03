import { useMemo } from 'react'
import { buildWeeklyDigest, digestToText } from '../lib/learning'

/**
 * Bản tin học tập 7 ngày cho bố mẹ.
 *
 * VÌ SAO CẦN:
 * Bố mẹ đi làm cả ngày, không ai mở app mỗi tối để xem từng lượt học. Thứ họ
 * thực sự cần là một câu trả lời ngắn cho "tuần này con học thế nào, có tiến bộ
 * không, và mình nên ngồi ôn cùng con phần nào".
 *
 * Mọi con số đều so với 7 ngày liền trước, vì con số tuyệt đối ("3 buổi học")
 * không nói lên điều gì nếu không biết tuần trước là 1 hay 10.
 */
function Delta({ value, unit = '', invert = false }) {
  if (value === null || value === undefined || value === 0) return null
  const good = invert ? value < 0 : value > 0
  return (
    <span className={`digest-delta ${good ? 'up' : 'down'}`}>
      {value > 0 ? '▲' : '▼'} {Math.abs(value)}{unit}
    </span>
  )
}

export default function WeeklyDigestPanel({
  sessions,
  childName,
  dueReviews = [],
  onCopied,
  onCopyFailed,
}) {
  const digest = useMemo(() => buildWeeklyDigest(sessions), [sessions])
  const text = useMemo(() => digestToText(digest, childName), [digest, childName])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      onCopied?.()
    } catch {
      // Trình duyệt chặn clipboard (thường do không chạy HTTPS) -> hiện text để bố mẹ tự copy
      onCopyFailed?.(text)
    }
  }

  if (!digest.hasData) {
    return (
      <div className="weekly-digest glass">
        <div className="digest-head">
          <h4 className="digest-title">📬 Bản tin tuần</h4>
        </div>
        <p className="digest-empty">
          7 ngày qua chưa có lượt học nào của {childName} được ghi nhận.
        </p>
      </div>
    )
  }

  const accuracyPct = digest.accuracy === null ? null : Math.round(digest.accuracy * 100)
  const deltaAccPct = digest.deltaAccuracy === null ? null : Math.round(digest.deltaAccuracy * 100)

  return (
    <div className="weekly-digest glass">
      <div className="digest-head">
        <h4 className="digest-title">📬 Bản tin tuần — {childName}</h4>
        <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopy}>
          📋 Sao chép bản tin
        </button>
      </div>

      <div className="digest-metrics">
        <div className="digest-metric">
          <span className="digest-metric-val">{digest.sessionCount}</span>
          <span className="digest-metric-label">buổi học</span>
          <Delta value={digest.deltaSessions} />
        </div>
        <div className="digest-metric">
          <span className="digest-metric-val">{digest.lessonCount}</span>
          <span className="digest-metric-label">bài khác nhau</span>
        </div>
        <div className="digest-metric">
          <span className="digest-metric-val">{digest.minutes}</span>
          <span className="digest-metric-label">phút</span>
          <Delta value={digest.deltaMinutes} unit="p" />
        </div>
        <div className="digest-metric">
          <span className="digest-metric-val">{digest.activeDays}<small>/7</small></span>
          <span className="digest-metric-label">ngày có học</span>
        </div>
        <div className="digest-metric">
          <span className="digest-metric-val">
            {accuracyPct === null ? '—' : `${accuracyPct}%`}
          </span>
          <span className="digest-metric-label">đúng ngay lần đầu</span>
          <Delta value={deltaAccPct} unit="%" />
        </div>
        <div className="digest-metric">
          <span className="digest-metric-val">{digest.starsEarned} ⭐</span>
          <span className="digest-metric-label">sao nhận được</span>
        </div>
      </div>

      {dueReviews.length > 0 && (
        <p className="digest-due">
          🔔 Có <strong>{dueReviews.length}</strong> bài đã đến hẹn ôn lại. Nhắc con mở tab
          &ldquo;Ôn tập&rdquo; nhé.
        </p>
      )}

      {digest.topMisses.length > 0 && (
        <div className="digest-misses">
          <h5 className="digest-sub">🎯 Nên ngồi ôn cùng con</h5>
          <ol>
            {digest.topMisses.map((m, i) => (
              <li key={i}>
                <span className="digest-miss-q">{m.q}</span>
                <span className="digest-miss-a">✅ {m.correct}</span>
                {m.count > 1 && <span className="digest-miss-count">sai {m.count} lần</span>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
