import { useState } from 'react'

/**
 * Component hiển thị Thẻ Học Infographic Trực Quan Kurio (Whiteboard Canvas Style)
 * Hỗ trợ các dạng minh họa:
 * - Hand gestures (Số La Mã: I, V, X)
 * - Knuckle diagram (Đếm ngày trong tháng)
 * - Base-10 3D Cube & Place Value table
 * - Mascot speech dialogue bubbles
 * - 5-Choice quiz format (A, B, C, D, E) with color badges
 */
export default function InfographicLessonCard({ lesson, quiz, onFinished, onClose }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleCheck = () => {
    if (!quiz || selectedOption === null) return
    const chosen = quiz.options[selectedOption]
    const chosenKey = typeof chosen === 'string' ? String.fromCharCode(65 + selectedOption) : chosen.key
    const isRight = chosenKey === quiz.correctAnswer || selectedOption === quiz.correctAnswer
    setIsCorrect(isRight)
    setShowExplanation(true)
    if (isRight && onFinished) {
      onFinished()
    }
  }

  return (
    <div className="infographic-canvas-card">
      {/* Top Banner Ribbon */}
      <div className="infographic-ribbon-badge">
        <span>Tài liệu hay,</span>
        <strong>Học hăng say!</strong>
      </div>

      {/* Header pill badge */}
      {lesson?.badge && (
        <div className="infographic-header-tag">
          <span className="pill-badge-text">{lesson.badge}</span>
        </div>
      )}

      {/* Title & Subtitle */}
      {lesson?.title && <h3 className="infographic-title">{lesson.title}</h3>}
      {lesson?.subtitle && <p className="infographic-subtitle">{lesson.subtitle}</p>}

      {/* Visual Diagrams Section */}
      {lesson?.type === 'roman_numerals' && (
        <div className="visual-roman-hands-grid">
          <div className="roman-hand-item">
            <span className="roman-symbol">I</span>
            <div className="hand-illustration">☝️</div>
            <span className="roman-label">Một</span>
          </div>
          <div className="roman-hand-item">
            <span className="roman-symbol">V</span>
            <div className="hand-illustration">🖐️</div>
            <span className="roman-label">Năm</span>
          </div>
          <div className="roman-hand-item">
            <span className="roman-symbol">X</span>
            <div className="hand-illustration">🙅‍♂️</div>
            <span className="roman-label">Mười</span>
          </div>
        </div>
      )}

      {lesson?.type === 'knuckle_months' && (
        <div className="visual-knuckle-wrapper">
          <p className="knuckle-intro-text">
            <strong>Một năm có 12 tháng:</strong> Tháng 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12.
          </p>
          <div className="knuckle-fists-graphic">
            <div className="fist-hand left-fist">
              <span className="knuckle-peak peak-31">T1 (31)</span>
              <span className="knuckle-valley valley-28">T2 (28/29)</span>
              <span className="knuckle-peak peak-31">T3 (31)</span>
              <span className="knuckle-valley valley-30">T4 (30)</span>
              <span className="knuckle-peak peak-31">T5 (31)</span>
              <span className="knuckle-valley valley-30">T6 (30)</span>
              <span className="knuckle-peak peak-31">T7 (31)</span>
              <div className="fist-svg-placeholder">✊ Cánh tay trái</div>
            </div>
            <div className="fist-hand right-fist">
              <span className="knuckle-peak peak-31">T8 (31)</span>
              <span className="knuckle-valley valley-30">T9 (30)</span>
              <span className="knuckle-peak peak-31">T10 (31)</span>
              <span className="knuckle-valley valley-30">T11 (30)</span>
              <span className="knuckle-peak peak-31">T12 (31)</span>
              <div className="fist-svg-placeholder">✊ Cánh tay phải</div>
            </div>
          </div>
        </div>
      )}

      {lesson?.type === 'place_value_dots' && (
        <div className="place-value-table-container">
          <table className="place-value-table">
            <thead>
              <tr>
                <th className="bg-yellow">Chục Nghìn</th>
                <th className="bg-purple">Nghìn</th>
                <th className="bg-green">Trăm</th>
                <th className="bg-red">Chục</th>
                <th className="bg-blue">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🟡 🟡 🟡</td>
                <td>🟣 🟣 🟣 🟣</td>
                <td>🟢 🟢 🟢 🟢 🟢 🟢 🟢</td>
                <td>🔴 🔴 🔴 🔴 🔴 🔴</td>
                <td>🔵</td>
              </tr>
              <tr className="num-row">
                <td colSpan="5"><strong>34 761</strong> có 5 chữ số &gt; <strong>8 947</strong> có 4 chữ số.</td>
              </tr>
            </tbody>
          </table>
          <div className="summary-box-highlight">
            Trong hai số tự nhiên, số nào có nhiều chữ số hơn là số lớn hơn!
          </div>
        </div>
      )}

      {/* Mascot Speech Dialogue Bubbles (Nam & Nữ đối thoại Kurio) */}
      {lesson?.dialogue && (
        <div className="mascot-dialogue-section">
          <div className="mascot-character boy">
            <div className="mascot-avatar">👦</div>
            <div className="speech-bubble boy-bubble">
              {lesson.dialogue.boyQuestion}
            </div>
          </div>
          <div className="mascot-character girl">
            <div className="speech-bubble girl-bubble">
              {lesson.dialogue.girlAnswer}
            </div>
            <div className="mascot-avatar">👧</div>
          </div>
        </div>
      )}

      {/* Quiz Section with 5 Color Choices (A, B, C, D, E) */}
      {quiz && (
        <div className="infographic-quiz-container">
          <h4 className="quiz-question-heading">{quiz.question}</h4>

          <div className="quiz-5-options-grid">
            {quiz.options.map((opt, idx) => {
              const optKey = typeof opt === 'string' ? String.fromCharCode(65 + idx) : opt.key
              const optText = typeof opt === 'string' ? opt : opt.text
              const optColor = typeof opt === 'object' && opt.color ? opt.color : '#4f46e5'
              const isSelected = selectedOption === idx

              return (
                <button
                  key={idx}
                  type="button"
                  className={`quiz-option-pill ${isSelected ? 'selected' : ''}`}
                  style={{ '--btn-accent': optColor }}
                  onClick={() => {
                    setSelectedOption(idx)
                    setShowExplanation(false)
                  }}
                >
                  <span className="option-badge-letter">{optKey}</span>
                  <span className="option-val-text">{optText}</span>
                </button>
              )
            })}
          </div>

          {/* Verification Actions */}
          <div className="quiz-check-action">
            {!showExplanation ? (
              <button
                type="button"
                className="btn btn-primary btn-lg glow"
                disabled={selectedOption === null}
                onClick={handleCheck}
              >
                💡 Kiểm tra kết quả
              </button>
            ) : (
              <div className={`quiz-feedback-box ${isCorrect ? 'success' : 'wrong'}`}>
                {isCorrect ? (
                  <>
                    <div className="feedback-title">🎉 CHÍNH XÁC RỒI!</div>
                    <p>{quiz.explanation}</p>
                  </>
                ) : (
                  <>
                    <div className="feedback-title">❌ CHƯA ĐÚNG RỒI!</div>
                    <p>Bé hãy chọn lại đáp án khác nhé!</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="infographic-footer-brand">
        <span className="brand-logo-text">✨ kurio - Học toán thông minh</span>
      </div>
    </div>
  )
}
