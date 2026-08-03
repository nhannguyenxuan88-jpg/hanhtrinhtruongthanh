// Logic học tập dùng chung: chấm sao trung thực, cổng chống đọc lướt,
// ôn tập lặp lại và bản tin tuần cho bố mẹ.
//
// BỐI CẢNH QUAN TRỌNG:
// Trong mọi phần trắc nghiệm của app, bé BẮT BUỘC trả lời đúng mới được sang
// câu tiếp theo. Vì vậy "số câu đúng" cuối bài luôn bằng điểm tuyệt đối và
// không nói lên điều gì. Mọi phép đo ở đây đều dựa trên số câu bé trả lời
// ĐÚNG NGAY LẦN ĐẦU (quiz_first_try) — đó mới là thước đo thật sự của việc
// bé có nắm bài hay chỉ đang đoán bừa.

// ---------- 1. Chấm sao theo mức độ nắm bài ----------

/**
 * Chấm kết quả một lượt trắc nghiệm.
 *
 * Nguyên tắc thiết kế:
 *  - KHÔNG BAO GIỜ về 0 sao. Bé đã ngồi học hết bài thì vẫn xứng đáng được
 *    ghi nhận; về 0 chỉ khiến bé nản và bỏ cuộc.
 *  - Nhưng chỉ khi đúng ngay lần đầu bé mới nhận trọn sao. Đoán bừa cho tới
 *    khi trúng vẫn được sao, chỉ là ít hơn thấy rõ.
 */
export function gradeQuizResult(baseStars, firstTryCount, total) {
  const base = Math.max(1, baseStars || 5)

  // Lượt học không có câu hỏi (dữ liệu cũ): giữ nguyên phần thưởng gốc
  if (!total) {
    return { accuracy: null, ratio: 1, stars: base, rank: RANKS.solid }
  }

  const accuracy = Math.max(0, Math.min(1, firstTryCount / total))

  let ratio, rank
  if (accuracy >= 0.9) {
    ratio = 1; rank = RANKS.excellent
  } else if (accuracy >= 0.7) {
    ratio = 0.8; rank = RANKS.good
  } else if (accuracy >= 0.5) {
    ratio = 0.6; rank = RANKS.solid
  } else {
    ratio = 0.4; rank = RANKS.needsReview
  }

  return { accuracy, ratio, stars: Math.max(1, Math.round(base * ratio)), rank }
}

const RANKS = {
  excellent: {
    key: 'excellent',
    emoji: '🏆',
    title: 'XUẤT SẮC!',
    msg: 'Con trả lời đúng ngay từ lần đầu gần như tất cả câu hỏi. Đây mới là học thật!',
    teenMsg: 'Gần như tuyệt đối ngay lần đầu. Con nắm chắc bài này rồi.',
  },
  good: {
    key: 'good',
    emoji: '🌟',
    title: 'RẤT GIỎI!',
    msg: 'Con nắm bài khá chắc. Còn một vài chỗ nhỏ cần xem lại thôi!',
    teenMsg: 'Nắm bài khá chắc, còn vài điểm cần củng cố.',
  },
  solid: {
    key: 'solid',
    emoji: '🎉',
    title: 'HOÀN THÀNH!',
    msg: 'Con đã đi hết bài. Đọc kỹ lại một lượt rồi thử lại để đúng nhiều hơn nhé!',
    teenMsg: 'Đã hoàn thành. Đọc lại phần chưa chắc rồi làm lại sẽ tốt hơn.',
  },
  needsReview: {
    key: 'needsReview',
    emoji: '📖',
    title: 'CẦN ÔN LẠI',
    msg: 'Con phải thử nhiều lần mới ra đáp án. Đọc lại bài rồi làm lại sẽ nhớ lâu hơn nhiều!',
    teenMsg: 'Phải thử nhiều lần mới ra đáp án — dấu hiệu bài này chưa vững. Nên đọc lại.',
  },
}

// ---------- 2. Cổng chống đọc lướt ----------

/**
 * Chia nội dung bài SGK thành các TRANG như sách thật.
 *
 * Dữ liệu bài SGK là một khối văn bản liền mạch, mỗi phần được ngăn bằng dòng
 * "---". Trước đây toàn bộ bài hiện trên MỘT trang dài phải cuộn, bé thấy như
 * đang xem tài liệu hơn là đọc sách. Giờ mỗi phần đó trở thành một trang, lật
 * từng trang như sách giấy.
 */
export function splitSgkPages(content) {
  const pages = []
  let current = []
  for (const line of String(content || '').split('\n')) {
    if (line.trim().startsWith('---')) {
      if (current.length) pages.push(current)
      current = [line]
    } else {
      current.push(line)
    }
  }
  if (current.some(l => l.trim() !== '')) pages.push(current)
  return pages.length ? pages : [['']]
}

/**
 * Thời gian tối thiểu (giây) bé cần ở lại trang đọc trước khi được vào
 * trắc nghiệm. Trẻ tiểu học đọc khoảng 100-120 từ/phút; ở đây lấy mốc rộng
 * rãi 2.5 từ/giây để không làm bé sốt ruột, và chặn trên 180 giây để bài dài
 * không biến thành hình phạt.
 */
export function readingTimeSeconds(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean).length
  if (!words) return 0
  return Math.min(180, Math.max(10, Math.round(words / 2.5)))
}

// ---------- 3. Ôn tập lặp lại (Spaced Repetition) ----------

const REVIEW_SOON_DAYS = 3   // chưa vững -> ôn lại sau 3 ngày
const REVIEW_LATER_DAYS = 7  // khá vững -> ôn lại sau 7 ngày

/**
 * Dựng hàng đợi ôn tập từ lịch sử học. Không cần bảng riêng: trạng thái được
 * suy ra từ lượt học GẦN NHẤT của mỗi bài, nên không bao giờ lệch với thực tế.
 *
 * Bài nào bé đúng ngay lần đầu >= 95% thì coi như đã nắm chắc, bỏ khỏi hàng đợi.
 */
export function computeReviewQueue(sessions = [], now = new Date()) {
  const latest = new Map()
  sessions.forEach(s => {
    const key = `${s.kind}::${s.ref_id}::${s.child_id}`
    const prev = latest.get(key)
    if (!prev || new Date(s.studied_at) > new Date(prev.studied_at)) {
      latest.set(key, s)
    }
  })

  const queue = []
  latest.forEach(s => {
    // Lượt học cũ (backfill) không có dữ liệu trắc nghiệm -> không xếp lịch ôn
    if (!s.quiz_total) return

    const accuracy = s.quiz_first_try / s.quiz_total
    let days
    if (accuracy < 0.8) days = REVIEW_SOON_DAYS
    else if (accuracy < 0.95) days = REVIEW_LATER_DAYS
    else return // đã nắm chắc

    const dueAt = new Date(s.studied_at)
    dueAt.setDate(dueAt.getDate() + days)

    queue.push({
      kind: s.kind,
      refId: s.ref_id,
      childId: s.child_id,
      title: s.title,
      subject: s.subject,
      accuracy,
      dueAt,
      isDue: now >= dueAt,
      daysUntilDue: Math.ceil((dueAt - now) / 86400000),
      wrongAnswers: s.wrong_answers || [],
      lastStudiedAt: s.studied_at,
    })
  })

  return queue.sort((a, b) => a.dueAt - b.dueAt)
}

// ---------- 4. Bản tin tuần cho bố mẹ ----------

const DAY_MS = 86400000

/**
 * Tổng hợp 7 ngày gần nhất và so sánh với 7 ngày trước đó, để bố mẹ nắm được
 * tình hình học của con trong 30 giây mà không cần mở app mỗi ngày.
 */
export function buildWeeklyDigest(sessions = [], now = new Date()) {
  const thisWeekStart = new Date(now.getTime() - 7 * DAY_MS)
  const lastWeekStart = new Date(now.getTime() - 14 * DAY_MS)

  const within = (s, from, to) => {
    const t = new Date(s.studied_at)
    return t >= from && t < to
  }
  const thisWeek = sessions.filter(s => within(s, thisWeekStart, now))
  const lastWeek = sessions.filter(s => within(s, lastWeekStart, thisWeekStart))

  const sum = (arr, pick) => arr.reduce((acc, x) => acc + (pick(x) || 0), 0)

  // Độ chính xác = tỉ lệ câu đúng ngay lần đầu trên toàn bộ câu hỏi đã làm
  const accuracyOf = (arr) => {
    const total = sum(arr, s => s.quiz_total)
    if (!total) return null
    return sum(arr, s => s.quiz_first_try) / total
  }

  const activeDays = new Set(
    thisWeek.map(s => new Date(s.studied_at).toISOString().split('T')[0])
  ).size

  // Những câu sai nhiều nhất trong tuần — chính là thứ bố mẹ nên ngồi ôn cùng con
  const missTally = new Map()
  thisWeek.forEach(s => {
    (s.wrong_answers || []).forEach(w => {
      if (!w?.q) return
      const cur = missTally.get(w.q) || { q: w.q, correct: w.correct, count: 0, lesson: s.title }
      cur.count += 1
      missTally.set(w.q, cur)
    })
  })
  const topMisses = Array.from(missTally.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const minutes = Math.round(sum(thisWeek, s => s.duration_seconds) / 60)
  const prevMinutes = Math.round(sum(lastWeek, s => s.duration_seconds) / 60)
  const accuracy = accuracyOf(thisWeek)
  const prevAccuracy = accuracyOf(lastWeek)

  return {
    hasData: thisWeek.length > 0,
    sessionCount: thisWeek.length,
    prevSessionCount: lastWeek.length,
    lessonCount: new Set(thisWeek.map(s => s.kind + '-' + s.ref_id)).size,
    minutes,
    prevMinutes,
    activeDays,
    accuracy,
    prevAccuracy,
    starsEarned: sum(thisWeek, s => s.stars_earned),
    topMisses,
    // Chênh lệch so với tuần trước (null nếu tuần trước chưa có dữ liệu để so)
    deltaSessions: lastWeek.length ? thisWeek.length - lastWeek.length : null,
    deltaMinutes: lastWeek.length ? minutes - prevMinutes : null,
    deltaAccuracy: (accuracy !== null && prevAccuracy !== null)
      ? accuracy - prevAccuracy
      : null,
  }
}

/** Kết xuất bản tin thành văn bản thuần để bố mẹ dán vào Zalo. */
export function digestToText(digest, childName = 'con') {
  if (!digest?.hasData) {
    return `Tuần này ${childName} chưa có lượt học nào được ghi nhận.`
  }
  const lines = [
    `📚 BẢN TIN HỌC TẬP TUẦN — ${childName}`,
    '',
    `• Số buổi học: ${digest.sessionCount}${fmtDelta(digest.deltaSessions)}`,
    `• Số bài khác nhau: ${digest.lessonCount}`,
    `• Thời gian học: ${digest.minutes} phút${fmtDelta(digest.deltaMinutes, ' phút')}`,
    `• Số ngày có học: ${digest.activeDays}/7`,
    `• Sao nhận được: ${digest.starsEarned} ⭐`,
  ]
  if (digest.accuracy !== null) {
    lines.push(`• Đúng ngay lần đầu: ${Math.round(digest.accuracy * 100)}%${
      digest.deltaAccuracy !== null
        ? ` (${digest.deltaAccuracy >= 0 ? '+' : ''}${Math.round(digest.deltaAccuracy * 100)}% so với tuần trước)`
        : ''
    }`)
  }
  if (digest.topMisses.length) {
    lines.push('', '🎯 Nên ngồi ôn cùng con:')
    digest.topMisses.forEach((m, i) => {
      lines.push(`${i + 1}. ${m.q}`)
      lines.push(`   → Đáp án đúng: ${m.correct}`)
    })
  }
  return lines.join('\n')
}

function fmtDelta(delta, unit = '') {
  if (delta === null || delta === undefined || delta === 0) return ''
  return ` (${delta > 0 ? '+' : ''}${delta}${unit} so với tuần trước)`
}
