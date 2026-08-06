/**
 * Pika AI Tutor Service
 * Xử lý phương pháp Socratic, gọi Gemini API, tích hợp Web Speech API (STT & TTS),
 * và nạp ngữ cảnh bài học Sách Giáo Khoa (SGK).
 */

let cachedWorkingModel = null
let cachedModelList = null
let cachedModelListKey = null

// Lấy API Key từ .env hoặc localStorage
export function getGeminiApiKey() {
  const raw = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('pika_gemini_api_key') || ''
  return raw.trim().replace(/^['"]|['"]$/g, '')
}

export function setGeminiApiKey(key) {
  cachedWorkingModel = null // Reset cache mô hình khi đổi key
  cachedModelList = null
  if (key) {
    localStorage.setItem('pika_gemini_api_key', key.trim().replace(/^['"]|['"]$/g, ''))
  } else {
    localStorage.removeItem('pika_gemini_api_key')
  }
}

// Model dự phòng khi không kéo được ListModels (thứ tự ưu tiên mới → cũ).
// Dòng gemini-1.5-* đã khai tử; gemini-2.5-flash bị Google chặn với tài khoản mới.
const FALLBACK_MODELS = [
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-2.0-flash'
]

/**
 * Lấy danh sách các mô hình Gemini hợp lệ từ Google ListModels API.
 * Loại: gemma (không nhận system_instruction), các model đã khai tử (1.0/1.5),
 * và các biến thể đặc thù không phải chat (tts / image / audio / embedding...).
 */
async function getAvailableGeminiModels(apiKey) {
  if (cachedModelList && cachedModelListKey === apiKey) return cachedModelList

  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1000`)
    const listData = await listRes.json().catch(() => ({}))

    if (listRes.ok && Array.isArray(listData.models)) {
      const EXCLUDE = /gemma|embedding|bison|aqa|-tts|image|audio|live|veo|imagen|learnlm|gemini-1\.0|gemini-1\.5|thinking|preview|exp/
      const valid = listData.models.filter(m =>
        m.supportedGenerationMethods &&
        m.supportedGenerationMethods.includes('generateContent') &&
        !EXCLUDE.test(m.name)
      )

      if (valid.length > 0) {
        // Ưu tiên dòng flash: nhanh + hạn mức miễn phí cao nhất.
        // flash-latest luôn trỏ tới bản flash ổn định mới nhất nên đứng đầu.
        const score = name => {
          if (name.includes('flash-latest')) return 100
          if (name.includes('gemini-3.6-flash')) return 97
          if (name.includes('gemini-3.5-flash-lite')) return 94
          if (name.includes('gemini-3.5-flash')) return 96
          if (name.includes('gemini-3.1-flash-lite')) return 90
          if (name.includes('gemini-2.5-flash-lite')) return 60
          if (name.includes('gemini-2.5-flash')) return 58
          if (name.includes('gemini-2.0-flash-lite')) return 55
          if (name.includes('gemini-2.0-flash')) return 56
          if (name.includes('flash')) return 70
          if (name.includes('pro')) return 40
          return 10
        }
        valid.sort((a, b) => score(b.name) - score(a.name))

        // Chỉ giữ tối đa 4 model — thử nhiều hơn chỉ tốn hạn mức miễn phí
        cachedModelList = valid.map(m => m.name.replace(/^models\//, '')).slice(0, 4)
        cachedModelListKey = apiKey
        return cachedModelList
      }
    }
  } catch (err) {
    console.warn('Không thể kéo danh sách models:', err.message)
  }

  return FALLBACK_MODELS
}

/**
 * LƯU Ý: KHÔNG gửi thinkingConfig — API hiện tại (dòng gemini-3.x / flash-latest)
 * trả 400 INVALID_ARGUMENT khi nhận trường này. Suy nghĩ nội bộ (nếu model có)
 * đã được lọc ở extractReplyText qua cờ part.thought; maxOutputTokens đặt dư
 * để phần thinking không nuốt hết chỗ của câu trả lời.
 */
function buildGenerationConfig() {
  return {
    temperature: 0.7,
    maxOutputTokens: 2048,
  }
}

// Ghép các part văn bản trả lời, bỏ qua part suy nghĩ nội bộ (thought: true)
function extractReplyText(data) {
  const parts = data?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''
  return parts
    .filter(p => !p.thought && typeof p.text === 'string')
    .map(p => p.text)
    .join('\n')
    .trim()
}

/**
 * Kiểm tra mã API Key Gemini trực tiếp với Google AI API
 */
export async function verifyGeminiApiKey(keyToTest) {
  const cleanKey = (keyToTest || getGeminiApiKey()).trim().replace(/^['"]|['"]$/g, '')
  if (!cleanKey) {
    return { valid: false, message: 'Vui lòng nhập mã API Key (bắt đầu bằng AIzaSy...)' }
  }

  try {
    const availableModels = await getAvailableGeminiModels(cleanKey)
    let lastErr = ''

    // Thử lần lượt các mô hình khả dụng đến khi có mô hình phản hồi thành công
    for (const modelName of availableModels) {
      const genUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`

      const genRes = await fetch(genUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Xin chào Pika' }] }],
          generationConfig: buildGenerationConfig(modelName)
        })
      })

      const genData = await genRes.json().catch(() => ({}))

      if (genRes.ok && extractReplyText(genData)) {
        cachedWorkingModel = modelName
        return { valid: true, message: `✅ Kích hoạt thành công mô hình ${modelName}!` }
      } else {
        lastErr = genData?.error?.message || `Mã lỗi HTTP ${genRes.status}`
        // Nếu lỗi do sai Key hoàn toàn thì dừng ngay
        if (genRes.status === 400 && lastErr.toLowerCase().includes('key')) {
          return { valid: false, message: `❌ Lỗi API Key Google: ${lastErr}` }
        }
      }
    }

    return { valid: false, message: `❌ Thử nghiệm API Key thất bại: ${lastErr}` }
  } catch (err) {
    return { valid: false, message: `❌ Không thể kết nối tới máy chủ Google API: ${err.message}` }
  }
}

/**
 * Xây dựng Socratic Prompt cho Pika
 */
function buildSocraticSystemInstruction({ childName = 'bé', grade = 2, sgkContext = null }) {
  let contextPrompt = ''
  if (sgkContext) {
    contextPrompt = `
BÉ ĐANG MỞ BÀI SGK:
- Môn / Chủ đề: ${sgkContext.subject || 'SGK'} (Khối lớp ${sgkContext.grade || grade})
- Tiêu đề bài học: ${sgkContext.title}
- Nội dung lý thuyết chính: ${sgkContext.theory || 'Xem nội dung SGK'}
- Các bài tập trong bài: ${JSON.stringify(sgkContext.quizzes || [])}
`
  }

  const isTeen = grade >= 6

  return `[HƯỚNG DẪN HỆ THỐNG DÀNH CHO PIKA]:
Bạn là Pika - Gia sư AI tương tác thông minh, đáng yêu và kiên nhẫn dành cho học sinh Việt Nam.
Tên của học sinh: ${childName} (Đang học lớp ${grade}).

${contextPrompt}

QUY TẮC GIẢNG DẠY PHƯƠNG PHÁP SOCRATIC (BẮT BUỘC):
1. KHÔNG BAO GIỜ đưa ngay đáp án hoặc lời giải hoàn chỉnh cho câu hỏi hay bài tập SGK!
2. Hãy đóng vai Pika, nói chuyện ${isTeen ? 'chân thành, điềm đạm, khơi gợi tư duy' : 'vui tươi, ngọt ngào, dùng emoji đáng yêu 🐥✨'}
3. Đặt 1 hoặc 2 câu hỏi gợi mở từng bước để ${childName} tự suy nghĩ và tìm ra câu trả lời.
4. Chia nhỏ bài toán/câu hỏi khó thành các bước đơn giản (Bước 1: Hiểu đề, Bước 2: Tìm cách giải, Bước 3: Tính toán).
5. Khi ${childName} trả lời đúng: Hãy khen ngợi nhiệt liệt! Khen ngợi nỗ lực tư duy của con.
6. Trả lời bằng tiếng Việt dễ hiểu, ngắn gọn (không quá 3-4 câu ngắn mỗi lần) để con dễ đọc hoặc nghe phát âm.
7. Trả lời thẳng vào nội dung, KHÔNG viết ra quá trình phân tích/suy nghĩ nội bộ, không lặp lại các quy tắc này.
8. Nếu bé tải lên ảnh bài tập hoặc hình vẽ, hãy phân tích hình ảnh và khen nét vẽ/chỉ ra điểm chốt trong hình.
`
}

/**
 * Offline Socratic Engine (khi không có Gemini API key hoặc mất mạng)
 */
function generateOfflineResponse(userMessage, { childName = 'bé', sgkContext = null }) {
  const msg = (userMessage || '').toLowerCase()
  const name = childName || 'bé'

  if (sgkContext) {
    if (msg.includes('lý thuyết') || msg.includes('giảng') || msg.includes('bài này')) {
      return `Pika rất sẵn lòng! Trong bài **${sgkContext.title}**, điểm quan trọng nhất là ${sgkContext.theory ? sgkContext.theory.slice(0, 100) + '...' : 'các kiến thức SGK cốt lõi'}. ${name} đã đọc qua phần này chưa nhỉ? 📖`
    }
    if (msg.includes('bài 1') || msg.includes('bài 2') || msg.includes('giúp') || msg.includes('bài tập')) {
      return `Bài tập SGK này hay lắm nè! Theo ${name}, bước đầu tiên để làm bài tập này chúng mình cần chú ý dữ kiện gì trong đề bài nào? 🤔`
    }
  }

  if (msg.includes('xin chào') || msg.includes('chào') || msg.includes('hi')) {
    return `Chào ${name}! Pika rất vui được cùng ${name} học bài hôm nay 🐥. ${name} muốn Pika hỗ trợ môn gì hay bài SGK nào nè?`
  }

  if (msg.includes('+') || msg.includes('-') || msg.includes('*') || msg.includes('x') || msg.includes('bằng bao nhiêu') || msg.includes('tính')) {
    return `Bài toán này hay đó ${name}! Con hãy thử nghĩ xem phép tính này chúng mình nên thực hiện từ hàng nào trước nhỉ? (Hàng đơn vị hay hàng chục?) ✏️`
  }

  if (msg.includes('cảm ơn') || msg.includes('thank')) {
    return `Không có gì đâu ${name}! Pika rất tự hào về tinh thần chăm học của con ✨. Tiếp tục phát huy nha!`
  }

  return `Câu hỏi của ${name} rất thú vị! Theo con nghĩ thì điều này liên quan đến điều gì chúng mình đã được học trên lớp nhỉ? Hãy chia sẻ cho Pika nghe với nha 💡!`
}

/**
 * Trò chuyện với Pika AI (Hỗ trợ text & image base64)
 */
export async function chatWithPika({
  userMessage,
  imageBase64 = null,
  childName = 'bé',
  grade = 2,
  sgkContext = null,
  history = []
}) {
  const apiKey = getGeminiApiKey()

  if (!apiKey) {
    await new Promise(r => setTimeout(r, 600))
    return {
      text: generateOfflineResponse(userMessage, { childName, sgkContext }),
      isOffline: true
    }
  }

  const systemInstructionText = buildSocraticSystemInstruction({ childName, grade, sgkContext })

  const contents = []

  // Lịch sử hội thoại gần nhất. Gemini BẮT BUỘC contents phải bắt đầu bằng
  // lượt 'user' và xen kẽ user/model — lời chào mở đầu của Pika (model) đứng
  // trước sẽ làm Google trả lỗi 400, nên phải chuẩn hoá lại tại đây.
  const recentHistory = history.filter(h => h.text && h.text.trim()).slice(-7)
  while (recentHistory.length && recentHistory[0].role !== 'user') {
    recentHistory.shift()
  }
  recentHistory.forEach(h => {
    const role = h.role === 'user' ? 'user' : 'model'
    const last = contents[contents.length - 1]
    if (last && last.role === role) {
      // Gộp 2 lượt cùng vai liên tiếp thành 1 để giữ luật xen kẽ
      last.parts[0].text += '\n' + h.text
    } else {
      contents.push({ role, parts: [{ text: h.text }] })
    }
  })

  // Tin nhắn hiện tại
  const currentParts = []
  if (userMessage && userMessage.trim()) {
    currentParts.push({ text: userMessage })
  }

  if (imageBase64) {
    // Giữ đúng định dạng gốc: jpg chụp bài tập / png từ bảng vẽ
    const mimeMatch = imageBase64.match(/^data:(image\/[\w.+-]+);base64,/)
    const cleanBase64 = imageBase64.replace(/^data:image\/[\w.+-]+;base64,/, '')
    currentParts.push({
      inline_data: {
        mime_type: mimeMatch ? mimeMatch[1] : 'image/png',
        data: cleanBase64
      }
    })
    if (currentParts.length === 1) {
      currentParts.unshift({ text: 'Đây là ảnh bài tập / hình vẽ của con, Pika xem giúp con nhé!' })
    }
  }

  contents.push({
    role: 'user',
    parts: currentParts
  })

  const basePayload = {
    system_instruction: {
      parts: [{ text: systemInstructionText }]
    },
    contents: contents,
  }

  try {
    const availableModels = await getAvailableGeminiModels(apiKey)
    // Model đã chạy tốt lần trước được thử đầu tiên cho nhanh + đỡ tốn lượt gọi
    const tryOrder = cachedWorkingModel
      ? [cachedWorkingModel, ...availableModels.filter(m => m !== cachedWorkingModel)]
      : availableModels

    let lastErrorMsg = ''
    let isQuotaError = false

    // Thử lần lượt các mô hình khả dụng. Nếu 1 mô hình dính 429 Quota Exceeded, chuyển ngay sang mô hình dự phòng tiếp theo!
    for (const modelName of tryOrder) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...basePayload, generationConfig: buildGenerationConfig(modelName) })
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        const replyText = extractReplyText(data)
        if (replyText) {
          cachedWorkingModel = modelName
          return {
            text: replyText,
            isOffline: false
          }
        }
      }

      lastErrorMsg = data?.error?.message || `Mã phản hồi HTTP ${response.status}`
      console.warn(`Gemini API (${modelName}) Failed:`, lastErrorMsg)

      if (response.status === 429 || lastErrorMsg.toLowerCase().includes('quota') || lastErrorMsg.toLowerCase().includes('rate limit')) {
        isQuotaError = true
      }

      // Key sai hoàn toàn thì các model còn lại cũng sẽ sai y hệt — dừng sớm
      if (response.status === 400 && lastErrorMsg.toLowerCase().includes('api key not valid')) {
        return {
          text: `⚠️ **Mã API Key không hợp lệ.** Vui lòng bấm ⚙️ Cài đặt, kiểm tra và dán lại API Key từ Google AI Studio (bắt đầu bằng \`AIzaSy...\`).\n\nPika tạm thời hỗ trợ con ở chế độ offline:\n\n` + generateOfflineResponse(userMessage, { childName, sgkContext }),
          isOffline: true,
          error: lastErrorMsg
        }
      }
    }

    // Nếu dính lỗi Quota 429 cho tất cả các mô hình, đưa ra thông báo rõ ràng cho người dùng
    if (isQuotaError) {
      return {
        text: `⏳ **Tài khoản API Key miễn phí tạm thời đạt giới hạn lượt gọi (Google AI 429 Rate Limit):**\n\nBản Free Tier của Google AI giới hạn số câu hỏi trong khoảng 1 phút. Bạn chỉ cần chờ khoảng 30 - 50 giây rồi bấm gửi lại nhé!\n\nTrong lúc chờ, Pika hỗ trợ con trả lời ở chế độ offline:\n\n` + generateOfflineResponse(userMessage, { childName, sgkContext }),
        isOffline: true,
        error: lastErrorMsg
      }
    }

    return {
      text: `⚠️ **Thông báo kết nối Gemini AI:** Google báo lỗi "${lastErrorMsg}". Vui lòng bấm ⚙️ Cài đặt để kiểm tra lại API Key.\n\nPika tạm thời hỗ trợ con ở chế độ offline:\n\n` + generateOfflineResponse(userMessage, { childName, sgkContext }),
      isOffline: true,
      error: lastErrorMsg
    }
  } catch (err) {
    console.warn('Fetch error:', err)
    return {
      text: `⚠️ **Lỗi kết nối:** ${err.message}.\n\nPika tạm thời hỗ trợ con ở chế độ offline:\n\n` + generateOfflineResponse(userMessage, { childName, sgkContext }),
      isOffline: true,
      error: err.message
    }
  }
}

// ---------- Speech-to-Text (Web Speech API) ----------
export function createSpeechRecognizer({ onResult, onError, onEnd }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    return null
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'vi-VN'
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    if (onResult) onResult(transcript)
  }

  recognition.onerror = (event) => {
    console.warn('Speech recognition error:', event.error)
    if (onError) onError(event.error)
  }

  recognition.onend = () => {
    if (onEnd) onEnd()
  }

  return recognition
}

// ---------- Text-to-Speech (Web Speech Synthesis) ----------

// Chrome giải phóng utterance đang đọc nếu không giữ tham chiếu, làm câu nói
// bị cắt ngang giữa chừng — giữ ở biến module để tránh.
let activeUtterance = null

/**
 * Chọn giọng tiếng Việt "dễ thương" nhất có trên máy.
 * Ưu tiên: giọng nữ Natural của Edge/Windows (HoaiMy) > Google Tiếng Việt
 * (Chrome) > giọng nữ bất kỳ > giọng vi-VN bất kỳ. Giọng nữ tự nhiên nghe
 * ấm và trong hơn hẳn giọng máy mặc định (An/NamMinh).
 */
function pickVietnameseVoice() {
  const voices = window.speechSynthesis.getVoices()
  const viVoices = voices.filter(v => /^vi([-_]|$)/i.test(v.lang || ''))
  if (viVoices.length === 0) return null

  const score = (v) => {
    const name = (v.name || '').toLowerCase()
    let s = 0
    // Giọng nữ Natural trên Windows/Edge — trong trẻo, tự nhiên nhất
    if (name.includes('hoaimy')) s += 100
    if (name.includes('natural')) s += 40
    // Giọng Google trên Chrome — mượt hơn nhiều so với giọng SAPI cũ
    if (name.includes('google')) s += 60
    // Nhận diện giọng nữ qua tên phổ biến
    if (/female|nữ|hoaimy|linh|mai|lan|hương|thảo|my/.test(name)) s += 30
    // Giọng nam / giọng máy cũ nghe cứng — hạ ưu tiên
    if (/nammin|namminh|male|\ban\b/.test(name)) s -= 30
    // Giọng cài sẵn trên máy đọc nhanh + ổn định hơn giọng tải qua mạng
    if (v.localService) s += 5
    return s
  }

  return viVoices.sort((a, b) => score(b) - score(a))[0]
}

export function speakText(text, { pitch = 1.1, rate = 1.0, onStart, onEnd } = {}) {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd()
    return null
  }

  window.speechSynthesis.cancel()

  const cleanText = text
    .replace(/[*#_`~]/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\p{Extended_Pictographic}/gu, '') // bỏ emoji để không bị đọc thành chữ
    .replace(/\n+/g, '. ')
    .trim()

  if (!cleanText) {
    if (onEnd) onEnd()
    return null
  }

  const utterance = new SpeechSynthesisUtterance(cleanText)
  utterance.lang = 'vi-VN'
  utterance.pitch = pitch
  utterance.rate = rate

  if (onStart) utterance.onstart = onStart
  const finish = () => {
    if (activeUtterance === utterance) activeUtterance = null
    if (onEnd) onEnd()
  }
  utterance.onend = finish
  utterance.onerror = finish

  activeUtterance = utterance

  // Danh sách giọng đọc nạp bất đồng bộ — trên di động (Android/iOS) có thể
  // mất tới hơn 1 giây mới có, nên thử lại vài lần thay vì chỉ chờ 300ms.
  let started = false
  const speakNow = () => {
    if (started) return
    started = true
    if (activeUtterance !== utterance) return // đã bị stopSpeaking() trước khi kịp đọc
    const viVoice = pickVietnameseVoice()
    if (!viVoice && window.speechSynthesis.getVoices().length > 0) {
      // Máy KHÔNG có giọng tiếng Việt (hay gặp trên điện thoại chưa cài):
      // im lặng còn hơn để giọng Anh mặc định đánh vần tiếng Việt sai bét.
      console.warn('Pika TTS: thiết bị chưa cài giọng tiếng Việt, bỏ qua đọc thoại.')
      finish()
      return
    }
    if (viVoice) utterance.voice = viVoice
    window.speechSynthesis.speak(utterance)
  }

  if (window.speechSynthesis.getVoices().length > 0) {
    speakNow()
  } else {
    window.speechSynthesis.addEventListener('voiceschanged', speakNow, { once: true })
    // Dự phòng khi không bắn voiceschanged: đợi voices nạp tối đa ~2 giây
    let tries = 0
    const poll = setInterval(() => {
      tries += 1
      if (started) { clearInterval(poll); return }
      if (window.speechSynthesis.getVoices().length > 0 || tries >= 10) {
        clearInterval(poll)
        speakNow()
      }
    }, 200)
  }

  return utterance
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    activeUtterance = null
    window.speechSynthesis.cancel()
  }
}
