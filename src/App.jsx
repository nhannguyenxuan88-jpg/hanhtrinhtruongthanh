import { useState, useEffect, useCallback } from 'react'
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
  upsertWeeklyPlan
} from './lib/api'
import { supabase } from './lib/supabase'
import { booksData } from './lib/booksData'
import { mathData } from './lib/mathData'
import { textbookData } from './lib/textbookData'
import { textbookData8 } from './lib/textbookData8'
import GameArcade from './components/GameArcade'
import './App.css'

const ANIMAL_EMOJIS = ['🦊', '🐨', '🦁', '🐯', '🐼', '🐰', '🐸', '🦄', '🐷', '🐱', '🐶', '🐵']

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
  const [sgkCompletedLessons, setSgkCompletedLessons] = useState({})
  const [sgkGrade, setSgkGrade] = useState(2)                          // khối lớp đang xem: 2 | 8
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
        const [kids, tks, comps, rws, red, plns] = await Promise.all([
          fetchChildren(),
          fetchTasks(),
          fetchCompletions(),
          fetchRewards(),
          fetchRedemptions(),
          fetchWeeklyPlans()
        ])
        setChildren(kids)
        setTasks(tks)
        setCompletions(comps)
        setRewards(rws)
        setRedemptions(red)
        setWeeklyPlans(plns)
        if (kids.length > 0 && !newTaskChildId) {
          setNewTaskChildId(kids[0].id)
        }
      } else if (profile?.type === 'child') {
        const childId = profile.child.id
        const [tks, comps, rws, bal, txs, plns] = await Promise.all([
          fetchTasks(),
          fetchCompletions(),
          fetchRewards(),
          fetchBalance(childId),
          fetchTransactions(childId),
          fetchWeeklyPlans()
        ])
        setTasks(tks)
        setCompletions(comps)
        setRewards(rws)
        setChildBalance(bal)
        setChildTransactions(txs)
        setWeeklyPlans(plns)
      } else {
        // Chỉ ở màn hình chọn hồ sơ
        const kids = await fetchChildren()
        setChildren(kids)
      }
    } catch (err) {
      showToast('Có lỗi xảy ra khi tải dữ liệu: ' + err.message)
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
      confetti({
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
    try {
      const mockTask = {
        id: 'book-' + book.id,
        title: `Đọc sách: ${book.title}`,
        stars: book.stars || 8,
        child_id: profile.child.id
      }
      await addStars(familyId, profile.child.id, mockTask.stars, `Hoàn thành đọc sách: ${book.title}`)
      await submitCompletion(
        familyId, 
        mockTask, 
        null, 
        `Bé đã đọc xong truyện "${book.title}" và trả lời đúng câu đố! Bài học: ${book.quiz?.moral || ''}`,
        'approved'
      )
      showToast(`🎉 Rực rỡ! Bé được nhận +${mockTask.stars} ⭐ khi đọc xong "${book.title}"!`)
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      })
      setReadingBook(null)
      loadAppData()
    } catch (err) {
      showToast('Lỗi nhận sao đọc sách: ' + err.message)
    }
  }

  // Bé hoàn thành học toán và trả lời đúng toàn bộ câu hỏi trắc nghiệm
  const handleMathTopicFinished = async (topic) => {
    try {
      const mockTask = {
        id: 'math-' + topic.id,
        title: `Toán tư duy: ${topic.title}`,
        stars: topic.stars || 8,
        child_id: profile.child.id
      }
      await addStars(familyId, profile.child.id, mockTask.stars, `Hoàn thành Toán tư duy: ${topic.title}`)
      await submitCompletion(
        familyId, 
        mockTask, 
        null, 
        `Bé đã hoàn thành học toán tư duy và trả lời đúng các thử thách của chủ đề: ${topic.title}`,
        'approved'
      )
      showToast(`🎉 Tuyệt vời! Bé được nhận +${mockTask.stars} ⭐ khi làm xong Toán tư duy!`)
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      })
      setSelectedMathTopic(null)
      loadAppData()
    } catch (err) {
      showToast('Lỗi nhận sao học toán: ' + err.message)
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
      confetti({
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
  const handleDeductStarsForGame = async (cost) => {
    try {
      await addStars(familyId, profile.child.id, -cost, 'Đổi vé chơi Game Arcade')
      setChildBalance(prev => Math.max(0, prev - cost))
      showToast(`🎟️ Đã trừ ${cost} Sao để đổi 1 vé chơi Game 5 phút!`)
    } catch (err) {
      showToast('Lỗi trừ sao đổi vé game: ' + err.message)
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

        </main>
      </div>
    )
  }

  // Màn hình 4: Giao diện dành cho các con
  if (profile.type === 'child') {
    return (
      <div className="dashboard-container kid-theme">
        {/* Header con */}
        <header className="dashboard-header glass kid-header">
          <div className="header-brand">
            <span className="child-avatar-display">{profile.child.avatar}</span>
            <div>
              <h2>Bé: {profile.child.name} {loadingData && <span className="spinner-sm"></span>} 🌟</h2>
              <p className="subtitle">Bé đang làm rất tốt! Cố gắng tích lũy thêm sao nhé.</p>
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
            📅 Hôm Nay
          </button>
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            📋 Nhiệm Vụ Của Con
          </button>
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('books')
              setReadingBook(null)
            }}
          >
            📚 Góc Đọc Sách
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
            🧮 Toán Tư Duy
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
            📗 Sách Giáo Khoa
          </button>
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'arcade' ? 'active' : ''}`}
            onClick={() => setActiveTab('arcade')}
          >
            🎮 Khu Game
          </button>
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            🎁 Đổi Quà Tặng
          </button>
          <button 
            type="button"
            className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📖 Nhật Ký Sao
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

          {/* Tab con 2: Cửa hàng Quà */}
          {activeTab === 'shop' && (
            <div className="tab-pane">
              <h3 className="section-title text-center">🍦 Hãy đổi những phần thưởng bé thích nhé</h3>
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
                      const prevBook = idx > 0 ? booksData[kidAgeGroup][idx - 1] : null
                      const isUnlocked = idx === 0 || completions.some(
                        c => c.child_id === profile.child.id && c.task_id === 'book-' + prevBook.id
                      )

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
                              }}
                            >
                              Đọc sách ➜
                            </button>
                          ) : (
                            <button type="button" className="btn btn-block btn-locked" disabled>
                              🔒 Đọc xong quyển trước để mở
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
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setReadingPageIndex(prev => prev + 1)}
                        >
                          {readingPageIndex === readingBook.pages.length - 1 ? 'Trả lời câu hỏi ➜' : 'Lướt tiếp ➜'}
                        </button>
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
                      const prevTopic = idx > 0 ? mathData[idx - 1] : null
                      const isUnlocked = idx === 0 || completions.some(
                        c => c.child_id === profile.child.id && c.task_id === 'math-' + prevTopic.id
                      )

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
                              }}
                            >
                              Vào học ngay ➜
                            </button>
                          ) : (
                            <button type="button" className="btn btn-block btn-locked" disabled>
                              🔒 Hoàn thành chủ đề trước để mở
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
                                    } else {
                                      setMathQuizShowFeedback(true)
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
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => setMathPageIndex(prev => prev + 1)}
                        >
                          {mathPageIndex === selectedMathTopic.lesson.steps.length - 1 ? 'Vào làm bài trắc nghiệm ➜' : 'Xem tiếp ➜'}
                        </button>
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
                      <button
                        key={book.id}
                        type="button"
                        className="sgk-subject-card"
                        style={{ '--subject-color': book.color }}
                        onClick={() => setSelectedTextbook(book)}
                      >
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
                      </button>
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
                    /* ===== PHẦN ĐỌC BÀI - nền giấy kẻ ô ===== */
                    <div className="sgk-book-page">
                      <div className="sgk-float-emoji" style={{ top: '8%', left: '4%', animationDelay: '0s' }}>{selectedTextbook?.emoji}</div>
                      <div className="sgk-float-emoji" style={{ top: '22%', right: '5%', animationDelay: '1.2s' }}>🎈</div>
                      <div className="sgk-float-emoji" style={{ bottom: '30%', left: '3%', animationDelay: '2.4s' }}>✨</div>
                      <div className="sgk-float-emoji" style={{ bottom: '12%', right: '6%', animationDelay: '0.6s' }}>🌟</div>
                      <div className="sgk-page-lines-bg">
                        <div className="sgk-page-content">
                          {selectedLesson.content.split('\n').map((line, i) => {
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

                      {/* Nút bắt đầu trắc nghiệm */}
                      <div className="sgk-page-footer">
                        <div className="sgk-footer-mascot bounce-anim">🦉</div>
                        <div className="sgk-footer-bubble">
                          <p className="sgk-footer-msg">Bé đã đọc xong chưa? Hãy làm trắc nghiệm để nhận <strong>⭐ {selectedTextbook?.stars} Sao</strong> nhé!</p>
                          <p className="sgk-footer-sub">Trả lời đúng liên tiếp sẽ được <strong>🔥 Chuỗi Sao</strong> siêu to nhé!</p>
                        </div>
                        <button
                          type="button"
                          className="sgk-start-quiz-btn"
                          onClick={() => {
                            setSgkLessonView('quiz')
                            resetSgkQuiz()
                          }}
                        >
                          🧩 Bắt đầu trắc nghiệm!
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ===== PHẦN TRẮC NGHIỆM ===== */
                    (() => {
                      const quiz = selectedLesson.quizzes[sgkQuizIndex]
                      const isLast = sgkQuizIndex === selectedLesson.quizzes.length - 1
                      const totalQuiz = selectedLesson.quizzes.length
                      const earnedStars = Math.max(1, Math.round((sgkQuizScore / totalQuiz) * (selectedTextbook?.stars || 5)))
                      const mascotPraise = ['Tuyệt vời! Bé giỏi quá! 🌟', 'Rực rỡ! Cứ thế này nhé! 🚀', 'Siêu đỉnh luôn nè! 💫', 'Wow! Bé học giỏi thật! 🎯']
                      const mascot = sgkQuizCorrect
                        ? { emoji: '🤩', msg: mascotPraise[sgkQuizIndex % mascotPraise.length] }
                        : sgkQuizFeedback
                          ? { emoji: '🤔', msg: 'Không sao! Bé đọc lại câu hỏi rồi thử lần nữa nhé! 💪' }
                          : { emoji: '🦉', msg: 'Bé chọn đáp án rồi bấm Kiểm tra nhé! ✨' }

                      /* ===== MÀN TỔNG KẾT SAU KHI LÀM XONG ===== */
                      if (sgkQuizDone) {
                        const rankMsg = sgkQuizScore === totalQuiz
                          ? { title: 'XUẤT SẮC! 🏆', msg: 'Bé trả lời đúng tất cả câu hỏi! Thần đồng của bố mẹ đây rồi!' }
                          : sgkQuizScore >= totalQuiz * 0.7
                            ? { title: 'RẤT GIỎI! 🌟', msg: 'Kết quả tuyệt vời! Chỉ còn một chút nữa là hoàn hảo!' }
                            : { title: 'HOÀN THÀNH! 🎉', msg: 'Bé đã học xong bài này rồi! Làm lại để đạt điểm cao hơn nhé!' }
                        return (
                          <div className="sgk-summary-card">
                            <div className="sgk-summary-confetti">🎉 ✨ 🎊 ✨ 🎉</div>
                            <div className="sgk-summary-trophy bounce-anim">🏆</div>
                            <h3 className="sgk-summary-title">{rankMsg.title}</h3>
                            <p className="sgk-summary-msg">{rankMsg.msg}</p>

                            <div className="sgk-summary-stats">
                              <div className="sgk-summary-stat">
                                <span className="sgk-summary-stat-num">{sgkQuizScore}/{totalQuiz}</span>
                                <span className="sgk-summary-stat-label">🎯 Câu đúng</span>
                              </div>
                              <div className="sgk-summary-stat">
                                <span className="sgk-summary-stat-num">🔥 {sgkBestStreak}</span>
                                <span className="sgk-summary-stat-label">Chuỗi dài nhất</span>
                              </div>
                              <div className="sgk-summary-stat">
                                <span className="sgk-summary-stat-num">⭐ {earnedStars}</span>
                                <span className="sgk-summary-stat-label">Sao nhận được</span>
                              </div>
                            </div>

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
                              <button
                                type="button"
                                className="sgk-btn-finish"
                                onClick={async () => {
                                  setSgkCompletedLessons(prev => ({ ...prev, [selectedLesson.id]: true }))
                                  try {
                                    if (earnedStars > 0) {
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
                                    }
                                    showToast(`🎉 Rực rỡ! Bé được cộng +${earnedStars} ⭐ vào Ví Sao!`)
                                    confetti({ particleCount: 220, spread: 100, origin: { y: 0.5 } })
                                  } catch (err) {
                                    showToast('Lỗi nhận sao SGK: ' + err.message)
                                    console.warn('Lỗi ghi nhận hoàn thành SGK:', err)
                                  }
                                  setSelectedLesson(null)
                                  setSgkLessonView('content')
                                  resetSgkQuiz()
                                  loadAppData()
                                }}
                              >
                                🏆 Nhận {earnedStars} Sao! ⭐
                              </button>
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
                                onClick={() => setSgkLessonView('content')}
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
                                      setSgkStreak(prev => {
                                        const next = prev + 1
                                        setSgkBestStreak(best => Math.max(best, next))
                                        return next
                                      })
                                      confetti({ particleCount: 60, spread: 70, origin: { y: 0.75 }, scalar: 0.8 })
                                    } else {
                                      setSgkQuizFeedback(true)
                                      setSgkStreak(0)
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
                                  }}
                                >
                                  Câu tiếp theo →
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="sgk-btn-finish"
                                  onClick={() => {
                                    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } })
                                    setSgkQuizDone(true)
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
