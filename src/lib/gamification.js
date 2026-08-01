// Helper Gamification: Level, Badges, & Streaks

export const LEVELS = [
  { level: 1, name: 'Mầm Non', emoji: '🌱', minStars: 0, maxStars: 49 },
  { level: 2, name: 'Cây Xanh', emoji: '🌿', minStars: 50, maxStars: 149 },
  { level: 3, name: 'Đại Thụ', emoji: '🌳', minStars: 150, maxStars: 299 },
  { level: 4, name: 'Ngôi Sao', emoji: '⭐', minStars: 300, maxStars: 499 },
  { level: 5, name: 'Kim Cương', emoji: '💎', minStars: 500, maxStars: 999 },
  { level: 6, name: 'Thần Đồng', emoji: '🏆', minStars: 1000, maxStars: Infinity }
]

export function getLevelInfo(totalStars = 0) {
  const stars = Math.max(0, totalStars)
  const currentLevelIndex = LEVELS.findIndex((l, i) => {
    const next = LEVELS[i + 1]
    return !next || stars < next.minStars
  })
  
  const current = LEVELS[currentLevelIndex >= 0 ? currentLevelIndex : 0]
  const next = LEVELS[currentLevelIndex + 1] || null

  let progressPct = 100
  let starsToNext = 0

  if (next) {
    const range = next.minStars - current.minStars
    const earnedInRange = stars - current.minStars
    progressPct = Math.min(100, Math.max(0, Math.round((earnedInRange / range) * 100)))
    starsToNext = next.minStars - stars
  }

  return {
    level: current.level,
    name: current.name,
    emoji: current.emoji,
    currentStars: stars,
    progressPct,
    starsToNext,
    nextLevelName: next ? next.name : 'Tối đa',
    nextLevelEmoji: next ? next.emoji : '👑'
  }
}

export function calculateStreak(completions = [], transactions = []) {
  const datesSet = new Set()

  completions.forEach(c => {
    if (c.created_at && c.status === 'approved') {
      const d = new Date(c.created_at).toISOString().split('T')[0]
      datesSet.add(d)
    }
  })

  transactions.forEach(t => {
    if (t.created_at && t.amount > 0) {
      const d = new Date(t.created_at).toISOString().split('T')[0]
      datesSet.add(d)
    }
  })

  const sortedDates = Array.from(datesSet).sort().reverse()
  const todayStr = new Date().toISOString().split('T')[0]
  
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0]

  const todayDone = datesSet.has(todayStr)

  let currentStreak = 0
  let checkDate = new Date()

  // Nếu hôm nay chưa làm, bắt đầu đếm từ hôm qua
  if (!todayDone) {
    if (!datesSet.has(yesterdayStr)) {
      currentStreak = 0
    } else {
      checkDate.setDate(checkDate.getDate() - 1)
    }
  }

  if (todayDone || datesSet.has(yesterdayStr)) {
    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (datesSet.has(dateStr)) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }

  // Lịch 7 ngày tuần này
  const now = new Date()
  const dayOfWeek = (now.getDay() + 6) % 7 // Mon = 0
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek)

  const weekActiveMap = {}
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  
  dayKeys.forEach((key, idx) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + idx)
    const dStr = d.toISOString().split('T')[0]
    weekActiveMap[key] = {
      dateStr: dStr,
      active: datesSet.has(dStr),
      isToday: dStr === todayStr
    }
  })

  return {
    currentStreak,
    todayDone,
    weekActiveMap
  }
}

export function calculateBadges(completions = [], transactions = [], currentStreak = 0) {
  const approvedComps = completions.filter(c => c.status === 'approved')
  
  const bookCount = approvedComps.filter(c => c.task_id?.startsWith('book-')).length
  const mathCount = approvedComps.filter(c => c.task_id?.startsWith('math-')).length
  const sgkCount = approvedComps.filter(c => c.task_id?.startsWith('sgk-')).length
  const taskCount = approvedComps.filter(c => !c.task_id?.startsWith('book-') && !c.task_id?.startsWith('math-') && !c.task_id?.startsWith('sgk-')).length
  const arcadeCount = transactions.filter(t => t.reason?.includes('Game Arcade')).length

  return [
    {
      id: 'book_master',
      name: 'Mọt Sách Tí Hon',
      emoji: '📚',
      desc: 'Đọc xong 5 quyển sách',
      unlocked: bookCount >= 5,
      progressText: `${Math.min(5, bookCount)}/5`
    },
    {
      id: 'math_genius',
      name: 'Thiên Tài Toán',
      emoji: '🧮',
      desc: 'Hoàn thành 5 chủ đề Toán tư duy',
      unlocked: mathCount >= 5,
      progressText: `${Math.min(5, mathCount)}/5`
    },
    {
      id: 'sgk_champion',
      name: 'Học Sinh Giỏi',
      emoji: '🎓',
      desc: 'Hoàn thành 10 bài Sách Giáo Khoa',
      unlocked: sgkCount >= 10,
      progressText: `${Math.min(10, sgkCount)}/10`
    },
    {
      id: 'housework_pro',
      name: 'Siêu Chăm Chỉ',
      emoji: '🧹',
      desc: 'Hoàn thành 10 nhiệm vụ việc nhà',
      unlocked: taskCount >= 10,
      progressText: `${Math.min(10, taskCount)}/10`
    },
    {
      id: 'streak_7',
      name: 'Chuỗi Lửa 7 Ngày',
      emoji: '🔥',
      desc: 'Học liên tiếp 7 ngày không nghỉ',
      unlocked: currentStreak >= 7,
      progressText: `${Math.min(7, currentStreak)}/7 ngày`
    },
    {
      id: 'arcade_gamer',
      name: 'Game Thủ Vui Vẻ',
      emoji: '🎮',
      desc: 'Đổi vé và chơi mini-game 3 lần',
      unlocked: arcadeCount >= 3,
      progressText: `${Math.min(3, arcadeCount)}/3`
    }
  ]
}
