import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

const ANIMAL_CARDS = ['🦊', '🦁', '🐰', '🐼', '🐯', '🐨']
const TICKET_PRICE = 10 // 10 sao = 1 lượt chơi 5 phút
const GAME_DURATION = 300 // 300 giây = 5 phút

export default function GameArcade({ childBalance, onDeductStars, showToast }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [activeGame, setActiveGame] = useState('catcher') // 'catcher' | 'memory' | 'racer'
  const [score, setScore] = useState(0)

  // Timer interval effect
  useEffect(() => {
    let timer = null
    if (isPlaying && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsPlaying(false)
            showToast('⏰ Hết 5 phút chơi game rồi con ơi! Hãy tích thêm Sao để chơi tiếp nhé! 🌟')
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, timeRemaining, showToast])

  // Xử lý đổi vé chơi
  // Chỉ mở game khi sao đã thực sự được trừ trong sổ sao, nếu không bé sẽ
  // chơi miễn phí mỗi khi mất mạng.
  const handleBuyTicket = async () => {
    if (childBalance < TICKET_PRICE) {
      showToast(`🔒 Bé còn thiếu ${TICKET_PRICE - childBalance} ⭐ nữa để đổi vé chơi game! Hãy hoàn thành bài học nhé 💪`)
      return
    }
    const paid = await onDeductStars(TICKET_PRICE)
    if (!paid) return
    setTimeRemaining(GAME_DURATION)
    setIsPlaying(true)
    setScore(0)
    showToast('🎉 Bé đã đổi 1 vé chơi Game 5 phút! Chúc bé chơi thật vui! 🎮')
  }

  // Định dạng thời gian MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="game-arcade-container">
      {/* Header Khu Game */}
      <div className="arcade-hero-banner">
        <div className="arcade-header-top">
          <span className="arcade-tag">🎮 KHU GAME PHẦN THƯỞNG</span>
          <div className="star-ticket-badge">
            ⭐ Giá vé: <strong>{TICKET_PRICE} Sao</strong> / 5 phút chơi
          </div>
        </div>
        <h2 className="arcade-title">🎪 Sân Chơi Giải Trí Đổi Sao</h2>
        <p className="arcade-subtitle">
          Chăm chỉ học tập và làm việc nhà để đổi vé chơi những Mini-Game cực vui bé nhé! 🌟
        </p>

        {isPlaying && (
          <div className="arcade-active-timer-bar">
            <div className="timer-countdown glow">
              ⏰ Thời gian còn lại: <strong>{formatTime(timeRemaining)}</strong>
            </div>
            <div className="score-live-badge">🏆 Điểm: {score}</div>
            <button 
              type="button" 
              className="btn-stop-arcade"
              onClick={() => {
                if (window.confirm('Bé có muốn dừng chơi game ngay bây giờ không?')) {
                  setIsPlaying(false)
                }
              }}
            >
              ✕ Dừng chơi
            </button>
          </div>
        )}
      </div>

      {/* Nếu CHƯA ĐỔI VÉ hoặc HẾT GIỜ */}
      {!isPlaying ? (
        <div className="arcade-ticket-shop card glass">
          <div className="ticket-illustration">🎟️</div>
          <h3>Đổi 10 Sao ⭐ Lấy 1 Lượt Chơi (5 phút)</h3>
          <p className="subtitle">
            {timeRemaining === 0 
              ? '⏰ Lượt chơi vừa rồi đã hết giờ! Bé đổi vé mới để chơi tiếp nhé!' 
              : `Bé đang có ${childBalance} ⭐ trong heo đất.`}
          </p>

          <div className="ticket-actions">
            {childBalance >= TICKET_PRICE ? (
              <button 
                type="button" 
                className="btn-buy-ticket animate-pulse"
                onClick={handleBuyTicket}
              >
                🎟️ ĐỔI VÉ VÀO CHƠI GAME NGAY (10 ⭐)
              </button>
            ) : (
              <button type="button" className="btn-buy-ticket locked" disabled>
                🔒 Cần thêm {TICKET_PRICE - childBalance} ⭐ để đổi vé
              </button>
            )}
          </div>

          {/* Xem trước danh sách Game */}
          <div className="game-preview-grid">
            <div className="game-preview-card">
              <span className="game-icon">🍎</span>
              <h4>Hứng Sao Thần Kỳ</h4>
              <p>Hứng sao & trái cây, né bom rớt từ bầu trời!</p>
            </div>
            <div className="game-preview-card">
              <span className="game-icon">🧩</span>
              <h4>Lật Thẻ Trí Nhớ</h4>
              <p>Lật tìm các cặp con vật xinh xắn rèn trí nhớ!</p>
            </div>
            <div className="game-preview-card">
              <span className="game-icon">🏎️</span>
              <h4>Đua Xe Nhanh Trí</h4>
              <p>Lái xe né chướng ngại vật & chọn đáp án đúng!</p>
            </div>
          </div>
        </div>
      ) : (
        /* ĐANG TRONG LƯỢT CHƠI GAME */
        <div className="arcade-gameplay-area card glass">
          {/* Thanh chọn game */}
          <div className="game-selector-tabs">
            <button
              type="button"
              className={`game-tab-btn ${activeGame === 'catcher' ? 'active' : ''}`}
              onClick={() => setActiveGame('catcher')}
            >
              🍎 Hứng Sao
            </button>
            <button
              type="button"
              className={`game-tab-btn ${activeGame === 'memory' ? 'active' : ''}`}
              onClick={() => setActiveGame('memory')}
            >
              🧩 Lật Thẻ
            </button>
            <button
              type="button"
              className={`game-tab-btn ${activeGame === 'racer' ? 'active' : ''}`}
              onClick={() => setActiveGame('racer')}
            >
              🏎️ Đua Xe
            </button>
            <button
              type="button"
              className={`game-tab-btn ${activeGame === 'wheel' ? 'active' : ''}`}
              onClick={() => setActiveGame('wheel')}
            >
              🎡 Vòng Quay
            </button>
          </div>

          {/* Màn hình hiển thị Mini-game tương ứng */}
          <div className="game-viewport">
            {activeGame === 'catcher' && (
              <StarCatcherGame onAddScore={(pts) => setScore(s => s + pts)} />
            )}
            {activeGame === 'memory' && (
              <MemoryMatchGame onAddScore={(pts) => setScore(s => s + pts)} />
            )}
            {activeGame === 'racer' && (
              <MathRacerGame onAddScore={(pts) => setScore(s => s + pts)} />
            )}
            {activeGame === 'wheel' && (
              <LuckyWheelGame onAddScore={(pts) => setScore(s => s + pts)} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ======================================================
   MINI GAME 1: 🍎 HỨNG SAO THẦN KỲ (STAR CATCHER)
   ====================================================== */
function StarCatcherGame({ onAddScore }) {
  const canvasRef = useRef(null)
  const playerXRef = useRef(200)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId = null

    // Game state
    const playerY = canvas.height - 40
    const playerWidth = 80
    const playerHeight = 30
    const clampX = (x) => Math.max(0, Math.min(canvas.width - playerWidth, x))
    playerXRef.current = clampX(playerXRef.current)

    let items = []
    let spawnTimer = 0

    const itemTypes = [
      { emoji: '⭐', score: 10, type: 'star' },
      { emoji: '🍎', score: 5, type: 'apple' },
      { emoji: '🍌', score: 5, type: 'banana' },
      { emoji: '💣', score: -10, type: 'bomb' },
    ]

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        playerXRef.current = clampX(playerXRef.current - 30)
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        playerXRef.current = clampX(playerXRef.current + 30)
      }
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      playerXRef.current = clampX(mouseX - playerWidth / 2)
    }

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect()
        const touchX = e.touches[0].clientX - rect.left
        playerXRef.current = clampX(touchX - playerWidth / 2)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove)

    const loop = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn item
      spawnTimer++
      if (spawnTimer % 35 === 0) {
        const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)]
        items.push({
          x: Math.random() * (canvas.width - 30),
          y: -20,
          speed: 3 + Math.random() * 3,
          ...randomItem
        })
      }

      // Update & Draw Items
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i]
        item.y += item.speed

        // Draw emoji item
        ctx.font = '26px sans-serif'
        ctx.fillText(item.emoji, item.x, item.y)

        // Collision check with basket
        const playerX = playerXRef.current
        if (
          item.y >= playerY - 10 &&
          item.y <= playerY + playerHeight &&
          item.x + 20 >= playerX &&
          item.x <= playerX + playerWidth
        ) {
          onAddScore(item.score)
          items.splice(i, 1)
          continue
        }

        // Out of bounds
        if (item.y > canvas.height + 20) {
          items.splice(i, 1)
        }
      }

      // Draw Basket
      const playerX = playerXRef.current
      ctx.fillStyle = '#8b5cf6'
      ctx.beginPath()
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(playerX, playerY, playerWidth, playerHeight, 12)
      } else {
        ctx.rect(playerX, playerY, playerWidth, playerHeight)
      }
      ctx.fill()
      ctx.font = '20px sans-serif'
      ctx.fillText('🧺', playerX + playerWidth / 2 - 12, playerY + 22)

      animationId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', handleKeyDown)
      canvas?.removeEventListener('mousemove', handleMouseMove)
      canvas?.removeEventListener('touchmove', handleTouchMove)
    }
  }, [onAddScore])

  // Di chuyển rổ bằng nút bấm (dùng chung biến với canvas loop)
  const movePlayer = (delta) => {
    const canvas = canvasRef.current
    if (!canvas) return
    playerXRef.current = Math.max(0, Math.min(canvas.width - 80, playerXRef.current + delta))
  }

  return (
    <div className="catcher-game-container">
      <p className="game-instruction">
        🎮 Rê chuột, lướt tay hoặc dùng phím ⬅️ ➡️ để di chuyển giỏ hứng Star & Trái cây nhé!
      </p>
      <canvas 
        ref={canvasRef} 
        width={480} 
        height={320} 
        className="game-canvas"
      />
      <div className="touch-controls">
        <button 
          type="button" 
          className="touch-btn" 
          onClick={() => movePlayer(-50)}
        >
          ⬅️ Sang Trái
        </button>
        <button 
          type="button" 
          className="touch-btn" 
          onClick={() => movePlayer(50)}
        >
          Sang Phải ➡️
        </button>
      </div>
    </div>
  )
}

/* ======================================================
   MINI GAME 2: 🧩 LẬT THẺ TRÍ NHỚ (MEMORY MATCH)
   ====================================================== */
function MemoryMatchGame({ onAddScore }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])

  // Khởi tạo bàn cờ
  const initGame = () => {
    const deck = [...ANIMAL_CARDS, ...ANIMAL_CARDS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }))
    setCards(deck)
    setFlipped([])
    setMatched([])
  }

  useEffect(() => {
    initGame()
  }, [])

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      if (cards[first].emoji === cards[second].emoji) {
        setMatched(prev => [...prev, first, second])
        onAddScore(20)
        setFlipped([])

        // Nếu thắng cả bàn
        if (matched.length + 2 === cards.length) {
          confetti({ particleCount: 100, spread: 70 })
          setTimeout(() => {
            initGame()
          }, 1200)
        }
      } else {
        setTimeout(() => setFlipped([]), 900)
      }
    }
  }

  return (
    <div className="memory-game-container">
      <p className="game-instruction">🧩 Lật 2 thẻ giống nhau để mở cặp hình con thú ngộ nghĩnh!</p>
      <div className="memory-grid">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx)
          return (
            <button
              key={idx}
              type="button"
              className={`memory-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(idx)}
            >
              {isFlipped ? card.emoji : '❓'}
            </button>
          )
        })}
      </div>
      <button type="button" className="btn-restart-game" onClick={initGame}>
        🔄 Chơi ván mới
      </button>
    </div>
  )
}

/* ======================================================
   MINI GAME 3: 🏎️ ĐUA XE NHANH TRÍ (MATH RACER)
   ====================================================== */
function MathRacerGame({ onAddScore }) {
  const [lane, setLane] = useState(1) // 0: Trái, 1: Giữa, 2: Phải
  const [quiz, setQuiz] = useState({ q: '3 + 4 = ?', ans: 7, options: [7, 5, 8] })
  const [bannerMsg, setBannerMsg] = useState('')

  const generateQuiz = () => {
    const a = Math.floor(Math.random() * 8) + 1
    const b = Math.floor(Math.random() * 8) + 1
    const isPlus = Math.random() > 0.4
    const ans = isPlus ? a + b : Math.max(a, b) - Math.min(a, b)
    const qStr = isPlus ? `${a} + ${b} = ?` : `${Math.max(a, b)} - ${Math.min(a, b)} = ?`

    // Generate 3 options in random order for 3 lanes
    const wrong1 = ans + 1
    const wrong2 = Math.max(1, ans - 1)
    const opts = [ans, wrong1, wrong2].sort(() => Math.random() - 0.5)

    setQuiz({ q: qStr, ans, options: opts })
  }

  useEffect(() => {
    generateQuiz()
  }, [])

  const handleDriveLane = (targetLane) => {
    setLane(targetLane)
    const chosenVal = quiz.options[targetLane]

    if (chosenVal === quiz.ans) {
      onAddScore(25)
      setBannerMsg('🏎️ TĂNG TỐC XUẤT SẮC! ĐÚNG RỒI! 🎉')
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } })
      setTimeout(() => {
        setBannerMsg('')
        generateQuiz()
      }, 1000)
    } else {
      setBannerMsg('⚠️ Ôi chưa đúng rồi! Hãy thử phép tính tiếp nhé!')
      setTimeout(() => {
        setBannerMsg('')
        generateQuiz()
      }, 1000)
    }
  }

  return (
    <div className="racer-game-container">
      <div className="racer-quiz-banner">
        <span className="racer-math-question">{quiz.q}</span>
        <p className="racer-hint">Lái xe vào làn đường có số kết quả đúng để về đích!</p>
      </div>

      {bannerMsg && <div className="racer-feedback-pop">{bannerMsg}</div>}

      {/* Đường đua 3 làn */}
      <div className="racer-track">
        {[0, 1, 2].map((laneIndex) => (
          <div 
            key={laneIndex} 
            className={`racer-lane ${lane === laneIndex ? 'active-lane' : ''}`}
            onClick={() => handleDriveLane(laneIndex)}
          >
            <div className="lane-gate-number">{quiz.options[laneIndex]}</div>
            {lane === laneIndex && <div className="racer-car">🏎️</div>}
          </div>
        ))}
      </div>

      <div className="racer-controls">
        <button type="button" className="touch-btn" onClick={() => handleDriveLane(Math.max(0, lane - 1))}>
          ⬅️ Lách Trái
        </button>
        <button type="button" className="touch-btn" onClick={() => handleDriveLane(Math.min(2, lane + 1))}>
          Lách Phải ➡️
        </button>
      </div>
    </div>
  )
}

/* ======================================================
   MINI GAME 4: 🎡 VÒNG QUAY MAY MẮN (LUCKY WHEEL)
   ====================================================== */
function LuckyWheelGame({ onAddScore }) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [resultMsg, setResultMsg] = useState('')

  const WHEEL_SLICES = [
    { label: '+10 Điểm 🌟', score: 10, color: '#ec4899', emoji: '⭐' },
    { label: '+30 Hộp Quà 🎁', score: 30, color: '#8b5cf6', emoji: '🎁' },
    { label: '+50 Siêu Điểm 🏆', score: 50, color: '#f59e0b', emoji: '🏆' },
    { label: '+15 Cáo Đốm 🦊', score: 15, color: '#10b981', emoji: '🦊' },
    { label: '+100 Kim Cương 💎', score: 100, color: '#38bdf8', emoji: '💎' },
    { label: '+20 Trái Cây 🍎', score: 20, color: '#ef4444', emoji: '🍎' },
  ]

  const handleSpin = () => {
    if (spinning) return
    setSpinning(true)
    setResultMsg('')

    const sliceCount = WHEEL_SLICES.length
    const randomIndex = Math.floor(Math.random() * sliceCount)
    const degreesPerSlice = 360 / sliceCount

    // Quay ít nhất 5 vòng (1800 độ) + góc dốc slice
    const newRotation = rotation + 1800 + (sliceCount - randomIndex) * degreesPerSlice - (degreesPerSlice / 2)
    setRotation(newRotation)

    setTimeout(() => {
      setSpinning(false)
      const prize = WHEEL_SLICES[randomIndex]
      onAddScore(prize.score)
      setResultMsg(`🎉 CHÚC MỪNG BÉ TRÚNG: ${prize.label}!`)
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
    }, 3500)
  }

  return (
    <div className="wheel-game-container">
      <p className="game-instruction">🎡 Bấm Quay để thử vận may trúng Kim Cương & Điểm thưởng lớn nhé!</p>
      
      {resultMsg && <div className="wheel-result-banner">{resultMsg}</div>}

      <div className="wheel-wrapper">
        <div className="wheel-pointer">▼</div>
        <div 
          className="lucky-wheel-circle"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3.5s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
          }}
        >
          {WHEEL_SLICES.map((slice, idx) => {
            const angle = (360 / WHEEL_SLICES.length) * idx
            return (
              <div 
                key={idx} 
                className="wheel-slice"
                style={{
                  transform: `rotate(${angle}deg)`,
                  background: slice.color
                }}
              >
                <span className="slice-text">{slice.emoji}</span>
              </div>
            )
          })}
        </div>
      </div>

      <button 
        type="button" 
        className="btn-spin-wheel" 
        disabled={spinning}
        onClick={handleSpin}
      >
        {spinning ? '🌀 Đang quay...' : '🎡 QUAY NGAY (MIỄN PHÍ)'}
      </button>
    </div>
  )
}

