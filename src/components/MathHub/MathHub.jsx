import { useState } from 'react'
import LearningPathMap from './LearningPathMap'
import IkmcExamHub from './IkmcExamHub'
import LogicStoryHub from './LogicStoryHub'
import MathCombatArena from './MathCombatArena'
import InfographicLessonCard from './InfographicLessonCard'
import PikaTutorModal from '../PikaTutor/PikaTutorModal'
import TopicReader from '../TopicReader'
import { mathData, getDynamicQuizForNode } from '../../lib/mathData'

export default function MathHub({
  profile,
  familyId,
  tone,
  kidAgeGroup,
  setKidAgeGroup,
  selectedMathTopic,
  setSelectedMathTopic,
  onFinishedTopic,
  renderTopicGrid,
  addStars,
  safeLogLearningSession,
  showToast
}) {
  const [activeSubTab, setActiveSubTab] = useState('path') // 'path' | 'ikmc' | 'stories' | 'combat' | 'ai' | 'topics'
  const [activeInfographicLesson, setActiveInfographicLesson] = useState(null)

  // Demo Infographic lesson fallback
  const demoInfographicLesson = {
    badge: 'MẸO HỌC TOÁN TRỰC QUAN',
    title: 'Số La Mã & Mẹo Đếm Ngày Trên Tay',
    subtitle: 'Học toán cực vui cùng phương pháp hình ảnh trực quan!',
    type: 'roman_numerals',
    dialogue: {
      boyQuestion: 'Minh và Chi giống nhau hình gì?',
      girlAnswer: 'Minh và Chi giống nhau hình ngôi sao ★!'
    }
  }

  return (
    <div className="kurio-math-hub-wrapper">
      {/* Top Header Bar Kurio Style */}
      <div className="kurio-top-bar glass">
        <div className="grade-selector-chip">
          <span className="shield-icon">🛡️</span>
          <strong>LỚP {profile?.child?.grade || 2}</strong>
        </div>

        <div className="bar-widgets-row">
          <div className="top-widget streak-widget">
            <span className="flame-anim">🔥</span>
            <span className="widget-num">1</span>
          </div>

          <div className="top-widget coin-widget">
            <span className="coin-anim">🪙</span>
            <span className="widget-num">1</span>
          </div>

          <div className="top-widget elo-widget">
            <span className="rank-icn">🔨</span>
            <span className="widget-num">ĐÁ 2 (429)</span>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <nav className="kurio-hub-subtabs">
        <button
          type="button"
          className={`hub-tab-btn ${activeSubTab === 'path' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('path')}
        >
          🗺️ Lộ Trình Học
        </button>

        <button
          type="button"
          className={`hub-tab-btn ${activeSubTab === 'ikmc' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('ikmc')}
        >
          🏆 Luyện Thi IKMC
        </button>

        <button
          type="button"
          className={`hub-tab-btn ${activeSubTab === 'stories' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('stories')}
        >
          📖 Cổ Tích Lô-gíc
        </button>

        <button
          type="button"
          className={`hub-tab-btn ${activeSubTab === 'combat' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('combat')}
        >
          ⚔️ 1v1 Combat
        </button>

        <button
          type="button"
          className={`hub-tab-btn ${activeSubTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('ai')}
        >
          🤖 Gia Sư AI
        </button>

        <button
          type="button"
          className={`hub-tab-btn ${activeSubTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('topics')}
        >
          🧮 Danh Mục Bài
        </button>
      </nav>

      {/* Mode Contents */}
      <div className="kurio-hub-main-body">
        {activeSubTab === 'path' && (
          <LearningPathMap
            onSelectNode={(node) => {
              if (node.isChest) {
                if (addStars && profile?.child?.id) {
                  addStars(familyId, profile.child.id, node.rewardStars || 15, `Mở Rương Kho Báu mốc Cấp ${node.level}`)
                }
                showToast && showToast(`🎁 CHÚC MỪNG CON! Mở Rương Kho Báu Mốc Cấp ${node.level} nhận được +${node.rewardStars || 15} ⭐! 🎉`)
                return
              }
              if (node.level === 7) {
                setActiveSubTab('ikmc')
                showToast && showToast('🏆 Đã mở Chế độ Luyện Thi IKMC Kangaroo Quốc Tế!')
                return
              }
              if (node.level === 8) {
                setActiveSubTab('combat')
                showToast && showToast('⚔️ Đã mở Đấu Trường Cao Thủ 1v1 Combat!')
                return
              }
              const currentGrade = profile?.child?.grade || 2
              const specificLesson = node.lesson || demoInfographicLesson
              const dynamicQuiz = getDynamicQuizForNode(node, currentGrade)
              setActiveInfographicLesson({ lesson: specificLesson, quiz: dynamicQuiz, node })
            }}
          />
        )}

        {activeInfographicLesson && (
          <div className="infographic-modal-overlay">
            <div className="infographic-modal-dialog">
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setActiveInfographicLesson(null)}
              >
                ✕ Đóng
              </button>
              <InfographicLessonCard
                lesson={activeInfographicLesson.lesson}
                quiz={activeInfographicLesson.quiz}
                onFinished={async () => {
                  if (addStars && profile?.child?.id) {
                    await addStars(familyId, profile.child.id, 10, `Hoàn thành mốc Cấp ${activeInfographicLesson.node?.level || 1}: ${activeInfographicLesson.node?.title || ''}`)
                  }
                  showToast && showToast(`🎉 Xuất sắc! Con vượt qua mốc Cấp ${activeInfographicLesson.node?.level || 1} nhận được +10 ⭐!`)
                  setActiveInfographicLesson(null)
                }}
              />
            </div>
          </div>
        )}

        {activeSubTab === 'ikmc' && (
          <IkmcExamHub
            onFinishedExam={async (stars, reason) => {
              if (addStars && profile?.child?.id) {
                await addStars(familyId, profile.child.id, stars, reason)
                showToast && showToast(`🏆 Con nhận được +${stars} ⭐ luyện thi IKMC!`)
              }
            }}
          />
        )}

        {activeSubTab === 'stories' && (
          <LogicStoryHub
            onFinishedStory={async (stars, reason) => {
              if (addStars && profile?.child?.id) {
                await addStars(familyId, profile.child.id, stars, reason)
                showToast && showToast(`📖 Con nhận được +${stars} ⭐ đọc truyện Lô-gíc!`)
              }
            }}
          />
        )}

        {activeSubTab === 'combat' && (
          <MathCombatArena
            playerProfile={profile}
            onFinishedCombat={async (stars, reason) => {
              if (addStars && profile?.child?.id) {
                await addStars(familyId, profile.child.id, stars, reason)
                showToast && showToast(`⚔️ Con nhận được +${stars} ⭐ thắng Đấu trường Combat!`)
              }
            }}
          />
        )}

        {activeSubTab === 'ai' && (
          <div className="kurio-ai-tutor-pane card glass">
            <div className="ai-banner-header">
              <span className="ai-sparkles-icon">✨</span>
              <div>
                <h3>kurio AI - Trợ lý AI Giải Toán Thông Minh</h3>
                <p className="subtitle">Chụp hoặc tải ảnh bài toán để được Pika AI hỗ trợ giải chi tiết nhé!</p>
              </div>
            </div>

            <PikaTutorModal
              profile={profile}
              isModal={false}
              onRewardStars={async (stars, reason) => {
                if (addStars && profile?.child?.id) {
                  await addStars(familyId, profile.child.id, stars, reason)
                  showToast && showToast(`🎉 Con nhận được +${stars} ⭐ từ Gia Sư Pika AI!`)
                }
              }}
              onLogSession={async (sessionData) => {
                if (safeLogLearningSession && profile?.child?.id) {
                  await safeLogLearningSession(familyId, profile.child.id, sessionData)
                }
              }}
            />
          </div>
        )}

        {activeSubTab === 'topics' && (
          <div className="topics-catalog-pane">
            {!selectedMathTopic ? (
              <>
                <h3 className="section-title text-center">🧮 Danh Mục Chủ Đề Toán Tư Duy</h3>

                <div className="age-group-toggle">
                  <button
                    type="button"
                    className={`toggle-age-btn ${kidAgeGroup === 'kids' ? 'active' : ''}`}
                    onClick={() => setKidAgeGroup('kids')}
                  >
                    🧸 Toán Tiểu Học
                  </button>
                  <button
                    type="button"
                    className={`toggle-age-btn ${kidAgeGroup === 'teens' ? 'active' : ''}`}
                    onClick={() => setKidAgeGroup('teens')}
                  >
                    🧭 Tư Duy Tuổi Teen
                  </button>
                </div>

                {renderTopicGrid && renderTopicGrid({
                  topics: mathData[kidAgeGroup],
                  catalogKey: 'math',
                  cardSubtitle: (topic) => `${topic.quizzes?.length || 0} thử thách trắc nghiệm`,
                  onOpen: setSelectedMathTopic,
                  lockedToast: '🔒 Chủ đề này chưa được mở.',
                })}
              </>
            ) : (
              <TopicReader
                key={selectedMathTopic.id}
                topic={selectedMathTopic}
                tone={tone}
                theme="math"
                onClose={() => setSelectedMathTopic(null)}
                onFinished={(result) => onFinishedTopic && onFinishedTopic(selectedMathTopic, 'math', result)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
