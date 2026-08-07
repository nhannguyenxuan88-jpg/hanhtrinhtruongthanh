import { useState } from 'react'

export default function StoryStreamView({
  profile,
  familyId,
  tone,
  childBalance,
  streakInfo,
  todayLesson,
  todayBook,
  todayChore,
  targetGoal,
  onOpenShop,
  onOpenLesson,
  onOpenBook,
  onCompleteChore,
  onOpenParentPin,
  onOpenFreePlay,
  celebrate
}) {
  const [chestOpened, setChestOpened] = useState(false)
  const [showChestModal, setShowChestModal] = useState(false)

  // Determine completion state of the 3 daily cards
  const isLessonDone = todayLesson?.isDone || false
  const isBookDone = todayBook?.isDone || false
  const isChoreDone = todayChore?.isDone || false

  const completedCardsCount = (isLessonDone ? 1 : 0) + (isBookDone ? 1 : 0) + (isChoreDone ? 1 : 0)
  const isAllDone = completedCardsCount === 3

  // Current active card index (0, 1, or 2)
  const activeCardIdx = !isLessonDone ? 0 : !isBookDone ? 1 : !isChoreDone ? 2 : 3

  const handleOpenChest = () => {
    setChestOpened(true)
    setShowChestModal(true)
    if (celebrate) celebrate({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
  }

  // Format helper to split title into sub-tag and main title, removing emoji clutter
  const formatTitleParts = (rawTitle) => {
    if (!rawTitle) return { subTag: null, mainTitle: '' }
    let cleaned = rawTitle.replace(/^[📗📖🧹🔓\s:]+/, '').trim()
    const match = cleaned.match(/^(.*?\(Tuần\s*\d+\)):\s*(.*)$/i)
    if (match) {
      return { subTag: match[1], mainTitle: match[2] }
    }
    return { subTag: null, mainTitle: cleaned }
  }

  const lessonParts = formatTitleParts(todayLesson?.title || 'Bài 5: Phép cộng có nhớ trong phạm vi 100')
  const bookParts = formatTitleParts(todayBook?.title || 'Cổ tích Lô-gíc: Bí mật kẻ ăn vụng cá')
  const choreParts = formatTitleParts(todayChore?.title || 'Tự dọn dẹp đồ chơi sau khi chơi xong')

  return (
    <div className="story-stream-container">
      {/* Top Floating Bar */}
      <header className="story-stream-topbar glass">
        <div className="profile-chip">
          <span className="profile-avatar">{profile.child.avatar}</span>
          <div className="profile-name-box">
            <strong>{profile.child.name}</strong>
            <span className="grade-sub">Lớp {profile.child.grade || 2}</span>
          </div>
        </div>

        <div className="top-stats-row">
          <div className="stat-pill streak-pill">
            <span className="fire-anim">🔥</span>
            <span>{streakInfo?.currentStreak || 1} Ngày</span>
          </div>
          <div className="stat-pill star-pill">
            <span>⭐</span>
            <span>{childBalance} Sao</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-parent-lock glass"
          onClick={onOpenParentPin}
          title="Vào Góc Quản Lý Bố Mẹ"
        >
          🔑 Bố Mẹ
        </button>
      </header>

      {/* Main Single Card Stage */}
      <main className="story-stream-stage">
        {/* Step Counter Indicator */}
        <div className="stream-progress-header text-center">
          <span className="progress-badge">
            NHIỆM VỤ HÔM NAY: {completedCardsCount}/3 THẺ
          </span>
          <div className="stream-progress-bar-track">
            <div
              className="stream-progress-bar-fill"
              style={{ width: `${Math.round((completedCardsCount / 3) * 100)}%` }}
            />
          </div>
        </div>

        {/* Target Reward Goal Widget */}
        {targetGoal && (
          <div className="target-goal-banner glass margin-bottom">
            <div className="goal-banner-left">
              <span className="goal-emoji">{targetGoal.emoji || '🎁'}</span>
              <div className="goal-text-box">
                <strong className="goal-title">🎯 MỤC TIÊU PHẤN ĐẤU: {targetGoal.title}</strong>
                <div className="goal-sub-text">
                  {childBalance >= targetGoal.cost ? (
                    <span className="goal-success-text">🎉 Bé đã đủ {targetGoal.cost} ⭐! Bấm để đổi ngay!</span>
                  ) : (
                    <span>Bé có {childBalance}/{targetGoal.cost} ⭐ (Còn thiếu {targetGoal.cost - childBalance} ⭐)</span>
                  )}
                </div>
                <div className="goal-progress-track">
                  <div
                    className="goal-progress-fill"
                    style={{ width: `${Math.min(100, Math.round((childBalance / Math.max(1, targetGoal.cost)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              className={`goal-action-btn ${childBalance >= targetGoal.cost ? 'can-afford glow animate-pulse' : ''}`}
              onClick={onOpenShop}
            >
              {childBalance >= targetGoal.cost ? '🎁 Đổi Quà!' : '🎯 Cửa Hàng'}
            </button>
          </div>
        )}

        {/* 1 Single Active Hero Card */}
        {!isAllDone ? (
          <div className="hero-story-card-wrapper animate-slide-up">
            {activeCardIdx === 0 && (
              <div className="hero-card lesson-theme glass">
                <div className="card-top-tag">THẺ 1 / 3: BÀI HỌC HÔM NAY</div>
                <div className="card-hero-icon">📗</div>
                {lessonParts.subTag && (
                  <div className="card-lesson-subtag">{lessonParts.subTag}</div>
                )}
                <h2 className="card-hero-title">
                  {lessonParts.mainTitle}
                </h2>
                <p className="card-hero-subtitle">
                  {todayLesson?.subtitle || 'Học 10 phút để rèn tư duy và tích lũy +10 Sao thưởng nhé!'}
                </p>
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-hero-action glow animate-pulse"
                  onClick={onOpenLesson}
                >
                  ▶ BẮT ĐẦU HỌC 10 PHÚT 🚀
                </button>
              </div>
            )}

            {activeCardIdx === 1 && (
              <div className="hero-card book-theme glass">
                <div className="card-top-tag">THẺ 2 / 3: BÀI ĐỌC & KHÁM PHÁ</div>
                <div className="card-hero-icon">📖</div>
                {bookParts.subTag && (
                  <div className="card-lesson-subtag">{bookParts.subTag}</div>
                )}
                <h2 className="card-hero-title">
                  {bookParts.mainTitle}
                </h2>
                <p className="card-hero-subtitle">
                  {todayBook?.subtitle || 'Đọc một câu chuyện ngắn thú vị để nhận +5 Sao thưởng nào!'}
                </p>
                <button
                  type="button"
                  className="btn btn-success btn-block btn-hero-action glow animate-pulse"
                  onClick={onOpenBook}
                >
                  ▶ ĐỌC TRUYỆN NGAY 📖
                </button>
              </div>
            )}

            {activeCardIdx === 2 && (
              <div className="hero-card chore-theme glass">
                <div className="card-top-tag">THẺ 3 / 3: VIỆC NHÀ RÈN LUYỆN</div>
                <div className="card-hero-icon">🧹</div>
                {choreParts.subTag && (
                  <div className="card-lesson-subtag">{choreParts.subTag}</div>
                )}
                <h2 className="card-hero-title">
                  {choreParts.mainTitle}
                </h2>
                <p className="card-hero-subtitle">
                  {todayChore?.description || 'Hoàn thành việc nhà bố mẹ giao để mở Rương Kho Báu Ngày!'}
                </p>
                <button
                  type="button"
                  className="btn btn-warning btn-block btn-hero-action glow animate-pulse"
                  onClick={onCompleteChore}
                >
                  ✔ BÁO HOÀN THÀNH BỐ MẸ DUYỆT 👍
                </button>
              </div>
            )}
          </div>
        ) : (
          /* All 3 Cards Completed -> Treasure Chest Stage */
          <div className="treasure-chest-hero-stage card glass text-center animate-bounce">
            <div className="chest-badge-head">🎉 TẤT CẢ THẺ NGÀY ĐÃ HOÀN THÀNH!</div>
            <h2 className="chest-title">RƯƠNG KHO BÁU HÔM NAY 🎁</h2>
            <p className="chest-subtitle">
              Chúc mừng {profile.child.name}! Con đã hoàn thành xuất sắc 3/3 nhiệm vụ ngày hôm nay!
            </p>

            <div className="chest-graphic-box">
              {!chestOpened ? (
                <button
                  type="button"
                  className="chest-closed-btn animate-pulse"
                  onClick={handleOpenChest}
                >
                  🎁
                  <span className="open-chest-lbl">CHẠM ĐỂ MỞ RƯƠNG!</span>
                </button>
              ) : (
                <div className="chest-opened-box">
                  <span className="chest-open-icon">💎</span>
                  <div className="reward-claim-badge">+20 SAO THƯỞNG DAILY ⭐</div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg free-play-unlock-btn glow margin-top"
              onClick={onOpenFreePlay}
            >
              🎮 SÂN CHƠI TỰ DO & SHOP QUÀ (ĐÃ MỞ KHÓA) ➔
            </button>
          </div>
        )}
      </main>

      {/* Persistent Bottom Free Play Trigger (Available anytime or highlighted when done) */}
      <footer className="story-stream-footer">
        <button
          type="button"
          className={`free-play-trigger-btn glass ${isAllDone ? 'unlocked-glow' : ''}`}
          onClick={onOpenFreePlay}
        >
          <span className="icon">🎮</span>
          <span>Sân Chơi Tự Do &amp; Shop Quà</span>
          {isAllDone && <span className="unlocked-badge">ĐÃ MỞ 🎁</span>}
        </button>
      </footer>

      {/* Chest Reward Modal */}
      {showChestModal && (
        <div className="pin-overlay">
          <div className="pin-dialog glass card text-center">
            <div className="modal-chest-icon">💎</div>
            <h3>NHẬN RƯƠNG KHO BÁU!</h3>
            <p>Con nhận được <strong>+20 Sao thưởng</strong> và duy trì chuỗi <strong>{streakInfo?.currentStreak || 1} Ngày Streak 🔥</strong>!</p>
            <button
              type="button"
              className="btn btn-success btn-block margin-top"
              onClick={() => setShowChestModal(false)}
            >
              Cảm ơn Bố Mẹ! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
