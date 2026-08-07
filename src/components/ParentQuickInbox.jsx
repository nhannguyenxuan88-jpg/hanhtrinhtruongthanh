import { useState } from 'react'

export default function ParentQuickInbox({
  childrenList,
  completions,
  redemptions,
  tasks,
  weeklyPlans,
  learningSessions = [],
  onApproveCompletion,
  onApproveRedemption,
  onAssignLesson,
  onSavePlan,
  onSignOut,
  onSwitchProfile
}) {
  const [parentTab, setParentTab] = useState('inbox') // 'inbox' | 'assign' | 'stats'
  const [selectedChildStatsId, setSelectedChildStatsId] = useState('all')

  const pendingCompletions = completions.filter(c => c.status === 'pending')
  const pendingRedemptions = redemptions.filter(r => r.status === 'pending')
  const totalPending = pendingCompletions.length + pendingRedemptions.length

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) {
      if (d.getDate() === now.getDate()) {
        return `Hôm nay ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
      }
      return `Hôm qua ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    }
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="parent-quick-inbox-container">
      {/* Top Header */}
      <header className="parent-header glass">
        <div className="header-brand">
          <span className="brand-emoji">🔑</span>
          <div>
            <h2>Góc Quản Lý Bố Mẹ</h2>
            <p className="subtitle">Duyệt nhanh nộp bài &amp; giao lộ trình rèn luyện cho các con</p>
          </div>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onSwitchProfile}>
            🔁 Đổi hồ sơ
          </button>
          <button type="button" className="btn btn-danger btn-sm" onClick={onSignOut}>
            🚪 Đăng xuất
          </button>
        </div>
      </header>

      {/* 3 Main Parent Navigation Tabs */}
      <nav className="parent-nav-tabs">
        <button
          type="button"
          className={`parent-tab-btn ${parentTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setParentTab('inbox')}
        >
          📥 Hộp Thư Duyệt (Inbox)
          {totalPending > 0 && <span className="badge-count">{totalPending}</span>}
        </button>

        <button
          type="button"
          className={`parent-tab-btn ${parentTab === 'assign' ? 'active' : ''}`}
          onClick={() => setParentTab('assign')}
        >
          🎯 Giao Bài &amp; Kế Hoạch Tuần
        </button>

        <button
          type="button"
          className={`parent-tab-btn ${parentTab === 'stats' ? 'active' : ''}`}
          onClick={() => setParentTab('stats')}
        >
          📊 Tiến Độ &amp; Cài Đặt
        </button>
      </nav>

      {/* Main Tab Views */}
      <main className="parent-main-content">
        {parentTab === 'inbox' && (
          <div className="inbox-pane card glass">
            <h3>📥 Yêu Cầu Cần Duyệt Nhanh ({totalPending})</h3>

            {totalPending === 0 ? (
              <p className="empty-message">🎉 Tuyệt vời! Hiện không có yêu cầu chờ duyệt nào.</p>
            ) : (
              <div className="inbox-items-list">
                {/* Pending Completions */}
                {pendingCompletions.map(comp => {
                  const child = childrenList.find(c => c.id === comp.child_id)
                  const task = tasks.find(t => t.id === comp.task_id)
                  return (
                    <div key={comp.id} className="inbox-item-card">
                      <div className="item-info">
                        <span className="child-badge">{child?.avatar} {child?.name}</span>
                        <strong>{task?.title || comp.child_note || 'Nhiệm vụ rèn luyện'}</strong>
                        {comp.child_note && <p className="child-msg">💬 "{comp.child_note}"</p>}
                      </div>
                      <div className="item-stars">+{comp.stars} ⭐</div>
                      <div className="item-actions">
                        <button
                          type="button"
                          className="btn btn-success btn-sm glow"
                          onClick={() => onApproveCompletion(comp, 'approve')}
                        >
                          ✔ Duyệt cộng sao
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* Pending Redemptions */}
                {pendingRedemptions.map(red => {
                  const child = childrenList.find(c => c.id === red.child_id)
                  return (
                    <div key={red.id} className="inbox-item-card reward-theme">
                      <div className="item-info">
                        <span className="child-badge blue">{child?.avatar} {child?.name}</span>
                        <strong>🎁 Đổi quà: {red.rewards?.title || 'Phần quà'}</strong>
                      </div>
                      <div className="item-stars spent">-{red.cost} ⭐</div>
                      <div className="item-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm glow"
                          onClick={() => onApproveRedemption(red, true)}
                        >
                          🎁 Đã trao quà
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {parentTab === 'assign' && (
          <div className="assign-pane card glass">
            <h3>🎯 Giao Bài Học &amp; Kế Hoạch Tuần</h3>
            <p className="subtitle">Chọn hồ sơ con và giao lộ trình tự động theo khối lớp</p>
            {/* Quick Assign Buttons */}
            <div className="quick-assign-box">
              {childrenList.map(child => (
                <div key={child.id} className="assign-child-row">
                  <span>{child.avatar} <strong>{child.name}</strong> (Lớp {child.grade || 2})</span>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onAssignLesson && onAssignLesson(child.id)}
                  >
                    ⚡ Giao tự động Tuần hiện tại
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {parentTab === 'stats' && (
          <div className="stats-pane card glass">
            <div className="stats-pane-header text-center">
              <h3>📊 Báo Cáo Tiến Độ &amp; Nhật Ký Học Tập Chi Tiết</h3>
              <p className="subtitle">Xem chi tiết từng bài học, việc nhà và số sao tích lũy của từng bé</p>
            </div>

            {/* Top Overview Cards */}
            <div className="stats-summary-grid margin-bottom">
              <div className="stat-card">
                <span className="stat-num">{childrenList.length}</span>
                <span className="stat-lbl">Hồ sơ con</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">
                  {completions.filter(c => c.status === 'approved').length + (learningSessions || []).length}
                </span>
                <span className="stat-lbl">Lượt học &amp; Hoàn thành</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">
                  {(learningSessions || []).reduce((sum, s) => sum + (s.stars_earned || 0), 0) +
                   completions.filter(c => c.status === 'approved').reduce((sum, c) => sum + (c.stars || 0), 0)}
                </span>
                <span className="stat-lbl">Sao đã nhận ⭐</span>
              </div>
            </div>

            {/* Child Filter Sub-Tabs */}
            <div className="stats-child-filter-bar">
              <button
                type="button"
                className={`child-filter-pill ${selectedChildStatsId === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedChildStatsId('all')}
              >
                👥 Tất cả các con ({childrenList.length})
              </button>
              {childrenList.map(child => (
                <button
                  key={child.id}
                  type="button"
                  className={`child-filter-pill ${selectedChildStatsId === child.id ? 'active' : ''}`}
                  onClick={() => setSelectedChildStatsId(child.id)}
                >
                  {child.avatar} {child.name} (Lớp {child.grade || 2})
                </button>
              ))}
            </div>

            {/* Individual Child Progress Cards */}
            <div className="child-progress-list">
              {(selectedChildStatsId === 'all'
                ? childrenList
                : childrenList.filter(c => c.id === selectedChildStatsId)
              ).map(child => {
                const childComps = completions.filter(c => c.child_id === child.id && c.status === 'approved')
                const childSessions = (learningSessions || []).filter(s => s.child_id === child.id)
                
                const sgkCount = childSessions.filter(s => s.kind === 'sgk' || s.kind === 'math').length
                const bookCount = childSessions.filter(s => s.kind === 'book').length
                const choreCount = childComps.filter(c => {
                  const task = tasks.find(t => t.id === c.task_id)
                  return !task?.task_type || task?.task_type === 'chore'
                }).length

                const totalChildStars = childComps.reduce((s, c) => s + (c.stars || 0), 0) +
                  childSessions.reduce((s, ls) => s + (ls.stars_earned || 0), 0)

                // Combine recent activities sorted by latest
                const activities = [
                  ...childSessions.map(s => ({
                    id: 'session-' + s.id,
                    type: s.kind || 'sgk',
                    title: s.title || 'Bài học trong app',
                    time: s.studied_at || s.created_at,
                    stars: s.stars_earned || 0,
                    detail: s.quiz_total ? `Đúng ${s.quiz_first_try}/${s.quiz_total} câu ngay lần đầu` : 'Đã học xong',
                    parentFeedback: null
                  })),
                  ...childComps.map(c => {
                    const task = tasks.find(t => t.id === c.task_id)
                    return {
                      id: 'comp-' + c.id,
                      type: task?.task_type || 'chore',
                      title: task?.title || 'Nhiệm vụ hàng ngày',
                      time: c.created_at,
                      stars: c.stars || 0,
                      detail: c.child_note ? `Bé nhắn: "${c.child_note}"` : 'Đã hoàn thành',
                      parentFeedback: c.parent_feedback ? `Lời phê của Bố Mẹ: "${c.parent_feedback}"` : null
                    }
                  })
                ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))

                return (
                  <div key={child.id} className="child-stat-detail-card card glass margin-top">
                    <div className="child-stat-header">
                      <div className="child-info-row">
                        <span className="child-avatar-lg">{child.avatar}</span>
                        <div>
                          <h4 className="child-name-heading">{child.name}</h4>
                          <span className="badge-grade">Lớp {child.grade || 2}</span>
                        </div>
                      </div>
                      <div className="child-total-stars-badge">
                        ⭐️ {totalChildStars} Sao tích lũy
                      </div>
                    </div>

                    {/* Breakdown Badges Grid */}
                    <div className="child-breakdown-grid">
                      <div className="breakdown-pill sgk">
                        <span className="pill-icon">📗</span>
                        <div>
                          <strong>{sgkCount} bài</strong>
                          <small>SGK &amp; Toán học</small>
                        </div>
                      </div>
                      <div className="breakdown-pill book">
                        <span className="pill-icon">📖</span>
                        <div>
                          <strong>{bookCount} bài</strong>
                          <small>Đọc sách &amp; Cổ tích</small>
                        </div>
                      </div>
                      <div className="breakdown-pill chore">
                        <span className="pill-icon">🧹</span>
                        <div>
                          <strong>{choreCount} việc</strong>
                          <small>Nếp sống &amp; Việc nhà</small>
                        </div>
                      </div>
                    </div>

                    {/* Pika AI Diagnostics & Weakness Analysis Card */}
                    {(() => {
                      const wrongList = []
                      childSessions.forEach(s => {
                        if (Array.isArray(s.wrong_answers)) {
                          s.wrong_answers.forEach(w => {
                            if (w.q) wrongList.push({ title: s.title || 'Bài tập', question: w.q, chose: w.chose, correct: w.correct })
                          })
                        }
                      })

                      const totalSessions = childSessions.length
                      const perfectCount = childSessions.filter(s => s.quiz_total > 0 && s.quiz_first_try === s.quiz_total).length

                      let strength = 'Bé làm bài rất tự giác, duy trì tiến độ học tập đều đặn.'
                      let weakness = 'Chưa ghi nhận điểm yếu lớn. Bé hoàn thành đúng hầu hết các câu trắc nghiệm.'
                      let recommendation = 'Bố mẹ nên tiếp tục duy trì giao 1 bài học SGK và 1 bài đọc mỗi ngày cho bé.'

                      if (wrongList.length > 0) {
                        const lastWrong = wrongList[wrongList.length - 1]
                        weakness = `Bé hay lúng túng ở câu hỏi: "${lastWrong.question.slice(0, 70)}..." trong bài "${lastWrong.title}". (Bé chọn "${lastWrong.chose}", đáp án đúng là "${lastWrong.correct}")`
                        recommendation = `Bố mẹ nên bấm "Giao bài tự động" ở Tab Giao Bài để Pika tự động đưa thêm các dạng bài ôn tập về "${lastWrong.title}" cho bé nhé!`
                      } else if (totalSessions > 0) {
                        const rate = Math.round((perfectCount / Math.max(1, totalSessions)) * 100)
                        strength = `Bé có tỷ lệ làm đúng trắc nghiệm ngay lần đầu đạt ${rate}%, phản xạ tư duy nhanh và chính xác!`
                      }

                      return (
                        <div className="pika-diagnostics-card margin-bottom">
                          <div className="diagnostics-head">
                            <span className="pika-head-icon">🧠</span>
                            <div>
                              <strong className="head-title">Gia Sư Pika Phân Tích Điểm Yếu &amp; Đề Xuất Học Tập</strong>
                              <span className="head-sub">Tự động phân tích từ trắc nghiệm &amp; cuộc trò chuyện của {child.name}</span>
                            </div>
                          </div>

                          <div className="diagnostics-content-grid">
                            <div className="diag-box strength">
                              <span className="diag-badge green">🎯 Điểm mạnh đã nắm vững</span>
                              <p className="diag-text">{strength}</p>
                            </div>

                            <div className="diag-box weakness">
                              <span className="diag-badge red">⚠️ Nội dung cần rèn luyện thêm</span>
                              <p className="diag-text">{weakness}</p>
                            </div>

                            <div className="diag-box advice">
                              <span className="diag-badge amber">💡 Đề xuất bài học cho Bố Mẹ</span>
                              <p className="diag-text">{recommendation}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Activity Log List */}
                    <div className="child-activity-log-section">
                      <h5 className="log-section-title">📜 Nhật ký học tập &amp; nộp bài gần đây:</h5>
                      {activities.length === 0 ? (
                        <div className="empty-log-box text-center">
                          <p className="text-muted">Bé chưa có hoạt động học tập nào được lưu.</p>
                          <small className="hint-text">Bố mẹ bấm nút ⚡ <strong>Giao tự động Tuần hiện tại</strong> ở Tab Giao Bài để giao nhiệm vụ cho bé nhé! 🚀</small>
                        </div>
                      ) : (
                        <div className="activity-timeline-list">
                          {activities.slice(0, 10).map(act => (
                            <div key={act.id} className="activity-log-item">
                              <span className="act-type-icon">
                                {act.type === 'sgk' || act.type === 'math' ? '📗' : act.type === 'book' ? '📖' : '🧹'}
                              </span>
                              <div className="act-info">
                                <strong className="act-title">{act.title}</strong>
                                <span className="act-detail">{act.detail}</span>
                                {act.parentFeedback && (
                                  <span className="act-parent-note">💬 {act.parentFeedback}</span>
                                )}
                              </div>
                              <div className="act-meta">
                                <span className="act-stars">+{act.stars} ⭐</span>
                                <small className="act-time">{formatTimeAgo(act.time)}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
