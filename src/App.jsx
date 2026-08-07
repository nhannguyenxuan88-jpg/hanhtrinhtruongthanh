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
  updateReward,
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
  safeLogLearningSession
} from './lib/api'
import { supabase } from './lib/supabase'
import { booksData } from './lib/booksData'
import { mathData } from './lib/mathData'
import { exploreData } from './lib/exploreData'
import { textbookData } from './lib/textbookData'
import { textbookData8 } from './lib/textbookData8'
import GameArcade from './components/GameArcade'
import ReadingGateButton from './components/ReadingGateButton'
import ReviewCard from './components/ReviewCard'
import TopicReader from './components/TopicReader'
import WeeklyDigestPanel from './components/WeeklyDigestPanel'
import PdfViewerModal from './components/PdfViewerModal'
import { getLevelInfo, calculateStreak, calculateBadges } from './lib/gamification'
import {
  gradeQuizResult,
  computeReviewQueue,
  splitSgkPages,
  learningItemState,
  findAreaTask,
  findItemTask,
} from './lib/learning'
import { LEARNING_AREAS, AREA_ORDER, areaItems, areaBadge } from './lib/assignables'
import { getTone, REWARD_SUGGESTIONS, isTeenGrade } from './lib/tone'
import SgkPdfButton from './components/SgkPdfButton'
import { textbookPdfFor, getExactPdfPage } from './lib/textbookPdfs'
import PikaTutorModal from './components/PikaTutor/PikaTutorModal'
import PikaAvatar from './components/PikaTutor/PikaAvatar'
import MathHub from './components/MathHub/MathHub'
import StoryStreamView from './components/StoryStreamView'

export const DEFAULT_SAMPLE_REWARDS = [
  { id: 'sample_rw_1', title: '🍦 Đi ăn kem cùng gia đình', cost: 10, emoji: '🍦' },
  { id: 'sample_rw_2', title: '🎮 30 phút chơi Game / Xem TV', cost: 15, emoji: '🎮' },
  { id: 'sample_rw_3', title: '🍕 Bữa tiệc Pizza / Gà rán yêu thích', cost: 20, emoji: '🍕' },
  { id: 'sample_rw_4', title: '📚 Sách / Truyện tranh mới', cost: 25, emoji: '📚' },
  { id: 'sample_rw_5', title: '🎬 Xem phim rạp cuối tuần', cost: 30, emoji: '🎬' },
  { id: 'sample_rw_6', title: '🧸 Bộ đồ chơi yêu thích', cost: 40, emoji: '🧸' },
  { id: 'sample_rw_7', title: '🚴‍♂️ 1 Ngày dã ngoại / Đạp xe', cost: 45, emoji: '🚴‍♂️' },
  { id: 'sample_rw_8', title: '🎡 Vé đi công viên nước / Khu vui chơi', cost: 50, emoji: '🎡' },
  { id: 'sample_rw_9', title: '🍰 Bánh ngọt & Trà sữa tùy chọn', cost: 15, emoji: '🍰' },
  { id: 'sample_rw_10', title: '📱 Thêm 1 giờ dùng máy tính bảng', cost: 20, emoji: '📱' },
]

export const PRESET_REWARD_EMOJIS = ['🍦', '🎮', '🍕', '📚', '🎬', '🧸', '🚴‍♂️', '🎡', '🍰', '📱', '🍿', '🏊‍♂️', '🎁', '⭐']
import FreePlayDrawer from './components/FreePlayDrawer'
import ParentQuickInbox from './components/ParentQuickInbox'
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

// Gợi ý nhiệm vụ cho bố mẹ bấm một cái là điền sẵn form.
//
// Phần tử có thêm `taskType` là nhiệm vụ TRỎ VÀO NỘI DUNG TRONG APP: tạo xong
// thì cả khu đó được mở khoá cho con học lần lượt. Không có `taskType` là việc
// đời thường, con làm xong thì nộp minh chứng cho bố mẹ duyệt như cũ.
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
  },
  {
    category: '🌍 Khám phá',
    tasks: [
      { title: 'Khám phá 1 chủ đề kiến thức mới', desc: 'Vào tab Khám Phá Thế Giới, đọc hết phần kiến thức và trả lời đúng các câu hỏi.', stars: 6, recurrence: 'weekly', taskType: 'explore' },
      { title: 'Kể lại điều mới học được', desc: 'Kể cho bố mẹ nghe 3 điều thú vị vừa học được trong ngày.', stars: 4, recurrence: 'daily' },
      { title: 'Quan sát và ghi chép thiên nhiên', desc: 'Quan sát một cái cây, con vật hoặc bầu trời rồi vẽ/ghi lại điều mình thấy.', stars: 4, recurrence: 'weekly' },
      { title: 'Đặt 3 câu hỏi "Vì sao?"', desc: 'Tự nghĩ 3 câu hỏi về thế giới xung quanh rồi cùng bố mẹ đi tìm câu trả lời.', stars: 3, recurrence: 'weekly' },
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
  const [activeTab, setActiveTab] = useState('stream')
  const [isFreePlayOpen, setIsFreePlayOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Trạng thái cho Thư viện sách (Reading Corner)
  const [readingBook, setReadingBook] = useState(null)
  const [readingPageIndex, setReadingPageIndex] = useState(0)
  const [quizSelectedOption, setQuizSelectedOption] = useState(null)
  const [quizAnsweredCorrectly, setQuizAnsweredCorrectly] = useState(false)
  const [quizShowFeedback, setQuizShowFeedback] = useState(false)
  const [kidAgeGroup, setKidAgeGroup] = useState('kids')

  // Trạng thái cho Sân Chơi Toán Tư Duy & Khu Khám Phá Thế Giới.
  // Mọi state trong lúc học (trang, đáp án, số câu đúng lần đầu...) do
  // component TopicReader tự giữ; ở đây chỉ cần biết đang mở chủ đề nào.
  const [selectedMathTopic, setSelectedMathTopic] = useState(null)
  const [selectedExploreTopic, setSelectedExploreTopic] = useState(null)

  // Trạng thái Mục Tiêu Đổi Quà (Target Reward Goal)
  const [targetGoal, setTargetGoal] = useState(null)

  useEffect(() => {
    if (profile?.child?.id) {
      try {
        const saved = localStorage.getItem(`target_reward_goal_${profile.child.id}`)
        if (saved) setTargetGoal(JSON.parse(saved))
        else setTargetGoal(null)
      } catch (e) {
        console.warn('Lỗi đọc mục tiêu đổi quà:', e)
      }
    }
  }, [profile?.child?.id])

  const handleSetTargetGoal = (reward) => {
    if (!profile?.child?.id) return
    try {
      localStorage.setItem(`target_reward_goal_${profile.child.id}`, JSON.stringify(reward))
      setTargetGoal(reward)
      showToast(`🎯 Đã chọn "${reward.title}" làm mục tiêu phấn đấu! Cố gắng tích lũy sao nhé con! 🎉`)
    } catch (e) {
      console.warn('Lỗi lưu mục tiêu đổi quà:', e)
    }
  }

  // Trạng thái Quản Lý Phần Thưởng Cho Bố Mẹ
  const [editingReward, setEditingReward] = useState(null)
  const [showAddRewardForm, setShowAddRewardForm] = useState(false)

  const handleSaveEditReward = async () => {
    if (!editingReward || !editingReward.title.trim()) return
    try {
      if (String(editingReward.id).startsWith('sample_rw_')) {
        const created = await addReward(familyId, {
          title: editingReward.title.trim(),
          cost: Number(editingReward.cost) || 10,
          emoji: editingReward.emoji || '🎁'
        })
        setRewards(prev => [...prev.filter(r => r.id !== editingReward.id), created])
      } else {
        const updated = await updateReward(editingReward.id, {
          title: editingReward.title.trim(),
          cost: Number(editingReward.cost) || 10,
          emoji: editingReward.emoji || '🎁'
        })
        setRewards(prev => prev.map(r => r.id === updated.id ? updated : r))
      }
      showToast('🎉 Đã cập nhật phần quà thành công!')
      setEditingReward(null)
    } catch (err) {
      console.error('Lỗi cập nhật phần quà:', err)
      showToast('Lỗi cập nhật phần quà: ' + err.message)
    }
  }

  const handleDeleteReward = async (reward) => {
    if (!window.confirm(`Bố mẹ có chắc muốn xóa phần quà "${reward.title}"?`)) return
    try {
      if (!String(reward.id).startsWith('sample_rw_')) {
        await deactivateReward(reward.id)
      }
      setRewards(prev => prev.filter(r => r.id !== reward.id))
      showToast('🗑️ Đã xóa phần quà!')
    } catch (err) {
      console.error('Lỗi xóa quà:', err)
      showToast('Lỗi xóa phần quà.')
    }
  }

  const handleAddCustomReward = async (e) => {
    if (e) e.preventDefault()
    if (!newRewardTitle.trim()) {
      showToast('Vui lòng nhập tên phần quà!')
      return
    }
    try {
      const created = await addReward(familyId, {
        title: newRewardTitle.trim(),
        cost: Number(newRewardCost) || 10,
        emoji: newRewardEmoji || '🎁'
      })
      setRewards(prev => [...prev, created])
      setNewRewardTitle('')
      setNewRewardCost(15)
      setNewRewardEmoji('🎁')
      setShowAddRewardForm(false)
      showToast('✨ Đã thêm phần quà mới vào cửa hàng!')
    } catch (err) {
      console.error('Lỗi thêm quà mới:', err)
      showToast('Lỗi thêm quà: ' + err.message)
    }
  }

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

  // Trạng thái Gia Sư Pika
  const [showPikaModal, setShowPikaModal] = useState(false)
  const [pikaSgkContext, setPikaSgkContext] = useState(null)

  const handleOpenPika = (sgkCtx = null) => {
    setPikaSgkContext(sgkCtx)
    setShowPikaModal(true)
  }

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

  const elapsedSeconds = (startedAt) =>
    startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : 0

  // ---------- Giọng điệu theo độ tuổi ----------
  // Con lớp 6+ dùng giọng điềm đạm, không mascot, không pháo hoa.
  const tone = getTone(profile?.child?.grade)

  // Kho truyện, Toán tư duy và Khám Phá đều chia hai nhánh nội dung theo tuổi.
  // Mặc định phải khớp khối lớp của con: nếu để cứng 'kids' thì bạn lớp 8 mở
  // app ra sẽ thấy toàn nội dung lớp 2. Con vẫn tự bấm chuyển sang nhánh kia
  // được nếu muốn đọc thêm.
  useEffect(() => {
    if (profile?.type === 'child') {
      setKidAgeGroup(isTeenGrade(profile.child?.grade) ? 'teens' : 'kids')
    }
  }, [profile])

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
    if (item.kind === 'math' || item.kind === 'explore') {
      const catalog = item.kind === 'math' ? mathData : exploreData
      const group = Object.keys(catalog).find(g =>
        catalog[g].some(t => String(t.id) === String(item.refId))
      )
      const topic = group && catalog[group].find(t => String(t.id) === String(item.refId))
      if (!topic) { showToast('Chủ đề này không còn nữa.'); return }
      setKidAgeGroup(group)
      // TopicReader tự khởi tạo lại toàn bộ state khi đổi chủ đề (key={topic.id})
      if (item.kind === 'math') {
        setSelectedMathTopic(topic)
        setActiveTab('math')
      } else {
        setSelectedExploreTopic(topic)
        setActiveTab('explore')
      }
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
  // Khu nội dung gắn kèm nhiệm vụ gõ tay ('' = việc đời thường)
  const [newTaskType, setNewTaskType] = useState('')

  // Khu đang xem trong bảng "Giao bài học trong app"
  const [assignArea, setAssignArea] = useState('book')

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
        setActiveTab('stream')
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

  const handleOpenParentPin = () => {
    setPinProfile('parent')
    setPinInput('')
    setPinError('')
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
        child_id: newTaskChildId,
        // Chip gợi ý có thể gắn sẵn khu nội dung để nhiệm vụ mở khoá được bài
        task_type: newTaskType || null,
        content_ref: null,
      })
      showToast('Đã thêm nhiệm vụ thành công!')
      setNewTaskTitle('')
      setNewTaskDesc('')
      setNewTaskType('')
      loadAppData()
    } catch (err) {
      showToast('Lỗi tạo nhiệm vụ: ' + err.message)
    }
  }

  // ---------- Bố mẹ giao thẳng bài học trong app ----------
  //
  // Đây là lối giao bài chính, thay cho việc bố mẹ phải tự gõ một nhiệm vụ có
  // tiêu đề trùng khớp tên bài. Nhiệm vụ tạo ra trỏ CỨNG vào nội dung qua
  // task_type + content_ref nên không bao giờ lệch khi tên bài đổi.
  //
  // Nhóm tuổi (kids/teens) LUÔN suy từ khối lớp của bé, không cho bố mẹ chọn
  // tay: giao nhầm truyện lớp 2 cho bạn lớp 8 là lỗi khó nhận ra mà rất khó chịu.
  const assignChild = children.find(c => c.id === newTaskChildId) || null
  const assignAgeGroup = isTeenGrade(assignChild?.grade) ? 'teens' : 'kids'
  const assignList = areaItems(assignArea, assignAgeGroup)

  // Bố mẹ mở CẢ KHU: con tự học lần lượt, không phải chờ giao từng bài.
  const handleAssignArea = async (kind) => {
    if (!newTaskChildId) {
      showToast('Bố mẹ chọn hồ sơ con trước nhé!')
      return
    }
    const area = LEARNING_AREAS[kind]
    try {
      await addTask(familyId, {
        title: `🔓 ${area.icon} ${area.label} — học lần lượt`,
        description: `Con vào tab ${area.icon} ${area.label} học lần lượt từ bài đầu. Học xong bài nào là tự nhận sao bài đó.`,
        stars: 5,
        recurrence: 'weekly',
        child_id: newTaskChildId,
        task_type: kind,
        content_ref: null,
      })
      showToast(`Đã mở cả khu ${area.icon} ${area.label} cho ${assignChild?.name || 'con'}!`)
      loadAppData()
    } catch (err) {
      showToast('Lỗi giao bài: ' + err.message)
    }
  }

  // Bố mẹ giao đúng MỘT bài.
  //
  // Tiêu đề cố ý chứa nguyên văn tên bài: nếu database chưa chạy
  // migration_assign.sql thì 2 cột mới bị bỏ qua, nhưng nhánh so tiêu đề trong
  // isLearningItemAssigned vẫn mở khoá đúng bài này.
  const handleAssignItem = async (kind, item) => {
    if (!newTaskChildId) {
      showToast('Bố mẹ chọn hồ sơ con trước nhé!')
      return
    }
    const area = LEARNING_AREAS[kind]
    try {
      await addTask(familyId, {
        title: `${area.icon} ${area.label}: ${item.title}`,
        description: `Bài học trong app. Con vào tab ${area.icon} ${area.label} và học xong bài này là tự nhận sao.`,
        stars: item.stars || 5,
        recurrence: 'once',
        child_id: newTaskChildId,
        task_type: kind,
        content_ref: String(item.id),
      })
      showToast(`Đã giao "${item.title}" cho ${assignChild?.name || 'con'}!`)
      loadAppData()
    } catch (err) {
      showToast('Lỗi giao bài: ' + err.message)
    }
  }

  // Bố mẹ bấm nút "⚡ Giao tự động Tuần hiện tại"
  const handleAutoAssignForChild = async (childId) => {
    const child = children.find(c => c.id === childId)
    if (!child) return
    const week = currentSchoolWeek()
    const weekItems = lessonsOfWeek(child.grade || 2, week)

    try {
      setLoadingData(true)
      // 1. Tự động lưu Kế hoạch tuần vào Database
      const days = autoAssignPlanDays(weekItems)
      await upsertWeeklyPlan(familyId, childId, week, days)

      // 2. Tự động tạo các Nhiệm Vụ Ngày
      if (weekItems.length > 0) {
        const first = weekItems[0]
        await addTask(familyId, {
          title: `📗 Bài SGK Lớp ${child.grade || 2} (Tuần ${week}): ${first.lesson.title}`,
          description: `Học bài SGK và hoàn thành bài trắc nghiệm 10 phút để tích lũy Sao!`,
          stars: 10,
          recurrence: 'once',
          child_id: childId,
          task_type: 'sgk',
          content_ref: String(first.lesson.id),
        })
      } else {
        await addTask(familyId, {
          title: `📗 Ôn tập Toán & Tiếng Việt Tuần ${week}`,
          description: `Đọc bài và làm bài trắc nghiệm SGK rèn luyện tư duy!`,
          stars: 10,
          recurrence: 'once',
          child_id: childId,
          task_type: 'sgk',
          content_ref: null,
        })
      }

      await addTask(familyId, {
        title: `📖 Đọc truyện Cổ tích Lô-gíc Tuần ${week}`,
        description: `Đọc một câu chuyện ý nghĩa và trả lời câu hỏi tư duy!`,
        stars: 5,
        recurrence: 'once',
        child_id: childId,
        task_type: 'book',
        content_ref: null,
      })

      await addTask(familyId, {
        title: `🧹 Rèn thói quen: Tự dọn dẹp góc học tập & đồ dùng`,
        description: `Tự sắp xếp góc học tập sạch sẽ gọn gàng sau khi học xong!`,
        stars: 5,
        recurrence: 'daily',
        child_id: childId,
        task_type: 'chore',
        content_ref: null,
      })

      showToast(`🎉 Đã giao tự động lộ trình Tuần ${week} cho ${child.name}!`)
      await loadAppData()
    } catch (err) {
      showToast('Lỗi giao bài tự động: ' + err.message)
    } finally {
      setLoadingData(false)
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

  /**
   * Nhiệm vụ này là một BÀI HỌC TRONG APP hay một việc đời thường?
   *
   * ĐÂY LÀ HÀNG RÀO CHỐNG CỘNG SAO HAI LẦN. Bài học trong app tự cộng sao ngay
   * khi con trả lời đúng hết câu hỏi. Nếu con vẫn thấy nút "Đã làm xong ✔" trên
   * chính nhiệm vụ đó, con nộp minh chứng, bố mẹ duyệt, và số sao được cộng
   * thêm lần thứ hai cho cùng một việc — sổ sao sai và phần thưởng mất ý nghĩa.
   * Nên với nhiệm vụ dạng này, con chỉ có một đường duy nhất: vào học.
   */
  const isContentTask = (task) => Boolean(task?.task_type && LEARNING_AREAS[task.task_type])

  /** Tìm một bài trong khu nội dung kèm THỨ TỰ của nó — thứ tự là thứ con phải học. */
  const findAreaItem = (kind, refId) => {
    const area = LEARNING_AREAS[kind]
    if (!area) return null
    for (const group of Object.keys(area.data)) {
      const items = area.data[group]
      const index = items.findIndex(it => String(it.id) === String(refId))
      if (index >= 0) return { group, items, index, item: items[index] }
    }
    return null
  }

  /** Con bấm "Vào học ngay" trên nhiệm vụ bài học -> mở đúng bài (hoặc đúng khu). */
  const openTaskContent = (task) => {
    const area = LEARNING_AREAS[task.task_type]
    if (!area) return
    // Nhiệm vụ "mở cả khu" không trỏ vào bài nào: đưa con vào khu để tự chọn
    // bài tiếp theo đang mở.
    if (!task.content_ref) {
      setActiveTab(area.tab)
      showToast(`Con vào ${area.icon} ${area.label} học lần lượt từ bài đang mở nhé!`)
      return
    }

    const found = findAreaItem(task.task_type, task.content_ref)
    if (!found) {
      setActiveTab(area.tab)
      showToast('Bài này không còn trong app nữa, con chọn bài khác nhé!')
      return
    }

    // Nút này KHÔNG được là cửa sau vượt khoá: bố mẹ giao bài số 7 thì con vẫn
    // phải học xong 6 bài trước, đúng như khi bấm từ lưới bài.
    const state = learningItemState({
      tasks, completions, childId: profile?.child?.id,
      kind: task.task_type, prefix: area.prefix,
      items: found.items, index: found.index,
    })
    if (!state.isUnlocked) {
      setKidAgeGroup(found.group)
      setActiveTab(area.tab)
      showToast(`📖 Con học xong "${state.prevItem?.title}" là bài này mở ra ngay!`)
      return
    }

    openReviewItem({ kind: task.task_type, refId: task.content_ref })
  }

  // Con bấm "Hoàn thành" -> Hiển thị Modal để nạp minh chứng
  const handleChildSubmitCompletion = (task) => {
    // Chốt cửa ngay tại gốc: nhiệm vụ bài học trong app đã tự cộng sao, nộp
    // minh chứng nữa là cộng hai lần. Giao diện đã ẩn nút này, nhưng chặn thêm
    // ở đây để sau này thêm chỗ hiển thị nhiệm vụ mới cũng không hở.
    if (isContentTask(task)) {
      openTaskContent(task)
      return
    }
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

  /**
   * Con học xong bài rồi thì thu lại nhiệm vụ "giao đúng bài này".
   *
   * Không có bước này thì danh sách "Việc đang giao" của bố mẹ sẽ chất đống
   * hàng chục bài đã hoàn thành. CHỈ thu nhiệm vụ đơn bài — nhiệm vụ "mở cả
   * khu" phải sống tiếp, vì nó còn nhiệm vụ mở những bài phía sau.
   * Thu không được cũng không sao: con đã nhận sao rồi, không chặn gì cả.
   */
  const retireItemTask = async (kind, item) => {
    const done = findItemTask(tasks, profile?.child?.id, kind, item)
    if (!done) return
    try {
      await deactivateTask(done.id)
    } catch (err) {
      console.warn('Không thu được nhiệm vụ đã hoàn thành:', err?.message)
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
      await safeLogLearningSession(familyId, childId, {
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
        await retireItemTask('book', book)
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

  // Con học xong một chủ đề dạng "lý thuyết ➜ trắc nghiệm".
  //
  // Dùng chung cho Toán tư duy và Khám Phá Thế Giới: hai khu chỉ khác nhau ở
  // nhãn hiển thị và loại hoạt động ghi vào lịch sử, còn cách chấm sao thì phải
  // giống hệt nhau. `result` do TopicReader gửi lên sau khi con làm hết câu hỏi.
  // Mô tả từng khu nội dung (tiền tố id ảo, nhãn, tên môn...) nằm ở
  // src/lib/assignables.js để giao diện giao bài của bố mẹ và luật khoá bài
  // phía con luôn đọc cùng một bộ dữ liệu.
  const handleTopicFinished = async (topic, catalogKey, result) => {
    const cat = LEARNING_AREAS[catalogKey]
    const childId = profile.child.id
    const taskId = cat.prefix + topic.id
    const alreadyDone = completions.some(
      c => c.child_id === childId && c.task_id === taskId && c.status === 'approved'
    )
    const total = result.total || 0
    const { stars } = gradeQuizResult(topic.stars || 8, result.firstTryCount, total)
    const starsToEarn = alreadyDone ? 0 : stars

    try {
      // 1) Ghi lịch sử học tập — kể cả khi con ôn lại chủ đề cũ
      await safeLogLearningSession(familyId, childId, {
        kind: cat.kind,
        refId: String(topic.id),
        title: topic.title,
        subject: topic.subject || cat.subject,
        quizTotal: total,
        quizFirstTry: result.firstTryCount,
        wrongAttempts: result.wrongAttempts,
        wrongAnswers: result.wrongAnswers,
        durationSeconds: result.durationSeconds,
        starsEarned: starsToEarn,
      })

      // 2) Cộng sao (chỉ lần đầu)
      if (alreadyDone) {
        showToast(`${cat.redoIcon} ${tone.you} đã ôn lại "${topic.title}" — đã ghi vào lịch sử học tập. Sao chỉ được nhận ở lần đầu nhé!`)
      } else {
        await addStars(familyId, childId, starsToEarn, `Hoàn thành ${cat.label}: ${topic.title}`)
        await submitCompletion(
          familyId,
          { id: taskId, title: `${cat.label}: ${topic.title}`, stars: starsToEarn, child_id: childId },
          null,
          cat.note(topic.title),
          'approved'
        )
        await retireItemTask(cat.kind, topic)
        setChildBalance(prev => prev + starsToEarn)
        const fullStars = topic.stars || 8
        showToast(
          starsToEarn < fullStars
            ? `${tone.you} nhận +${starsToEarn} ⭐ (${result.firstTryCount}/${total} câu đúng ngay lần đầu). Đúng hết ngay lần đầu sẽ được trọn ${fullStars} ⭐!`
            : `🎉 Tuyệt vời! ${tone.you} được nhận +${starsToEarn} ⭐ khi làm xong ${cat.label}!`
        )
        celebrate({ particleCount: 120, spread: 70, origin: { y: 0.6 } })
      }
      if (catalogKey === 'math') setSelectedMathTopic(null)
      else setSelectedExploreTopic(null)
      loadAppData()
    } catch (err) {
      showToast('❌ Chưa lưu được kết quả: ' + err.message + '. ' + tone.you + ' hãy thử lại nhé!')
    }
  }

  /**
   * Lưới thẻ chủ đề cho Toán tư duy & Khám Phá Thế Giới.
   *
   * LUẬT MỞ KHOÁ (giữ nguyên cho cả hai khu): chủ đề chỉ mở khi bố mẹ đã giao
   * VÀ con đã học xong chủ đề liền trước. Chủ đề đầu tiên luôn mở sẵn để con có
   * đường vào. Toàn bộ luật do learningItemState (src/lib/learning.js) tính, dùng
   * chung với tab Đọc sách và bảng giao bài của bố mẹ để không bao giờ lệch nhau.
   */
  const renderTopicGrid = ({ topics, catalogKey, cardSubtitle, onOpen, lockedToast }) => {
    const cat = LEARNING_AREAS[catalogKey]
    return (
      <div className="books-grid">
        {topics.map((topic, idx) => {
          const { isDone, isAssigned, isUnlocked, prevItem } = learningItemState({
            tasks, completions, childId: profile.child.id,
            kind: cat.kind, prefix: cat.prefix, items: topics, index: idx,
          })

          return (
            <div key={topic.id} className={`book-card glass ${!isUnlocked ? 'locked' : ''}`}>
              <div className="book-lock-overlay">
                {!isUnlocked && <span className="lock-icon">🔒</span>}
                <span className="book-emoji">{topic.emoji}</span>
              </div>
              <h4>{topic.title}</h4>
              <p className="subtitle">{topic.subtitle || cardSubtitle(topic)}</p>
              <span className="stars-badge">⭐️ {topic.stars} Sao</span>

              {isUnlocked ? (
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => onOpen(topic)}
                >
                  {isDone ? 'Ôn lại chủ đề ➜' : 'Vào học ngay ➜'}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-locked"
                  onClick={() => showToast(
                    // Đã giao rồi mà vẫn khoá thì chỉ còn thiếu bài liền trước.
                    // Nói đúng lý do để con biết mình chỉ cách một bài nữa,
                    // thay vì tưởng bố mẹ chưa giao và bỏ luôn.
                    isAssigned
                      ? `📖 Con học xong "${prevItem?.title}" là bài này mở ra ngay!`
                      : lockedToast
                  )}
                >
                  {isAssigned ? '⏳ Học xong bài trước đã nhé' : '🔒 Chờ Bố Mẹ giao bài này'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Con bấm "Đổi quà"
  const handleChildRedeem = async (reward) => {
    if (childBalance < reward.cost) {
      showToast('Con chưa tích đủ sao để đổi món quà này đâu!')
      return
    }

    try {
      let targetReward = reward
      if (String(reward.id).startsWith('sample_rw_')) {
        const created = await addReward(familyId, { title: reward.title, cost: reward.cost, emoji: reward.emoji })
        targetReward = created
        setRewards(prev => [...prev, created])
      }
      await redeemReward(familyId, profile.child.id, targetReward)
      showToast(`Đổi quà thành công! Hãy báo bố mẹ trao món quà "${targetReward.title}" nhé 🎁`)
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

  // Màn hình 3: Giao diện dành cho Bố Mẹ (ParentQuickInbox 1-Click)
  if (profile.type === 'parent') {
    return (
      <ParentQuickInbox
        childrenList={children}
        completions={completions}
        redemptions={redemptions}
        tasks={tasks}
        weeklyPlans={weeklyPlans}
        learningSessions={learningSessions}
        onApproveCompletion={(comp, action) => {
          setActiveApprovalCompletion({ ...comp, action })
          setParentFeedbackText('')
        }}
        onApproveRedemption={(red, approve) => handleReviewRedemption(red.id, approve)}
        onAssignLesson={(childId) => handleAutoAssignForChild(childId)}
        onSignOut={signOut}
        onSwitchProfile={() => selectProfile(null)}
      />
    )
  }


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
              {/*
                GIAO BÀI HỌC TRONG APP — lối giao bài chính.

                Ba khu nội dung đều khoá bài: con chỉ mở được một bài khi bố mẹ
                đã giao VÀ đã học xong bài liền trước. Trước đây "giao" nghĩa là
                bố mẹ phải tự gõ một nhiệm vụ có tiêu đề trùng khớp tên bài — với
                hơn 50 bài thì bất khả thi, nên hầu hết nội dung nằm sau ổ khoá.
                Bảng này giao bài bằng 1 cú bấm và trỏ CỨNG vào đúng mục nội dung.
              */}
              <section className="card glass assign-panel">
                <h3>🎯 Giao Bài Học Trong App</h3>
                <p className="assign-hint">
                  Con chỉ mở được bài khi bố mẹ đã giao <strong>và</strong> đã học xong bài liền trước.
                  Học xong trong app con tự nhận sao, bố mẹ không phải duyệt lại.
                </p>

                {children.length === 0 ? (
                  <p className="empty-message">Bố mẹ tạo hồ sơ cho con trước đã nhé!</p>
                ) : (
                  <>
                    {/* Chọn con — dùng chung ô "Giao cho bé" của form bên dưới */}
                    <div className="assign-kid-row">
                      {children.map(child => (
                        <button
                          key={child.id}
                          type="button"
                          className={`plan-kid-chip ${newTaskChildId === child.id ? 'active' : ''}`}
                          onClick={() => setNewTaskChildId(child.id)}
                        >
                          {child.avatar} {child.name}
                          <span className="plan-kid-grade">Lớp {child.grade || 2}</span>
                        </button>
                      ))}
                      {assignChild && (
                        <span className="assign-age-note">
                          Nội dung theo Lớp {assignChild.grade || 2}
                          {assignAgeGroup === 'teens' ? ' (tuổi teen)' : ' (tiểu học)'}
                        </span>
                      )}
                    </div>

                    {/* Ba khu nội dung + tiến độ của bé đang chọn */}
                    <div className="suggestions-tabs">
                      {AREA_ORDER.map(kind => {
                        const area = LEARNING_AREAS[kind]
                        const items = areaItems(kind, assignAgeGroup)
                        const doneCount = items.filter(it => completions.some(
                          c => c.child_id === newTaskChildId && c.task_id === area.prefix + it.id
                        )).length
                        return (
                          <button
                            key={kind}
                            type="button"
                            className={`suggestion-tab-btn ${assignArea === kind ? 'active' : ''}`}
                            onClick={() => setAssignArea(kind)}
                          >
                            {area.icon} {area.label}
                            <span className="assign-progress">{doneCount}/{items.length}</span>
                          </button>
                        )
                      })}
                    </div>

                    {(() => {
                      const area = LEARNING_AREAS[assignArea]
                      const areaTask = findAreaTask(tasks, newTaskChildId, assignArea)
                      return (
                        <>
                          <div className="assign-area-row">
                            {areaTask ? (
                              <>
                                <span className="assign-area-open">
                                  ✅ Cả khu {area.icon} {area.label} đang mở — con tự học lần lượt
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-xs"
                                  onClick={() => handleDeactivateTask(areaTask.id)}
                                >
                                  Thu lại
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleAssignArea(assignArea)}
                              >
                                🔓 Mở cả khu — con tự học lần lượt
                              </button>
                            )}
                          </div>

                          <div className="assign-item-list">
                            {assignList.map((item, idx) => {
                              const { isDone, isAssigned, isUnlocked } = learningItemState({
                                tasks, completions, childId: newTaskChildId,
                                kind: assignArea, prefix: area.prefix,
                                items: assignList, index: idx,
                              })
                              const itemTask = findItemTask(tasks, newTaskChildId, assignArea, item)

                              let status = '🔒 Chưa giao'
                              let statusClass = 'locked'
                              if (isDone) { status = '✅ Đã xong'; statusClass = 'done' }
                              else if (isUnlocked) { status = '🔓 Đang mở'; statusClass = 'open' }
                              else if (isAssigned) { status = '⏳ Chờ xong bài trước'; statusClass = 'waiting' }

                              return (
                                <div key={item.id} className={`assign-item ${statusClass}`}>
                                  <span className="assign-item-emoji">{item.emoji}</span>
                                  <div className="assign-item-main">
                                    <strong>{idx + 1}. {item.title}</strong>
                                    <span className={`assign-item-status ${statusClass}`}>{status}</span>
                                  </div>
                                  <span className="stars-badge">⭐️ {item.stars}</span>
                                  {isDone ? null : itemTask ? (
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-xs"
                                      onClick={() => handleDeactivateTask(itemTask.id)}
                                    >
                                      ✅ Đã giao — Thu lại
                                    </button>
                                  ) : areaTask ? (
                                    <span className="assign-item-note">theo cả khu</span>
                                  ) : (
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-xs"
                                      onClick={() => handleAssignItem(assignArea, item)}
                                    >
                                      Giao bài này
                                    </button>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )
                    })()}
                  </>
                )}
              </section>

              <section className="card glass">
                <h3>Thêm Nhiệm Vụ Mới</h3>

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
                          setNewTaskType(task.taskType || '')
                          showToast(`Đã chọn: ${task.title} ✨`)
                        }}
                        title={task.desc}
                      >
                        <span className="task-title-pill">{task.title}</span>
                        {task.taskType && <span className="task-link-pill">🔗</span>}
                        <span className="task-stars-pill">+{task.stars}⭐</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCreateTask} className="form-group text-left">
                  {newTaskType && LEARNING_AREAS[newTaskType] && (
                    <div className="task-link-note">
                      <span>🔗 Mở khu {areaBadge(newTaskType)} cho con</span>
                      <button
                        type="button"
                        className="task-link-clear"
                        onClick={() => setNewTaskType('')}
                        title="Bỏ liên kết, chỉ tạo nhiệm vụ thường"
                      >
                        ✕
                      </button>
                    </div>
                  )}

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
                            {/* Phân biệt rõ bài học trong app với việc nhà: loại
                                này con tự nhận sao, bố mẹ không phải duyệt */}
                            {isContentTask(task) && (
                              <span className="badge-tag badge-content">
                                🔗 {areaBadge(task.task_type)}
                                {task.content_ref ? '' : ' · cả khu'}
                              </span>
                            )}
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

  // Màn hình 4: Giao diện dành cho các con (Luồng Thẻ 1-Chạm StoryStreamView)
  if (profile.type === 'child') {
    const levelInfo = getLevelInfo(childBalance)
    const streakInfo = calculateStreak(completions, childTransactions)
    const badgesList = calculateBadges(completions, childTransactions, streakInfo.currentStreak)

    // Dynamic Today Assigned Items for Story Cards
    const childTasks = tasks.filter(t => t.child_id === profile.child.id)
    const sgkTask = childTasks.find(t => t.task_type === 'sgk' || t.task_type === 'math')
    const bookTask = childTasks.find(t => t.task_type === 'book')
    const choreTask = childTasks.find(t => !t.task_type || t.task_type === 'chore')

    const todayLesson = {
      title: sgkTask?.title || 'Bài 5: Phép cộng có nhớ trong phạm vi 100',
      subtitle: sgkTask?.description || 'Học 10 phút để rèn tư duy và tích lũy +10 Sao thưởng nhé!',
      isDone: sgkTask ? completions.some(c => c.child_id === profile.child.id && c.task_id === sgkTask.id && c.status === 'approved') : false
    }

    const todayBook = {
      title: bookTask?.title || 'Cổ tích Lô-gíc: Bí mật kẻ ăn vụng cá',
      subtitle: bookTask?.description || 'Đọc một câu chuyện ngắn thú vị để nhận +5 Sao thưởng nào!',
      isDone: bookTask ? completions.some(c => c.child_id === profile.child.id && c.task_id === bookTask.id && c.status === 'approved') : false
    }

    const todayChore = {
      title: choreTask?.title || 'Tự dọn dẹp đồ chơi sau khi chơi xong',
      description: choreTask?.description || 'Hoàn thành việc nhà bố mẹ giao để mở Rương Kho Báu Ngày!',
      isDone: choreTask ? completions.some(c => c.child_id === profile.child.id && c.task_id === choreTask.id && c.status === 'approved') : false
    }

    return (
      <div className={`dashboard-container kid-theme ${tone.bodyClass}`}>
        {/* Story Stream Main View (Default No-Tab Mode) */}
        {activeTab === 'stream' ? (
          <StoryStreamView
            profile={profile}
            familyId={familyId}
            tone={tone}
            childBalance={childBalance}
            streakInfo={streakInfo}
            todayLesson={todayLesson}
            todayBook={todayBook}
            todayChore={todayChore}
            targetGoal={targetGoal}
            onOpenShop={() => setActiveTab('shop')}
            onOpenLesson={() => setActiveTab('sgk')}
            onOpenBook={() => setActiveTab('books')}
            onCompleteChore={() => handleToggleTaskCompletion(tasks[0]?.id || '')}
            onOpenParentPin={handleOpenParentPin}
            onOpenFreePlay={() => setIsFreePlayOpen(true)}
            celebrate={celebrate}
          />
        ) : (
          /* Top Back Bar when exploring sub-features */
          <div className="sub-feature-header-bar glass text-center padding-sm flex items-center justify-between gap-md">
            <button
              type="button"
              className="btn btn-secondary btn-sm glow"
              onClick={() => setActiveTab('stream')}
            >
              ⬅️ Trở Về Hôm Nay (Thẻ Nhiệm Vụ)
            </button>
            <button
              type="button"
              className="btn btn-outline-warning btn-sm"
              onClick={handleOpenParentPin}
            >
              🔑 Bố Mẹ
            </button>
          </div>
        )}

        {/* Free Play Drawer Modal */}
        <FreePlayDrawer
          isOpen={isFreePlayOpen}
          onClose={() => setIsFreePlayOpen(false)}
          onSelectFeature={(featureId) => setActiveTab(featureId)}
        />

        {/* Nội dung chính của con */}
        <main className="dashboard-main-content">
          
          {/* Tab con: Gia Sư AI Pika */}
          {activeTab === 'pika' && (
            <div className="tab-pane">
              <PikaTutorModal
                profile={profile}
                sgkContext={pikaSgkContext}
                isModal={false}
                onRewardStars={async (stars, reason) => {
                  await addStars(familyId, profile.child.id, stars, reason)
                  setChildBalance(prev => prev + stars)
                  showToast(`🎉 Con nhận được +${stars} ⭐ từ Gia Sư Pika!`)
                }}
                onLogSession={async (sessionData) => {
                  await safeLogLearningSession(familyId, profile.child.id, sessionData)
                }}
              />
            </div>
          )}

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
                              // Bài học trong app tự cộng sao -> không cho nộp minh chứng
                              const isLesson = isContentTask(task)
                              return (
                                <div key={task.id} className="plan-today-task">
                                  <div>
                                    <strong>{task.title}</strong>
                                    <span className="task-star-tag">
                                      ⭐ {isLesson ? `tối đa ${task.stars}` : task.stars}
                                    </span>
                                    {isPending && !isLesson && <span className="recurrence-badge">⌛ Chờ duyệt</span>}
                                  </div>
                                  {isLesson ? (
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      onClick={() => openTaskContent(task)}
                                    >
                                      📖 Vào học ngay ➜
                                    </button>
                                  ) : !isPending && (
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
                    // Bài học trong app: con vào học là tự nhận sao, không nộp minh chứng
                    const isLesson = isContentTask(task)

                    return (
                      <div key={task.id} className={`task-kid-card glass ${isPending && !isLesson ? 'card-pending' : ''}`}>
                        <div className="task-star-tag">
                          ⭐ {isLesson ? `tối đa ${task.stars}` : task.stars}
                        </div>
                        <h4>{task.title}</h4>
                        {task.description && <p className="desc">{task.description}</p>}
                        <div className="recurrence-badge">{recurrenceText}</div>

                        {isLesson ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-primary btn-block"
                              onClick={() => openTaskContent(task)}
                            >
                              📖 Vào học ngay ➜
                            </button>
                            <p className="task-selfstar-note">Học xong trong app là tự nhận sao ⭐</p>
                          </>
                        ) : isPending ? (
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
          {activeTab === 'shop' && (
            <div className="tab-pane">
              <h3 className="section-title text-center">🎁 Cửa Hàng Quà &amp; Kế Hoạch Đổi Quà</h3>
              <p className="subtitle text-center">Bé chọn 1 phần quà làm <strong>🎯 Mục tiêu phấn đấu</strong> hoặc Bố Mẹ chỉnh sửa / thêm quà mới dễ dàng!</p>

              {/* Thanh công cụ quản lý của Bố Mẹ */}
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <span className="text-xs text-amber-200 font-semibold">
                  🎁 Tổng cộng {rewards.length > 0 ? rewards.length : 5} phần thưởng trong cửa hàng
                </span>
                <button
                  type="button"
                  className="btn btn-warning btn-sm font-bold shadow flex items-center gap-1 cursor-pointer"
                  onClick={() => setShowAddRewardForm(!showAddRewardForm)}
                >
                  {showAddRewardForm ? '✕ Đóng Form' : '➕ Thêm Quà Mới'}
                </button>
              </div>

              {/* Form Thêm Quà Mới */}
              {showAddRewardForm && (
                <form onSubmit={handleAddCustomReward} className="bg-slate-800/90 border border-amber-400/50 p-4 rounded-2xl mb-4 text-left animate-fade-in shadow-xl">
                  <h4 className="text-amber-300 font-extrabold text-sm mb-3">➕ Thêm Phần Thưởng Mới Cho Bé</h4>
                  
                  {/* Danh sách quà gợi ý sẵn */}
                  <div className="mb-4">
                    <label className="text-xs text-amber-200 font-bold block mb-1.5">⚡ Danh Sách Quà Gợi Ý Sẵn (Bấm 1 nhấp để điền nhanh Icon &amp; Tiêu đề):</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-900/60 rounded-xl border border-white/10">
                      {DEFAULT_SAMPLE_REWARDS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-amber-500/20 rounded-lg text-center cursor-pointer border border-white/5 hover:border-amber-400/50 transition flex flex-col justify-between"
                          onClick={() => {
                            setNewRewardTitle(preset.title)
                            setNewRewardCost(preset.cost)
                            setNewRewardEmoji(preset.emoji)
                            showToast(`Đã chọn "${preset.title}". Bố mẹ có thể điều chỉnh số Sao hoặc tiêu đề bên dưới!`)
                          }}
                        >
                          <span className="text-xl">{preset.emoji}</span>
                          <span className="text-[11px] font-semibold text-gray-200 line-clamp-2 mt-1">{preset.title}</span>
                          <span className="text-[10px] font-extrabold text-amber-300 mt-1">✨ {preset.cost} Sao</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-300 font-bold block mb-1">Tên phần quà:</label>
                      <input
                        type="text"
                        className="form-control text-sm py-1.5"
                        placeholder="VD: 15p chơi game, Ăn pizza..."
                        value={newRewardTitle}
                        onChange={(e) => setNewRewardTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-300 font-bold block mb-1">Biểu tượng (Icon Emoji):</label>
                      <input
                        type="text"
                        className="form-control text-sm py-1.5 mb-1"
                        placeholder="🍕, 🎮, 🍦, 🧸..."
                        value={newRewardEmoji}
                        onChange={(e) => setNewRewardEmoji(e.target.value)}
                        required
                      />
                      {/* Thước chọn Icon Emoji nhanh */}
                      <div className="flex items-center gap-1 flex-wrap p-1.5 bg-slate-900/80 rounded-lg border border-white/10">
                        {PRESET_REWARD_EMOJIS.map(emo => (
                          <button
                            key={emo}
                            type="button"
                            className={`text-base p-1 rounded hover:bg-amber-400/20 transition cursor-pointer ${newRewardEmoji === emo ? 'bg-amber-400/40 border border-amber-400' : ''}`}
                            onClick={() => setNewRewardEmoji(emo)}
                          >
                            {emo}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-300 font-bold block mb-1">Số Sao để đổi:</label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        className="form-control text-sm py-1.5"
                        value={newRewardCost}
                        onChange={(e) => setNewRewardCost(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddRewardForm(false)}>Hủy</button>
                    <button type="submit" className="btn btn-primary btn-sm font-bold">Lưu phần quà ✨</button>
                  </div>
                </form>
              )}

              {/* Modal Chỉnh Sửa Quà */}
              {editingReward && (
                <div className="pin-overlay" onClick={() => setEditingReward(null)}>
                  <div className="card glass p-6 max-w-md w-full text-left" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-extrabold text-amber-300 mb-3">✏️ Chỉnh Sửa Phần Quà</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-300 font-bold block mb-1">Tên phần quà:</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingReward.title}
                          onChange={(e) => setEditingReward({ ...editingReward, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 font-bold block mb-1">Biểu tượng (Icon Emoji):</label>
                        <input
                          type="text"
                          className="form-control mb-1"
                          value={editingReward.emoji}
                          onChange={(e) => setEditingReward({ ...editingReward, emoji: e.target.value })}
                        />
                        {/* Thước chọn Icon Emoji nhanh trong Modal Sửa */}
                        <div className="flex items-center gap-1 flex-wrap p-1.5 bg-slate-900/80 rounded-lg border border-white/10">
                          {PRESET_REWARD_EMOJIS.map(emo => (
                            <button
                              key={emo}
                              type="button"
                              className={`text-base p-1 rounded hover:bg-amber-400/20 transition cursor-pointer ${editingReward.emoji === emo ? 'bg-amber-400/40 border border-amber-400' : ''}`}
                              onClick={() => setEditingReward({ ...editingReward, emoji: emo })}
                            >
                              {emo}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-300 font-bold block mb-1">Số Sao đổi quà:</label>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={editingReward.cost}
                          onChange={(e) => setEditingReward({ ...editingReward, cost: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingReward(null)}>Đóng</button>
                      <button type="button" className="btn btn-success btn-sm font-bold" onClick={handleSaveEditReward}>Lưu Thay Đổi 💾</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mục tiêu hiện tại */}
              {targetGoal && (
                <div className="target-goal-shop-card glass card margin-bottom flex items-center justify-between gap-3 p-4 border border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{targetGoal.emoji || '🎁'}</span>
                    <div>
                      <h4 className="m-0 text-amber-300 font-extrabold text-base">🎯 Mục Tiêu Phấn Đấu Hiện Tại: {targetGoal.title}</h4>
                      <p className="m-0 text-xs text-gray-200 mt-1">
                        Giá trị: <strong>{targetGoal.cost} ⭐</strong> • Bé có <strong>{childBalance}/{targetGoal.cost} ⭐</strong>
                        {childBalance < targetGoal.cost && ` (Còn thiếu ${targetGoal.cost - childBalance} ⭐)`}
                      </p>
                    </div>
                  </div>
                  {childBalance >= targetGoal.cost && (
                    <button
                      type="button"
                      className="btn btn-success glow animate-pulse font-bold px-4 py-2 text-sm"
                      onClick={() => handleChildRedeem(targetGoal)}
                    >
                      🎁 Đổi Quà Ngay!
                    </button>
                  )}
                </div>
              )}

              {/* Hiển thị danh sách quà (nếu DB chưa có thì dùng bộ 5 quà mẫu) */}
              {(() => {
                const displayRewards = rewards.length > 0 ? rewards : DEFAULT_SAMPLE_REWARDS
                return (
                  <>
                    {rewards.length === 0 && (
                      <div className="bg-amber-500/20 border border-amber-400/40 rounded-2xl p-4 mb-4 text-center">
                        <p className="text-amber-200 font-extrabold text-sm m-0 mb-2">
                          💡 Đã khởi tạo 5 quà mẫu chuẩn để bé chọn ngay!
                        </p>
                        {profile?.type === 'parent' && (
                          <button
                            type="button"
                            className="btn btn-warning btn-sm font-bold shadow"
                            onClick={handleCreateDefaultRewards}
                          >
                            ⚡ Lưu 5 Phần Quà Mẫu Này Vào Cửa Hàng
                          </button>
                        )}
                      </div>
                    )}

                    <div className="rewards-grid">
                      {displayRewards.map((reward) => {
                        const canAfford = childBalance >= reward.cost
                        const pointsNeeded = reward.cost - childBalance
                        const isCurrentTarget = targetGoal?.id === reward.id

                        return (
                          <div key={reward.id} className={`reward-kid-card glass ${!canAfford ? 'locked' : ''} ${isCurrentTarget ? 'border-amber-400 border-2 shadow-lg' : ''}`}>
                            <span className="reward-emoji">{reward.emoji}</span>
                            <h4>{reward.title}</h4>
                            <div className="reward-price">✨ {reward.cost} Sao</div>
                            
                            <div className="flex flex-col gap-2 w-full mt-3">
                              <button
                                type="button"
                                className={`btn btn-block btn-xs ${isCurrentTarget ? 'btn-warning text-amber-950 font-bold' : 'btn-secondary opacity-90'}`}
                                onClick={() => handleSetTargetGoal(reward)}
                              >
                                {isCurrentTarget ? '🎯 Đang làm mục tiêu' : '🎯 Đặt làm mục tiêu'}
                              </button>

                              {canAfford ? (
                                <button 
                                  type="button"
                                  className="btn btn-primary btn-block animate-pulse font-bold"
                                  onClick={() => handleChildRedeem(reward)}
                                >
                                  Đổi Quà 🎁
                                </button>
                              ) : (
                                <button type="button" className="btn btn-block btn-locked" disabled>
                                  🔒 Thiếu {pointsNeeded} ⭐
                                </button>
                              )}

                              {/* Nút Quản Lý Sửa / Xóa Cho Bố Mẹ */}
                              <div className="flex items-center gap-1 mt-1 border-t border-white/10 pt-2">
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-xs font-bold text-amber-300 flex-1 cursor-pointer"
                                  onClick={() => setEditingReward({ ...reward })}
                                  title="Chỉnh sửa phần quà này"
                                >
                                  ✏️ Sửa
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-xs font-bold flex-1 cursor-pointer"
                                  onClick={() => handleDeleteReward(reward)}
                                  title="Xóa phần quà này"
                                >
                                  🗑️ Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              })()}
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
                      // Cùng một hàm luật khoá với Toán tư duy & Khám phá
                      const { isAssigned, isUnlocked, prevItem } = learningItemState({
                        tasks, completions, childId: profile.child.id,
                        kind: 'book', prefix: LEARNING_AREAS.book.prefix,
                        items: booksData[kidAgeGroup], index: idx,
                      })

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
                              onClick={() => showToast(
                                // Cùng cách chỉ đường như Toán & Khám phá
                                isAssigned
                                  ? `📖 Con đọc xong "${prevItem?.title}" là truyện này mở ra ngay!`
                                  : '🔒 Truyện này chưa được giao. Con nhờ Bố Mẹ mở: Nhiệm vụ ➜ 🎯 Giao bài học ➜ 📚 Góc đọc sách nhé! 😊'
                              )}
                            >
                              {isAssigned ? '⏳ Đọc xong truyện trước đã nhé' : '🔒 Chờ Bố Mẹ giao bài này'}
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
                          {/* Truyện mới chưa có ảnh riêng thì bỏ trống trường image.
                              Không render <img> khi thiếu src: thẻ img không có src
                              KHÔNG bắn sự kiện error, nên onError phía dưới sẽ không
                              chạy và khung ảnh sẽ trống trơn thay vì hiện 📖. */}
                          {readingBook.pages[readingPageIndex].image && (
                            <img
                              src={readingBook.pages[readingPageIndex].image}
                              alt={`Minh họa trang ${readingPageIndex + 1}`}
                              className="book-illustration"
                              onError={(e) => {
                                // Fallback khi có đường dẫn nhưng file ảnh chưa tồn tại
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                          )}
                          <div
                            className="book-illustration-fallback"
                            style={{ display: readingBook.pages[readingPageIndex].image ? 'none' : 'flex' }}
                          >
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

          {/* Tab con 5: Sân Chơi Toán Tư Duy (Kurio Math Hub Nâng Cấp) */}
          {activeTab === 'math' && (
            <div className="tab-pane">
              <MathHub
                profile={profile}
                familyId={familyId}
                tone={tone}
                kidAgeGroup={kidAgeGroup}
                setKidAgeGroup={setKidAgeGroup}
                selectedMathTopic={selectedMathTopic}
                setSelectedMathTopic={setSelectedMathTopic}
                onFinishedTopic={(topic, catalogKey, result) => handleTopicFinished(topic, catalogKey, result)}
                renderTopicGrid={renderTopicGrid}
                addStars={addStars}
                safeLogLearningSession={safeLogLearningSession}
                showToast={showToast}
              />
            </div>
          )}

          {/* Tab con 6: Khám Phá Thế Giới — kiến thức nền ngoài sách giáo khoa */}
          {activeTab === 'explore' && (
            <div className="tab-pane">
              {!selectedExploreTopic ? (
                <>
                  <h3 className="section-title text-center">🌍 Khám Phá Thế Giới</h3>
                  <p className="subtitle text-center">
                    {tone.isTeen
                      ? 'Kiến thức nền ngoài sách giáo khoa: khoa học, lịch sử - địa lý, môi trường và an toàn số.'
                      : 'Cơ thể em, loài vật, cây cỏ, Trái Đất và quê hương Việt Nam — bé khám phá và nhận Sao nhé!'}
                  </p>

                  <div className="age-group-toggle">
                    <button
                      type="button"
                      className={`toggle-age-btn ${kidAgeGroup === 'kids' ? 'active' : ''}`}
                      onClick={() => setKidAgeGroup('kids')}
                    >
                      🧸 Khám Phá Tí Hon
                    </button>
                    <button
                      type="button"
                      className={`toggle-age-btn ${kidAgeGroup === 'teens' ? 'active' : ''}`}
                      onClick={() => setKidAgeGroup('teens')}
                    >
                      🧭 Hiểu Biết Tuổi Teen
                    </button>
                  </div>

                  {renderTopicGrid({
                    topics: exploreData[kidAgeGroup],
                    catalogKey: 'explore',
                    cardSubtitle: (topic) => `${topic.quizzes.length} câu hỏi khám phá`,
                    onOpen: setSelectedExploreTopic,
                    lockedToast: '🔒 Chủ đề Khám Phá này chưa được giao. Con nhờ Bố Mẹ mở: Nhiệm vụ ➜ 🎯 Giao bài học ➜ 🌍 Khám phá nhé! 😊',
                  })}
                </>
              ) : (
                <TopicReader
                  key={selectedExploreTopic.id}
                  topic={selectedExploreTopic}
                  tone={tone}
                  theme="explore"
                  onClose={() => setSelectedExploreTopic(null)}
                  onFinished={(result) => handleTopicFinished(selectedExploreTopic, 'explore', result)}
                />
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

                  {/* Phân nhóm: SGK Chuẩn Bộ GD&ĐT vs Sách Nâng Cao Bổ Trợ */}
                  {(() => {
                    const coreBooks = sgkBooks.filter(b => !b.id.includes('_adv'))
                    const advBooks = sgkBooks.filter(b => b.id.includes('_adv'))

                    const renderBookCard = (book) => (
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
                    )

                    return (
                      <>
                        <div className="sgk-section-divider text-left margin-bottom">
                          <h3 className="text-white text-lg font-extrabold flex items-center gap-2 m-0">
                            <span>📘 CHƯƠNG TRÌNH SGK CHUẨN BỘ GD&ĐT</span>
                            <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold">
                              Tuần 1 - 35 Học Trên Lớp
                            </span>
                          </h3>
                        </div>

                        <div className="sgk-subject-grid mb-8">
                          {coreBooks.map(renderBookCard)}
                        </div>

                        {advBooks.length > 0 && (
                          <>
                            <div className="sgk-section-divider text-left margin-bottom pt-4 border-t border-white/10">
                              <h3 className="text-white text-lg font-extrabold flex items-center gap-2 m-0">
                                <span>🌟 SÁCH BỔ TRỢ & TƯ DUY NÂNG CAO</span>
                                <span className="text-xs bg-purple-400/20 text-purple-300 border border-purple-400/40 px-2.5 py-0.5 rounded-full font-bold">
                                  Nguồn G:\Sách giáo khoa
                                </span>
                              </h3>
                            </div>

                            <div className="sgk-subject-grid">
                              {advBooks.map(renderBookCard)}
                            </div>
                          </>
                        )}
                      </>
                    )
                  })()}
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
                          style={{
                            background: isDone ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' : !isUnlocked ? 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' : color.bg,
                            cursor: (isUnlocked || isDone) ? 'pointer' : 'not-allowed'
                          }}
                          onClick={() => {
                            if (isUnlocked || isDone) {
                              setSelectedLesson(lesson)
                              setSgkLessonView('content')
                              resetSgkQuiz()
                            }
                          }}
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

                          {/* Nút xem trang PDF gốc theo tuần */}
                          {(() => {
                            const pdfInfo = textbookPdfFor(selectedTextbook)
                            if (!pdfInfo) return null
                            const targetPage = getExactPdfPage(selectedTextbook.id, idx, lesson.pdfPage)
                            return (
                              <button
                                type="button"
                                className="btn btn-amber text-[11px] font-extrabold shadow-sm my-1 py-1 px-2 rounded-xl border border-amber-400/40 w-full text-amber-950 bg-gradient-to-r from-amber-300 to-yellow-400 hover:brightness-110 flex items-center justify-center gap-1 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSgkPdfOpen({
                                    url: '/' + pdfInfo.file,
                                    page: targetPage,
                                    label: `${selectedTextbook.subject} - Tuần ${lesson.week} (Trang ${targetPage})`
                                  })
                                }}
                              >
                                📕 Trang sách gốc PDF (Trang {targetPage})
                              </button>
                            )
                          })()}

                          {isDone ? (
                            <button
                              type="button"
                              className="sgk-lesson-start-btn done cursor-pointer"
                              style={{ background: '#059669', color: '#ffffff', fontWeight: 'bold' }}
                              onClick={() => {
                                setSelectedLesson(lesson)
                                setSgkLessonView('content')
                                resetSgkQuiz()
                              }}
                            >
                              🏆 Đã xong • Bấm để đọc lại &amp; ôn tập 📚
                            </button>
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
                    {/* Nút xem trực tiếp trang sách PDF gốc của tuần này */}
                    {(() => {
                      const pdfInfo = textbookPdfFor(selectedTextbook)
                      if (!pdfInfo) return null
                      const idx = selectedTextbook.lessons.findIndex(l => l.id === selectedLesson.id)
                      const targetPage = getExactPdfPage(selectedTextbook.id, idx >= 0 ? idx : 0, selectedLesson.pdfPage)
                      return (
                        <button
                          type="button"
                          className="btn btn-amber btn-sm font-extrabold shadow flex items-center gap-1 cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 border border-amber-300/50"
                          onClick={() => {
                            setSgkPdfOpen({
                              url: '/' + pdfInfo.file,
                              page: targetPage,
                              label: `${selectedTextbook.subject} - ${selectedLesson.title} (Trang ${targetPage})`
                            })
                          }}
                        >
                          📕 Trang sách gốc PDF ({targetPage})
                        </button>
                      )
                    })()}

                    <button
                      type="button"
                      className="btn btn-warning btn-sm shadow flex items-center gap-1"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #eab308)', color: '#fff', border: 'none', fontWeight: 'bold' }}
                      onClick={() => handleOpenPika({
                        id: selectedLesson.id,
                        title: selectedLesson.title,
                        subject: selectedTextbook?.subject,
                        grade: sgkGrade,
                        theory: selectedLesson.theory || selectedLesson.summary || (typeof selectedLesson.content === 'string' ? selectedLesson.content.slice(0, 300) : ''),
                        quizzes: selectedLesson.quizzes || []
                      })}
                    >
                      🐥 Hỏi Gia Sư Pika 💡
                    </button>
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
                                      await safeLogLearningSession(familyId, profile.child.id, {
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
          <PdfViewerModal pdf={sgkPdfOpen} onClose={() => setSgkPdfOpen(null)} onOpenPika={handleOpenPika} />

          {/* Floating Pika Mascot Button cho bé (chỉ hiện khi chưa ở tab Pika) */}
          {activeTab !== 'pika' && (
            <div className="pika-floating-btn-wrap" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PikaAvatar
                state="idle"
                size="sm"
                onClick={() => handleOpenPika(selectedLesson ? {
                  id: selectedLesson.id,
                  title: selectedLesson.title,
                  subject: selectedTextbook?.subject,
                  grade: sgkGrade,
                  theory: selectedLesson.theory || selectedLesson.summary || (typeof selectedLesson.content === 'string' ? selectedLesson.content.slice(0, 300) : ''),
                  quizzes: selectedLesson.quizzes || []
                } : null)}
              />
              <span 
                onClick={() => handleOpenPika(null)}
                style={{ background: '#f59e0b', color: '#78350f', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', cursor: 'pointer', marginTop: '4px' }}
              >
                Hỏi Pika 🐥
              </span>
            </div>
          )}

          {/* Modal Gia Sư AI Pika */}
          {showPikaModal && (
            <PikaTutorModal
              profile={profile}
              sgkContext={pikaSgkContext}
              onClose={() => setShowPikaModal(false)}
              onRewardStars={async (stars, reason) => {
                await addStars(familyId, profile.child.id, stars, reason)
                setChildBalance(prev => prev + stars)
                showToast(`🎉 Con nhận được +${stars} ⭐ từ Gia Sư Pika!`)
              }}
              onLogSession={async (sessionData) => {
                await safeLogLearningSession(familyId, profile.child.id, sessionData)
              }}
            />
          )}

          {/* Modal Nhập PIN khi bấm 🔑 Bố Mẹ */}
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
