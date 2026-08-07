import { useState, useEffect } from 'react'

const BOT_OPPONENTS = [
  { name: 'Phạm Thanh Sơn', rank: 'Đá 2', elo: 429, avatar: '👦' },
  { name: 'Nguyễn Hoàng Nam', rank: 'Đá 1', elo: 450, avatar: '🦁' },
  { name: 'Trần Minh Anh', rank: 'Đá 2', elo: 412, avatar: '🦊' },
  { name: 'Lê Khánh Linh', rank: 'Đồng 3', elo: 480, avatar: '🐰' }
]

const LEADERBOARD_USERS = [
  { rank: 1, name: 'Quân', elo: 503, avatar: '🦁', title: 'Cao Thủ Rừng Xanh' },
  { rank: 2, name: 'Khôi', elo: 491, avatar: '🐯', title: 'Siêu Sao Tính Nhanh' },
  { rank: 3, name: 'Dũng', elo: 475, avatar: '🐼', title: 'Thánh Toán Logic' },
  { rank: 4, name: 'Thanh Sơn', elo: 429, avatar: '👦', title: 'Đá 2' },
  { rank: 5, name: 'Bé Bông', elo: 410, avatar: '🦊', title: 'Tập Sự' }
]

const COMBAT_QUIZZES = [
  { q: '15 + 28 = ?', opts: ['43', '41', '45', '42'], ans: 0 },
  { q: '4 x 8 = ?', opts: ['36', '32', '28', '30'], ans: 1 },
  { q: '100 - 37 = ?', opts: ['63', '73', '67', '53'], ans: 0 },
  { q: '54 : 6 = ?', opts: ['8', '7', '9', '6'], ans: 2 },
  { q: '7 x 7 = ?', opts: ['49', '42', '56', '48'], ans: 0 }
]

export default function MathCombatArena({ playerProfile, onFinishedCombat }) {
  const [viewState, setViewState] = useState('lobby') // 'lobby' | 'searching' | 'battle' | 'result'
  const [opponent, setOpponent] = useState(null)
  const [currentQIdx, setCurrentQIdx] = useState(0)
  const [playerScore, setPlayerScore] = useState(0)
  const [botScore, setBotScore] = useState(0)
  const [elo, setElo] = useState(429)
  const [selectedOpt, setSelectedOpt] = useState(null)

  // Start matchmaking simulation
  const handleStartCombat = () => {
    setViewState('searching')
    const randomBot = BOT_OPPONENTS[Math.floor(Math.random() * BOT_OPPONENTS.length)]
    setOpponent(randomBot)

    setTimeout(() => {
      setViewState('battle')
      setCurrentQIdx(0)
      setPlayerScore(0)
      setBotScore(0)
      setSelectedOpt(null)
    }, 2500)
  }

  // Answer question in battle
  const handleSelectAnswer = (idx) => {
    if (selectedOpt !== null) return
    setSelectedOpt(idx)

    const currentQ = COMBAT_QUIZZES[currentQIdx]
    const isRight = idx === currentQ.ans

    if (isRight) setPlayerScore(prev => prev + 10)

    // Bot random answer after delay
    setTimeout(() => {
      const botRight = Math.random() > 0.3
      if (botRight) setBotScore(prev => prev + 10)

      if (currentQIdx < COMBAT_QUIZZES.length - 1) {
        setCurrentQIdx(prev => prev + 1)
        setSelectedOpt(null)
      } else {
        // Battle finished
        setViewState('result')
        const newElo = isRight ? elo + 25 : elo - 10
        setElo(newElo)
        if (onFinishedCombat) {
          onFinishedCombat(15, 'Thắng trận Đấu Trường Kurio Combat')
        }
      }
    }, 800)
  }

  return (
    <div className="math-combat-arena-container">
      {viewState === 'lobby' && (
        <div className="combat-lobby-view">
          {/* Top Rank Header */}
          <div className="rank-profile-header glass">
            <div className="rank-badge-box">
              <span className="rank-icon">🔨</span>
              <div className="rank-details">
                <span className="rank-name">HẠNG ĐÁ 2</span>
                <span className="rank-elo">Elo {elo}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-warning btn-lg combat-action-btn glow animate-pulse"
              onClick={handleStartCombat}
            >
              ⚡ COMBAT ⚡
            </button>
          </div>

          {/* Leaderboard Section */}
          <div className="leaderboard-section card glass">
            <div className="lb-header">
              <span className="lb-icon">🏎️</span>
              <h3>ĐƯỜNG ĐƯA ELORIO (BẢNG XẾP HẠNG)</h3>
            </div>

            <div className="lb-list">
              {LEADERBOARD_USERS.map((user) => (
                <div key={user.rank} className={`lb-item ${user.rank <= 3 ? `top-${user.rank}` : ''}`}>
                  <div className="lb-rank-num">#{user.rank}</div>
                  <span className="user-avatar">{user.avatar}</span>
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-title">{user.title}</span>
                  </div>
                  <div className="user-elo-badge">{user.elo} Elo</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewState === 'searching' && (
        <div className="combat-searching-view text-center card glass">
          <div className="vs-logo-anim">⚡ COMBAT ⚡</div>
          <h3>ĐANG GHÉP CẶP ĐẤU...</h3>
          <p className="subtitle">Hệ thống đang tìm đối thủ phù hợp với Elo {elo} của bạn...</p>
          <div className="searching-spinner-box">
            <span className="spinner-large">🌀</span>
          </div>

          {opponent && (
            <div className="versus-preview-card animate-bounce">
              <div className="vs-player">
                <span className="avatar">👦</span>
                <span>Bạn (Elo {elo})</span>
              </div>
              <div className="vs-badge">VS</div>
              <div className="vs-opponent">
                <span className="avatar">{opponent.avatar}</span>
                <span>{opponent.name} (Elo {opponent.elo})</span>
              </div>
            </div>
          )}
        </div>
      )}

      {viewState === 'battle' && (
        <div className="combat-battle-view card glass">
          {/* Battle Scores Header */}
          <div className="battle-scores-header">
            <div className="player-side">
              <span className="avatar">👦</span>
              <div>
                <strong>Bạn</strong>
                <span className="score-val">{playerScore} pts</span>
              </div>
            </div>

            <div className="vs-text">VS</div>

            <div className="opponent-side">
              <div>
                <strong>{opponent?.name}</strong>
                <span className="score-val">{botScore} pts</span>
              </div>
              <span className="avatar">{opponent?.avatar}</span>
            </div>
          </div>

          {/* Current Question */}
          <div className="battle-quiz-body text-center">
            <span className="quiz-q-num">CÂU HỎI {currentQIdx + 1} / {COMBAT_QUIZZES.length}</span>
            <h2 className="combat-q-text">{COMBAT_QUIZZES[currentQIdx].q}</h2>

            <div className="combat-options-grid">
              {COMBAT_QUIZZES[currentQIdx].opts.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`combat-opt-btn ${selectedOpt === idx ? 'selected' : ''}`}
                  onClick={() => handleSelectAnswer(idx)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewState === 'result' && (
        <div className="combat-result-view text-center card glass">
          <div className="result-banner">
            {playerScore >= botScore ? (
              <>
                <span className="victory-emoji">🏆</span>
                <h2>CHIẾN THẮNG RỰC RỠ!</h2>
                <div className="elo-change positive">+25 Elo ⭐</div>
              </>
            ) : (
              <>
                <span className="defeat-emoji">💔</span>
                <h2>CỐ GẮNG LẦN SAU NÀO!</h2>
                <div className="elo-change negative">-10 Elo</div>
              </>
            )}
          </div>

          <div className="battle-stats-box">
            <p>Điểm của bạn: <strong>{playerScore} pts</strong></p>
            <p>Điểm đối thủ ({opponent?.name}): <strong>{botScore} pts</strong></p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg glow"
            onClick={() => setViewState('lobby')}
          >
            Trở về Đấu trường ➔
          </button>
        </div>
      )}
    </div>
  )
}
