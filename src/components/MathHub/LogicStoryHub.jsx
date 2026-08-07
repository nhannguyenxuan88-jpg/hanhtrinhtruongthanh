import { useState } from 'react'
import { logicStories } from '../../lib/mathData'

export default function LogicStoryHub({ onFinishedStory }) {
  const [selectedStory, setSelectedStory] = useState(null)
  const [pageIdx, setPageIdx] = useState(0)
  const [selectedQuizOpt, setSelectedQuizOpt] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handleOpenStory = (story) => {
    setSelectedStory(story)
    setPageIdx(0)
    setSelectedQuizOpt(null)
    setShowFeedback(false)
    setIsDone(false)
  }

  const handleCheckAnswer = () => {
    if (!selectedStory || selectedQuizOpt === null) return
    const isRight = selectedQuizOpt === selectedStory.quiz.correctAnswer
    setShowFeedback(true)
    if (isRight) {
      setIsDone(true)
      if (onFinishedStory) {
        onFinishedStory(10, `Đọc truyện ${selectedStory.title}`)
      }
    }
  }

  return (
    <div className="logic-story-hub-container">
      {!selectedStory ? (
        <>
          {/* Header */}
          <div className="story-hub-header glass">
            <span className="story-logo-badge">📖 CỔ TÍCH VỀ LÔ-GÍCH</span>
            <h2>Cổ Tích Về Lô-Gíc Kurio</h2>
            <p className="subtitle">
              Học toán suy luận thật vui qua những câu chuyện cổ tích và truyện tranh hấp dẫn!
            </p>
          </div>

          {/* Stories Grid */}
          <div className="stories-grid">
            {logicStories.map((story) => (
              <div key={story.id} className="story-card glass">
                <div className="story-card-cover">
                  <span className="story-badge">{story.coverBadge}</span>
                  <span className="story-emoji">{story.emoji}</span>
                </div>
                <h3>{story.title}</h3>
                <p className="summary-text">{story.summary}</p>
                <button
                  type="button"
                  className="btn btn-primary btn-block glow"
                  onClick={() => handleOpenStory(story)}
                >
                  Đọc truyện ngay ➔
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Reading View */
        <div className="story-reader-card card glass">
          <div className="story-reader-header">
            <span className="story-reader-title">{selectedStory.title}</span>
            <button
              type="button"
              className="btn-close-reader"
              onClick={() => setSelectedStory(null)}
            >
              ✕ Đóng lại
            </button>
          </div>

          <div className="story-reader-body">
            {pageIdx < selectedStory.pages.length ? (
              /* Story Page Content */
              <div className="story-page-content">
                <div className="page-header-tag">
                  Trang {pageIdx + 1} / {selectedStory.pages.length}
                </div>
                <h3>{selectedStory.pages[pageIdx].title}</h3>
                <p className="story-paragraph-text">{selectedStory.pages[pageIdx].text}</p>

                {selectedStory.pages[pageIdx].dialogue && (
                  <div className="story-character-dialogue">
                    <span className="char-avatar">{selectedStory.pages[pageIdx].dialogue.avatar}</span>
                    <div className="char-bubble">
                      <strong>{selectedStory.pages[pageIdx].dialogue.character}:</strong> "{selectedStory.pages[pageIdx].dialogue.text}"
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Final Logic Quiz */
              <div className="story-quiz-content">
                <span className="quiz-tag">🧠 THỬ THÁCH SUY LUẬN LÔ-GÍCH</span>
                <h3 className="quiz-question-text">{selectedStory.quiz.question}</h3>

                <div className="story-quiz-options">
                  {selectedStory.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`story-opt-btn ${selectedQuizOpt === idx ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedQuizOpt(idx)
                        setShowFeedback(false)
                      }}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + idx)}.</span>
                      <span className="opt-val">{opt}</span>
                    </button>
                  ))}
                </div>

                {showFeedback && (
                  <div className={`quiz-feedback-banner ${selectedQuizOpt === selectedStory.quiz.correctAnswer ? 'success' : 'wrong'}`}>
                    {selectedQuizOpt === selectedStory.quiz.correctAnswer ? (
                      <>
                        <div className="feedback-head">🎉 CHÍNH XÁC RỒI!</div>
                        <p>{selectedStory.quiz.explanation}</p>
                      </>
                    ) : (
                      <>
                        <div className="feedback-head">❌ CHƯA CHÍNH XÁC!</div>
                        <p>Bé hãy đọc lại manh mối trong truyện và chọn lại nhé!</p>
                      </>
                    )}
                  </div>
                )}

                <div className="quiz-actions-row">
                  {!isDone ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-lg glow"
                      disabled={selectedQuizOpt === null}
                      onClick={handleCheckAnswer}
                    >
                      💡 Kiểm tra đáp án
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success btn-lg animate-bounce"
                      onClick={() => setSelectedStory(null)}
                    >
                      Hoàn thành & nhận +10 ⭐!
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="story-reader-footer">
            <span className="page-num-lbl">
              {pageIdx < selectedStory.pages.length ? `Trang ${pageIdx + 1}` : 'Thử thách cuối'}
            </span>
            {pageIdx < selectedStory.pages.length && (
              <div className="nav-btns">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={pageIdx === 0}
                  onClick={() => setPageIdx(prev => prev - 1)}
                >
                  ⇦ Trang trước
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setPageIdx(prev => prev + 1)}
                >
                  {pageIdx === selectedStory.pages.length - 1 ? 'Trả lời câu đố ➜' : 'Trang sau ➜'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
