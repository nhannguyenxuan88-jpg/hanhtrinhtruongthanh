import { supabase } from './supabase'

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

export async function addTask(familyId, task) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ family_id: familyId, ...task })
    .select()
    .single()
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
  const { data, error } = await supabase
    .from('completions')
    .insert({
      family_id: familyId,
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
  if (!childId) return
  try {
    const { error } = await supabase
      .from('star_transactions')
      .insert({ 
        family_id: familyId || '00000000-0000-0000-0000-000000000000', 
        child_id: childId, 
        amount: amount, 
        reason: reason || '' 
      })
    if (error) console.warn('Cảnh báo addStars Supabase:', error.message)
  } catch (err) {
    console.warn('Cảnh báo addStars catch:', err.message)
  }
}

export async function fetchBalance(childId) {
  const { data, error } = await supabase
    .from('star_transactions')
    .select('amount')
    .eq('child_id', childId)
  if (error) throw error
  return data.reduce((sum, t) => sum + t.amount, 0)
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
