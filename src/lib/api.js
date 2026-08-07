import { supabase } from './supabase'

// family_id LUÔN bằng auth.uid() (xem RLS policy trong schema.sql), nên khi
// thiếu familyId ta lấy thẳng từ phiên đăng nhập thay vì đoán mò.
// Tuyệt đối không dùng UUID rỗng làm giá trị dự phòng: nó vi phạm khoá ngoại
// auth.users lẫn RLS, khiến mọi lượt ghi thất bại trong im lặng.
async function resolveFamilyId(familyId) {
  if (familyId) return familyId
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  const uid = data?.user?.id
  if (!uid) throw new Error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.')
  return uid
}

// ---------- Hồ sơ ----------
export async function fetchChildren() {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .order('created_at')
  if (error) throw error
  return data
}

export async function addChild(familyId, { name, avatar, pin, grade = 2 }) {
  const { data, error } = await supabase
    .from('children')
    .insert({ family_id: familyId, name, avatar, pin, grade })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateChildGrade(childId, grade) {
  const { error } = await supabase
    .from('children')
    .update({ grade })
    .eq('id', childId)
  if (error) throw error
}

// ---------- Kế hoạch tuần ----------
export async function fetchWeeklyPlans() {
  const { data, error } = await supabase
    .from('weekly_plans')
    .select('*')
    .order('week', { ascending: false })
  if (error) throw error
  return data
}

export async function upsertWeeklyPlan(familyId, childId, week, days) {
  const { data, error } = await supabase
    .from('weekly_plans')
    .upsert(
      { family_id: familyId, child_id: childId, week, days, updated_at: new Date().toISOString() },
      { onConflict: 'child_id,week' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchParentSettings(familyId) {
  const { data, error } = await supabase
    .from('parent_settings')
    .select('*')
    .maybeSingle()
  if (error) throw error
  if (data) return data
  // Lần đầu: tạo bản ghi mặc định
  const { data: created, error: err2 } = await supabase
    .from('parent_settings')
    .insert({ family_id: familyId })
    .select()
    .single()
  if (err2) throw err2
  return created
}

export async function updateParentPin(familyId, pin) {
  const { error } = await supabase
    .from('parent_settings')
    .update({ parent_pin: pin })
    .eq('family_id', familyId)
  if (error) throw error
}

// ---------- Nhiệm vụ ----------
export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Nhiệm vụ trỏ vào bài học trong app cần 2 cột task_type / content_ref
// (supabase/migration_assign.sql). Nếu bố mẹ chưa chạy migration đó, PostgREST
// trả về PGRST204 "Could not find the 'task_type' column" và MỌI việc tạo nhiệm
// vụ sẽ thất bại — kể cả việc nhà. Không được để một migration bị quên làm tê
// liệt chức năng cơ bản nhất của app, nên ở đây thử lại một lần không kèm 2 cột.
function isMissingColumnError(error) {
  if (!error) return false
  const text = `${error.code || ''} ${error.message || ''}`.toLowerCase()
  return text.includes('pgrst204')
    || (text.includes('column') && (text.includes('does not exist') || text.includes('could not find')))
}

export async function addTask(familyId, task) {
  const insert = (payload) => supabase
    .from('tasks')
    .insert({ family_id: familyId, ...payload })
    .select()
    .single()

  let { data, error } = await insert(task)

  if (error && isMissingColumnError(error) && ('task_type' in task || 'content_ref' in task)) {
    console.warn(
      'Database chưa có cột task_type/content_ref — hãy chạy supabase/migration_assign.sql. '
      + 'Vẫn tạo nhiệm vụ nhưng nút "Mở cả khu" sẽ không mở khoá được.'
    )
    const fallback = { ...task }
    delete fallback.task_type
    delete fallback.content_ref
    ;({ data, error } = await insert(fallback))
  }

  if (error) throw error
  return data
}

export async function deactivateTask(taskId) {
  const { error } = await supabase
    .from('tasks')
    .update({ active: false })
    .eq('id', taskId)
  if (error) throw error
}

// ---------- Hoàn thành ----------
// Không embed tasks(title) nữa: task_id giờ là text ('sgk-...', 'math-...', ...)
// nên FK completions->tasks đã bị drop -> PostgREST không còn quan hệ để join.
// Tiêu đề nhiệm vụ được nối ở tầng giao diện từ danh sách tasks đã tải sẵn.
export async function fetchCompletions() {
  const { data, error } = await supabase
    .from('completions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Con bấm "Hoàn thành" -> tạo bản ghi (mặc định pending, với bài học app tự duyệt thì approved)
export async function submitCompletion(familyId, task, proofImage = null, childNote = '', status = 'pending') {
  const fid = await resolveFamilyId(familyId)
  const { data, error } = await supabase
    .from('completions')
    .insert({
      family_id: fid,
      task_id: task.id,
      child_id: task.child_id,
      stars: task.stars,
      proof_image: proofImage,
      child_note: childNote,
      status: status,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// Bố mẹ duyệt -> cộng sao vào sổ
export async function reviewCompletion(familyId, completion, approve, parentFeedback = '', taskTitle = '') {
  const { error } = await supabase
    .from('completions')
    .update({ 
      status: approve ? 'approved' : 'rejected',
      parent_feedback: parentFeedback,
    })
    .eq('id', completion.id)
  if (error) throw error
  if (approve) {
    await addStars(familyId, completion.child_id, completion.stars,
      `Hoàn thành: ${taskTitle || 'nhiệm vụ'}`)
    // Chỉ nhiệm vụ thật (id uuid) mới xử lý lặp lại; id ảo ('sgk-...') bỏ qua
    const isUuid = typeof completion.task_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(completion.task_id)
    if (isUuid) {
      const { data: task } = await supabase
        .from('tasks').select('recurrence').eq('id', completion.task_id).single()
      if (task?.recurrence === 'once') await deactivateTask(completion.task_id)
    }
  }
}

// ---------- Phần thưởng ----------
export async function fetchRewards() {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('active', true)
    .order('cost')
  if (error) throw error
  return data
}

export async function addReward(familyId, reward) {
  const { data, error } = await supabase
    .from('rewards')
    .insert({ family_id: familyId, ...reward })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deactivateReward(rewardId) {
  const { error } = await supabase
    .from('rewards')
    .update({ active: false })
    .eq('id', rewardId)
  if (error) throw error
}

export async function updateReward(rewardId, updates) {
  const { data, error } = await supabase
    .from('rewards')
    .update(updates)
    .eq('id', rewardId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ---------- Đổi quà ----------
export async function fetchRedemptions() {
  const { data, error } = await supabase
    .from('redemptions')
    .select('*, rewards(title, emoji)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Con đổi quà: trừ sao ngay, chờ bố mẹ trao
export async function redeemReward(familyId, childId, reward) {
  const balance = await fetchBalance(childId)
  if (balance < reward.cost) throw new Error('Chưa đủ sao!')
  const { data, error } = await supabase
    .from('redemptions')
    .insert({
      family_id: familyId,
      child_id: childId,
      reward_id: reward.id,
      cost: reward.cost,
    })
    .select()
    .single()
  if (error) throw error
  await addStars(familyId, childId, -reward.cost, `Đổi quà: ${reward.title}`)
  return data
}

// Bố mẹ xác nhận đã trao / từ chối (hoàn sao)
export async function reviewRedemption(familyId, redemption, fulfill) {
  const { error } = await supabase
    .from('redemptions')
    .update({ status: fulfill ? 'fulfilled' : 'rejected' })
    .eq('id', redemption.id)
  if (error) throw error
  if (!fulfill) {
    await addStars(familyId, redemption.child_id, redemption.cost,
      `Hoàn sao: ${redemption.rewards?.title ?? 'quà'}`)
  }
}

// ---------- Sổ sao ----------
export async function addStars(familyId, childId, amount, reason) {
  if (!childId) throw new Error('Thiếu hồ sơ bé khi ghi sổ sao.')
  const fid = await resolveFamilyId(familyId)
  const { error } = await supabase
    .from('star_transactions')
    .insert({
      family_id: fid,
      child_id: childId,
      amount: amount,
      reason: reason || '',
    })
  if (error) throw error
}

export async function fetchBalance(childId) {
  if (!childId) return 0
  const { data, error } = await supabase
    .from('star_transactions')
    .select('amount')
    .eq('child_id', childId)
  if (error) throw error
  return (data || []).reduce((sum, t) => sum + t.amount, 0)
}

export async function fetchTransactions(childId) {
  const { data, error } = await supabase
    .from('star_transactions')
    .select('*')
    .eq('child_id', childId)
    .order('created_at', { ascending: false })
    .limit(30)
  if (error) throw error
  return data
}

// ---------- Lịch sử học tập ----------
// Khác với completions ("bài này đã xong hay chưa", mỗi bài đúng 1 dòng),
// learning_sessions ghi lại MỌI lượt học kể cả khi bé học lại bài cũ.
// Đây là dữ liệu nền cho ôn tập lặp lại (spaced repetition) và báo cáo tiến độ.

export async function fetchLearningSessions(childId = null, limit = 300) {
  let query = supabase
    .from('learning_sessions')
    .select('*')
    .order('studied_at', { ascending: false })
    .limit(limit)
  if (childId) query = query.eq('child_id', childId)
  const { data, error } = await query
  if (error) throw error
  return data
}

/**
 * Ghi lại một lượt học. Gọi mỗi khi bé làm xong phần trắc nghiệm của bài,
 * bất kể có nhận sao hay không (lần học lại vẫn phải được lưu).
 *
 * @param {object} s
 *   kind          'sgk' | 'book' | 'math'
 *   refId         mã bài học gốc (không kèm tiền tố)
 *   title         tên bài hiển thị cho bố mẹ
 *   subject/grade/week   thông tin phân loại, có thể bỏ trống
 *   quizTotal     tổng số câu hỏi
 *   quizFirstTry  số câu bé trả lời đúng ngay lần đầu
 *   wrongAttempts tổng số lần bé chọn sai
 *   wrongAnswers  [{ q, chose, correct }] — dùng cho ôn tập lặp lại
 *   durationSeconds  thời gian làm bài
 *   starsEarned   số sao nhận được ở lượt này (0 nếu học lại)
 */
export async function logLearningSession(familyId, childId, s) {
  if (!childId) throw new Error('Thiếu hồ sơ bé khi ghi lịch sử học tập.')
  const fid = await resolveFamilyId(familyId)

  // Đây là lượt học thứ mấy của bài này?
  const { count, error: countErr } = await supabase
    .from('learning_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('child_id', childId)
    .eq('kind', s.kind)
    .eq('ref_id', s.refId)
  if (countErr) throw countErr

  const { data, error } = await supabase
    .from('learning_sessions')
    .insert({
      family_id: fid,
      child_id: childId,
      kind: s.kind,
      ref_id: s.refId,
      title: s.title,
      subject: s.subject ?? null,
      grade: s.grade ?? null,
      week: s.week ?? null,
      quiz_total: s.quizTotal ?? 0,
      quiz_first_try: s.quizFirstTry ?? 0,
      wrong_attempts: s.wrongAttempts ?? 0,
      wrong_answers: s.wrongAnswers ?? [],
      duration_seconds: s.durationSeconds ?? 0,
      attempt_no: (count ?? 0) + 1,
      stars_earned: s.starsEarned ?? 0,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Ghi lịch sử học nhưng KHÔNG BAO GIỜ chặn việc cộng sao cho con.
 *
 * VÌ SAO CẦN:
 * Ở mọi luồng học, lịch sử được ghi TRƯỚC khi cộng sao. Nếu bước ghi lỗi
 * (mất mạng giữa chừng, hoặc bố mẹ chưa chạy migration mới) thì con học
 * xong mà không nhận được sao nào — mất công sức thật của con vì một lỗi
 * kỹ thuật. Lịch sử học chỉ là dữ liệu tham khảo cho bố mẹ, còn sao là
 * động lực của con: khi phải chọn, luôn ưu tiên con.
 */
export async function safeLogLearningSession(familyId, childId, s) {
  try {
    return await logLearningSession(familyId, childId, s)
  } catch (err) {
    console.warn('Không ghi được lịch sử học tập (vẫn cộng sao cho con):', err?.message)
    return null
  }
}
