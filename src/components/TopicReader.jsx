import { useState, useMemo } from 'react'
import ReadingGateButton from './ReadingGateButton'
import { exploreIllustrations } from '../lib/exploreIllustrations'

/**
 * Bộ đọc bài dạng "Lý thuyết ➜ Trắc nghiệm" dùng chung cho Toán tư duy và
 * Khám Phá Thế Giới.
 *
 * VÌ SAO CẦN FILE NÀY:
 * Hai khu này có cùng một nhịp học: con lật vài trang lý thuyết, qua cổng
 * chống đọc lướt, rồi trả lời từng câu hỏi cho tới hết. Trước đây toàn bộ
 * giao diện + 9 biến state nằm thẳng trong App.jsx; nếu khu Khám Phá copy
 * lại thì mỗi lần sửa cách chấm bài phải sửa hai nơi và sớm muộn cũng lệch
 * nhau. Component này giữ toàn bộ state của MỘT lượt học, App.jsx chỉ cần
 * biết kết quả cuối cùng qua onFinished().
 *
 * NGUYÊN TẮC CHẤM BÀI (giữ nguyên như trước):
 * Con bắt buộc trả lời đúng mới được sang câu tiếp, nên "số câu đúng" luôn
 * tuyệt đối và vô nghĩa. Thứ được đếm là số câu con đúng NGAY LẦN ĐẦU.
 *
 * @param {object}   topic       chủ đề: { emoji, title, stars, lesson: { badge, steps[] }, quizzes[] }
 * @param {object}   tone        giọng theo độ tuổi (src/lib/tone.js)
 * @param {string}   theme       'math' | 'explore' — chỉ đổi màu, layout giữ nguyên
 * @param {function} onClose     đóng bài, quay lại lưới chủ đề
 * @param {function} onFinished  ({ firstTryCount, total, wrongAttempts, wrongAnswers, durationSeconds })
 */
export default function TopicReader({ topic, tone, theme = 'math', onClose, onFinished }) {
  const steps = topic.lesson?.steps || []
  const quizzes = topic.quizzes || []

  // Trang hiện tại: [0 .. steps.length-1] là lý thuyết, sau đó là các câu hỏi
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  // Dữ liệu chấm bài của cả lượt học
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState([])
  const [firstTryCount, setFirstTryCount] = useState(0)
  const [questionMissed, setQuestionMissed] = useState(false)
  const [startedAt] = useState(() => Date.now())
  const [submitting, setSubmitting] = useState(false)

  const isExplore = theme === 'explore'
  // Lớp CSS phụ: khu Khám Phá đổi tông màu, mọi layout dùng lại của Toán
  const t = useMemo(() => (isExplore ? 'explore-theme' : ''), [isExplore])

  const inLesson = pageIndex < steps.length
  const quizIndex = pageIndex - steps.length
  const currentQuiz = quizzes[quizIndex]

  const goNextQuestion = () => {
    setPageIndex(prev => prev + 1)
    setSelectedOption(null)
    setAnsweredCorrectly(false)
    setShowFeedback(false)
    setQuestionMissed(false)
  }

  const handleCheck = () => {
    if (selectedOption === currentQuiz.correctAnswer) {
      setAnsweredCorrectly(true)
      if (!questionMissed) setFirstTryCount(prev => prev + 1)
    } else {
      setShowFeedback(true)
      setQuestionMissed(true)
      setWrongAttempts(prev => prev + 1)
      setWrongAnswers(prev => [...prev, {
        q: currentQuiz.question,
        chose: currentQuiz.options[selectedOption],
        correct: currentQuiz.options[currentQuiz.correctAnswer],
      }])
    }
  }

  const handleFinish = () => {
    if (submitting) return
    setSubmitting(true)
    onFinished({
      firstTryCount,
      total: quizzes.length,
      wrongAttempts,
      wrongAnswers,
      durationSeconds: Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
    })
  }

  return (
    <div className={`book-reader-container card glass ${t}`}>
      <div className="reader-header">
        <span className="book-title-header">{topic.emoji} {topic.title}</span>
        <button type="button" className="btn-close-reader" onClick={onClose}>
          ✕ Đóng lại
        </button>
      </div>

      <div className="reader-content-body">
        {inLesson ? (
          /* Phần lý thuyết & kiến thức trọng tâm dạng thẻ visual */
          <div className="math-step-view">
            <div className="math-step-header">
              <span className="quiz-tag glow">{topic.lesson.badge}</span>
              <span className="math-step-badge">
                {isExplore ? 'Phần' : 'Bài'} {pageIndex + 1} / {steps.length}
              </span>
            </div>

            <div className="math-lesson-card glass">
              {/* Hình minh hoạ emoji cho Khám Phá */}
              {isExplore && (() => {
                const illus = exploreIllustrations[topic.id]?.[pageIndex]
                if (!illus) return null
                return (
                  <div className="explore-illus-scene" style={{ background: illus.bg }}>
                    <div className="explore-illus-emojis">{illus.emojis}</div>
                    <span className="explore-illus-label">{illus.label}</span>
                  </div>
                )
              })()}

              <h3 className="math-step-title">{steps[pageIndex].title}</h3>
              <p className="math-step-desc">{steps[pageIndex].desc}</p>

              {/* Toán: công thức nổi bật — Khám phá: ô "sự thật thú vị" */}
              {steps[pageIndex].formula && (
                <div className="math-formula-box">
                  <span className="formula-icon">{isExplore ? '🔎' : '⚡'}</span>
                  <div className="formula-text">{steps[pageIndex].formula}</div>
                </div>
              )}

              {steps[pageIndex].tip && (
                <div className="math-tip-box">
                  <span className="tip-text">{steps[pageIndex].tip}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Phần trắc nghiệm */
          <div className="reader-quiz-view math-quiz-theme">
            <div className="math-quiz-header">
              <span className="quiz-tag math-quiz-tag">
                🧠 THỬ THÁCH CÂU {quizIndex + 1} / {quizzes.length}
              </span>
              <span className="math-star-reward">⭐️ {topic.stars} Sao trọn bài</span>
            </div>

            <h4 className="quiz-question math-question-title">{currentQuiz.question}</h4>

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
                  className={`quiz-option-btn math-option-card ${selectedOption === idx ? 'selected' : ''}`}
                  disabled={answeredCorrectly}
                  onClick={() => {
                    setSelectedOption(idx)
                    setShowFeedback(false)
                  }}
                >
                  <span className="option-letter-badge">{String.fromCharCode(65 + idx)}</span>
                  <span className="option-text-val">{option}</span>
                </button>
              ))}
            </div>

            {showFeedback && !answeredCorrectly && (
              <div className="error-banner animate-bounce">❌ {tone.quizWrong}</div>
            )}

            {answeredCorrectly && (
              <div className="success-banner moral-box math-success-box">
                <span className="moral-title">
                  {isExplore ? '🎉 CHÍNH XÁC! GIẢI THÍCH THÊM:' : '🎉 XUẤT SẮC! LỜI GIẢI CHI TIẾT:'}
                </span>
                <p className="moral-text">{currentQuiz.explanation}</p>
              </div>
            )}

            <div className="quiz-actions">
              {!answeredCorrectly ? (
                <button
                  type="button"
                  className="btn btn-primary math-action-btn"
                  disabled={selectedOption === null}
                  onClick={handleCheck}
                >
                  💡 Kiểm tra kết quả
                </button>
              ) : quizIndex < quizzes.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary math-action-btn"
                  onClick={goNextQuestion}
                >
                  Câu hỏi tiếp theo ➜
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success animate-pulse math-action-btn"
                  disabled={submitting}
                  onClick={handleFinish}
                >
                  Hoàn thành &amp; Nhận {topic.stars} Sao! ⭐️
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="reader-footer">
        <span className="page-indicator">
          {inLesson
            ? `${isExplore ? 'Kiến thức' : 'Lý thuyết'}: Trang ${pageIndex + 1} / ${steps.length}`
            : `Thử thách: Câu ${quizIndex + 1} / ${quizzes.length}`}
        </span>

        {inLesson && (
          <div className="navigation-buttons">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(prev => prev - 1)}
            >
              ⇦ Quay lại
            </button>
            {pageIndex === steps.length - 1 ? (
              <ReadingGateButton
                className="btn btn-primary btn-sm"
                text={[steps[pageIndex]?.desc, steps[pageIndex]?.tip].filter(Boolean).join(' ')}
                tone={tone}
                onReady={() => setPageIndex(prev => prev + 1)}
              >
                Vào làm bài trắc nghiệm ➜
              </ReadingGateButton>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setPageIndex(prev => prev + 1)}
              >
                Xem tiếp ➜
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
