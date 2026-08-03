import { useState, useEffect, useCallback, useMemo } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import confetti from 'canvas-confetti'
import { 
  isSupabaseConfigured, 
  updateSupabaseConfig, 
  supabaseUrl as initialUrl, 
  supabaseAnonKey as initialAnonKey 
} from './lib/supabase'
import {
  fetchChildren,
  addChild,
  updateChildGrade,
  fetchParentSettings,
  updateParentPin,
  fetchTasks,
  addTask,
  deactivateTask,
  fetchCompletions,
  submitCompletion,
  reviewCompletion,
  fetchRewards,
  addReward,
  deactivateReward,
  fetchRedemptions,
  redeemReward,
  reviewRedemption,
  fetchBalance,
  fetchTransactions,
  addStars,
  fetchWeeklyPlans,
  upsertWeeklyPlan,
  fetchLearningSessions,
  logLearningSession
} from './lib/api'
import { supabase } from './lib/supabase'
import { booksData } from './lib/booksData'
import { mathData } from './lib/mathData'
import { textbookData } from './lib/textbookData'
import { textbookData8 } from './lib/textbookData8'
import GameArcade from './components/GameArcade'
import ReadingGateButton from './components/ReadingGateButton'
import ReviewCard from './components/ReviewCard'
import WeeklyDigestPanel from './components/WeeklyDigestPanel'
import PdfViewerModal from './components/PdfViewerModal'
import { getLevelInfo, calculateStreak, calculateBadges } from './lib/gamification'
import {
  gradeQuizResult,
  computeReviewQueue,
  splitSgkPages,
} from './lib/learning'
import { getTone, REWARD_SUGGESTIONS, isTeenGrade } from './lib/tone'
import SgkPdfButton from './components/SgkPdfButton'
import './App.css'

const ANIMAL_EMOJIS = ['🦊', '🐨', '🦁', '🐯', '🐼', '🐰', '🐸', '🦄', '🐷', '🐱', '🐶', '🐵']

// ---- Bộ nhớ đệm ngoại tuyến ----
// CHỈ dùng để hiển thị tạm khi mất kết nối. Supabase luôn là nguồn sự thật;
// dữ liệu đệm không bao giờ được phép ghi đè hay cộng dồn vào số liệu của DB.
const childCacheKey = (childId) => 'child_snapshot_' + childId

function cacheChildSnapshot(childId, completions, balance) {
  try {
    localStorage.setItem(childCacheKey(childId), JSON.stringify({
      completions: completions || [],
      balance: balance || 0,
      savedAt: new Date().toISOString(),
    }))
  } catch {
    // Trình duyệt chặn localStorage hoặc hết dung lượng — bỏ qua an toàn.
  }
}

function readChildSnapshot(childId) {
  try {
    const raw = localStorage.getItem(childCacheKey(childId))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return { completions: parsed.completions || [], balance: parsed.balance || 0 }
  } catch {
    return null
  }
}

// ---- Kế hoạch tuần: hằng số + tiện ích ----
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const WEEKDAY_LABELS = { mon: 'Thứ 2', tue: 'Thứ 3', wed: 'Thứ 4', thu: 'Thứ 5', fri: 'Thứ 6' }
const PLAN_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri']

// Tuần học hiện tại: năm học bắt đầu từ tuần chứa mùng 1/9, kéo dài 35 tuần
function currentSchoolWeek(now = new Date()) {
  const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1
  const sep1 = new Date(year, 8, 1)
  sep1.setDate(sep1.getDate() - ((sep1.getDay() + 6) % 7))
  const diffDays = Math.floor((now - sep1) / 86400000)
  return Math.min(35, Math.max(1, Math.floor(diffDays / 7) + 1))
}

// Tìm book + lesson theo id trong cả 2 khối
function findLessonAcrossData(lessonId) {
  for (const books of [textbookData, textbookData8]) {
    for (const book of books) {
      const lesson = book.lessons.find(l => l.id === lessonId)
      if (lesson) return { book, lesson, grade: books === textbookData8 ? 8 : 2 }
    }
  }
  return null
}

// Các bài SGK của một khối trong một tuần
function lessonsOfWeek(grade, week) {
  const books = grade === 8 ? textbookData8 : textbookData
  return books.flatMap(book => book.lessons.filter(l => l.week === week).map(l => ({ book, lesson: l })))
}

// Tự động chia bài SGK của tuần cho 5 ngày (xen kẽ môn)
function autoAssignPlanDays(weekItems) {
  const days = {}
  PLAN_DAYS.forEach(d => { days[d] = { lessonId: null, note: '' } })
  weekItems.forEach((item, i) => {
    const key = PLAN_DAYS[i % PLAN_DAYS.length]
    days[key] = { ...days[key], lessonId: item.lesson.id }
  })
  return days
}

const SCIENTIFIC_SUGGESTIONS = [
  {
    category: '🧹 Việc nhà',
    tasks: [
      { title: 'Tự dọn dẹp đồ chơi', desc: 'Cất gọn gàng đồ chơi vào rương/kệ sau khi chơi xong.', stars: 3, recurrence: 'daily' },
      { title: 'Lau dọn bàn ăn', desc: 'Lau sạch bàn ăn trước và sau bữa cơm của gia đình.', stars: 2, recurrence: 'daily' },
      { title: 'Tưới cây trong nhà', desc: 'Tưới nước vừa đủ ẩm cho cây cảnh trong nhà hoặc ban công.', stars: 2, recurrence: 'weekly' },
      { title: 'Giúp quét phòng', desc: 'Quét dọn sạch sẽ phòng khách hoặc phòng ngủ của bé.', stars: 3, recurrence: 'daily' },
    ]
  },
  {
    category: '📚 Học tập',
    tasks: [
      { title: 'Tự giác học đúng giờ', desc: 'Ngồi vào bàn học trước 19h30 và tự hoàn thành bài tập đầy đủ.', stars: 5, recurrence: 'daily' },
      { title: 'Đọc sách 20 phút', desc: 'Đọc truyện chữ, sách kỹ năng hoặc hạt giống tâm hồn.', stars: 4, recurrence: 'daily' },
      { title: 'Chuẩn bị sách vở ngày mai', desc: 'Tự sắp xếp sách vở, đồ dùng học tập vào ba lô trước khi ngủ.', stars: 3, recurrence: 'daily' },
      { title: 'Rèn chữ hoặc vẽ tranh', desc: 'Viết 1 trang vở rèn chữ đẹp hoặc vẽ tranh tự chọn đầy sáng tạo.', stars: 4, recurrence: 'once' },
    ]
  },
  {
    category: '🧼 Tự lập',
    tasks: [
      { title: 'Tự gấp chăn màn', desc: 'Gấp gọn gàng chăn, xếp gối ngay ngắn sau khi thức dậy.', stars: 3, recurrence: 'daily' },
      { title: 'Đánh răng đúng giờ', desc: 'Đánh răng sạch sẽ trước khi đi ngủ và sau khi ngủ dậy.', stars: 2, recurrence: 'daily' },
      { title: 'Chuẩn bị quần áo ngày mai', desc: 'Tự chọn và treo sẵn đồng phục, quần áo cho ngày mai.', stars: 3, recurrence: 'daily' },
      { title: 'Tự tắm rửa sạch sẽ', desc: 'Tự tắm rửa, gội đầu sạch sẽ đúng giờ bố mẹ giao.', stars: 3, recurrence: 'daily' },
    ]
  },
  {
    category: '⚽ Sức khỏe',
    tasks: [
      { title: 'Ngủ đúng giờ trước 22h', desc: 'Lên giường ngủ đúng giờ, không dùng điện thoại/máy tính trước ngủ.', stars: 4, recurrence: 'daily' },
      { title: 'Tập thể dục 15 phút', desc: 'Chạy bộ nhẹ nhàng, nhảy dây hoặc tập thể dục theo nhạc buổi sáng.', stars: 3, recurrence: 'daily' },
      { title: 'Uống đủ nước lọc', desc: 'Uống đủ nước lọc hằng ngày (khoảng 3-4 cốc nước to).', stars: 2, recurrence: 'daily' },
      { title: 'Dọn phòng riêng sạch sẽ', desc: 'Lau dọn phòng ngủ cá nhân, sắp xếp bàn học ngăn nắp.', stars: 5, recurrence: 'weekly' },
    ]
  }
]

function AppContent() {
  const { session, loading: authLoading, familyId, profile, selectProfile, signOut } = useAuth()
  
  // Trạng thái cấu hình Supabase
  const [configured, setConfigured] = useState(isSupabaseConfigured())
  const [cfgUrl, setCfgUrl] = useState(initialUrl)
  const [cfgKey, setCfgKey] = useState(initialAnonKey)

  // Trạng thái Xác thực (Auth)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoadingState, setAuthLoadingState] = useState(false)

  // Trạng thái Dữ liệu chính
  const [children, setChildren] = useState([])
  const [tasks, setTasks] = useState([])
  const [completions, setCompletions] = useState([])
  const [rewards, setRewards] = useState([])
  const [redemptions, setRedemptions] = useState([])
  
  // Dữ liệu riêng của Con
  const [childBalance, setChildBalance] = useState(0)
  const [childTransactions, setChildTransactions] = useState([])
  
  // Trạng thái chung UI
  const [loadingData, setLoadingData] = useState(false)
  const [activeTab, setActiveTab] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  // Trạng thái cho Thư viện sách (Reading Corner)
  const [readingBook, setReadingBook] = useState(null)
  const [readingPageIndex, setReadingPageIndex] = useState(0)
  const [quizSelectedOption, setQuizSelectedOption] = useState(null)
  const [quizAnsweredCorrectly, setQuizAnsweredCorrectly] = useState(false)
  const [quizShowFeedback, setQuizShowFeedback] = useState(false)
  const [kidAgeGroup, setKidAgeGroup] = useState('kids')

  // Trạng thái cho Sân Chơi Toán Tư Duy (Math Playground)
  const [selectedMathTopic, setSelectedMathTopic] = useState(null)
  const [mathPageIndex, setMathPageIndex] = useState(0)
  const [mathQuizSelectedOption, setMathQuizSelectedOption] = useState(null)
  const [mathQuizAnsweredCorrectly, setMathQuizAnsweredCorrectly] = useState(false)
  const [mathQuizShowFeedback, setMathQuizShowFeedback] = useState(false)

  // Trạng thái cho Sách Giáo Khoa (SGK)
  const [selectedTextbook, setSelectedTextbook] = useState(null)   // sách đang chọn
  const [selectedLesson, setSelectedLesson] = useState(null)        // bài đang học
  const [sgkQuizIndex, setSgkQuizIndex] = useState(0)               // câu hỏi hiện tại
  const [sgkQuizSelected, setSgkQuizSelected] = useState(null)      // lựa chọn của bé
  const [sgkQuizCorrect, setSgkQuizCorrect] = useState(false)       // đã trả lời đúng?
  const [sgkQuizFeedback, setSgkQuizFeedback] = useState(false)     // hiển thị phản hồi sai
  const [sgkLessonView, setSgkLessonView] = useState('content')     // 'content' | 'quiz'
  const [sgkPageIndex, setSgkPageIndex] = useState(0)               // trang đọc hiện tại (0-based)
  const [sgkCompletedLessons, setSgkCompletedLessons] = useState({})
  const [sgkGrade, setSgkGrade] = useState(2)                          // khối lớp đang xem: 2 | 8
  const [sgkPdfOpen, setSgkPdfOpen] = useState(null)                   // { url, label } | null: modal xem sách gốc PDF
  const sgkBooks = sgkGrade === 8 ? textbookData8 : textbookData

  // Trạng thái Kế hoạch tuần
  const [weeklyPlans, setWeeklyPlans] = useState([])
  const [planChildId, setPlanChildId] = useState(null)
  const [planWeek, setPlanWeek] = useState(currentSchoolWeek())
  const [planDays, setPlanDays] = useState({})
  const [planDirty, setPlanDirty] = useState(false)
  const [planSaving, setPlanSaving] = useState(false)

  // Trạng thái gamification cho SGK
  const [sgkQuizScore, setSgkQuizScore] = useState(0)                  // số câu đúng
  const [sgkStreak, setSgkStreak] = useState(0)                        // chuỗi trả lời đúng liên tiếp
  const [sgkBestStreak, setSgkBestStreak] = useState(0)                // chuỗi đúng dài nhất
  const [sgkQuizDone, setSgkQuizDone] = useState(false)                // đã làm xong tất cả câu hỏi

  // ---------- Lịch sử học tập ----------
  // Bé phải trả lời đúng mới được sang câu tiếp theo, nên "số câu đúng" luôn
  // bằng điểm tuyệt đối và không nói lên điều gì. Tín hiệu học tập thật nằm ở
  // SỐ LẦN CHỌN SAI và các câu bị sai — đó là thứ được ghi lại dưới đây.
  const [learningSessions, setLearningSessions] = useState([])
  const [historyChildId, setHistoryChildId] = useState('all')  // bộ lọc màn hình bố mẹ
  // Khi trình duyệt chặn clipboard (không phải HTTPS), hiện bản tin ra để bố mẹ tự bôi đen copy
  const [digestFallbackText, setDigestFallbackText] = useState(null)

  const [sgkWrongAttempts, setSgkWrongAttempts] = useState(0)
  const [sgkWrongAnswers, setSgkWrongAnswers] = useState([])
  const [sgkFirstTryCount, setSgkFirstTryCount] = useState(0)   // số câu đúng ngay lần đầu
  const [sgkQuestionMissed, setSgkQuestionMissed] = useState(false)  // câu hiện tại đã sai lần nào chưa
  const [sgkStartedAt, setSgkStartedAt] = useState(null)

  const [bookWrongAttempts, setBookWrongAttempts] = useState(0)
  const [bookWrongAnswers, setBookWrongAnswers] = useState([])
  const [bookStartedAt, setBookStartedAt] = useState(null)

  const [mathWrongAttempts, setMathWrongAttempts] = useState(0)
  const [mathWrongAnswers, setMathWrongAnswers] = useState([])
  const [mathFirstTryCount, setMathFirstTryCount] = useState(0)
  const [mathQuestionMissed, setMathQuestionMissed] = useState(false)
  const [mathStartedAt, setMathStartedAt] = useState(null)

  const elapsedSeconds = (startedAt) =>
    startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : 0

  // ---------- Giọng điệu theo độ tuổi ----------
  // Con lớp 6+ dùng giọng điềm đạm, không mascot, không pháo hoa.
  const tone = getTone(profile?.child?.grade)

  // Pháo hoa chỉ nổ cho các bé tiểu học; tuổi teen thấy phiền hơn là vui.
  const celebrate = useCallback((opts) => {
    if (tone.celebrate) confetti(opts)
  }, [tone.celebrate])

  // ---------- Ôn tập lặp lại ----------
  // Suy ra từ lịch sử học nên không cần bảng riêng và không bao giờ lệch thực tế.
  // Nhà có con lớp 6+ thì mặc định hiện gợi ý quà kiểu tuổi teen trước
  // null = chưa chọn tay -> tự suy theo độ tuổi các con trong nhà
  const [rewardSuggAge, setRewardSuggAge] = useState(null)
  const suggAge = rewardSuggAge ?? (children.some(c => isTeenGrade(c.grade)) ? 'teen' : 'kid')

  const reviewQueue = useMemo(() => computeReviewQueue(learningSessions), [learningSessions])
  const myReviewQueue = useMemo(() => (
    profile?.type === 'child'
      ? reviewQueue.filter(r => r.childId === profile.child.id)
      : reviewQueue
  ), [reviewQueue, profile])
  const dueReviews = useMemo(() => myReviewQueue.filter(r => r.isDue), [myReviewQueue])
  const upcomingReviews = useMemo(() => myReviewQueue.filter(r => !r.isDue), [myReviewQueue])

  // Helpers cho SGK
  const isSgkLessonDone = (lesson) =>
    !!sgkCompletedLessons[lesson.id] ||
    completions.some(c => c.child_id === profile?.child?.id && (c.task_id === 'sgk-' + lesson.id || c.task_id === lesson.id))
  const sgkBookProgress = (book) => {
    const done = book.lessons.filter(isSgkLessonDone).length
    return { done, total: book.lessons.length, pct: Math.round((done / book.lessons.length) * 100) }
  }
  const resetSgkQuiz = () => {
    setSgkQuizIndex(0)
    setSgkQuizSelected(null)
    setSgkQuizCorrect(false)
    setSgkQuizFeedback(false)
    setSgkQuizScore(0)
    setSgkStreak(0)
    setSgkBestStreak(0)
    setSgkQuizDone(false)
    setSgkWrongAttempts(0)
    setSgkWrongAnswers([])
    setSgkFirstTryCount(0)
    setSgkQuestionMissed(false)
    setSgkStartedAt(Date.now())
    setSgkPageIndex(0)
  }

  // Mở lại đúng bài cần ôn từ hàng đợi ôn tập.
  // Luôn mở ở phần NỘI DUNG chứ không nhảy thẳng vào trắc nghiệm: mục đích của
  // ôn tập là đọc lại, không phải làm lại bài kiểm tra cho xong.
  const openReviewItem = (item) => {
    if (item.kind === 'sgk') {
      const found = findLessonAcrossData(item.refId)
      if (!found) { showToast('Bài này không còn trong chương trình nữa.'); return }
      setSelectedTextbook(found.book)
      setSelectedLesson(found.lesson)
      setSgkLessonView('content')
      resetSgkQuiz()
      setActiveTab('sgk')
      return
    }
    if (item.kind === 'math') {
      const topic = mathData.find(t => String(t.id) === String(item.refId))
      if (!topic) { showToast('Chủ đề này không còn nữa.'); return }
      setSelectedMathTopic(topic)
      setMathPageIndex(0)
      setMathQuizSelectedOption(null)
      setMathQuizAnsweredCorrectly(false)
      setMathQuizShowFeedback(false)
      setMathWrongAttempts(0)
      setMathWrongAnswers([])
      setMathFirstTryCount(0)
      setMathQuestionMissed(false)
      setMathStartedAt(Date.now())
      setActiveTab('math')
      return
    }
    // book
    const group = Object.keys(booksData).find(g =>
      booksData[g].some(b => String(b.id) === String(item.refId))
    )
    const book = group && booksData[group].find(b => String(b.id) === String(item.refId))
    if (!book) { showToast('Quyển sách này không còn nữa.'); return }
    setKidAgeGroup(group)
    setReadingBook(book)
    setReadingPageIndex(0)
    setQuizSelectedOption(null)
    setQuizAnsweredCorrectly(false)
    setQuizShowFeedback(false)
    setBookWrongAttempts(0)
    setBookWrongAnswers([])
    setBookStartedAt(Date.now())
    setActiveTab('books')
  }

  // ---------- Kế hoạch tuần ----------
  const loadPlanDays = useCallback((childId, week) => {
    const saved = weeklyPlans.find(p => p.child_id === childId && p.week === week)
    const child = children.find(c => c.id === childId)
    const base = {}
    PLAN_DAYS.forEach(d => { base[d] = { lessonId: null, note: '' } })
    if (saved?.days && Object.keys(saved.days).length) {
      PLAN_DAYS.forEach(d => {
        if (saved.days[d]) base[d] = { ...base[d], ...saved.days[d] }
      })
      setPlanDays(base)
    } else {
      setPlanDays(autoAssignPlanDays(lessonsOfWeek(child?.grade || 2, week)))
    }
    setPlanDirty(false)
  }, [weeklyPlans, children])

  const handlePlanChildChange = (childId) => {
    setPlanChildId(childId)
    loadPlanDays(childId, planWeek)
  }

  const handlePlanWeekChange = (week) => {
    setPlanWeek(week)
    if (planChildId) loadPlanDays(planChildId, week)
  }

  const handlePlanDayChange = (day, field, value) => {
    setPlanDays(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }))
    setPlanDirty(true)
  }

  const handlePlanAutoAssign = () => {
    if (!planChildId) return
    const child = children.find(c => c.id === planChildId)
    const next = autoAssignPlanDays(lessonsOfWeek(child?.grade || 2, planWeek))
    PLAN_DAYS.forEach(d => { if (planDays[d]?.note) next[d].note = planDays[d].note })
    setPlanDays(next)
    setPlanDirty(true)
  }

  const handlePlanSave = async () => {
    if (!planChildId) return
    setPlanSaving(true)
    try {
      await upsertWeeklyPlan(familyId, planChildId, planWeek, planDays)
      showToast(`Đã lưu kế hoạch tuần ${planWeek}! 📅`)
      setPlanDirty(false)
      loadAppData()
    } catch (err) {
      showToast('Lỗi lưu kế hoạch: ' + err.message)
    } finally {
      setPlanSaving(false)
    }
  }

  // Mở bài SGK thẳng từ kế hoạch tuần
  const handleOpenLessonFromPlan = (lessonId) => {
    const found = findLessonAcrossData(lessonId)
    if (!found) { showToast('Không tìm thấy bài học này!'); return }
    setSgkGrade(found.grade)
    setSelectedTextbook(found.book)
    setSelectedLesson(found.lesson)
    setSgkLessonView('content')
    resetSgkQuiz()
    setActiveTab('sgk')
  }

  // Trạng thái cho Minh chứng hoàn thành (Child Proof Submission)
  const [activeProofTask, setActiveProofTask] = useState(null)
  const [proofImageBase64, setProofImageBase64] = useState(null)
  const [proofChildNote, setProofChildNote] = useState('')

  // Trạng thái cho Bố mẹ duyệt kèm Lời phê (Parent Review & Feedback)
  const [activeApprovalCompletion, setActiveApprovalCompletion] = useState(null)
  const [parentFeedbackText, setParentFeedbackText] = useState('')
  
  // Trạng thái Nhập PIN (Netflix-style)
  const [pinProfile, setPinProfile] = useState(null) // 'parent' hoặc child object
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')

  // Trạng thái Thêm hồ sơ con mới
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [newChildName, setNewChildName] = useState('')
  const [newChildAvatar, setNewChildAvatar] = useState('🦊')
  const [newChildPin, setNewChildPin] = useState('')
  const [newChildGrade, setNewChildGrade] = useState(2)
  const [addChildError, setAddChildError] = useState('')

  // Trạng thái Thêm nhiệm vụ mới (Parent)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskStars, setNewTaskStars] = useState(5)
  const [newTaskRecurrence, setNewTaskRecurrence] = useState('once')
  const [newTaskChildId, setNewTaskChildId] = useState('')

  // Trạng thái Thêm quà mới (Parent)
  const [newRewardTitle, setNewRewardTitle] = useState('')
  const [newRewardEmoji, setNewRewardEmoji] = useState('🎁')
  const [newRewardCost, setNewRewardCost] = useState(10)

  // Trạng thái Thay đổi mã PIN (Parent Settings)
  const [currentParentPin, setCurrentParentPin] = useState('')
  const [newParentPin, setNewParentPin] = useState('')
  const [parentPinError, setParentPinError] = useState('')
  const [parentPinSuccess, setParentPinSuccess] = useState('')

  // Trạng thái Thay đổi mã PIN của con (Parent Settings)
  const [editingChildPinId, setEditingChildPinId] = useState('')
  const [newChildPinValue, setNewChildPinValue] = useState('')
  const [activeSuggestionTab, setActiveSuggestionTab] = useState(0)

  // Auto hide Toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Hiển thị thông báo toast
  function showToast(msg) {
    setToastMessage(msg)
  }

  // Nạp lại toàn bộ dữ liệu tương ứng với phân hệ đang chọn
  const loadAppData = useCallback(async () => {
    if (!session) return
    setLoadingData(true)
    try {
      if (profile?.type === 'parent') {
        const [kids, tks, comps, rws, red, plns, sessions] = await Promise.all([
          fetchChildren(),
          fetchTasks(),
          fetchCompletions(),
          fetchRewards(),
          fetchRedemptions(),
          fetchWeeklyPlans(),
          fetchLearningSessions()
        ])
        setChildren(kids)
        setTasks(tks)
        setCompletions(comps)
        setRewards(rws)
        setRedemptions(red)
        setWeeklyPlans(plns)
        setLearningSessions(sessions)
        if (kids.length > 0 && !newTaskChildId) {
          setNewTaskChildId(kids[0].id)
        }
      } else if (profile?.type === 'child') {
        const childId = profile.child.id
        const [tks, comps, rws, bal, txs, plns, sessions] = await Promise.all([
          fetchTasks(),
          fetchCompletions(),
          fetchRewards(),
          fetchBalance(childId),
          fetchTransactions(childId),
          fetchWeeklyPlans(),
          fetchLearningSessions(childId)
        ])

        // Supabase là nguồn sự thật duy nhất. localStorage chỉ còn là bộ nhớ
        // đệm dùng khi mất mạng — không bao giờ được ghi đè số liệu của DB.
        // (Trước đây Math.max(dbBal, localBal) đã che giấu việc DB ghi hỏng
        //  suốt một thời gian dài mà không ai phát hiện ra.)
        cacheChildSnapshot(childId, comps, bal)

        setTasks(tks || [])
        setCompletions(comps || [])
        setRewards(rws || [])
        setChildBalance(bal)
        setChildTransactions(txs || [])
        setWeeklyPlans(plns || [])
        setLearningSessions(sessions || [])

        // Đồng bộ trạng thái hoàn thành SGK từ DB
        const doneMap = {}
        ;(comps || [])
          .filter(c => c.child_id === childId && c.status === 'approved')
          .forEach(c => {
            if (c.task_id?.startsWith('sgk-')) doneMap[c.task_id.replace('sgk-', '')] = true
          })
        setSgkCompletedLessons(prev => ({ ...prev, ...doneMap }))
      } else {
        // Chỉ ở màn hình chọn hồ sơ
        const kids = await fetchChildren()
        setChildren(kids)
      }
    } catch (err) {
      // Mất mạng / lỗi máy chủ: hiển thị tạm dữ liệu đã lưu đệm và nói rõ
      // với người dùng rằng đây là dữ liệu ngoại tuyến.
      const cached = profile?.type === 'child' ? readChildSnapshot(profile.child.id) : null
      if (cached) {
        setCompletions(cached.completions)
        setChildBalance(cached.balance)
        showToast('⚠️ Không kết nối được máy chủ. Đang hiển thị dữ liệu lưu tạm trên máy này.')
      } else {
        showToast('Có lỗi xảy ra khi tải dữ liệu: ' + err.message)
      }
    } finally {
      setLoadingData(false)
    }
  }, [session, profile, newTaskChildId])

  // Tự động tải lại dữ liệu khi đổi trạng thái session/profile
  useEffect(() => {
    if (configured && session) {
      loadAppData()
      if (profile?.type === 'parent') {
        setActiveTab('approvals')
      } else if (profile?.type === 'child') {
        setActiveTab('plan')
      }
    }
  }, [session, profile, configured, loadAppData])

  // Xử lý lưu cấu hình Supabase
  const handleSaveConfig = (e) => {
    e.preventDefault()
    if (!cfgUrl || !cfgKey) {
      showToast('Vui lòng nhập đầy đủ URL và Anon Key!')
      return
    }
    updateSupabaseConfig(cfgUrl, cfgKey)
    setConfigured(true)
    showToast('Đã lưu cấu hình kết nối Supabase!')
  }

  // Xử lý Đăng ký / Đăng nhập tài khoản gia đình
  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoadingState(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        showToast('Đăng ký thành công! Hãy đăng nhập nhé.')
        setIsSignUp(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        showToast('Chào mừng quay trở lại!')
      }
    } catch (err) {
      setAuthError(err.message || 'Lỗi xác thực hệ thống')
    } finally {
      setAuthLoadingState(false)
    }
  }

  // Click vào Hồ sơ -> Mở popup PIN
  const handleProfileClick = (p) => {
    setPinProfile(p)
    setPinInput('')
    setPinError('')
  }

  // Nhập số trên bàn phím ảo PIN
  const handlePinKeyPress = (num) => {
    if (pinInput.length >= 4) return
    const newVal = pinInput + num
    setPinInput(newVal)
    setPinError('')

    if (newVal.length === 4) {
      verifyPIN(newVal)
    }
  }

  // Xóa ký tự PIN
  const handlePinDelete = () => {
    setPinInput(prev => prev.slice(0, -1))
    setPinError('')
  }

  // Kiểm tra mã PIN
  const verifyPIN = async (enteredPin) => {
    setLoadingData(true)
    try {
      if (pinProfile === 'parent') {
        const settings = await fetchParentSettings(familyId)
        if (settings && settings.parent_pin === enteredPin) {
          selectProfile({ type: 'parent' })
          setPinProfile(null)
          showToast('Đăng nhập Góc Bố Mẹ thành công!')
        } else {
          setPinError('Mã PIN Bố Mẹ chưa đúng!')
          setPinInput('')
        }
      } else {
        // Hồ sơ con
        if (pinProfile.pin === enteredPin) {
          selectProfile({ type: 'child', child: pinProfile })
          setPinProfile(null)
          showToast(`Chào bé ${pinProfile.name}! 🚀`)
        } else {
          setPinError('Mã PIN chưa chính xác, thử lại con nhé!')
          setPinInput('')
        }
      }
    } catch (err) {
      setPinError('Lỗi kiểm tra PIN: ' + err.message)
      setPinInput('')
    } finally {
      setLoadingData(false)
    }
  }

  // Thêm hồ sơ con mới
  const handleCreateChild = async (e) => {
    e.preventDefault()
    setAddChildError('')
    if (!newChildName.trim()) {
      setAddChildError('Con tên gì thế bố mẹ?')
      return
    }
    if (newChildPin.length !== 4 || isNaN(newChildPin)) {
      setAddChildError('Mã PIN cho con phải gồm 4 số!')
      return
    }

    try {
      await addChild(familyId, {
        name: newChildName.trim(),
        avatar: newChildAvatar,
        pin: newChildPin,
        grade: newChildGrade
      })
      showToast('Đã tạo hồ sơ con thành công!')
      setShowAddChildModal(false)
      setNewChildName('')
      setNewChildPin('')
      setNewChildGrade(2)
      // Tải lại danh sách hồ sơ
      loadAppData()
    } catch (err) {
      setAddChildError(err.message || 'Không thể tạo hồ sơ con')
    }
  }

  // Bố mẹ thêm nhiệm vụ mới
  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) {
      showToast('Vui lòng nhập tên nhiệm vụ!')
      return
    }
    if (!newTaskChildId) {
      showToast('Vui lòng chọn hồ sơ con để giao!')
      return
    }

    try {
      await addTask(familyId, {
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim(),
        stars: Number(newTaskStars),
        recurrence: newTaskRecurrence,
        child_id: newTaskChildId
      })
      showToast('Đã thêm nhiệm vụ thành công!')
      setNewTaskTitle('')
      setNewTaskDesc('')
      loadAppData()
    } catch (err) {
      showToast('Lỗi tạo nhiệm vụ: ' + err.message)
    }
  }

  // Bố mẹ dừng nhiệm vụ
  const handleDeactivateTask = async (id) => {
    try {
      await deactivateTask(id)
      showToast('Đã dừng nhiệm vụ!')
      loadAppData()
    } catch (err) {
      showToast('Lỗi dừng nhiệm vụ: ' + err.message)
    }
  }

  // Bố mẹ phê duyệt / từ chối kèm lời phê qua modal
  const handleConfirmApprovalReview = async () => {
    if (!activeApprovalCompletion) return
    const { completion, action } = activeApprovalCompletion
    const isApprove = action === 'approve'
    try {
      await reviewCompletion(familyId, completion, isApprove, parentFeedbackText.trim(), tasks.find(t => t.id === completion.task_id)?.title || '')
      showToast(isApprove ? `Đã phê duyệt nhiệm vụ! + ${completion.stars} ⭐️` : 'Đã từ chối nhiệm vụ!')
      if (isApprove) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
      setActiveApprovalCompletion(null)
      setParentFeedbackText('')
      loadAppData()
    } catch (err) {
      showToast('Lỗi phê duyệt: ' + err.message)
    }
  }

  // Bố mẹ thêm quà mới vào shop
  const handleCreateReward = async (e) => {
    e.preventDefault()
    if (!newRewardTitle.trim()) {
      showToast('Vui lòng nhập tên món quà!')
      return
    }

    try {
      await addReward(familyId, {
        title: newRewardTitle.trim(),
        emoji: newRewardEmoji,
        cost: Number(newRewardCost)
      })
      showToast('Đã thêm quà mới vào Cửa hàng!')
      setNewRewardTitle('')
      loadAppData()
    } catch (err) {
      showToast('Lỗi thêm quà: ' + err.message)
    }
  }

  // Bố mẹ gỡ quà khỏi shop
  const handleDeactivateReward = async (id) => {
    try {
      await deactivateReward(id)
      showToast('Đã gỡ quà khỏi Cửa hàng!')
      loadAppData()
    } catch (err) {
      showToast('Lỗi gỡ quà: ' + err.message)
    }
  }

  // Bố mẹ duyệt trao quà / từ chối
  const handleApproveRedemption = async (red, fulfill) => {
    try {
      await reviewRedemption(familyId, red, fulfill)
      showToast(fulfill ? 'Xác nhận đã trao phần quà cho con! 🎁' : 'Đã hủy và hoàn lại sao cho con!')
      loadAppData()
    } catch (err) {
      showToast('Lỗi xử lý đổi quà: ' + err.message)
    }
  }

  // Bố mẹ cập nhật PIN quản lý
  const handleChangeParentPin = async (e) => {
    e.preventDefault()
    setParentPinError('')
    setParentPinSuccess('')

    if (newParentPin.length !== 4 || isNaN(newParentPin)) {
      setParentPinError('Mã PIN mới phải gồm 4 chữ số!')
      return
    }

    try {
      const settings = await fetchParentSettings(familyId)
      if (settings.parent_pin !== currentParentPin) {
        setParentPinError('Mã PIN hiện tại không khớp!')
        return
      }
      await updateParentPin(familyId, newParentPin)
      setParentPinSuccess('Đã đổi mã PIN Bố Mẹ thành công!')
      setCurrentParentPin('')
      setNewParentPin('')
    } catch (err) {
      setParentPinError('Không thể đổi PIN: ' + err.message)
    }
  }

  // Bố mẹ sửa mã PIN của con
  const handleUpdateChildPin = async (childId) => {
    if (newChildPinValue.length !== 4 || isNaN(newChildPinValue)) {
      showToast('Mã PIN mới của con phải gồm 4 chữ số!')
      return
    }
    try {
      const { error } = await supabase
        .from('children')
        .update({ pin: newChildPinValue })
        .eq('id', childId)
      if (error) throw error
      showToast('Đã cập nhật mã PIN của con!')
      setEditingChildPinId('')
      setNewChildPinValue('')
      loadAppData()
    } catch (err) {
      showToast('Lỗi cập nhật PIN con: ' + err.message)
    }
  }

  // Con bấm "Hoàn thành" -> Hiển thị Modal để nạp minh chứng
  const handleChildSubmitCompletion = (task) => {
    setActiveProofTask(task)
    setProofImageBase64(null)
    setProofChildNote('')
  }

  // Bé xác nhận gửi minh chứng
  const handleConfirmProofSubmit = async () => {
    if (!activeProofTask) return
    try {
      await submitCompletion(familyId, activeProofTask, proofImageBase64, proofChildNote.trim())
      showToast('Đã gửi yêu cầu hoàn thành kèm minh chứng! Chờ bố mẹ duyệt con nhé. 🚀')
      celebrate({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.6 }
      })
      setActiveProofTask(null)
      setProofImageBase64(null)
      setProofChildNote('')
      loadAppData()
    } catch (err) {
      showToast('Lỗi gửi hoàn thành: ' + err.message)
    }
  }

  // Bé hoàn thành đọc sách và trả lời đúng câu hỏi trắc nghiệm
  const handleBookFinished = async (book) => {
    const childId = profile.child.id
    // Sao chỉ được cộng ở lần đầu, NHƯNG lượt học vẫn luôn được ghi vào lịch sử.
    const alreadyDone = completions.some(
      c => c.child_id === childId && c.task_id === 'book-' + book.id && c.status === 'approved'
    )
    const quizTotal = book.quiz ? 1 : 0
    const firstTry = book.quiz && bookWrongAttempts === 0 ? 1 : 0
    // Đoán bừa tới khi trúng vẫn qua bài, nên sao phải tính theo lần trả lời ĐẦU TIÊN.
    const bookGrade = gradeQuizResult(book.stars || 8, firstTry, quizTotal)
    const starsToEarn = alreadyDone ? 0 : bookGrade.stars

    try {
      // 1) Ghi lịch sử học tập — kể cả khi bé đọc lại quyển cũ
      await logLearningSession(familyId, childId, {
        kind: 'book',
        refId: String(book.id),
        title: book.title,
        subject: 'Đọc sách',
        quizTotal,
        quizFirstTry: firstTry,
        wrongAttempts: bookWrongAttempts,
        wrongAnswers: bookWrongAnswers,
        durationSeconds: elapsedSeconds(bookStartedAt),
        starsEarned: starsToEarn,
      })

      // 2) Cộng sao (chỉ lần đầu)
      if (alreadyDone) {
        showToast(`📚 Bé đã đọc lại "${book.title}" — đã ghi vào lịch sử học tập. Sao chỉ được nhận ở lần đầu nhé!`)
      } else {
        await addStars(familyId, childId, starsToEarn, `Hoàn thành đọc sách: ${book.title}`)
        await submitCompletion(
          familyId,
          { id: 'book-' + book.id, title: `Đọc sách: ${book.title}`, stars: starsToEarn, child_id: childId },
          null,
          `Bé đã đọc xong truyện "${book.title}" và trả lời đúng câu đố! Bài học: ${book.quiz?.moral || ''}`,
          'approved'
        )
        setChildBalance(prev => prev + starsToEarn)
        const bookFull = book.stars || 8
        showToast(
          starsToEarn < bookFull
            ? `${tone.you} nhận +${starsToEarn} ⭐ khi đọc xong "${book.title}". Trả lời đúng ngay lần đầu sẽ được trọn ${bookFull} ⭐ nhé!`
            : `🎉 Rực rỡ! ${tone.you} được nhận +${starsToEarn} ⭐ khi đọc xong "${book.title}"!`
        )
        celebrate({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      }
      setReadingBook(null)
      loadAppData()
    } catch (err) {
      showToast('❌ Chưa lưu được kết quả: ' + err.message + '. Bé hãy thử lại nhé!')
    }
  }

  // Bé hoàn thành học toán và trả lời đúng toàn bộ câu hỏi trắc nghiệm
  const handleMathTopicFinished = async (topic) => {
    const childId = profile.child.id
    const alreadyDone = completions.some(
      c => c.child_id === childId && c.task_id === 'math-' + topic.id && c.status === 'approved'
    )
    const mathTotal = topic.quizzes?.length || 0
    const mathGrade = gradeQuizResult(topic.stars || 8, mathFirstTryCount, mathTotal)
    const starsToEarn = alreadyDone ? 0 : mathGrade.stars

    try {
      // 1) Ghi lịch sử học tập — kể cả khi bé ôn lại chủ đề cũ
      await logLearningSession(familyId, childId, {
        kind: 'math',
        refId: String(topic.id),
        title: topic.title,
        subject: 'Toán tư duy',
        quizTotal: mathTotal,
        quizFirstTry: mathFirstTryCount,
        wrongAttempts: mathWrongAttempts,
        wrongAnswers: mathWrongAnswers,
        durationSeconds: elapsedSeconds(mathStartedAt),
        starsEarned: starsToEarn,
      })

      // 2) Cộng sao (chỉ lần đầu)
      if (alreadyDone) {
        showToast(`🧮 Bé đã ôn lại "${topic.title}" — đã ghi vào lịch sử học tập. Sao chỉ được nhận ở lần đầu nhé!`)
      } else {
        await addStars(familyId, childId, starsToEarn, `Hoàn thành Toán tư duy: ${topic.title}`)
        await submitCompletion(
          familyId,
          { id: 'math-' + topic.id, title: `Toán tư duy: ${topic.title}`, stars: starsToEarn, child_id: childId },
          null,
          `Bé đã hoàn thành học toán tư duy và trả lời đúng các thử thách của chủ đề: ${topic.title}`,
          'approved'
        )
        setChildBalance(prev => prev + starsToEarn)
        const mathFull = topic.stars || 8
        showToast(
          starsToEarn < mathFull
            ? `${tone.you} nhận +${starsToEarn} ⭐ (${mathFirstTryCount}/${mathTotal} câu đúng ngay lần đầu). Đúng hết ngay lần đầu sẽ được trọn ${mathFull} ⭐!`
            : `🎉 Tuyệt vời! ${tone.you} được nhận +${starsToEarn} ⭐ khi làm xong Toán tư duy!`
        )
        celebrate({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      }
      setSelectedMathTopic(null)
      loadAppData()
    } catch (err) {
      showToast('❌ Chưa lưu được kết quả: ' + err.message + '. Bé hãy thử lại nhé!')
    }
  }

  // Con bấm "Đổi quà"
  const handleChildRedeem = async (reward) => {
    if (childBalance < reward.cost) {
      showToast('Con chưa tích đủ sao để đổi món quà này đâu!')
      return
    }

    try {
      await redeemReward(familyId, profile.child.id, reward)
      showToast(`Đổi quà thành công! Hãy báo bố mẹ trao món quà "${reward.title}" nhé 🎁`)
      // Hiệu ứng pháo hoa rực rỡ
      celebrate({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      })
      loadAppData()
    } catch (err) {
      showToast('Lỗi đổi quà: ' + err.message)
    }
  }

  // Bé đổi vé chơi game trong Khu Game (trừ sao, ghi sổ sao để không bị khôi phục khi tải lại)
  // Trả về true/false để Khu Game chỉ bắt đầu khi đã trừ sao thành công.
  const handleDeductStarsForGame = async (cost) => {
    try {
      await addStars(familyId, profile.child.id, -cost, 'Đổi vé chơi Game Arcade')
      setChildBalance(prev => Math.max(0, prev - cost))
      showToast(`🎟️ Đã trừ ${cost} Sao để đổi 1 vé chơi Game 5 phút!`)
      return true
    } catch (err) {
      showToast('Lỗi trừ sao đổi vé game: ' + err.message)
      return false
    }
  }

  // Helpers tính thời gian tương đối ngộ nghĩnh cho nhật ký sao
  const formatTime = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    
    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) {
      if (d.getDate() === now.getDate()) {
        return `Hôm nay, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
      return `Hôm qua, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  // ==================== RENDERING LOGIC ====================

  // Màn hình 0: Cấu hình Supabase (nếu chưa cấu hình)
  if (!configured) {
    return (
      <div className="center-container">
        <div className="card glass config-wizard">
          <h2>Cấu Hình Kết Nối Supabase</h2>
          <p className="subtitle">Chào mừng! Để bắt đầu sử dụng app, vui lòng nhập thông tin cơ sở dữ liệu Supabase của bạn.</p>
          <form onSubmit={handleSaveConfig} className="form-group">
            <label htmlFor="url-input">Supabase Project URL</label>
            <input 
              id="url-input"
              type="text" 
              placeholder="https://xxxxxx.supabase.co" 
              value={cfgUrl}
              onChange={(e) => setCfgUrl(e.target.value)}
              required
            />
            <label htmlFor="key-input">Anon Key</label>
            <input 
              id="key-input"
              type="password" 
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
              value={cfgKey}
              onChange={(e) => setCfgKey(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary">Kết nối & Bắt đầu</button>
          </form>
          <div className="config-help">
            <p>💡 <strong>Mẹo:</strong> Bạn có thể tìm thấy thông tin này trong phần <strong>Project Settings &gt; API</strong> trong bảng điều khiển Supabase của bạn.</p>
          </div>
        </div>
      </div>
    )
  }

  // Đang tải xác thực ban đầu
  if (authLoading) {
    return (
      <div className="center-container">
        <div className="spinner"></div>
      </div>
    )
  }

  // Màn hình 1: Xác thực Đăng nhập / Đăng ký
  if (!session) {
    return (
      <div className="center-container">
        <div className="card glass auth-card">
          <div className="brand">
            <span className="logo-emoji">🏆</span>
            <h1>Hành Trình Trưởng Thành</h1>
            <p>Ứng dụng rèn luyện nếp sống tốt, hoàn thành nhiệm vụ & đổi sao nhận quà ý nghĩa!</p>
          </div>
          
          <div className="auth-toggle">
            <button 
              id="signin-tab-btn"
              type="button"
              className={!isSignUp ? 'active' : ''} 
              onClick={() => { setIsSignUp(false); setAuthError(''); }}
            >
              Đăng Nhập Gia Đình
            </button>
            <button 
              id="signup-tab-btn"
              type="button"
              className={isSignUp ? 'active' : ''} 
              onClick={() => { setIsSignUp(true); setAuthError(''); }}
            >
              Tạo Tài Khoản Mới
            </button>
          </div>

          <form onSubmit={handleAuth} className="form-group">
            <label htmlFor="auth-email-input">Email gia đình</label>
            <input 
              id="auth-email-input"
              type="email" 
              placeholder="example@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="auth-pwd-input">Mật khẩu</label>
            <input 
              id="auth-pwd-input"
              type="password" 
              placeholder="Mật khẩu của bạn" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {authError && <div className="error-banner">{authError}</div>}
            
            <button type="submit" className="btn btn-primary" disabled={authLoadingState}>
              {authLoadingState ? 'Đang kết nối...' : isSignUp ? 'Tạo Tài Khoản Gia Đình' : 'Vào Gia Đình'}
            </button>
          </form>

          <button 
            type="button" 
            className="btn-link text-small" 
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn cài đặt lại thông tin Supabase?')) {
                localStorage.removeItem('supabase_url')
                localStorage.removeItem('supabase_anon_key')
                setConfigured(false)
              }
            }}
          >
            ⚙ Thay đổi cấu hình Supabase
          </button>
        </div>
      </div>
    )
  }

  // Màn hình 2: Chọn hồ sơ (Netflix style)
  if (!profile) {
    return (
      <div className="center-container">
        <div className="profile-selector-container">
          <h1 className="select-profile-title">Ai đang sử dụng thế?</h1>
          
          <div className="profiles-grid">
            {/* Hồ sơ bố mẹ */}
            <button 
              type="button"
              className="profile-card parent-profile"
              onClick={() => handleProfileClick('parent')}
            >
              <div className="profile-avatar-wrapper">
                <span className="profile-avatar">🔑</span>
              </div>
              <span className="profile-name">Bố Mẹ</span>
            </button>

            {/* Danh sách các con */}
            {children.map((child) => (
              <button 
                key={child.id}
                type="button"
                className="profile-card child-profile"
                onClick={() => handleProfileClick(child)}
              >
                <div className="profile-avatar-wrapper">
                  <span className="profile-avatar">{child.avatar}</span>
                </div>
                <span className="profile-name">{child.name}</span>
              </button>
            ))}

            {/* Thêm hồ sơ con mới */}
            <button 
              type="button"
              className="profile-card add-profile-card"
              onClick={() => {
                setAddChildError('')
                setShowAddChildModal(true)
              }}
            >
              <div className="profile-avatar-wrapper dashed">
                <span className="profile-avatar">+</span>
              </div>
              <span className="profile-name">Thêm Bé</span>
            </button>
          </div>

          <div className="profile-footer-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={signOut}>
              🚪 Đăng xuất tài khoản
            </button>
          </div>

          {/* Modal Nhập PIN */}
          {pinProfile && (
            <div className="pin-overlay">
              <div className="pin-dialog glass card">
                <h3>Nhập mã PIN</h3>
                <p className="subtitle">
                  Để truy cập vào hồ sơ{' '}
                  <strong>{pinProfile === 'parent' ? 'Bố Mẹ' : pinProfile.name}</strong>
                </p>

                <div className="pin-display">
                  {[0, 1, 2, 3].map((idx) => (
                    <div 
                      key={idx} 
                      className={`pin-dot ${pinInput.length > idx ? 'filled' : ''}`}
                    ></div>
                  ))}
                </div>

                {pinError && <div className="error-banner pin-error">{pinError}</div>}

                {/* Bàn phím số trên màn hình */}
                <div className="pin-keypad">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button 
                      key={num} 
                      type="button"
                      className="keypad-btn" 
                      onClick={() => handlePinKeyPress(num.toString())}
                    >
                      {num}
                    </button>
                  ))}
                  <button 
                    type="button"
                    className="keypad-btn btn-danger" 
                    onClick={() => setPinProfile(null)}
                  >
                    Hủy
                  </button>
                  <button 
                    type="button"
                    className="keypad-btn" 
                    onClick={() => handlePinKeyPress('0')}
                  >
                    0
                  </button>
                  <button 
                    type="button"
                    className="keypad-btn btn-secondary" 
                    onClick={handlePinDelete}
                  >
                    ⌫
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Thêm hồ sơ con */}
          {showAddChildModal && (
            <div className="pin-overlay">
              <div className="card glass add-child-dialog">
                <h3>Thêm Hồ Sơ Bé Mới</h3>
                <form onSubmit={handleCreateChild} className="form-group text-left">
                  <label htmlFor="child-name-input">Tên của con</label>
                  <input 
                    id="child-name-input"
                    type="text" 
                    placeholder="Ví dụ: Tùng Anh, bé Bông..." 
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    required
                  />

                  <label>Chọn biểu tượng đại diện</label>
                  <div className="emojis-selection-grid">
                    {ANIMAL_EMOJIS.map((emoji) => (
                      <button 
                        key={emoji}
                        type="button"
                        className={`emoji-selector-btn ${newChildAvatar === emoji ? 'selected' : ''}`}
                        onClick={() => setNewChildAvatar(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <label htmlFor="child-pin-input">Mã PIN bí mật của con (4 chữ số)</label>
                  <input 
                    id="child-pin-input"
                    type="text" 
                    maxLength="4" 
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="0000" 
                    value={newChildPin}
                    onChange={(e) => setNewChildPin(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />
                  <span className="hint-text">Mã PIN giúp con đăng nhập và tự quản lý số sao của mình.</span>

                  <label>Con đang học lớp mấy?</label>
                  <div className="plan-grade-edit-row">
                    {[2, 8].map(g => (
                      <button
                        key={g}
                        type="button"
                        className={`plan-grade-btn ${newChildGrade === g ? 'active' : ''}`}
                        onClick={() => setNewChildGrade(g)}
                      >
                        Lớp {g}
                      </button>
                    ))}
                  </div>
                  <span className="hint-text">Chọn khối lớp để kế hoạch tuần tự gợi ý đúng bài SGK cho con.</span>

                  {addChildError && <div className="error-banner">{addChildError}</div>}

                  <div className="dialog-actions-row">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowAddChildModal(false)}
                    >
                      Đóng
                    </button>
                    <button type="submit" className="btn btn-primary">Tạo hồ sơ con</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Màn hình 3: Giao diện dành cho Bố Mẹ
  if (profile.type === 'parent') {
    return (
      <div className="dashboard-container">
        {/* Header Góc Bố Mẹ */}
        <header className="dashboard-header glass">
          <div className="header-brand">
            <span className="logo-emoji">🔑</span>
            <div>
              <h2>Góc Quản Lý Bố Mẹ {loadingData && <span className="spinner-sm"></span>}</h2>
              <p className="subtitle">Phê duyệt yêu cầu và giao việc rèn luyện cho các con</p>
            </div>
          </div>
          <div className="header-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => selectProfile(null)}>
              🔁 Đổi hồ sơ
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={signOut}>
              🚪 Đăng xuất
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="dashboard-nav-tabs">
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveTab('approvals')}
          >
            📥 Duyệt yêu cầu
            {(completions.filter(c => c.status === 'pending').length > 0 || 
              redemptions.filter(r => r.status === 'pending').length > 0) && (
              <span className="badge-count">
                {completions.filter(c => c.status === 'pending').length + 
                 redemptions.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            📋 Quản lý Nhiệm vụ
          </button>
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('plan')
              if (planChildId === null && children.length > 0) {
                setPlanChildId(children[0].id)
                loadPlanDays(children[0].id, planWeek)
              }
            }}
          >
            📅 Kế hoạch tuần
          </button>
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'rewards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rewards')}
          >
            🎁 Cửa hàng quà tặng
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveTab('learning')}
          >
            📖 Lịch sử học tập
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Thống Kê
          </button>
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙ Cài đặt PIN
          </button>
        </nav>

        {/* Nội dung chính các Tab */}
        <main className="dashboard-main-content">
          
          {/* Tab 1: Phê duyệt yêu cầu */}
          {activeTab === 'approvals' && (
            <div className="tab-pane">
              {/* Phê duyệt làm xong việc */}
              <section className="dashboard-section card glass">
                <h3 className="section-title">🌟 Nhiệm vụ hoàn thành cần duyệt</h3>
                {completions.filter(c => c.status === 'pending').length === 0 ? (
                  <p className="empty-message">Hiện chưa có bé nào gửi yêu cầu hoàn thành nhiệm vụ.</p>
                ) : (
                  <div className="approvals-list">
                    {completions.filter(c => c.status === 'pending').map((comp) => {
                      const child = children.find(ch => ch.id === comp.child_id)
                      return (
                        <div key={comp.id} className="approval-item card">
                          <div className="approval-info">
                            <span className="child-tag">
                              {child?.avatar} {child?.name}
                            </span>
                            <div className="details text-left">
                              <strong>
                                {tasks.find(t => t.id === comp.task_id)?.title || 
                                 comp.child_note || 
                                 (comp.task_id?.startsWith('sgk-') ? 'Bài học Sách Giáo Khoa' : 
                                  comp.task_id?.startsWith('math-') ? 'Bài tập Toán tư duy' : 
                                  comp.task_id?.startsWith('book-') ? 'Đọc sách truyện' : 'Nhiệm vụ rèn luyện')}
                              </strong>
                              <span className="time">{formatTime(comp.created_at)}</span>
                              
                              {comp.child_note && tasks.find(t => t.id === comp.task_id)?.title && (
                                <div className="child-note-bubble">
                                  💬 Con nhắn: "{comp.child_note}"
                                </div>
                              )}
                              
                              {comp.proof_image && (
                                <div className="proof-image-thumbnail-box">
                                  <a href={comp.proof_image} target="_blank" rel="noreferrer">
                                    <img src={comp.proof_image} alt="Ảnh minh chứng" className="proof-thumbnail" />
                                    <span className="view-full-image-text">🔍 Xem ảnh lớn</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="stars-earned">+{comp.stars} ⭐</div>
                          <div className="action-buttons">
                            <button 
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                setActiveApprovalCompletion({ completion: comp, action: 'reject' })
                                setParentFeedbackText('')
                              }}
                            >
                              Từ chối
                            </button>
                            <button 
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={() => {
                                setActiveApprovalCompletion({ completion: comp, action: 'approve' })
                                setParentFeedbackText('')
                              }}
                            >
                              Duyệt cộng sao
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* Phê duyệt đổi quà */}
              <section className="dashboard-section card glass">
                <h3 className="section-title">🎁 Quà cần trao cho con</h3>
                {redemptions.filter(r => r.status === 'pending').length === 0 ? (
                  <p className="empty-message">Hiện chưa có bé nào đổi phần thưởng.</p>
                ) : (
                  <div className="approvals-list">
                    {redemptions.filter(r => r.status === 'pending').map((red) => {
                      const child = children.find(ch => ch.id === red.child_id)
                      return (
                        <div key={red.id} className="approval-item card">
                          <div className="approval-info">
                            <span className="child-tag blue">
                              {child?.avatar} {child?.name}
                            </span>
                            <div className="details">
                              <strong>{red.rewards?.emoji} {red.rewards?.title || 'Phần quà'}</strong>
                              <span className="time">{formatTime(red.created_at)}</span>
                            </div>
                          </div>
                          <div className="stars-spent">-{red.cost} ⭐️</div>
                          <div className="action-buttons">
                            <button 
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleApproveRedemption(red, false)}
                            >
                              Hủy & hoàn sao
                            </button>
                            <button 
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => handleApproveRedemption(red, true)}
                            >
                              Đã trao quà
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Tab 1.5: Kế hoạch tuần */}
          {activeTab === 'plan' && (
            <div className="tab-pane">
              <section className="dashboard-section card glass">
                <h3 className="section-title">📅 Kế hoạch học tập tuần {planWeek}</h3>

                {/* Chọn bé + tuần */}
                <div className="plan-toolbar">
                  <div className="plan-kid-chips">
                    {children.map(child => (
                      <button
                        key={child.id}
                        type="button"
                        className={`plan-kid-chip ${planChildId === child.id ? 'active' : ''}`}
                        onClick={() => handlePlanChildChange(child.id)}
                      >
                        {child.avatar} {child.name}
                        <span className="plan-kid-grade">Lớp {child.grade || 2}</span>
                      </button>
                    ))}
                    <div className="plan-kid-grade-edit">
                      <label>Khối lớp của bé:</label>
                      <button
                        type="button"
                        className={`plan-grade-btn ${(children.find(c => c.id === planChildId)?.grade || 2) === 2 ? 'active' : ''}`}
                        onClick={async () => {
                          const child = children.find(c => c.id === planChildId)
                          if (!child) return
                          try {
                            await updateChildGrade(child.id, 2)
                            showToast(`Đã đặt ${child.name} học Lớp 2!`)
                            loadAppData()
                            loadPlanDays(child.id, planWeek)
                          } catch (err) { showToast('Lỗi: ' + err.message) }
                        }}
                      >Lớp 2</button>
                      <button
                        type="button"
                        className={`plan-grade-btn ${(children.find(c => c.id === planChildId)?.grade || 2) === 8 ? 'active' : ''}`}
                        onClick={async () => {
                          const child = children.find(c => c.id === planChildId)
                          if (!child) return
                          try {
                            await updateChildGrade(child.id, 8)
                            showToast(`Đã đặt ${child.name} học Lớp 8!`)
                            loadAppData()
                            loadPlanDays(child.id, planWeek)
                          } catch (err) { showToast('Lỗi: ' + err.message) }
                        }}
                      >Lớp 8</button>
                    </div>
                  </div>
                  <div className="plan-week-select">
                    <label>Tuần</label>
                    <select
                      value={planWeek}
                      onChange={e => handlePlanWeekChange(Number(e.target.value))}
                    >
                      {Array.from({ length: 35 }, (_, i) => i + 1).map(w => (
                        <option key={w} value={w}>Tuần {w}{w === currentSchoolWeek() ? ' (hiện tại)' : ''}</option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handlePlanAutoAssign}>
                      ✨ Tự động sắp xếp
                    </button>
                  </div>
                </div>

                {/* 5 ngày trong tuần */}
                <div className="plan-days-grid">
                  {PLAN_DAYS.map(day => {
                    const dayPlan = planDays[day] || { lessonId: null, note: '' }
                    const child = children.find(c => c.id === planChildId)
                    const weekItems = lessonsOfWeek(child?.grade || 2, planWeek)
                    return (
                      <div key={day} className={`plan-day-card ${day === WEEKDAY_KEYS[new Date().getDay()] ? 'today' : ''}`}>
                        <h4>{WEEKDAY_LABELS[day]}</h4>
                        <label className="plan-field-label">📗 Bài SGK</label>
                        <select
                          value={dayPlan.lessonId || ''}
                          onChange={e => handlePlanDayChange(day, 'lessonId', e.target.value || null)}
                        >
                          <option value="">— Không có bài —</option>
                          {weekItems.map(({ book, lesson }) => (
                            <option key={lesson.id} value={lesson.id}>
                              {book.subject} {book.volume}: {lesson.title}
                            </option>
                          ))}
                        </select>
                        {dayPlan.lessonId && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm plan-open-btn"
                            onClick={() => handleOpenLessonFromPlan(dayPlan.lessonId)}
                          >
                            📖 Xem bài học
                          </button>
                        )}
                        <label className="plan-field-label">📝 Việc riêng / ghi chú</label>
                        <input
                          type="text"
                          placeholder="VD: Học piano 30 phút"
                          value={dayPlan.note || ''}
                          onChange={e => handlePlanDayChange(day, 'note', e.target.value)}
                        />
                      </div>
                    )
                  })}
                </div>

                <div className="plan-save-row">
                  {planDirty && <span className="plan-unsaved-badge">⚠️ Chưa lưu</span>}
                  <button type="button" className="btn btn-success" onClick={handlePlanSave} disabled={planSaving}>
                    {planSaving ? 'Đang lưu...' : '💾 Lưu kế hoạch tuần'}
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Tab 2: Quản lý Nhiệm vụ */}
          {activeTab === 'tasks' && (
            <div className="tab-pane-grid">
              {/* Form Thêm nhiệm vụ */}
              <section className="card glass">
                <h3>Thêm Nhiệm Vụ Mới</h3>

                {/* Bảng Đề xuất Nhiệm vụ Khoa học */}
                <div className="scientific-suggestions">
                  <span className="suggestions-title">💡 Chọn nhanh nhiệm vụ gợi ý khoa học:</span>
                  <div className="suggestions-tabs">
                    {SCIENTIFIC_SUGGESTIONS.map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`suggestion-tab-btn ${activeSuggestionTab === idx ? 'active' : ''}`}
                        onClick={() => setActiveSuggestionTab(idx)}
                      >
                        {cat.category}
                      </button>
                    ))}
                  </div>
                  <div className="suggestions-list">
                    {SCIENTIFIC_SUGGESTIONS[activeSuggestionTab].tasks.map((task, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="suggestion-item-btn"
                        onClick={() => {
                          setNewTaskTitle(task.title)
                          setNewTaskDesc(task.desc)
                          setNewTaskStars(task.stars)
                          setNewTaskRecurrence(task.recurrence)
                          showToast(`Đã chọn: ${task.title} ✨`)
                        }}
                        title={task.desc}
                      >
                        <span className="task-title-pill">{task.title}</span>
                        <span className="task-stars-pill">+{task.stars}⭐</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCreateTask} className="form-group text-left">
                  <label htmlFor="task-title-input">Tên nhiệm vụ</label>
                  <input 
                    id="task-title-input"
                    type="text" 
                    placeholder="Rửa bát, quét phòng, đọc sách 15 phút..." 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                  />

                  <label htmlFor="task-desc-input">Chi tiết nhiệm vụ (tùy chọn)</label>
                  <textarea 
                    id="task-desc-input"
                    placeholder="Bé rửa sạch cả bát và xoong nồi nhé..." 
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                  />

                  <div className="form-row-2">
                    <div>
                      <label htmlFor="task-stars-input">Số sao tặng</label>
                      <input 
                        id="task-stars-input"
                        type="number" 
                        min="1" 
                        value={newTaskStars}
                        onChange={(e) => setNewTaskStars(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="task-recurrence-select">Chu kỳ lặp</label>
                      <select 
                        id="task-recurrence-select"
                        value={newTaskRecurrence}
                        onChange={(e) => setNewTaskRecurrence(e.target.value)}
                      >
                        <option value="once">Chỉ làm 1 lần</option>
                        <option value="daily">Lặp lại hằng ngày</option>
                        <option value="weekly">Lặp lại hằng tuần</option>
                      </select>
                    </div>
                  </div>

                  <label htmlFor="task-child-select">Giao cho bé</label>
                  <select 
                    id="task-child-select"
                    value={newTaskChildId}
                    onChange={(e) => setNewTaskChildId(e.target.value)}
                    required
                  >
                    {children.map(child => (
                      <option key={child.id} value={child.id}>{child.avatar} {child.name}</option>
                    ))}
                  </select>

                  <button type="submit" className="btn btn-primary margin-top">Giao Nhiệm Vụ</button>
                </form>
              </section>

              {/* Danh sách nhiệm vụ đang giao */}
              <section className="card glass">
                <h3>Danh Sách Việc Đang Giao</h3>
                {tasks.length === 0 ? (
                  <p className="empty-message">Hiện gia đình chưa giao việc nào.</p>
                ) : (
                  <div className="elements-list">
                    {tasks.map((task) => {
                      const child = children.find(ch => ch.id === task.child_id)
                      const recurrenceMap = {
                        once: 'Chỉ 1 lần',
                        daily: 'Hằng ngày',
                        weekly: 'Hằng tuần'
                      }
                      return (
                        <div key={task.id} className="list-element-card">
                          <div className="element-main">
                            <span className="child-badge">{child?.avatar} {child?.name}</span>
                            <h4>{task.title}</h4>
                            <p className="subtitle">{task.description}</p>
                            <span className="badge-tag">{recurrenceMap[task.recurrence]}</span>
                          </div>
                          <div className="element-action">
                            <span className="stars-badge">⭐️ {task.stars}</span>
                            <button 
                              type="button"
                              className="btn btn-danger btn-xs"
                              onClick={() => handleDeactivateTask(task.id)}
                            >
                              Dừng giao
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Tab 3: Quản lý Cửa hàng Quà */}
          {activeTab === 'rewards' && (
            <div className="tab-pane-grid">
              {/* Form Thêm Quà */}
              <section className="card glass">
                <h3>Thêm Quà Mới</h3>
                <form onSubmit={handleCreateReward} className="form-group text-left">
                  <label htmlFor="reward-title-input">Tên phần quà</label>
                  <input 
                    id="reward-title-input"
                    type="text" 
                    placeholder="Đi xem phim, mua kem, xem TV 30 phút..." 
                    value={newRewardTitle}
                    onChange={(e) => setNewRewardTitle(e.target.value)}
                    required
                  />

                  <div className="form-row-2">
                    <div>
                      <label htmlFor="reward-emoji-select">Chọn biểu tượng quà</label>
                      <select 
                        id="reward-emoji-select"
                        value={newRewardEmoji}
                        onChange={(e) => setNewRewardEmoji(e.target.value)}
                      >
                        <option value="🎁">🎁 Hộp quà</option>
                        <option value="🍦">🍦 Ăn kem</option>
                        <option value="🎡">🎡 Đi chơi</option>
                        <option value="📺">📺 Xem TV</option>
                        <option value="🧸">🧸 Đồ chơi</option>
                        <option value="🍕">🍕 Pizza</option>
                        <option value="🎨">🎨 Tô tượng</option>
                        <option value="📚">📚 Truyện tranh</option>
                        <option value="🎮">🎮 Chơi game</option>
                        <option value="🍚">🍚 Chọn món ăn</option>
                        <option value="🚲">🚲 Đi công viên</option>
                        <option value="🌙">🌙 Ngủ trễ</option>
                        <option value="🎟️">🎟️ Phiếu ưu tiên</option>
                        <option value="👵">👵 Về quê thăm Ông Bà</option>
                        <option value="🕐">🕐 Tự quản thời gian</option>
                        <option value="🛹">🛹 Đi chơi với bạn</option>
                        <option value="🗺️">🗺️ Tự chọn hoạt động</option>
                        <option value="💻">💻 Dùng máy tính</option>
                        <option value="💰">💰 Tiền tiêu vặt</option>
                        <option value="🤝">🤝 Được tin tưởng</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="reward-cost-input">Giá sao đổi</label>
                      <input 
                        id="reward-cost-input"
                        type="number" 
                        min="1" 
                        value={newRewardCost}
                        onChange={(e) => setNewRewardCost(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary margin-top">Thêm Quà Vào Shop</button>
                </form>

                {/* Gợi ý phần thưởng theo độ tuổi.
                    Trẻ nhỏ thích quà vặt và sự chiều chuộng; tuổi teen coi trọng
                    QUYỀN TỰ CHỦ và được tin tưởng hơn nhiều — quà kiểu "được bố mẹ
                    cõng đi dạo" với bạn lớp 8 là phản tác dụng. */}
                <div className="reward-suggestions">
                  <div className="reward-sugg-tabs">
                    <span className="reward-sugg-label">💡 Gợi ý cho:</span>
                    <button
                      type="button"
                      className={`reward-sugg-tab ${suggAge === 'kid' ? 'active' : ''}`}
                      onClick={() => setRewardSuggAge('kid')}
                    >
                      Tiểu học
                    </button>
                    <button
                      type="button"
                      className={`reward-sugg-tab ${suggAge === 'teen' ? 'active' : ''}`}
                      onClick={() => setRewardSuggAge('teen')}
                    >
                      Lớp 6 trở lên
                    </button>
                  </div>
                  <div className="reward-sugg-list">
                    {REWARD_SUGGESTIONS[suggAge].map(s => (
                      <button
                        key={s.title}
                        type="button"
                        className="reward-sugg-pill"
                        title="Bấm để điền nhanh vào form bên trên"
                        onClick={() => {
                          setNewRewardTitle(s.title)
                          setNewRewardEmoji(s.emoji)
                          setNewRewardCost(s.cost)
                        }}
                      >
                        <span className="reward-sugg-emoji">{s.emoji}</span>
                        <span className="reward-sugg-text">{s.title}</span>
                        <span className="reward-sugg-cost">{s.cost} ⭐</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Danh sách quà trong Shop */}
              <section className="card glass">
                <h3>Quà Tặng Trong Cửa Hàng</h3>
                {rewards.length === 0 ? (
                  <p className="empty-message">Hiện chưa có phần quà nào trong cửa hàng.</p>
                ) : (
                  <div className="elements-list">
                    {rewards.map((reward) => (
                      <div key={reward.id} className="list-element-card">
                        <div className="element-main row-layout">
                          <span className="gift-emoji">{reward.emoji}</span>
                          <div>
                            <h4>{reward.title}</h4>
                            <span className="price-tag">Cần {reward.cost} ⭐️ để đổi</span>
                          </div>
                        </div>
                        <div className="element-action">
                          <button 
                            type="button"
                            className="btn btn-danger btn-xs"
                            onClick={() => handleDeactivateReward(reward.id)}
                          >
                            Gỡ bỏ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Tab 4: Cài đặt PIN & Tài khoản */}
          {activeTab === 'settings' && (
            <div className="tab-pane-grid">
              {/* Đổi PIN Bố Mẹ */}
              <section className="card glass">
                <h3>Đổi Mã PIN Bố Mẹ</h3>
                <p className="subtitle">Dùng để hạn chế các con tự vào Góc Bố Mẹ thay đổi cấu hình.</p>
                <form onSubmit={handleChangeParentPin} className="form-group text-left">
                  <label htmlFor="current-pin-input">Mã PIN hiện tại</label>
                  <input 
                    id="current-pin-input"
                    type="password" 
                    maxLength="4"
                    placeholder="0000"
                    value={currentParentPin}
                    onChange={(e) => setCurrentParentPin(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />
                  <label htmlFor="new-pin-input">Mã PIN mới (4 chữ số)</label>
                  <input 
                    id="new-pin-input"
                    type="password" 
                    maxLength="4"
                    placeholder="Mã PIN 4 số mới"
                    value={newParentPin}
                    onChange={(e) => setNewParentPin(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                  />

                  {parentPinError && <div className="error-banner">{parentPinError}</div>}
                  {parentPinSuccess && <div className="success-banner">{parentPinSuccess}</div>}

                  <button type="submit" className="btn btn-primary margin-top">Cập Nhật PIN Bố Mẹ</button>
                </form>
              </section>

              {/* Danh sách quản lý PIN của con */}
              <section className="card glass">
                <h3>Quản Lý Mã PIN Các Bé</h3>
                <p className="subtitle">Bố mẹ có thể xem hoặc đặt lại mã PIN của con nếu con quên.</p>
                <div className="elements-list">
                  {children.map((child) => (
                    <div key={child.id} className="list-element-card text-left">
                      <div className="element-main">
                        <h4>{child.avatar} {child.name}</h4>
                        <p className="subtitle">Mã PIN hiện tại: <strong>{child.pin}</strong></p>
                      </div>
                      
                      <div className="element-action">
                        {editingChildPinId === child.id ? (
                          <div className="row-layout gap-sm">
                            <input 
                              aria-label="Mã PIN mới của bé"
                              type="text" 
                              maxLength="4" 
                              placeholder="Mới" 
                              className="input-xs"
                              value={newChildPinValue}
                              onChange={(e) => setNewChildPinValue(e.target.value.replace(/[^0-9]/g, ''))}
                            />
                            <button 
                              type="button"
                              className="btn btn-primary btn-xs"
                              onClick={() => handleUpdateChildPin(child.id)}
                            >
                              Lưu
                            </button>
                            <button 
                              type="button"
                              className="btn btn-secondary btn-xs"
                              onClick={() => setEditingChildPinId('')}
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            className="btn btn-secondary btn-xs" 
                            onClick={() => {
                              setEditingChildPinId(child.id)
                              setNewChildPinValue('')
                            }}
                          >
                            Đổi PIN
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Modal Bố Mẹ Duyệt Kèm Lời Phê */}
          {/* Dự phòng khi trình duyệt không cho ghi clipboard */}
          {digestFallbackText && (
            <div className="pin-overlay">
              <div className="card glass add-child-dialog">
                <h3>📋 Sao chép bản tin</h3>
                <p className="subtitle">
                  Trình duyệt không cho tự động sao chép. Bố mẹ bôi đen nội dung dưới đây rồi
                  copy thủ công nhé.
                </p>
                <textarea
                  readOnly
                  className="digest-fallback-textarea"
                  value={digestFallbackText}
                  onFocus={(e) => e.target.select()}
                />
                <div className="dialog-actions-row">
                  <button
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={() => setDigestFallbackText(null)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeApprovalCompletion && (
            <div className="pin-overlay">
              <div className="card glass add-child-dialog">
                <h3>Xác nhận phê duyệt nhiệm vụ</h3>
                <p className="subtitle">
                  {activeApprovalCompletion.action === 'approve' 
                    ? 'Bạn đang phê duyệt và cộng sao cho con. Hãy gửi kèm lời nhắn khen ngợi nhé!' 
                    : 'Bạn đang từ chối yêu cầu này. Hãy gửi kèm lời nhắn giải thích cho con nhé!'}
                </p>

                <div className="form-group text-left">
                  <label htmlFor="parent-feedback-textarea">✍️ Lời phê/góp ý gửi đến con (tùy chọn)</label>
                  <textarea
                    id="parent-feedback-textarea"
                    placeholder={activeApprovalCompletion.action === 'approve' 
                      ? 'Con làm rất tốt, bố mẹ rất tự hào về con! ❤️' 
                      : 'Nhiệm vụ chưa hoàn thành sạch sẽ lắm con ơi, hãy dọn lại nhé!'}
                    value={parentFeedbackText}
                    onChange={(e) => setParentFeedbackText(e.target.value)}
                  />

                  <div className="quick-templates">
                    <span className="text-small">Khen nhanh:</span>
                    <div className="template-pills">
                      {[
                        'Bố mẹ rất tự hào về con! ❤️',
                        'Sạch gọn tuyệt vời con ơi! 👍',
                        'Cố gắng phát huy nhé con! 🌟',
                        'Cố lên con yêu! 💪'
                      ].map((tpl) => (
                        <button
                          key={tpl}
                          type="button"
                          className="template-pill-btn"
                          onClick={() => setParentFeedbackText(tpl)}
                        >
                          {tpl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="dialog-actions-row">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setActiveApprovalCompletion(null)
                        setParentFeedbackText('')
                      }}
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      className={activeApprovalCompletion.action === 'approve' ? 'btn btn-success' : 'btn btn-danger'}
                      onClick={handleConfirmApprovalReview}
                    >
                      {activeApprovalCompletion.action === 'approve' ? 'Duyệt & Cộng Sao ✔' : 'Từ chối yêu cầu ✕'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal xem sách gốc PDF: đúng bản in với đầy đủ tranh minh hoạ */}
          <PdfViewerModal pdf={sgkPdfOpen} onClose={() => setSgkPdfOpen(null)} />
          
          {/* Tab 6: Thống Kê Tiến Độ */}
          {/* Tab: Lịch sử học tập chi tiết của các con */}
          {activeTab === 'learning' && (
            <div className="tab-pane">
              <h3 className="section-title">📖 Lịch Sử Học Tập Của Các Con</h3>
              <p className="subtitle">
                Mỗi lượt bé làm bài đều được ghi lại, kể cả những lần ôn lại bài cũ không còn nhận sao.
              </p>

              {/* Bộ lọc theo bé */}
              <div className="learning-filter-bar">
                <button
                  type="button"
                  className={`learning-filter-btn ${historyChildId === 'all' ? 'active' : ''}`}
                  onClick={() => setHistoryChildId('all')}
                >
                  👨‍👩‍👧‍👦 Tất cả
                </button>
                {children.map(kid => (
                  <button
                    key={kid.id}
                    type="button"
                    className={`learning-filter-btn ${historyChildId === kid.id ? 'active' : ''}`}
                    onClick={() => setHistoryChildId(kid.id)}
                  >
                    {kid.avatar} {kid.name}
                  </button>
                ))}
              </div>

              {/* Bản tin tuần: bố mẹ nắm tình hình trong 30 giây, không cần mở app mỗi ngày */}
              <WeeklyDigestPanel
                sessions={historyChildId === 'all'
                  ? learningSessions
                  : learningSessions.filter(s => s.child_id === historyChildId)}
                childName={historyChildId === 'all'
                  ? 'các con'
                  : (children.find(c => c.id === historyChildId)?.name || 'con')}
                dueReviews={historyChildId === 'all'
                  ? dueReviews
                  : dueReviews.filter(r => r.childId === historyChildId)}
                onCopied={() => showToast('📋 Đã sao chép bản tin. Bố mẹ dán vào Zalo được rồi!')}
                onCopyFailed={(text) => setDigestFallbackText(text)}
              />

              {(() => {
                const rows = historyChildId === 'all'
                  ? learningSessions
                  : learningSessions.filter(s => s.child_id === historyChildId)

                if (rows.length === 0) {
                  return (
                    <p className="empty-message">
                      Chưa có lượt học nào được ghi lại. Khi bé làm xong phần trắc nghiệm của một bài,
                      lượt học sẽ xuất hiện tại đây.
                    </p>
                  )
                }

                const kindMeta = {
                  sgk:  { icon: '📗', label: 'SGK' },
                  book: { icon: '📚', label: 'Đọc sách' },
                  math: { icon: '🧮', label: 'Toán tư duy' },
                }
                const childName = (id) => children.find(c => c.id === id)?.name || 'Bé'
                const totalMinutes = Math.round(rows.reduce((s, r) => s + (r.duration_seconds || 0), 0) / 60)
                const totalWrong = rows.reduce((s, r) => s + (r.wrong_attempts || 0), 0)
                const distinctLessons = new Set(rows.map(r => r.kind + '-' + r.ref_id)).size

                // Những câu bé hay sai nhất — nền tảng cho ôn tập lặp lại
                const missTally = new Map()
                rows.forEach(r => {
                  (r.wrong_answers || []).forEach(w => {
                    if (!w?.q) return
                    const key = w.q
                    const cur = missTally.get(key) || { q: w.q, correct: w.correct, count: 0, title: r.title }
                    cur.count += 1
                    missTally.set(key, cur)
                  })
                })
                const topMisses = Array.from(missTally.values())
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)

                return (
                  <>
                    <div className="stats-overview-grid">
                      <div className="stat-kpi-card">
                        <span className="stat-kpi-icon">📝</span>
                        <div>
                          <div className="stat-kpi-val">{rows.length}</div>
                          <div className="stat-kpi-label">Lượt học đã ghi</div>
                        </div>
                      </div>
                      <div className="stat-kpi-card">
                        <span className="stat-kpi-icon">📘</span>
                        <div>
                          <div className="stat-kpi-val">{distinctLessons}</div>
                          <div className="stat-kpi-label">Bài học khác nhau</div>
                        </div>
                      </div>
                      <div className="stat-kpi-card">
                        <span className="stat-kpi-icon">⏱️</span>
                        <div>
                          <div className="stat-kpi-val">{totalMinutes}</div>
                          <div className="stat-kpi-label">Tổng số phút học</div>
                        </div>
                      </div>
                      <div className="stat-kpi-card">
                        <span className="stat-kpi-icon">🤔</span>
                        <div>
                          <div className="stat-kpi-val">{totalWrong}</div>
                          <div className="stat-kpi-label">Lần trả lời sai</div>
                        </div>
                      </div>
                    </div>

                    {topMisses.length > 0 && (
                      <section className="dashboard-section card glass review-section">
                        <h4 className="review-title">🎯 Những câu bé hay sai — nên ôn lại cùng con</h4>
                        <ul className="review-list">
                          {topMisses.map((m, i) => (
                            <li key={i} className="review-item">
                              <span className="review-count">{m.count}×</span>
                              <div>
                                <p className="review-q">{m.q}</p>
                                <p className="review-a">Đáp án đúng: <strong>{m.correct}</strong></p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    <section className="dashboard-section card glass">
                      <h4 className="review-title">🕒 Dòng thời gian học tập</h4>
                      <div className="learning-log">
                        {rows.map(r => {
                          const meta = kindMeta[r.kind] || { icon: '📄', label: r.kind }
                          const mins = Math.round((r.duration_seconds || 0) / 60)
                          const hasDetail = (r.wrong_answers || []).length > 0
                          return (
                            <div key={r.id} className="learning-log-item">
                              <span className="learning-log-icon">{meta.icon}</span>
                              <div className="learning-log-body">
                                <div className="learning-log-head">
                                  <strong className="learning-log-title">{r.title}</strong>
                                  {r.attempt_no > 1 && (
                                    <span className="learning-badge badge-repeat">Lần {r.attempt_no}</span>
                                  )}
                                  {r.stars_earned > 0 && (
                                    <span className="learning-badge badge-star">+{r.stars_earned} ⭐</span>
                                  )}
                                </div>
                                <div className="learning-log-meta">
                                  {historyChildId === 'all' && <span>👦 {childName(r.child_id)}</span>}
                                  <span>{meta.label}{r.subject && r.subject !== meta.label ? ` · ${r.subject}` : ''}</span>
                                  {r.week ? <span>Tuần {r.week}</span> : null}
                                  <span>{formatTime(r.studied_at)}</span>
                                  {mins > 0 && <span>⏱️ {mins} phút</span>}
                                </div>
                                <div className="learning-log-result">
                                  {r.quiz_total > 0 ? (
                                    <>
                                      <span className="result-chip chip-good">
                                        Đúng ngay lần đầu: {r.quiz_first_try}/{r.quiz_total}
                                      </span>
                                      <span className={`result-chip ${r.wrong_attempts > 0 ? 'chip-warn' : 'chip-good'}`}>
                                        {r.wrong_attempts > 0 ? `${r.wrong_attempts} lần chọn sai` : 'Không sai câu nào 🎉'}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="result-chip chip-muted">
                                      Lượt học cũ — chưa có dữ liệu trắc nghiệm chi tiết
                                    </span>
                                  )}
                                </div>
                                {hasDetail && (
                                  <details className="learning-detail">
                                    <summary>Xem {r.wrong_answers.length} câu bé chọn sai</summary>
                                    <ul>
                                      {r.wrong_answers.map((w, wi) => (
                                        <li key={wi}>
                                          <p className="detail-q">{w.q}</p>
                                          <p className="detail-wrong">Bé chọn: {w.chose}</p>
                                          <p className="detail-right">Đáp án đúng: {w.correct}</p>
                                        </li>
                                      ))}
                                    </ul>
                                  </details>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  </>
                )
              })()}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="tab-pane">
              <h3 className="section-title">📊 Thống Kê Tiến Độ Rèn Luyện & Học Tập</h3>
              
              {/* Thẻ KPI tổng quan */}
              <div className="stats-overview-grid">
                <div className="stat-kpi-card">
                  <span className="stat-kpi-icon">👶</span>
                  <div>
                    <div className="stat-kpi-val">{children.length}</div>
                    <div className="stat-kpi-label">Hồ sơ trẻ em</div>
                  </div>
                </div>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-icon">⭐</span>
                  <div>
                    <div className="stat-kpi-val">{completions.filter(c => c.status === 'approved').reduce((s, c) => s + (c.stars || 0), 0)}</div>
                    <div className="stat-kpi-label">Tổng Sao Thưởng Đã Duyệt</div>
                  </div>
                </div>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-icon">🎯</span>
                  <div>
                    <div className="stat-kpi-val">{completions.filter(c => c.status === 'approved').length}</div>
                    <div className="stat-kpi-label">Lượt Hoàn Thành Bài / Nhiệm Vụ</div>
                  </div>
                </div>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-icon">🎁</span>
                  <div>
                    <div className="stat-kpi-val">{redemptions.filter(r => r.status === 'fulfilled').length}</div>
                    <div className="stat-kpi-label">Phần Thưởng Đã Trao</div>
                  </div>
                </div>
              </div>

              {/* Biểu đồ cột CSS 7 ngày gần nhất */}
              {(() => {
                const days7 = []
                const now = new Date()
                for (let i = 6; i >= 0; i--) {
                  const d = new Date(now)
                  d.setDate(now.getDate() - i)
                  const dStr = d.toISOString().split('T')[0]
                  const dayLabel = i === 0 ? 'Hôm nay' : `${d.getDate()}/${d.getMonth() + 1}`
                  const dayStars = completions
                    .filter(c => c.status === 'approved' && c.created_at?.startsWith(dStr))
                    .reduce((sum, c) => sum + (c.stars || 0), 0)
                  days7.push({ dateStr: dStr, label: dayLabel, stars: dayStars })
                }
                const maxStarsInWeek = Math.max(10, ...days7.map(d => d.stars))

                return (
                  <div className="chart-container-card">
                    <h4>📈 Sao Kiếm Được Trong 7 Ngày Gần Nhất</h4>
                    <p className="subtitle" style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
                      Biểu đồ phản ánh mức độ tích cực học tập & làm việc nhà của các con
                    </p>
                    <div className="css-bar-chart">
                      {days7.map((d, i) => {
                        const pct = Math.round((d.stars / maxStarsInWeek) * 100)
                        return (
                          <div key={i} className="chart-col">
                            {d.stars > 0 && <span className="chart-bar-val">+{d.stars}</span>}
                            <div className="chart-bar-fill" style={{ height: `${Math.max(4, pct)}%` }}></div>
                            <span className="chart-col-label">{d.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

        </main>
      </div>
    )
  }

  // Màn hình 4: Giao diện dành cho các con
  if (profile.type === 'child') {
    const levelInfo = getLevelInfo(childBalance)
    const streakInfo = calculateStreak(completions, childTransactions)
    const badgesList = calculateBadges(completions, childTransactions, streakInfo.currentStreak)

    return (
      <div className={`dashboard-container kid-theme ${tone.bodyClass}`}>
        {/* Header con */}
        <header className="dashboard-header glass kid-header">
          <div className="header-brand">
            <span className="child-avatar-display">{profile.child.avatar}</span>
            <div>
              <h2>{tone.headerPrefix}{profile.child.name} {loadingData && <span className="spinner-sm"></span>}{tone.headerSuffix}</h2>
              <p className="subtitle">
                {tone.isTeen
                  ? 'Tiến độ học tập và phần thưởng của con.'
                  : 'Bé đang làm rất tốt! Cố gắng tích lũy thêm sao nhé.'}
              </p>
            </div>
          </div>

          {/* Level Widget & Streak Widget */}
          <div className="kid-header-widgets">
            <div className="level-badge-widget">
              <span className="level-icon">{levelInfo.emoji}</span>
              <div className="level-details">
                <span className="level-title">Lv.{levelInfo.level} {levelInfo.name}</span>
                <div className="xp-progress-bar-track">
                  <div className="xp-progress-bar-fill" style={{ width: `${levelInfo.progressPct}%` }}></div>
                </div>
                <span className="xp-text">{levelInfo.starsToNext > 0 ? `Còn ${levelInfo.starsToNext} ⭐ lên ${levelInfo.nextLevelName}` : 'Cấp tối đa!'}</span>
              </div>
            </div>

            <div className="streak-widget">
              <span className="streak-fire-anim">🔥</span>
              <div>
                <span className="streak-count">{streakInfo.currentStreak}</span>
                <span className="streak-label"> Ngày Streak</span>
              </div>
            </div>
          </div>

          {/* Star Badge hiển thị nổi bật */}
          <div className="star-balance-widget">
            <span className="star-icon">⭐</span>
            <div className="count-info">
              <span className="count-number">{childBalance}</span>
              <span className="count-label">SAO ĐANG CÓ</span>
            </div>
          </div>

          <div className="header-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => selectProfile(null)}>
              🔁 Đổi hồ sơ
            </button>
          </div>
        </header>

        {/* Tabs dành cho con */}
        <nav className="dashboard-nav-tabs kid-tabs">
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('plan')}
          >
            {tone.tabs.plan}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            {tone.tabs.tasks}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('books')
              setReadingBook(null)
            }}
          >
            {tone.tabs.books}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'math' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('math')
              setSelectedMathTopic(null)
              setMathPageIndex(0)
              setMathQuizSelectedOption(null)
              setMathQuizAnsweredCorrectly(false)
              setMathQuizShowFeedback(false)
            }}
          >
            {tone.tabs.math}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'sgk' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('sgk')
              setSelectedTextbook(null)
              setSelectedLesson(null)
            }}
          >
            {tone.tabs.sgk}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            {tone.tabs.review}
            {dueReviews.length > 0 && <span className="nav-tab-dot">{dueReviews.length}</span>}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            {tone.tabs.badges}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'arcade' ? 'active' : ''}`}
            onClick={() => setActiveTab('arcade')}
          >
            {tone.tabs.arcade}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            {tone.tabs.shop}
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            {tone.tabs.history}
          </button>
        </nav>

        {/* Nội dung chính của con */}
        <main className="dashboard-main-content">
          
          {/* Tab con 0: Hôm nay học gì? */}
          {activeTab === 'plan' && (
            <div className="tab-pane">
              {(() => {
                const today = new Date()
                const todayKey = WEEKDAY_KEYS[today.getDay()]
                const isWeekend = todayKey === 'sat' || todayKey === 'sun'
                const planDayKey = isWeekend ? 'mon' : todayKey
                let todayWeek = currentSchoolWeek(today)
                if (isWeekend) todayWeek = Math.min(35, todayWeek + 1)
                const plan = weeklyPlans.find(p => p.child_id === profile.child.id && p.week === todayWeek)
                const dayPlan = plan?.days?.[planDayKey] || null
                const todayTasks = tasks.filter(t => t.child_id === profile.child.id && (t.recurrence === 'daily' || t.recurrence === 'weekly'))
                const foundLesson = dayPlan?.lessonId ? findLessonAcrossData(dayPlan.lessonId) : null

                return (
                  <>
                    <h3 className="section-title text-center">
                      📅 Hôm nay: {WEEKDAY_LABELS[planDayKey]}, Tuần {todayWeek}
                      {isWeekend && <span className="plan-weekend-note"> (hôm nay cuối tuần — xem trước kế hoạch thứ 2)</span>}
                    </h3>

                    {!plan ? (
                      <p className="empty-message">Bố mẹ chưa tạo kế hoạch cho tuần {todayWeek} này. Hãy nhờ bố mẹ tạo kế hoạch nhé! 🙏</p>
                    ) : (
                      <div className="plan-today-card card glass">
                        {/* Bài SGK hôm nay */}
                        <div className="plan-today-lesson">
                          <span className="plan-field-label">📗 Bài học hôm nay</span>
                          {dayPlan?.lessonId && foundLesson ? (
                            <>
                              <div className="plan-today-lesson-info">
                                <span className="sgk-subject-emoji">{foundLesson.book.emoji}</span>
                                <div>
                                  <h4>{foundLesson.lesson.title}</h4>
                                  <p>{foundLesson.book.subject} {foundLesson.book.volume} • Tuần {foundLesson.lesson.week}</p>
                                </div>
                                {isSgkLessonDone(foundLesson.lesson) && <span className="sgk-done-stamp">🏆 Hoàn thành!</span>}
                              </div>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => handleOpenLessonFromPlan(foundLesson.lesson.id)}
                              >
                                📖 Học bài ngay!
                              </button>
                            </>
                          ) : (
                            <p className="plan-today-empty">Hôm nay không có bài học mới — dành thời gian ôn bài đã học nhé! 😊</p>
                          )}
                        </div>

                        {/* Ghi chú của bố mẹ */}
                        {dayPlan?.note && (
                          <div className="plan-today-note">
                            💌 Bố mẹ nhắn: <em>"{dayPlan.note}"</em>
                          </div>
                        )}

                        {/* Nhiệm vụ hôm nay */}
                        <div className="plan-today-tasks">
                          <span className="plan-field-label">💪 Nhiệm vụ hôm nay</span>
                          {todayTasks.length === 0 ? (
                            <p className="plan-today-empty">Hôm nay không có nhiệm vụ nào được giao.</p>
                          ) : (
                            todayTasks.map(task => {
                              const isPending = completions.some(c => c.task_id === task.id && c.status === 'pending')
                              return (
                                <div key={task.id} className="plan-today-task">
                                  <div>
                                    <strong>{task.title}</strong>
                                    <span className="task-star-tag">⭐ {task.stars}</span>
                                    {isPending && <span className="recurrence-badge">⌛ Chờ duyệt</span>}
                                  </div>
                                  {!isPending && (
                                    <button
                                      type="button"
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleChildSubmitCompletion(task)}
                                    >
                                      Đã làm xong! ✔
                                    </button>
                                  )}
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          )}

          {/* Tab con 1: Làm Nhiệm vụ */}
          {activeTab === 'tasks' && (
            <div className="tab-pane">
              <h3 className="section-title text-center">💪 Hãy chọn nhiệm vụ và thực hiện nào!</h3>
              {tasks.filter(t => t.child_id === profile.child.id).length === 0 ? (
                <p className="empty-message">Hiện con không có việc nào được giao. Hãy bảo bố mẹ thêm việc nhé!</p>
              ) : (
                <div className="tasks-grid">
                  {tasks.filter(t => t.child_id === profile.child.id).map((task) => {
                    // Kiểm tra xem đã hoàn thành chờ duyệt chưa
                    const isPending = completions.some(c => c.task_id === task.id && c.status === 'pending')
                    const recurrenceText = {
                      once: 'Làm 1 lần',
                      daily: 'Mỗi ngày',
                      weekly: 'Mỗi tuần'
                    }[task.recurrence]

                    return (
                      <div key={task.id} className={`task-kid-card glass ${isPending ? 'card-pending' : ''}`}>
                        <div className="task-star-tag">⭐ {task.stars}</div>
                        <h4>{task.title}</h4>
                        {task.description && <p className="desc">{task.description}</p>}
                        <div className="recurrence-badge">{recurrenceText}</div>
                        
                        {isPending ? (
                          <div className="pending-status-banner">
                            ⌛ Chờ bố mẹ duyệt cộng sao
                          </div>
                        ) : (
                          <button 
                            type="button"
                            className="btn btn-success btn-block"
                            onClick={() => handleChildSubmitCompletion(task)}
                          >
                            Đã làm xong! ✔
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab con: Ôn tập lặp lại — bài nào chưa vững sẽ quay lại đúng lúc sắp quên */}
          {activeTab === 'review' && (
            <div className="tab-pane max-width-md">
              <h3 className="section-title text-center">{tone.reviewTitle}</h3>
              <p className="review-intro">{tone.reviewIntro}</p>

              {myReviewQueue.length === 0 ? (
                <div className="review-empty glass">
                  <span className="review-empty-emoji">{tone.isTeen ? '✓' : '🎊'}</span>
                  <p>
                    {tone.isTeen
                      ? 'Chưa có nội dung nào cần ôn lại. Làm thêm bài mới để hệ thống theo dõi tiếp.'
                      : 'Chưa có bài nào cần ôn lại. Bé học thêm bài mới nhé!'}
                  </p>
                </div>
              ) : (
                <>
                  {dueReviews.length > 0 && (
                    <div className="review-group">
                      <h4 className="review-group-title due">
                        🔔 Nên ôn hôm nay ({dueReviews.length})
                      </h4>
                      <div className="review-cards">
                        {dueReviews.map(item => (
                          <ReviewCard
                            key={`${item.kind}-${item.refId}`}
                            item={item}
                            tone={tone}
                            onOpen={() => openReviewItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {upcomingReviews.length > 0 && (
                    <div className="review-group">
                      <h4 className="review-group-title upcoming">
                        📅 Sắp tới ({upcomingReviews.length})
                      </h4>
                      <div className="review-cards">
                        {upcomingReviews.map(item => (
                          <ReviewCard
                            key={`${item.kind}-${item.refId}`}
                            item={item}
                            tone={tone}
                            onOpen={() => openReviewItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Tab con 2: Cửa hàng Quà */}
          {activeTab === 'shop' && (
            <div className="tab-pane">
              <h3 className="section-title text-center">{tone.shopTitle}</h3>
              {rewards.length === 0 ? (
                <p className="empty-message">Hiện shop quà tặng đang trống, bé hãy nhắc bố mẹ thêm nhé!</p>
              ) : (
                <div className="rewards-grid">
                  {rewards.map((reward) => {
                    const canAfford = childBalance >= reward.cost
                    const pointsNeeded = reward.cost - childBalance
                    return (
                      <div key={reward.id} className={`reward-kid-card glass ${!canAfford ? 'locked' : ''}`}>
                        <span className="reward-emoji">{reward.emoji}</span>
                        <h4>{reward.title}</h4>
                        <div className="reward-price">✨ {reward.cost} Sao</div>
                        
                        {canAfford ? (
                          <button 
                            type="button"
                            className="btn btn-primary btn-block animate-pulse"
                            onClick={() => handleChildRedeem(reward)}
                          >
                            Đổi Quà 🎁
                          </button>
                        ) : (
                          <button type="button" className="btn btn-block btn-locked" disabled>
                            🔒 Thiếu {pointsNeeded} ⭐
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab con 3: Nhật ký Sao */}
          {activeTab === 'history' && (
            <div className="tab-pane max-width-md">
              {learningSessions.length > 0 && (
                <>
                  <h3 className="section-title text-center">📚 Những bài con đã học</h3>
                  <div className="child-learning-list card glass">
                    {learningSessions.slice(0, 10).map(s => {
                      const icon = { sgk: '📗', book: '📚', math: '🧮' }[s.kind] || '📄'
                      return (
                        <div key={s.id} className="child-learning-item">
                          <span className="child-learning-icon">{icon}</span>
                          <div className="child-learning-body">
                            <strong>{s.title}</strong>
                            <span className="child-learning-meta">
                              {formatTime(s.studied_at)}
                              {s.attempt_no > 1 && ` · ôn lại lần ${s.attempt_no}`}
                              {s.quiz_total > 0 && s.wrong_attempts === 0 && ' · không sai câu nào 🎉'}
                            </span>
                          </div>
                          {s.stars_earned > 0 && (
                            <span className="child-learning-stars">+{s.stars_earned} ⭐</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              <h3 className="section-title text-center">📖 Nhật ký tích lũy sao của bé</h3>
              {childTransactions.length === 0 ? (
                <p className="empty-message">Con chưa có giao dịch sao nào. Hãy bắt đầu làm nhiệm vụ để có sao nhé!</p>
              ) : (
                <div className="timeline-container card glass">
                  {childTransactions.map((tx) => {
                    const isPositive = tx.amount > 0
                    
                    // Tìm lời phê tương ứng từ bố mẹ
                    const getParentFeedbackForTx = () => {
                      if (!tx.reason.startsWith('Hoàn thành:')) return null
                      const taskTitle = tx.reason.replace('Hoàn thành: ', '').trim()
                      const comp = completions.find(c => {
                        if (c.child_id !== profile.child.id || c.status !== 'approved' || !c.parent_feedback) return false
                        const compTitle = tasks.find(t => t.id === c.task_id)?.title
                        return compTitle && (compTitle === taskTitle || taskTitle.includes(compTitle))
                      })
                      return comp ? comp.parent_feedback : null
                    }
                    
                    const parentMsg = getParentFeedbackForTx()

                    return (
                      <div key={tx.id} className="timeline-item">
                        <div className={`timeline-indicator ${isPositive ? 'positive' : 'negative'}`}>
                          {isPositive ? '⭐' : '🎁'}
                        </div>
                        <div className="timeline-content">
                          <span className="timestamp">{formatTime(tx.created_at)}</span>
                          <h4>{tx.reason}</h4>
                          <span className={`transaction-amount ${isPositive ? 'text-positive' : 'text-negative'}`}>
                            {isPositive ? `+${tx.amount}` : tx.amount} Sao
                          </span>
                          
                          {parentMsg && (
                            <div className="parent-feedback-bubble">
                              💬 <strong>Lời khen của Bố Mẹ:</strong> "{parentMsg}"
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab con 4: Góc Đọc Sách */}
          {activeTab === 'books' && (
            <div className="tab-pane">
              {!readingBook ? (
                <>
                  <h3 className="section-title text-center">📚 Góc Đọc Sách Tích Lũy Sao</h3>
                  <div className="age-group-toggle">
                    <button
                      type="button"
                      className={`toggle-age-btn ${kidAgeGroup === 'kids' ? 'active' : ''}`}
                      onClick={() => setKidAgeGroup('kids')}
                    >
                      🧸 Nhà Sách Tí Hon (Dưới 10 tuổi)
                    </button>
                    <button
                      type="button"
                      className={`toggle-age-btn ${kidAgeGroup === 'teens' ? 'active' : ''}`}
                      onClick={() => setKidAgeGroup('teens')}
                    >
                      🧭 Trạm Kỹ Năng Tuổi Teen (Trên 13 tuổi)
                    </button>
                  </div>

                  <div className="books-grid">
                    {booksData[kidAgeGroup].map((book, idx) => {
                      const isDone = completions.some(c => c.child_id === profile.child.id && c.task_id === 'book-' + book.id)
                      const isAssigned = tasks.some(t => t.child_id === profile.child.id && (t.title.toLowerCase().includes(book.title.toLowerCase()) || t.task_type === 'book')) || idx === 0 || isDone
                      const prevBook = idx > 0 ? booksData[kidAgeGroup][idx - 1] : null
                      const isUnlocked = isAssigned && (idx === 0 || completions.some(
                        c => c.child_id === profile.child.id && c.task_id === 'book-' + prevBook.id
                      ))

                      return (
                        <div key={book.id} className={`book-card glass ${!isUnlocked ? 'locked' : ''}`}>
                          <div className="book-lock-overlay">
                            {!isUnlocked && <span className="lock-icon">🔒</span>}
                            <span className="book-emoji">{book.emoji}</span>
                          </div>
                          <h4>{book.title}</h4>
                          <p className="subtitle">{book.subtitle}</p>
                          <span className="stars-badge">⭐️ {book.stars} Sao</span>
                          
                          {isUnlocked ? (
                            <button
                              type="button"
                              className="btn btn-primary btn-block"
                              onClick={() => {
                                setReadingBook(book)
                                setReadingPageIndex(0)
                                setQuizSelectedOption(null)
                                setQuizAnsweredCorrectly(false)
                                setQuizShowFeedback(false)
                                setBookWrongAttempts(0)
                                setBookWrongAnswers([])
                                setBookStartedAt(Date.now())
                              }}
                            >
                              Đọc sách ➜
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              className="btn btn-block btn-locked"
                              onClick={() => showToast('🔒 Truyện này chưa được Bố Mẹ giao! Bé nhờ Bố Mẹ thêm vào Kế Hoạch / Nhiệm Vụ nhé! 😊')}
                            >
                              🔒 Chờ Bố Mẹ giao bài này
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                /* Giao diện đọc sách */
                <div className="book-reader-container card glass">
                  <div className="reader-header">
                    <span className="book-title-header">{readingBook.emoji} {readingBook.title}</span>
                    <button
                      type="button"
                      className="btn-close-reader"
                      onClick={() => setReadingBook(null)}
                    >
                      ✕ Đóng sách
                    </button>
                  </div>

                  <div className="reader-content-body">
                    {readingPageIndex < readingBook.pages.length ? (
                      /* Đang đọc các trang truyện */
                      <div className="reader-page-view">
                        <div className="page-image-box">
                          <img
                            src={readingBook.pages[readingPageIndex].image}
                            alt={`Minh họa trang ${readingPageIndex + 1}`}
                            className="book-illustration"
                            onError={(e) => {
                              // Fallback khi chưa có ảnh vật lý
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <div className="book-illustration-fallback" style={{ display: 'none' }}>
                            <span style={{ fontSize: '48px' }}>📖</span>
                            <span style={{ fontSize: '12px', marginTop: '8px', color: '#999' }}>Hình ảnh minh họa...</span>
                          </div>
                        </div>
                        <div className="page-text-content">
                          <p className="story-paragraph">{readingBook.pages[readingPageIndex].text}</p>
                        </div>
                      </div>
                    ) : (
                      /* Trang trắc nghiệm cuối sách */
                      <div className="reader-quiz-view">
                        <span className="quiz-tag">🧠 THỬ THÁCH TRÍ TUỆ</span>
                        <h4 className="quiz-question">{readingBook.quiz.question}</h4>
                        
                        <div className="quiz-options-list">
                          {readingBook.quiz.options.map((option, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className={`quiz-option-btn ${quizSelectedOption === idx ? 'selected' : ''}`}
                              disabled={quizAnsweredCorrectly}
                              onClick={() => {
                                setQuizSelectedOption(idx)
                                setQuizShowFeedback(false)
                              }}
                            >
                              <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                              <span className="option-text">{option}</span>
                            </button>
                          ))}
                        </div>

                        {quizShowFeedback && !quizAnsweredCorrectly && (
                          <div className="error-banner">
                            ❌ Câu trả lời chưa chính xác, hãy đọc kỹ câu chuyện và chọn lại nhé con!
                          </div>
                        )}

                        {quizAnsweredCorrectly && (
                          <div className="success-banner moral-box">
                            <span className="moral-title">🎉 ĐÚNG RỒI! BÀI HỌC RÚT RA:</span>
                            <p className="moral-text">{readingBook.quiz.moral}</p>
                          </div>
                        )}

                        <div className="quiz-actions">
                          {!quizAnsweredCorrectly ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              disabled={quizSelectedOption === null}
                              onClick={() => {
                                if (quizSelectedOption === readingBook.quiz.correctAnswer) {
                                  setQuizAnsweredCorrectly(true)
                                } else {
                                  setQuizShowFeedback(true)
                                  setBookWrongAttempts(prev => prev + 1)
                                  setBookWrongAnswers(prev => [...prev, {
                                    q: readingBook.quiz.question,
                                    chose: readingBook.quiz.options[quizSelectedOption],
                                    correct: readingBook.quiz.options[readingBook.quiz.correctAnswer],
                                  }])
                                }
                              }}
                            >
                              💡 Kiểm tra câu trả lời
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-success animate-pulse"
                              onClick={() => handleBookFinished(readingBook)}
                            >
                              Hoàn thành & Nhận {readingBook.stars} Sao! ⭐️
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="reader-footer">
                    <span className="page-indicator">
                      {readingPageIndex < readingBook.pages.length
                        ? `Trang ${readingPageIndex + 1} / ${readingBook.pages.length}`
                        : 'Câu hỏi trắc nghiệm'}
                    </span>
                    {readingPageIndex < readingBook.pages.length && (
                      <div className="navigation-buttons">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled={readingPageIndex === 0}
                          onClick={() => setReadingPageIndex(prev => prev - 1)}
                        >
                          ⇦ Quay lại
                        </button>
                        {readingPageIndex === readingBook.pages.length - 1 ? (
                          /* Cổng chống đọc lướt: giữ bé ở trang cuối đủ lâu để thực sự đọc */
                          <ReadingGateButton
                            className="btn btn-primary btn-sm"
                            text={readingBook.pages[readingPageIndex]?.text}
                            tone={tone}
                            onReady={() => setReadingPageIndex(prev => prev + 1)}
                          >
                            Trả lời câu hỏi ➜
                          </ReadingGateButton>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setReadingPageIndex(prev => prev + 1)}
                          >
                            Lướt tiếp ➜
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab con 5: Sân Chơi Toán Tư Duy Lớp 2 */}
          {activeTab === 'math' && (
            <div className="tab-pane">
              {!selectedMathTopic ? (
                <>
                  <h3 className="section-title text-center">🧮 Sân Chơi Toán Tư Duy Lớp 2</h3>
                  <p className="subtitle text-center">Bé hãy chọn một chủ đề toán học để rèn luyện tư duy logic và nhận thêm Sao nhé!</p>

                  <div className="books-grid">
                    {mathData.map((topic, idx) => {
                      const isDone = completions.some(c => c.child_id === profile.child.id && c.task_id === 'math-' + topic.id)
                      const isAssigned = tasks.some(t => t.child_id === profile.child.id && (t.title.toLowerCase().includes(topic.title.toLowerCase()) || t.task_type === 'math')) || idx === 0 || isDone
                      const prevTopic = idx > 0 ? mathData[idx - 1] : null
                      const isUnlocked = isAssigned && (idx === 0 || completions.some(
                        c => c.child_id === profile.child.id && c.task_id === 'math-' + prevTopic.id
                      ))

                      return (
                        <div key={topic.id} className={`book-card glass ${!isUnlocked ? 'locked' : ''}`}>
                          <div className="book-lock-overlay">
                            {!isUnlocked && <span className="lock-icon">🔒</span>}
                            <span className="book-emoji">{topic.emoji}</span>
                          </div>
                          <h4>{topic.title}</h4>
                          <p className="subtitle">5 thử thách câu hỏi trắc nghiệm tư duy</p>
                          <span className="stars-badge">⭐️ {topic.stars} Sao</span>
                          
                          {isUnlocked ? (
                            <button
                              type="button"
                              className="btn btn-primary btn-block"
                              onClick={() => {
                                setSelectedMathTopic(topic)
                                setMathPageIndex(0)
                                setMathQuizSelectedOption(null)
                                setMathQuizAnsweredCorrectly(false)
                                setMathQuizShowFeedback(false)
                                setMathWrongAttempts(0)
                                setMathWrongAnswers([])
                                setMathFirstTryCount(0)
                                setMathQuestionMissed(false)
                                setMathStartedAt(Date.now())
                              }}
                            >
                              Vào học ngay ➜
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              className="btn btn-block btn-locked"
                              onClick={() => showToast('🔒 Chủ đề Toán này chưa được Bố Mẹ giao! Bé nhờ Bố Mẹ thêm vào Kế Hoạch / Nhiệm Vụ nhé! 😊')}
                            >
                              🔒 Chờ Bố Mẹ giao bài này
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                /* Giao diện Học & Làm bài trắc nghiệm Toán */
                <div className="book-reader-container card glass">
                  <div className="reader-header">
                    <span className="book-title-header">{selectedMathTopic.emoji} {selectedMathTopic.title}</span>
                    <button
                      type="button"
                      className="btn-close-reader"
                      onClick={() => setSelectedMathTopic(null)}
                    >
                      ✕ Đóng lại
                    </button>
                  </div>

                  <div className="reader-content-body">
                    {mathPageIndex < selectedMathTopic.lesson.steps.length ? (
                      /* Đang xem phần Lý thuyết & Kiến thức trọng tâm dạng thẻ toán học visual */
                      <div className="math-step-view">
                        <div className="math-step-header">
                          <span className="quiz-tag glow">{selectedMathTopic.lesson.badge}</span>
                          <span className="math-step-badge">Bài {mathPageIndex + 1} / {selectedMathTopic.lesson.steps.length}</span>
                        </div>

                        <div className="math-lesson-card glass">
                          <h3 className="math-step-title">{selectedMathTopic.lesson.steps[mathPageIndex].title}</h3>
                          <p className="math-step-desc">{selectedMathTopic.lesson.steps[mathPageIndex].desc}</p>
                          
                          {/* Khối công thức toán nổi bật dạng bảng tính */}
                          <div className="math-formula-box">
                            <span className="formula-icon">⚡</span>
                            <div className="formula-text">{selectedMathTopic.lesson.steps[mathPageIndex].formula}</div>
                          </div>

                          {/* Mẹo tính nhẩm hay */}
                          <div className="math-tip-box">
                            <span className="tip-text">{selectedMathTopic.lesson.steps[mathPageIndex].tip}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Đang làm các câu hỏi trắc nghiệm */
                      (() => {
                        const currentQuizIndex = mathPageIndex - selectedMathTopic.lesson.steps.length
                        const currentQuiz = selectedMathTopic.quizzes[currentQuizIndex]
                        return (
                          <div className="reader-quiz-view math-quiz-theme">
                            <div className="math-quiz-header">
                              <span className="quiz-tag math-quiz-tag">🧠 THỬ THÁCH CÂU {currentQuizIndex + 1} / {selectedMathTopic.quizzes.length}</span>
                              <span className="math-star-reward">⭐️ Thưởng 5 Sao</span>
                            </div>

                            <h4 className="quiz-question math-question-title">{currentQuiz.question}</h4>
                            
                            {/* Phép tính / Biểu thức minh họa sinh động */}
                            {currentQuiz.equation && (
                              <div className="math-equation-banner">
                                <span className="equation-math-text">{currentQuiz.equation}</span>
                              </div>
                            )}

                            <div className="quiz-options-list math-options-grid">
                              {currentQuiz.options.map((option, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className={`quiz-option-btn math-option-card ${mathQuizSelectedOption === idx ? 'selected' : ''}`}
                                  disabled={mathQuizAnsweredCorrectly}
                                  onClick={() => {
                                    setMathQuizSelectedOption(idx)
                                    setMathQuizShowFeedback(false)
                                  }}
                                >
                                  <span className="option-letter-badge">{String.fromCharCode(65 + idx)}</span>
                                  <span className="option-text-val">{option}</span>
                                </button>
                              ))}
                            </div>

                            {mathQuizShowFeedback && !mathQuizAnsweredCorrectly && (
                              <div className="error-banner animate-bounce">
                                ❌ Chưa đúng rồi! Bé hãy suy nghĩ kỹ và chọn lại đáp án nhé 💪
                              </div>
                            )}

                            {mathQuizAnsweredCorrectly && (
                              <div className="success-banner moral-box math-success-box">
                                <span className="moral-title">🎉 XUẤT SẮC! LỜI GIẢI CHI TIẾT:</span>
                                <p className="moral-text">{currentQuiz.explanation}</p>
                              </div>
                            )}

                            <div className="quiz-actions">
                              {!mathQuizAnsweredCorrectly ? (
                                <button
                                  type="button"
                                  className="btn btn-primary math-action-btn"
                                  disabled={mathQuizSelectedOption === null}
                                  onClick={() => {
                                    if (mathQuizSelectedOption === currentQuiz.correctAnswer) {
                                      setMathQuizAnsweredCorrectly(true)
                                      if (!mathQuestionMissed) setMathFirstTryCount(prev => prev + 1)
                                    } else {
                                      setMathQuizShowFeedback(true)
                                      setMathQuestionMissed(true)
                                      setMathWrongAttempts(prev => prev + 1)
                                      setMathWrongAnswers(prev => [...prev, {
                                        q: currentQuiz.question,
                                        chose: currentQuiz.options[mathQuizSelectedOption],
                                        correct: currentQuiz.options[currentQuiz.correctAnswer],
                                      }])
                                    }
                                  }}
                                >
                                  💡 Kiểm tra kết quả
                                </button>
                              ) : (
                                currentQuizIndex < selectedMathTopic.quizzes.length - 1 ? (
                                  <button
                                    type="button"
                                    className="btn btn-primary math-action-btn"
                                    onClick={() => {
                                      setMathPageIndex(prev => prev + 1)
                                      setMathQuizSelectedOption(null)
                                      setMathQuizAnsweredCorrectly(false)
                                      setMathQuizShowFeedback(false)
                                      setMathQuestionMissed(false)
                                    }}
                                  >
                                    Câu hỏi tiếp theo ➜
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-success animate-pulse math-action-btn"
                                    onClick={() => handleMathTopicFinished(selectedMathTopic)}
                                  >
                                    Hoàn thành & Nhận {selectedMathTopic.stars} Sao! ⭐️
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )
                      })()
                    )}
                  </div>

                  <div className="reader-footer">
                    <span className="page-indicator">
                      {mathPageIndex < selectedMathTopic.lesson.steps.length
                        ? `Lý thuyết: Trang ${mathPageIndex + 1} / ${selectedMathTopic.lesson.steps.length}`
                        : `Thử thách: Câu ${mathPageIndex - selectedMathTopic.lesson.steps.length + 1} / ${selectedMathTopic.quizzes.length}`}
                    </span>
                    {mathPageIndex < selectedMathTopic.lesson.steps.length && (
                      <div className="navigation-buttons">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          disabled={mathPageIndex === 0}
                          onClick={() => setMathPageIndex(prev => prev - 1)}
                        >
                          ⇦ Quay lại
                        </button>
                        {mathPageIndex === selectedMathTopic.lesson.steps.length - 1 ? (
                          <ReadingGateButton
                            className="btn btn-primary btn-sm"
                            text={[
                              selectedMathTopic.lesson.steps[mathPageIndex]?.desc,
                              selectedMathTopic.lesson.steps[mathPageIndex]?.tip,
                            ].filter(Boolean).join(' ')}
                            tone={tone}
                            onReady={() => setMathPageIndex(prev => prev + 1)}
                          >
                            Vào làm bài trắc nghiệm ➜
                          </ReadingGateButton>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setMathPageIndex(prev => prev + 1)}
                          >
                            Xem tiếp ➜
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab SGK: Sách Giáo Khoa Lớp 2 - Giao diện mới sinh động */}
          {activeTab === 'sgk' && (
            <div className="tab-pane sgk-wrapper">

              {/* ===== MÀN HÌNH 1: CHỌN SÁCH ===== */}
              {!selectedTextbook && !selectedLesson && (
                <>
                  {/* Tiêu đề chào mừng */}
                  <div className="sgk-hero-banner">
                    <div className="sgk-hero-stars">⭐ ⭐ ⭐</div>
                    <h2 className="sgk-hero-title">📗 Sách Giáo Khoa Lớp {sgkGrade}</h2>
                    <p className="sgk-hero-subtitle">Bé chọn môn học yêu thích, đọc bài và làm trắc nghiệm để nhận Sao thưởng nhé! 🎉</p>
                    <div className="sgk-grade-switch">
                      <button
                        type="button"
                        className={`sgk-grade-btn ${sgkGrade === 2 ? 'active' : ''}`}
                        onClick={() => {
                          setSgkGrade(2)
                          setSelectedTextbook(null)
                          setSelectedLesson(null)
                        }}
                      >
                        Lớp 2 🎒
                      </button>
                      <button
                        type="button"
                        className={`sgk-grade-btn ${sgkGrade === 8 ? 'active' : ''}`}
                        onClick={() => {
                          setSgkGrade(8)
                          setSelectedTextbook(null)
                          setSelectedLesson(null)
                        }}
                      >
                        Lớp 8 📚
                      </button>
                    </div>
                  </div>

                  <div className="sgk-subject-grid">
                    {sgkBooks.map((book) => (
                      <div
                        key={book.id}
                        role="button"
                        tabIndex={0}
                        className="sgk-subject-card"
                        style={{ '--subject-color': book.color }}
                        onClick={() => setSelectedTextbook(book)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') setSelectedTextbook(book)
                        }}
                      >
                        <SgkPdfButton book={book} onOpen={setSgkPdfOpen} />
                          <div className="sgk-subject-top">
                            <span className="sgk-subject-emoji">{book.emoji}</span>
                            <div className="sgk-subject-sparkles">✨</div>
                          </div>
                          <div className="sgk-subject-name">{book.subject}</div>
                          <div className="sgk-subject-vol">{book.volume}</div>
                          <div className="sgk-subject-pills">
                            <span className="sgk-pill-lesson">📖 {book.lessons.length} bài</span>
                            <span className="sgk-pill-star">⭐ {book.stars} sao/bài</span>
                          </div>
                          {(() => {
                            const prog = sgkBookProgress(book)
                            return (
                              <div className="sgk-book-progress">
                                <div className="sgk-book-progress-track">
                                  <div
                                    className="sgk-book-progress-fill"
                                    style={{ width: `${prog.pct}%` }}
                                  />
                                </div>
                                <span className="sgk-book-progress-label">
                                  {prog.pct === 100 ? '🏆 Đã hoàn thành cả quyển!' : `⚡ ${prog.done}/${prog.total} bài đã học`}
                                </span>
                              </div>
                            )
                          })()}
                          <div className="sgk-subject-cta">Học ngay →</div>
                        </div>
                    ))}
                  </div>
                </>
              )}

              {/* ===== MÀN HÌNH 2: DANH SÁCH BÀI HỌC ===== */}
              {selectedTextbook && !selectedLesson && (
                <>
                  {/* Header môn học */}
                  <div className="sgk-subject-header" style={{ '--subject-color': selectedTextbook.color }}>
                    <button
                      type="button"
                      className="sgk-back-btn"
                      onClick={() => setSelectedTextbook(null)}
                    >
                      ← Về trang chủ
                    </button>
                    <div className="sgk-subject-header-content">
                      <span className="sgk-subject-header-emoji">{selectedTextbook.emoji}</span>
                      <div>
                        <div className="sgk-subject-header-name">{selectedTextbook.subject}</div>
                        <div className="sgk-subject-header-vol">{selectedTextbook.volume}</div>
                      </div>
                    </div>
                    <div className="sgk-progress-info">
                      {Object.keys(sgkCompletedLessons).filter(k => selectedTextbook.lessons.some(l => l.id === k)).length}
                      /{selectedTextbook.lessons.length} bài hoàn thành
                    </div>
                    <div className="sgk-progress-track">
                      <div
                        className="sgk-progress-fill"
                        style={{ width: `${sgkBookProgress(selectedTextbook).pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Lưới bài học dạng card đẹp */}
                  <div className="sgk-lessons-grid">
                    {selectedTextbook.lessons.map((lesson, idx) => {
                      const prevLesson = idx > 0 ? selectedTextbook.lessons[idx - 1] : null
                      const isDone = isSgkLessonDone(lesson)
                      const isUnlocked = idx === 0 || isSgkLessonDone(prevLesson)

                      const lessonColors = [
                        { bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)', accent: '#e8613a', icon: '📖' },
                        { bg: 'linear-gradient(135deg, #d4fc79, #96e6a1)', accent: '#2d8e4e', icon: '🌱' },
                        { bg: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)', accent: '#2563eb', icon: '🌊' },
                        { bg: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', accent: '#6d28d9', icon: '🦋' },
                        { bg: 'linear-gradient(135deg, #fddb92, #d1fdff)', accent: '#b45309', icon: '🌻' },
                        { bg: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)', accent: '#7c3aed', icon: '🌙' },
                      ]
                      const color = lessonColors[idx % lessonColors.length]
                      return (
                        <div
                          key={lesson.id}
                          className={`sgk-lesson-card ${isDone ? 'lesson-card-done' : ''} ${!isUnlocked ? 'locked' : ''}`}
                          style={{ background: isDone ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : !isUnlocked ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' : color.bg }}
                        >
                          {/* Số bài */}
                          <div className="sgk-lesson-num" style={{ color: isDone ? '#059669' : !isUnlocked ? '#64748b' : color.accent }}>
                            {isDone ? '✅' : !isUnlocked ? '🔒' : color.icon}
                          </div>
                          <div className="sgk-lesson-week-tag">Tuần {lesson.week}</div>
                          <h4 className="sgk-lesson-card-title" style={{ color: isDone ? '#065f46' : !isUnlocked ? '#475569' : color.accent }}>
                            {lesson.title.replace(/^Bài \d+:\s*/, '')}
                          </h4>
                          <div className="sgk-lesson-bai-num">Bài {idx + 1}</div>
                          <div className="sgk-lesson-card-meta">
                            <span>🧩 {lesson.quizzes.length} câu hỏi</span>
                            <span>⭐ {selectedTextbook.stars} sao</span>
                          </div>
                          {isDone ? (
                            <div className="sgk-done-stamp">🏆 Hoàn thành!</div>
                          ) : isUnlocked ? (
                            <button
                              type="button"
                              className="sgk-lesson-start-btn"
                              style={{ background: color.accent }}
                              onClick={() => {
                                setSelectedLesson(lesson)
                                setSgkLessonView('content')
                                resetSgkQuiz()
                              }}
                            >
                              Học bài này 📚
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="sgk-lesson-start-btn locked"
                              disabled
                            >
                              🔒 Hoàn thành bài trước để mở
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {/* ===== MÀN HÌNH 3: ĐỌC BÀI + TRẮC NGHIỆM ===== */}
              {selectedLesson && (
                <div className="sgk-reader-wrapper">
                  {/* Header bài đọc */}
                  <div className="sgk-reader-header" style={{ '--subject-color': selectedTextbook?.color || '#8b5cf6' }}>
                    <button
                      type="button"
                      className="sgk-back-btn"
                      onClick={() => {
                        setSelectedLesson(null)
                        setSgkLessonView('content')
                        resetSgkQuiz()
                      }}
                    >
                      ← Về danh sách bài
                    </button>
                    <div className="sgk-reader-title-row">
                      <span className="sgk-reader-emoji">{selectedTextbook?.emoji}</span>
                      <div>
                        <div className="sgk-reader-lesson-name">{selectedLesson.title}</div>
                        <div className="sgk-reader-mode-indicator">
                          {sgkLessonView === 'content' ? '📖 Đọc bài' : '🧩 Trắc nghiệm'}
                        </div>
                      </div>
                    </div>
                    {/* Progress dots */}
                    <div className="sgk-reader-progress">
                      <div className={`sgk-step-dot ${sgkLessonView === 'content' ? 'active' : 'done'}`}>1<span>Đọc bài</span></div>
                      <div className="sgk-step-line"></div>
                      <div className={`sgk-step-dot ${sgkLessonView === 'quiz' ? 'active' : ''}`}>2<span>Trắc nghiệm</span></div>
                    </div>
                  </div>

                  {sgkLessonView === 'content' ? (
                    /* ===== PHẦN ĐỌC BÀI - nền giấy kẻ ô, lật từng trang như sách thật ===== */
                    (() => {
                      const pages = splitSgkPages(selectedLesson.content)
                      const isLastPage = sgkPageIndex >= pages.length - 1
                      // Lật trang: chuyển trang và kéo lên đầu trang đọc
                      const goPage = (dir) => {
                        setSgkPageIndex(prev => Math.max(0, Math.min(pages.length - 1, prev + dir)))
                        document.querySelector('.sgk-book-page')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                      return (
                        <div className="sgk-book-page">
                          <div className="sgk-float-emoji" style={{ top: '8%', left: '4%', animationDelay: '0s' }}>{selectedTextbook?.emoji}</div>
                          <div className="sgk-float-emoji" style={{ top: '22%', right: '5%', animationDelay: '1.2s' }}>🎈</div>
                          <div className="sgk-float-emoji" style={{ bottom: '30%', left: '3%', animationDelay: '2.4s' }}>✨</div>
                          <div className="sgk-float-emoji" style={{ bottom: '12%', right: '6%', animationDelay: '0.6s' }}>🌟</div>
                          <div className="sgk-page-lines-bg">
                            <div className="sgk-page-content">
                              {pages[sgkPageIndex].map((line, i) => {
                                if (line.startsWith('🌅') || line.startsWith('📚')) {
                                  return <div key={i} className="sgk-label-reading">{line}</div>
                                }
                                if (line.startsWith('---')) {
                                  return <div key={i} className="sgk-page-separator"><span>✦ ✦ ✦</span></div>
                                }
                                if (line.startsWith('💬') || line.startsWith('📋') || line.startsWith('📐') || line.startsWith('🌟')) {
                                  return <div key={i} className="sgk-label-question-box">{line}</div>
                                }
                                if (line.startsWith('•')) {
                                  return <div key={i} className="sgk-reading-bullet">
                                    <span className="bullet-dot">●</span> {line.replace('•', '').trim()}
                                  </div>
                                }
                                if (line.startsWith('→')) {
                                  return <div key={i} className="sgk-reading-result">{line}</div>
                                }
                                if (line.match(/^[1-9]️⃣/)) {
                                  return <div key={i} className="sgk-reading-step">{line}</div>
                                }
                                if (line.trim() === '') return <div key={i} className="sgk-line-gap" />
                                return <p key={i} className="sgk-reading-text">{line}</p>
                              })}
                            </div>
                          </div>

                          {/* Điều hướng trang: đọc sách là lật từng trang, không cuộn một lèo */}
                          <div className="sgk-page-nav">
                            <button
                              type="button"
                              className="sgk-page-btn back"
                              disabled={sgkPageIndex === 0}
                              onClick={() => goPage(-1)}
                            >
                              ⇦ Trang trước
                            </button>
                            <span className="sgk-page-counter">
                              📖 Trang {Math.min(sgkPageIndex + 1, pages.length)}/{pages.length}
                            </span>
                            {!isLastPage && (
                              <button
                                type="button"
                                className="sgk-page-btn next"
                                onClick={() => goPage(1)}
                              >
                                Trang sau ➜
                              </button>
                            )}
                          </div>

                          {/* Footer + cổng vào trắc nghiệm chỉ xuất hiện ở TRANG CUỐI */}
                          {isLastPage && (
                            <div className="sgk-page-footer">
                              {tone.mascot && <div className="sgk-footer-mascot bounce-anim">🦉</div>}
                              <div className="sgk-footer-bubble">
                                <p className="sgk-footer-msg">
                                  {tone.isTeen
                                    ? <>Đọc kỹ bài rồi làm trắc nghiệm để nhận <strong>⭐ {selectedTextbook?.stars} Sao</strong>.</>
                                    : <>Bé đã đọc xong chưa? Hãy làm trắc nghiệm để nhận <strong>⭐ {selectedTextbook?.stars} Sao</strong> nhé!</>}
                                </p>
                                <p className="sgk-footer-sub">
                                  Chỉ những câu <strong>đúng ngay lần đầu</strong> mới được tính trọn sao nhé!
                                </p>
                              </div>
                              {/* Cổng chống đọc lướt: phải đọc đủ thời lượng cả bài mới vào được trắc nghiệm */}
                              <ReadingGateButton
                                className="sgk-start-quiz-btn"
                                text={selectedLesson.content}
                                tone={tone}
                                onReady={() => {
                                  setSgkLessonView('quiz')
                                  resetSgkQuiz()
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })()
                  ) : (
                    /* ===== PHẦN TRẮC NGHIỆM ===== */
                    (() => {
                      const quiz = selectedLesson.quizzes[sgkQuizIndex]
                      const isLast = sgkQuizIndex === selectedLesson.quizzes.length - 1
                      const totalQuiz = selectedLesson.quizzes.length
                      // Sao tính theo số câu ĐÚNG NGAY LẦN ĐẦU, không phải số câu đúng.
                      // Bé buộc phải đúng mới đi tiếp nên "số câu đúng" luôn tuyệt đối;
                      // nếu tính theo nó thì đoán bừa vẫn được trọn sao.
                      const grade = gradeQuizResult(selectedTextbook?.stars || 5, sgkFirstTryCount, totalQuiz)
                      const earnedStars = grade.stars
                      const mascotPraise = ['Tuyệt vời! Bé giỏi quá! 🌟', 'Rực rỡ! Cứ thế này nhé! 🚀', 'Siêu đỉnh luôn nè! 💫', 'Wow! Bé học giỏi thật! 🎯']
                      const mascot = sgkQuizCorrect
                        ? { emoji: '🤩', msg: mascotPraise[sgkQuizIndex % mascotPraise.length] }
                        : sgkQuizFeedback
                          ? { emoji: '🤔', msg: tone.quizWrong }
                          : { emoji: '🦉', msg: tone.quizIntro }

                      /* ===== MÀN TỔNG KẾT SAU KHI LÀM XONG ===== */
                      if (sgkQuizDone) {
                        const sgkAlreadyDone = completions.some(
                          c => c.child_id === profile.child.id && c.task_id === 'sgk-' + selectedLesson.id && c.status === 'approved'
                        )
                        const rankMsg = {
                          title: `${grade.rank.title}${tone.isTeen ? '' : ' ' + grade.rank.emoji}`,
                          msg: tone.isTeen ? grade.rank.teenMsg : grade.rank.msg,
                        }
                        return (
                          <div className="sgk-summary-card">
                            {!tone.isTeen && <div className="sgk-summary-confetti">🎉 ✨ 🎊 ✨ 🎉</div>}
                            {!tone.isTeen && <div className="sgk-summary-trophy bounce-anim">🏆</div>}
                            <h3 className="sgk-summary-title">{rankMsg.title}</h3>
                            <p className="sgk-summary-msg">{rankMsg.msg}</p>

                            <div className="sgk-summary-stats">
                              <div className="sgk-summary-stat">
                                <span className="sgk-summary-stat-num">{sgkFirstTryCount}/{totalQuiz}</span>
                                <span className="sgk-summary-stat-label">🎯 Đúng ngay lần đầu</span>
                              </div>
                              <div className="sgk-summary-stat">
                                <span className="sgk-summary-stat-num">{sgkWrongAttempts}</span>
                                <span className="sgk-summary-stat-label">Lần chọn sai</span>
                              </div>
                              <div className="sgk-summary-stat">
                                <span className="sgk-summary-stat-num">⭐ {earnedStars}</span>
                                <span className="sgk-summary-stat-label">Sao nhận được</span>
                              </div>
                            </div>

                            {/* Nói thẳng vì sao nhận được từng ấy sao — để bé hiểu
                                phần thưởng gắn với việc hiểu bài, không phải số lần bấm. */}
                            {grade.ratio < 1 && (
                              <p className="sgk-summary-note">
                                Đúng ngay lần đầu toàn bộ câu hỏi sẽ nhận trọn{' '}
                                <strong>{selectedTextbook?.stars || 5} ⭐</strong>. Đọc lại bài rồi thử lại nhé!
                              </p>
                            )}

                            <div className="sgk-summary-stars">
                              {Array.from({ length: Math.min(5, earnedStars) }).map((_, si) => (
                                <span key={si} className="sgk-summary-star" style={{ animationDelay: `${si * 0.25}s` }}>⭐</span>
                              ))}
                            </div>

                            <div className="sgk-summary-actions">
                              <button
                                type="button"
                                className="sgk-btn-read-again"
                                onClick={resetSgkQuiz}
                              >
                                🔄 Chơi lại
                              </button>
                              {earnedStars > 0 && !sgkAlreadyDone ? (
                                <button
                                  type="button"
                                  className="sgk-btn-finish"
                                  onClick={async () => {
                                    try {
                                      await addStars(familyId, profile.child.id, earnedStars, `Hoàn thành bài học SGK: ${selectedLesson.title}`)
                                      await submitCompletion(
                                        familyId,
                                        {
                                          id: 'sgk-' + selectedLesson.id,
                                          title: `${selectedTextbook?.subject || 'SGK'}: ${selectedLesson.title}`,
                                          stars: earnedStars,
                                          child_id: profile.child.id
                                        },
                                        null,
                                        `Bé đã hoàn thành bài học SGK: ${selectedLesson.title}`,
                                        'approved'
                                      )
                                      setSgkCompletedLessons(prev => ({ ...prev, [selectedLesson.id]: true }))
                                      setChildBalance(prev => prev + earnedStars)
                                      showToast(`🎉 Rực rỡ! Bé được cộng +${earnedStars} ⭐ vào Ví Sao!`)
                                      celebrate({ particleCount: 220, spread: 100, origin: { y: 0.5 } })
                                    } catch (err) {
                                      // Không đánh dấu đã xong khi chưa lưu được: thà bé làm lại
                                      // còn hơn tưởng đã nhận sao mà thực tế không có gì được lưu.
                                      showToast('❌ Chưa lưu được sao: ' + err.message + '. Bé hãy thử lại nhé!')
                                      return
                                    }
                                    setSelectedLesson(null)
                                    setSgkLessonView('content')
                                    resetSgkQuiz()
                                    loadAppData()
                                  }}
                                >
                                  🏆 Nhận {earnedStars} Sao! ⭐
                                </button>
                              ) : sgkAlreadyDone ? (
                                <button
                                  type="button"
                                  className="sgk-btn-finish"
                                  onClick={() => {
                                    showToast('📗 Bé đã nhận sao cho bài này rồi!')
                                    setSelectedLesson(null)
                                    setSgkLessonView('content')
                                    resetSgkQuiz()
                                  }}
                                >
                                  ✅ Đã hoàn thành trước đó
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="sgk-btn-finish"
                                  onClick={() => {
                                    setSelectedLesson(null)
                                    setSgkLessonView('content')
                                    resetSgkQuiz()
                                  }}
                                >
                                  📖 Về đọc lại bài
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div className="sgk-quiz-wrapper">
                          {/* HUD: điểm số + streak */}
                          <div className="sgk-quiz-hud">
                            <div className="sgk-score-chip">🎯 {sgkQuizScore} <span>/ {totalQuiz}</span></div>
                            {sgkStreak >= 2 && <div className="sgk-streak-badge">🔥 x{sgkStreak}</div>}
                            <div className="sgk-quiz-progress-bar">
                              {selectedLesson.quizzes.map((_, qi) => (
                                <div
                                  key={qi}
                                  className={`sgk-quiz-progress-dot ${qi < sgkQuizIndex ? 'done' : qi === sgkQuizIndex ? 'active' : ''}`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Card câu hỏi */}
                          <div className="sgk-quiz-card">
                            <div className="sgk-quiz-number">Câu {sgkQuizIndex + 1} / {totalQuiz}</div>
                            <div className={`sgk-quiz-mascot ${sgkQuizCorrect ? 'mascot-happy' : sgkQuizFeedback ? 'mascot-think' : 'mascot-idle'}`}>
                              <span className="sgk-mascot-emoji">{mascot.emoji}</span>
                              <div className="sgk-mascot-bubble">{mascot.msg}</div>
                            </div>
                            <h3 className="sgk-quiz-question">{quiz.question}</h3>

                            {/* Các lựa chọn */}
                            <div className="sgk-quiz-options">
                              {quiz.options.map((option, idx) => {
                                const letters = ['A', 'B', 'C', 'D']
                                const optColors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
                                const isSelected = sgkQuizSelected === idx
                                const isCorrect = sgkQuizCorrect && idx === quiz.correctAnswer
                                const isWrong = sgkQuizFeedback && isSelected && idx !== quiz.correctAnswer
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    className={`sgk-option-btn ${isSelected && !sgkQuizCorrect ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                                    style={{ '--opt-color': optColors[idx] }}
                                    disabled={sgkQuizCorrect}
                                    onClick={() => {
                                      setSgkQuizSelected(idx)
                                      setSgkQuizFeedback(false)
                                    }}
                                  >
                                    <span className="sgk-opt-letter" style={{ background: optColors[idx] }}>{letters[idx]}</span>
                                    <span className="sgk-opt-text">{option}</span>
                                    {isCorrect && <span className="sgk-opt-check">✓</span>}
                                    {isWrong && <span className="sgk-opt-x">✗</span>}
                                  </button>
                                )
                              })}
                            </div>

                            {/* Phản hồi sai */}
                            {sgkQuizFeedback && !sgkQuizCorrect && (
                              <div className="sgk-feedback-wrong">
                                <span className="sgk-feedback-icon">🙈</span>
                                <p>Chưa đúng rồi! Bé đọc lại câu hỏi và thử chọn lại nhé! 💪</p>
                              </div>
                            )}

                            {/* Phản hồi đúng */}
                            {sgkQuizCorrect && (
                              <div className="sgk-feedback-correct">
                                <span className="sgk-feedback-icon">🎉</span>
                                <div>
                                  <strong>ĐÚNG RỒI! +1 điểm 🎯</strong>
                                  <p>{quiz.explanation}</p>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="sgk-quiz-actions">
                              <button
                                type="button"
                                className="sgk-btn-read-again"
                                onClick={() => {
                                  setSgkLessonView('content')
                                  setSgkPageIndex(0)
                                }}
                              >
                                ← Đọc lại bài
                              </button>

                              {!sgkQuizCorrect ? (
                                <button
                                  type="button"
                                  className="sgk-btn-check"
                                  disabled={sgkQuizSelected === null}
                                  onClick={() => {
                                    if (sgkQuizSelected === quiz.correctAnswer) {
                                      setSgkQuizCorrect(true)
                                      setSgkQuizScore(prev => prev + 1)
                                      // Đúng ngay lần đầu mới thực sự là "nắm được bài"
                                      if (!sgkQuestionMissed) setSgkFirstTryCount(prev => prev + 1)
                                      setSgkStreak(prev => {
                                        const next = prev + 1
                                        setSgkBestStreak(best => Math.max(best, next))
                                        return next
                                      })
                                      celebrate({ particleCount: 60, spread: 70, origin: { y: 0.75 }, scalar: 0.8 })
                                    } else {
                                      setSgkQuizFeedback(true)
                                      setSgkStreak(0)
                                      setSgkQuestionMissed(true)
                                      setSgkWrongAttempts(prev => prev + 1)
                                      setSgkWrongAnswers(prev => [...prev, {
                                        q: quiz.question,
                                        chose: quiz.options[sgkQuizSelected],
                                        correct: quiz.options[quiz.correctAnswer],
                                      }])
                                    }
                                  }}
                                >
                                  💡 Kiểm tra
                                </button>
                              ) : !isLast ? (
                                <button
                                  type="button"
                                  className="sgk-btn-next"
                                  onClick={() => {
                                    setSgkQuizIndex(prev => prev + 1)
                                    setSgkQuizSelected(null)
                                    setSgkQuizCorrect(false)
                                    setSgkQuizFeedback(false)
                                    setSgkQuestionMissed(false)
                                  }}
                                >
                                  Câu tiếp theo →
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="sgk-btn-finish"
                                  onClick={async () => {
                                    celebrate({ particleCount: 120, spread: 90, origin: { y: 0.6 } })
                                    setSgkQuizDone(true)
                                    // Ghi lịch sử NGAY tại đây, không đợi bé bấm "Nhận sao":
                                    // lượt ôn lại bài cũ (không còn sao) vẫn phải được lưu.
                                    const doneBefore = completions.some(
                                      c => c.child_id === profile.child.id &&
                                           c.task_id === 'sgk-' + selectedLesson.id &&
                                           c.status === 'approved'
                                    )
                                    try {
                                      await logLearningSession(familyId, profile.child.id, {
                                        kind: 'sgk',
                                        refId: String(selectedLesson.id),
                                        title: selectedLesson.title,
                                        subject: selectedTextbook?.subject || 'SGK',
                                        grade: sgkGrade,
                                        week: selectedLesson.week ?? null,
                                        quizTotal: totalQuiz,
                                        quizFirstTry: sgkFirstTryCount,
                                        wrongAttempts: sgkWrongAttempts,
                                        wrongAnswers: sgkWrongAnswers,
                                        durationSeconds: elapsedSeconds(sgkStartedAt),
                                        starsEarned: doneBefore ? 0 : earnedStars,
                                      })
                                      loadAppData()
                                    } catch (err) {
                                      showToast('⚠️ Chưa lưu được lịch sử học tập: ' + err.message)
                                    }
                                  }}
                                >
                                  🏆 Xem kết quả!
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })()
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab con 6: Huy Hiệu & Thành Tựu */}
          {activeTab === 'badges' && (
            <div className="tab-pane">
              <h3 className="section-title text-center">🏅 Bảng Thành Tựu & Huy Hiệu Của Bé</h3>
              <p className="subtitle text-center">Tích lũy kinh nghiệm và làm nhiều bài học để mở khóa tất cả huy hiệu nhé!</p>
              
              <div className="badges-grid">
                {badgesList.map(badge => (
                  <div key={badge.id} className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`}>
                    <span className="badge-emoji">{badge.emoji}</span>
                    <h4 className="badge-name">{badge.name}</h4>
                    <p className="badge-desc">{badge.desc}</p>
                    <span className="badge-progress">
                      {badge.unlocked ? '✅ Đã đạt được' : `🔒 Tiến độ: ${badge.progressText}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Khu Game Đổi Sao */}
          {activeTab === 'arcade' && (
            <div className="tab-pane">
              <GameArcade 
                childBalance={childBalance} 
                onDeductStars={handleDeductStarsForGame} 
                showToast={showToast} 
              />
            </div>
          )}

          {/* Modal Bé gửi Minh Chứng */}
          {activeProofTask && (
            <div className="pin-overlay">
              <div className="card glass add-child-dialog">
                <h3>📸 Gửi Minh Chứng Hoàn Thành</h3>
                <p className="subtitle">Bé hãy gửi hình ảnh thành quả hoặc lời nhắn cho bố mẹ xem nhé!</p>
                
                <div className="form-group text-left">
                  <div className="stars-badge">⭐️ {activeProofTask.stars} Sao</div>
                  <h4>Nhiệm vụ: {activeProofTask.title}</h4>
                  {activeProofTask.description && <p className="subtitle">{activeProofTask.description}</p>}
                  
                  <label htmlFor="proof-file-input">📸 Chụp ảnh hoặc tải ảnh lên (tùy chọn)</label>
                  <input
                    id="proof-file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setProofImageBase64(reader.result)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />

                  {proofImageBase64 && (
                    <div className="proof-image-preview-container">
                      <img src={proofImageBase64} alt="Xem trước minh chứng" className="proof-image-preview" />
                      <button
                        type="button"
                        className="btn-remove-preview"
                        onClick={() => setProofImageBase64(null)}
                      >
                        ✕ Gỡ ảnh
                      </button>
                    </div>
                  )}

                  <label htmlFor="child-note-textarea">💬 Lời nhắn của con gửi bố mẹ (tùy chọn)</label>
                  <textarea
                    id="child-note-textarea"
                    placeholder="Ví dụ: Con đã lau bàn ăn sạch bóng rồi ạ..."
                    value={proofChildNote}
                    onChange={(e) => setProofChildNote(e.target.value)}
                  />

                  <div className="dialog-actions-row">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setActiveProofTask(null)
                        setProofImageBase64(null)
                        setProofChildNote('')
                      }}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleConfirmProofSubmit}
                    >
                      Gửi bố mẹ duyệt 🚀
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal xem sách gốc PDF (view của bé) */}
          <PdfViewerModal pdf={sgkPdfOpen} onClose={() => setSgkPdfOpen(null)} />

        </main>
      </div>
    )
  }

  return (
    <div className="center-container">
      <div className="spinner"></div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
