import { useState } from 'react'
import { journeyMapData } from '../../lib/mathData'

export default function LearningPathMap({ onSelectNode }) {
  const [nodes, setNodes] = useState(journeyMapData)

  const handleNodeClick = (node) => {
    if (node.status === 'locked') {
      alert('🔒 Mốc học tập này chưa mở! Hãy hoàn thành các mốc trước nhé con!')
      return
    }
    if (onSelectNode) {
      onSelectNode(node)
    }
  }

  return (
    <div className="learning-path-wrapper">
      {/* Top Banner Header */}
      <div className="path-top-banner">
        <div className="banner-timer-box">
          <span className="timer-icon">⏰</span>
          <div className="timer-text">
            <span className="timer-val">13:20:35</span>
            <span className="timer-lbl">THỜI GIAN CÒN LẠI</span>
          </div>
        </div>
        <div className="banner-title-box">
          <span className="title-badge">HỌC NGAY!</span>
          <h3>Bản Đồ Học Tập Lô-Gíc</h3>
        </div>
      </div>

      {/* SVG Winding Path Background */}
      <div className="path-map-container">
        <svg className="path-svg-line" viewBox="0 0 400 700" preserveAspectRatio="none">
          <path
            d="M 200 60 C 320 120, 320 200, 200 260 C 80 320, 80 400, 200 460 C 320 520, 320 600, 200 640"
            fill="none"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="16 10"
          />
          <path
            d="M 200 60 C 320 120, 320 200, 200 260"
            fill="none"
            stroke="#10b981"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>

        {/* Nodes Grid along the curve */}
        <div className="path-nodes-list">
          {nodes.map((node, idx) => {
            const isCompleted = node.status === 'completed'
            const isCurrent = node.status === 'current'
            const isLocked = node.status === 'locked'
            const isChest = node.isChest

            // Alternate positions (left, center, right)
            const nodeClass = idx % 2 === 0 ? 'node-pos-left' : 'node-pos-right'

            return (
              <div key={node.id} className={`path-node-item ${nodeClass} ${node.status}`}>
                {isChest ? (
                  <button
                    type="button"
                    className="chest-node-btn animate-bounce"
                    onClick={() => handleNodeClick(node)}
                  >
                    <span className="chest-emoji">🎁</span>
                    <span className="chest-reward-tag">+{node.rewardStars} ⭐</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`level-node-btn ${isCurrent ? 'active-pulse' : ''}`}
                    onClick={() => handleNodeClick(node)}
                  >
                    {isCompleted && <span className="completed-check">✓</span>}
                    {isLocked && <span className="locked-icon">🔒</span>}
                    <span className="node-icon">{node.icon}</span>
                    <span className="node-level-num">Cấp {node.level}</span>
                  </button>
                )}
                
                <div className="node-label-card">
                  <strong>{node.title}</strong>
                  {node.timer && <span className="node-timer-tag">⌛ {node.timer}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
