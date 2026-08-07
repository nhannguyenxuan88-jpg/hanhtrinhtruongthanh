import React, { useState, useEffect, useRef } from 'react'
import PikaAvatar from './PikaAvatar'
import PikaWhiteboard from './PikaWhiteboard'
import {
  chatWithPika,
  createSpeechRecognizer,
  speakText,
  stopSpeaking,
  getGeminiApiKey,
  setGeminiApiKey,
  verifyGeminiApiKey,
  describeMicError
} from '../../lib/pikaAiService'

export default function PikaTutorModal({
  profile,
  sgkContext = null,
  isModal = true,
  onClose,
  onRewardStars,
  onLogSession
}) {
  const childName = profile?.child?.name || 'bé'
  const grade = profile?.child?.grade || 2

  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [pikaState, setPikaState] = useState('idle') // 'idle'|'listening'|'thinking'|'speaking'|'celebrating'
  const [showWhiteboard, setShowWhiteboard] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey())
  const [isListening, setIsListening] = useState(false)
  const [isAutoSpeak, setIsAutoSpeak] = useState(true)
  const [rewardClaimed, setRewardClaimed] = useState(false)

  const chatEndRef = useRef(null)
  const recognizerRef = useRef(null)
  // Ref giữ bản mới nhất của handleSendMessage — callback của SpeechRecognizer
  // được đăng ký 1 lần lúc mount, nếu gọi thẳng sẽ dính closure cũ (messages rỗng)
  const sendMessageRef = useRef(null)
  const sessionLoggedRef = useRef(false)

  const childId = profile?.child?.id || 'default'
  const storageKey = `pika_chat_history_${childId}`

  // Tự động lưu lịch sử hội thoại vào localStorage
  useEffect(() => {
    if (messages.length > 0 && !sgkContext) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages.slice(-50)))
      } catch (e) {
        console.warn('Lỗi lưu lịch sử Pika:', e)
      }
    }
  }, [messages, sgkContext, storageKey])

  // Khởi tạo tin nhắn chào mừng ban đầu hoặc nạp lại lịch sử trò chuyện
  useEffect(() => {
    let isCancelled = false

    const initGreeting = async () => {
      let initialGreeting = `Pika chào ${childName}! 🐥`

      if (sgkContext) {
        const tempMsg = {
          id: 'init-1',
          role: 'pika',
          text: `Pika chào ${childName}! 🐥 Cô Pika đang xem bài SGK **"${sgkContext.title}"** để chuẩn bị giảng cho con nhé... ✨`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages([tempMsg])
        setPikaState('thinking')

        const promptText = sgkContext.pageText
          ? `Pika ơi, con đang mở bài SGK "${sgkContext.title}" ở trang này. Chữ trong trang sách là: "${sgkContext.pageText.slice(0, 800)}". Pika hãy chủ động phân tích bài học, giải thích từ ngữ ấn tượng và đặt 1 câu hỏi gợi mở đầu tiên cho con nhé!`
          : `Pika ơi, con đang mở bài SGK "${sgkContext.title}" thuộc môn ${sgkContext.subject || 'SGK'}. Pika hãy chủ động giảng bài và hướng dẫn con nhé!`

        const aiResponse = await chatWithPika({
          userMessage: promptText,
          childName,
          grade,
          sgkContext,
          history: []
        })

        if (!isCancelled) {
          const proactiveMsg = {
            id: 'init-proactive',
            role: 'pika',
            text: aiResponse.text,
            isOffline: aiResponse.isOffline,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          setMessages([proactiveMsg])
          if (isAutoSpeak) speakMessage(aiResponse.text)
          else setPikaState('idle')
        }
      } else {
        // Nạp lại lịch sử trò chuyện cũ từ localStorage (nếu có)
        try {
          const saved = localStorage.getItem(storageKey)
          if (saved) {
            const parsed = JSON.parse(saved)
            if (Array.isArray(parsed) && parsed.length > 0) {
              setMessages(parsed)
              return
            }
          }
        } catch (e) {
          console.warn('Lỗi đọc lịch sử Pika:', e)
        }

        initialGreeting = `Pika chào ${childName}! 🐥 Hôm nay con muốn Pika hỗ trợ giải đáp môn Toán, Ngữ Văn, Tiếng Anh hay làm bài tập nào nè?`
        setMessages([
          {
            id: 'init-1',
            role: 'pika',
            text: initialGreeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ])
        if (isAutoSpeak && isModal) speakMessage(initialGreeting)
      }
    }

    initGreeting()

    return () => {
      isCancelled = true
    }
  }, [sgkContext, childName, storageKey])

  const handleClearChatHistory = () => {
    if (window.confirm('Con có muốn làm mới cuộc trò chuyện để bắt đầu chủ đề mới cùng Pika không?')) {
      try { localStorage.removeItem(storageKey) } catch {}
      const freshMsg = {
        id: Date.now().toString(),
        role: 'pika',
        text: `Pika chào ${childName}! 🐥 Cuộc trò chuyện đã được làm mới. Con muốn Pika giúp bài học nào nè?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([freshMsg])
      stopSpeaking()
    }
  }

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pikaState])

  // Khởi tạo Speech Recognizer + dọn dẹp giọng đọc/micro khi đóng Pika
  useEffect(() => {
    const recognizer = createSpeechRecognizer({
      onResult: (text) => {
        setIsListening(false)
        setPikaState('idle')
        if (text) {
          sendMessageRef.current?.(text)
        }
      },
      onError: (code) => {
        setIsListening(false)
        setPikaState('idle')
        // Hiện hướng dẫn cụ thể trong khung chat thay vì lặng lẽ tắt micro
        const guide = describeMicError(code)
        if (guide) {
          setMessages(prev => [...prev, {
            id: `mic-err-${Date.now()}`,
            role: 'pika',
            text: guide,
            isOffline: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }])
        }
      },
      onEnd: () => {
        setIsListening(false)
        setPikaState('idle')
      }
    })
    recognizerRef.current = recognizer

    return () => {
      // Đóng modal / chuyển tab: tắt loa và micro ngay, không để đọc "ma"
      stopSpeaking()
      try { recognizer?.abort?.() } catch { /* trình duyệt cũ không có abort */ }
    }
  }, [])

  const speakMessage = (text) => {
    setPikaState('speaking')
    speakText(text, {
      pitch: 1.35, // giọng cao, trẻ con — hợp nhân vật gà con Pika
      rate: 0.95,  // đọc chậm rãi một chút cho bé dễ nghe theo
      onStart: () => setPikaState('speaking'),
      onEnd: () => setPikaState('idle')
    })
  }

  const handleSendMessage = async (customText = null, imageBase64 = null) => {
    const textToSend = customText !== null ? customText : inputText
    if (!textToSend.trim() && !imageBase64) return

    stopSpeaking()

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      image: imageBase64,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    if (customText === null) setInputText('')
    setPikaState('thinking')
    setShowWhiteboard(false)

    // Gọi AI Service — chỉ truyền lịch sử TRƯỚC tin nhắn này; bản thân tin nhắn
    // hiện tại (kèm ảnh) do chatWithPika tự gắn vào cuối, truyền lại sẽ bị lặp đôi
    const aiResponse = await chatWithPika({
      userMessage: textToSend,
      imageBase64: imageBase64,
      childName,
      grade,
      sgkContext,
      history: messages
    })

    const pikaReplyMsg = {
      id: (Date.now() + 1).toString(),
      role: 'pika',
      text: aiResponse.text,
      isOffline: aiResponse.isOffline,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, pikaReplyMsg])

    // Kiểm tra đủ 3 trao đổi -> Thưởng sao cho bé
    const exchangeCount = messages.filter(m => m.role === 'user').length + 1
    if (exchangeCount >= 3 && !rewardClaimed && onRewardStars) {
      setRewardClaimed(true)
      onRewardStars(3, `Tương tác học tập cùng Gia sư Pika (${sgkContext ? sgkContext.title : 'bài tập'})`)
      setPikaState('celebrating')
    }

    // Đọc giọng phát âm nếu bật AutoSpeak
    if (isAutoSpeak) {
      speakMessage(aiResponse.text)
    } else {
      setPikaState('idle')
    }

    // Ghi nhật ký học tập: 1 dòng cho MỖI buổi trò chuyện (không ghi lại từng
    // tin nhắn). Kind cố định 'sgk' — ràng buộc DB chỉ nhận sgk/book/math/explore.
    if (onLogSession && !sessionLoggedRef.current) {
      sessionLoggedRef.current = true
      onLogSession({
        kind: 'sgk',
        refId: sgkContext ? `pika_${sgkContext.id}` : 'pika_session',
        title: sgkContext ? `Hỏi Pika: ${sgkContext.title}` : 'Thảo luận cùng Gia Sư Pika',
        subject: sgkContext?.subject || 'Gia sư Pika',
        grade: grade
      })
    }
  }
  // Cập nhật ref mỗi lần render để callback micro luôn gọi bản mới nhất
  sendMessageRef.current = handleSendMessage

  const toggleMic = () => {
    if (!recognizerRef.current) {
      alert('Trình duyệt này chưa hỗ trợ nhận diện giọng nói. Hãy dùng Google Chrome (máy tính hoặc Android) để nói chuyện với Pika nhé.')
      return
    }

    if (isListening) {
      recognizerRef.current.stop()
      setIsListening(false)
      setPikaState('idle')
    } else {
      stopSpeaking()
      try {
        recognizerRef.current.start()
      } catch {
        // start() ném InvalidStateError nếu phiên nghe trước chưa kết thúc hẳn
        // — hủy phiên cũ rồi thử lại một nhịp sau
        try { recognizerRef.current.abort() } catch { /* bỏ qua */ }
        setTimeout(() => {
          try { recognizerRef.current.start() } catch (err2) {
            console.warn('Speech start error:', err2)
            return
          }
          setIsListening(true)
          setPikaState('listening')
        }, 150)
        return
      }
      setIsListening(true)
      setPikaState('listening')
    }
  }

  const [verifyingKey, setVerifyingKey] = useState(false)
  const [keyVerifyResult, setKeyVerifyResult] = useState(null)

  const handleTestApiKey = async () => {
    setVerifyingKey(true)
    setKeyVerifyResult(null)
    const res = await verifyGeminiApiKey(apiKeyInput)
    setKeyVerifyResult(res)
    setVerifyingKey(false)
  }

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKeyInput)
    setShowSettings(false)
    setKeyVerifyResult(null)
    alert('Đã lưu cấu hình API Key!')
  }

  const contentJSX = (
    <div className={`pika-container ${!isModal ? 'pika-inline-workspace' : ''}`}>
      
      {/* Header */}
      <div className="pika-header">
        <div className="pika-header-title">
          <PikaAvatar state={pikaState} size="sm" onClick={() => speakMessage('Pika chào con! 🐥')} />
          <div>
            <h2 className="pika-header-h2">
              Gia Sư AI Pika 🐥
              {rewardClaimed && (
                <span className="pika-star-badge-claimed">
                  +3 ⭐ Đã nhận sao!
                </span>
              )}
            </h2>
            <p className="pika-header-sub">
              Đồng hành Socratic • Giảng bài SGK & Giải toán
            </p>
          </div>
        </div>

        <div className="pika-header-actions">
          <button
            type="button"
            onClick={handleClearChatHistory}
            className="pika-btn-icon"
            title="Làm mới cuộc trò chuyện"
          >
            🗑️
          </button>

          <button
            type="button"
            onClick={() => setIsAutoSpeak(!isAutoSpeak)}
            className={`pika-btn-toggle ${isAutoSpeak ? 'active' : ''}`}
            title="Bật/Tắt tự động đọc giọng Pika"
          >
            {isAutoSpeak ? '🔊 Đọc thoại' : '🔇 Tắt đọc'}
          </button>

          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="pika-btn-icon"
            title="Cấu hình API Key"
          >
            ⚙️
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="pika-btn-close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Modal Cấu Hình API Key */}
      {showSettings && (
        <div className="pika-settings-popup">
          <h4 className="font-bold text-gray-800 text-sm mb-1">⚙️ Cấu Hình API Key Gemini</h4>
          
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 mb-3 text-[11px] text-emerald-950 leading-relaxed shadow-sm">
            <div className="font-extrabold text-emerald-800 mb-1 flex items-center gap-1">
              🛡️ Cam Kết An Toàn Chi Phí 100%
            </div>
            <p className="m-0 text-[11px] font-medium">
              API Key từ <strong className="font-bold text-emerald-900">Google AI Studio</strong> hoạt động mặc định ở gói <strong>Miễn Phí (Free Tier)</strong>:
            </p>
            <ul className="m-0 pl-4 pt-1 text-[10.5px] list-disc space-y-0.5 font-medium text-emerald-900">
              <li><strong>Tuyệt đối KHÔNG phát sinh chi phí hay trừ tiền.</strong></li>
              <li>Google không yêu cầu thẻ tín dụng cho tài khoản cá nhân Free Tier.</li>
              <li>Khi chạm hạn mức miễn phí (15 câu/phút), hệ thống tạm ngưng vài chục giây mà không tốn 1 đồng nào.</li>
            </ul>
          </div>

          <p className="text-xs text-gray-600 mb-1.5 font-semibold">
            Nhập API Key cá nhân từ <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-600 underline font-bold">aistudio.google.com</a>:
          </p>
          <input
            type="password"
            value={apiKeyInput}
            onChange={e => {
              setApiKeyInput(e.target.value)
              setKeyVerifyResult(null)
            }}
            placeholder="AIzaSy..."
            className="w-full text-xs p-2 border rounded-xl mb-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          {keyVerifyResult && (
            <div className={`p-2 mb-2 rounded-lg text-xs font-semibold ${keyVerifyResult.valid ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
              {keyVerifyResult.message}
            </div>
          )}

          <div className="flex items-center justify-between gap-1 pt-1">
            <button
              type="button"
              onClick={handleTestApiKey}
              disabled={verifyingKey || !apiKeyInput.trim()}
              className="text-xs px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg border border-amber-300 transition"
            >
              {verifyingKey ? '⏳ Đang kiểm tra...' : '🔍 Kiểm tra Key'}
            </button>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setShowSettings(false)
                  setKeyVerifyResult(null)
                }}
                className="text-xs px-2.5 py-1 bg-gray-200 text-gray-700 rounded-lg"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="text-xs px-3 py-1 bg-amber-500 text-white font-bold rounded-lg shadow"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner SGK đang mở (nếu có) */}
      {sgkContext && (
        <div className="pika-sgk-banner">
          <div className="pika-sgk-title">
            <span>📚</span>
            <span>Đang hỗ trợ bài SGK: <strong>{sgkContext.title}</strong> ({sgkContext.subject || 'SGK'})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSendMessage(`Pika ơi, tóm tắt giúp con lý thuyết bài "${sgkContext.title}" với!`)}
              className="pika-sgk-quick-btn"
            >
              💡 Lý thuyết bài này
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage(`Pika hướng dẫn con làm bài tập 1 trong bài "${sgkContext.title}" với!`)}
              className="pika-sgk-quick-btn"
            >
              🧩 Bài tập 1
            </button>
          </div>
        </div>
      )}

      {/* Khu vực chính Chat / Whiteboard */}
      <div className="pika-chat-area">
        {showWhiteboard ? (
          <div className="flex justify-center items-center h-full">
            <PikaWhiteboard
              onSendImage={(imgBase64) => handleSendMessage('', imgBase64)}
              onClose={() => setShowWhiteboard(false)}
            />
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`pika-msg-row ${m.role === 'user' ? 'user' : 'pika'}`}
              >
                {m.role === 'pika' && (
                  <PikaAvatar state="idle" size="sm" onClick={() => speakMessage(m.text)} />
                )}

                <div className={`pika-msg-bubble ${m.role === 'user' ? 'user' : 'pika'}`}>
                  {m.image && (
                    <img
                      src={m.image}
                      alt="Bài tập bé gửi"
                      className="max-h-48 rounded-xl mb-2 border border-gray-200 object-contain bg-white block"
                    />
                  )}
                  <p className="whitespace-pre-line leading-relaxed m-0">{m.text}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 text-[10px] opacity-70">
                    <span>{m.timestamp}</span>
                    {m.role === 'pika' && (
                      <button
                        type="button"
                        onClick={() => speakMessage(m.text)}
                        className="hover:underline font-bold flex items-center gap-1 cursor-pointer bg-transparent border-0 text-current p-0"
                      >
                        🔊 Phát lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Quick Suggestion Chips */}
      {!showWhiteboard && (
        <div className="pika-quick-chips">
          <span className="text-xs font-bold text-amber-900">Gợi ý:</span>
          <button
            type="button"
            onClick={() => handleSendMessage('Pika ơi, làm sao để tính đúng phép cộng có nhớ nhỉ?')}
            className="pika-chip-btn"
          >
            ➕ Phép cộng có nhớ
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Cho con 1 câu đố vui toán học thử tài suy luận đi Pika!')}
            className="pika-chip-btn"
          >
            🎲 Đố vui Logic
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Pika hướng dẫn con cách viết câu mở bài cho bài văn miêu tả nhé!')}
            className="pika-chip-btn"
          >
            📝 Viết văn miêu tả
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="pika-input-bar">
        <button
          type="button"
          onClick={() => setShowWhiteboard(!showWhiteboard)}
          className={`pika-btn-board ${showWhiteboard ? 'active' : ''}`}
          title="Bật/Tắt bảng vẽ nháp bài tập"
        >
          🎨<span className="pika-btn-board-label"> {showWhiteboard ? 'Ẩn bảng' : 'Bảng nháp'}</span>
        </button>

        <button
          type="button"
          onClick={toggleMic}
          className={`pika-btn-mic ${isListening ? 'listening' : ''}`}
          title="Bấm để nói bằng micro"
        >
          🎙️
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSendMessage() }}
          placeholder={isListening ? 'Đang lắng nghe bé nói...' : 'Nhập câu hỏi hoặc làm bài tập cùng Pika...'}
          className="pika-text-input"
        />

        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="pika-btn-send"
        >
          Gửi 🚀
        </button>
      </div>

    </div>
  )

  if (isModal) {
    return (
      <div className="pika-overlay" onClick={onClose}>
        <div onClick={e => e.stopPropagation()} className="w-full flex justify-center">
          {contentJSX}
        </div>
      </div>
    )
  }

  return contentJSX
}
