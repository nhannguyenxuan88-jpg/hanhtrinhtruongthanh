import { useState, useEffect } from 'react'
import { ikmcData } from '../../lib/ikmcData'

export default function IkmcExamHub({ onFinishedExam }) {
  const [selectedSet, setSelectedSet] = useState(null)
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [scoreResult, setScoreResult] = useState(null)

  // Timer countdown when exam starts
  useEffect(() => {
    if (!selectedSet || isSubmitted) return
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [selectedSet, isSubmitted])

  const handleStartExam = (examSet) => {
    setSelectedSet(examSet)
    setCurrentQuizIdx(0)
    setUserAnswers({})
    setTimeLeftSeconds(examSet.timeLimitMinutes * 60)
    setIsSubmitted(false)
    setScoreResult(null)
  }

  const handleSelectAnswer = (quizId, optionKey) => {
    if (isSubmitted) return
    setUserAnswers(prev => ({ ...prev, [quizId]: optionKey }))
  }

  const handleSubmitExam = () => {
    if (!selectedSet || isSubmitted) return
    setIsSubmitted(true)

    let correctCount = 0
    selectedSet.quizzes.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })

    const starsEarned = correctCount * 5
    setScoreResult({
      correctCount,
      total: selectedSet.quizzes.length,
      starsEarned,
      pct: Math.round((correctCount / selectedSet.quizzes.length) * 100)
    })

    if (onFinishedExam) {
      onFinishedExam(starsEarned, `Hoàn thành ${selectedSet.title}`)
    }
  }

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="ikmc-exam-hub-container">
      {!selectedSet ? (
        <>
          {/* Main Header */}
          <div className="ikmc-header-card glass">
            <div className="ikmc-title-box">
              <span className="ikmc-logo-badge">🏆 IKMC KANGAROU</span>
              <h2>Luyện Thi Toán Quốc Tế IKMC</h2>
              <p className="subtitle">
                Thử sức với bộ đề thi Toán Tư Duy Kangourou International Math Contest các năm!
              </p>
            </div>
            <div className="ikmc-tabs-row">
              <button type="button" className="ikmc-tab-btn active">Đề Thi IKMC Các Năm</button>
              <button type="button" className="ikmc-tab-btn">Luyện Thi Học Kỳ</button>
              <button type="button" className="ikmc-tab-btn">Thi Tháng</button>
            </div>
          </div>

          {/* List of Exam Sets */}
          <div className="ikmc-sets-grid">
            {ikmcData.map((exam) => (
              <div key={exam.year} className="ikmc-exam-card glass">
                <div className="exam-card-header">
                  <span className="exam-badge">{exam.badge}</span>
                  <span className="exam-level-pill">{exam.level}</span>
                </div>
                <h3>{exam.title}</h3>
                <div className="exam-meta-info">
                  <span>⏱️ {exam.timeLimitMinutes} Phút</span>
                  <span>🧩 {exam.quizzes.length} Câu hỏi</span>
                </div>
                <div className="exam-progress-bar">
                  <div className="fill-bar" style={{ width: '0%' }}></div>
                  <span className="progress-lbl">Chưa làm</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block glow"
                  onClick={() => handleStartExam(exam)}
                >
                  Bắt đầu làm bài 🚀
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Active Exam View */
        <div className="ikmc-active-exam-view card glass">
          {/* Top Timer Bar */}
          <div className="exam-timer-bar">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSelectedSet(null)}
            >
              ⇦ Thoát đề thi
            </button>

            <div className="exam-title-pill">{selectedSet.title}</div>

            <div className={`exam-timer-badge ${timeLeftSeconds < 300 ? 'warning' : ''}`}>
              ⏰ {formatTimer(timeLeftSeconds)}
            </div>
          </div>

          {!isSubmitted ? (
            /* Quiz Questions View */
            <div className="exam-quiz-body">
              {/* Question Navigator Dots */}
              <div className="quiz-nav-dots-row">
                {selectedSet.quizzes.map((q, idx) => (
                  <button
                    key={q.id}
                    type="button"
                    className={`nav-dot-btn ${idx === currentQuizIdx ? 'current' : userAnswers[q.id] ? 'answered' : ''}`}
                    onClick={() => setCurrentQuizIdx(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Current Question Display */}
              {(() => {
                const q = selectedSet.quizzes[currentQuizIdx]
                return (
                  <div className="current-quiz-box">
                    <span className="quiz-num-tag">CÂU HỎI {currentQuizIdx + 1} / {selectedSet.quizzes.length}</span>
                    <h3 className="quiz-question-text">{q.question}</h3>

                    <div className="quiz-5-options-list">
                      {q.options.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          className={`quiz-5-option-btn ${userAnswers[q.id] === opt.key ? 'selected' : ''}`}
                          style={{ '--choice-color': opt.color }}
                          onClick={() => handleSelectAnswer(q.id, opt.key)}
                        >
                          <span className="option-letter">{opt.key}</span>
                          <span className="option-text">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Bottom Nav Actions */}
              <div className="exam-actions-row">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={currentQuizIdx === 0}
                  onClick={() => setCurrentQuizIdx(prev => prev - 1)}
                >
                  ⇦ Câu trước
                </button>

                {currentQuizIdx < selectedSet.quizzes.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentQuizIdx(prev => prev + 1)}
                  >
                    Câu tiếp theo ➜
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success btn-lg glow animate-pulse"
                    onClick={handleSubmitExam}
                  >
                    Nộp bài thi 🏁
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="exam-results-container text-center">
              <div className="result-header-badge">
                <span className="trophy-emoji">🏆</span>
                <h2>KẾT QUẢ THI IKMC</h2>
              </div>

              <div className="score-summary-card glass">
                <div className="score-main-val">{scoreResult?.correctCount} / {scoreResult?.total}</div>
                <p>Số câu trả lời đúng ({scoreResult?.pct}%)</p>
                <div className="earned-stars-badge">
                  + {scoreResult?.starsEarned} SAO THƯỞNG ⭐
                </div>
              </div>

              {/* Solutions Breakdown */}
              <div className="solutions-list-box text-left">
                <h3>📖 Lời Giải Chi Tiết Cụ Thể:</h3>
                {selectedSet.quizzes.map((q, idx) => {
                  const userChoice = userAnswers[q.id]
                  const isRight = userChoice === q.correctAnswer
                  return (
                    <div key={q.id} className={`solution-item-card ${isRight ? 'correct' : 'wrong'}`}>
                      <div className="sol-header">
                        <strong>Câu {idx + 1}: {q.question}</strong>
                        <span className={`status-tag ${isRight ? 'correct' : 'wrong'}`}>
                          {isRight ? '✓ ĐÚNG' : '✗ SAI'}
                        </span>
                      </div>
                      <p className="user-choice-line">Bạn chọn: <strong>{userChoice || 'Chưa chọn'}</strong> | Đáp án chuẩn: <strong>{q.correctAnswer}</strong></p>
                      <div className="explanation-bubble">💡 {q.explanation}</div>
                    </div>
                  )
                })}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => setSelectedSet(null)}
              >
                Quay lại danh sách đề thi ➜
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
