import React from 'react'

/**
 * PikaAvatar Component
 * @param {string} state - 'idle' | 'listening' | 'thinking' | 'speaking' | 'celebrating'
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 */
export default function PikaAvatar({ state = 'idle', size = 'md', onClick, style = {} }) {
  const sizeMap = {
    sm: { width: 56, height: 56 },
    md: { width: 96, height: 96 },
    lg: { width: 140, height: 140 },
    xl: { width: 180, height: 180 }
  }

  const dim = sizeMap[size] || sizeMap.md

  const isSpeaking = state === 'speaking'
  const isListening = state === 'listening'
  const isThinking = state === 'thinking'
  const isCelebrating = state === 'celebrating'

  return (
    <div 
      className="pika-avatar-wrapper"
      onClick={onClick}
      title="Pika Gia Sư AI"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${dim.width}px`,
        height: `${dim.height}px`,
        minWidth: `${dim.width}px`,
        minHeight: `${dim.height}px`,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        flexShrink: 0,
        ...style
      }}
    >
      {/* Hiệu ứng sóng âm khi đang nghe hoặc phát biểu */}
      {(isListening || isSpeaking) && (
        <div 
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            backgroundColor: 'rgba(251, 191, 36, 0.35)',
            border: '2px solid #f59e0b',
            animation: 'pulse 1.2s infinite ease-in-out',
            pointerEvents: 'none'
          }} 
        />
      )}
      
      {/* Hiệu ứng lấp lánh khi suy nghĩ */}
      {isThinking && (
        <div style={{ position: 'absolute', top: '-8px', right: '-4px', fontSize: '18px', zIndex: 10 }}>
          💡
        </div>
      )}

      {/* Hiệu ứng pháo hoa khi khen ngợi */}
      {isCelebrating && (
        <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', fontSize: '20px', zIndex: 10 }}>
          🎉
        </div>
      )}

      <svg 
        viewBox="0 0 200 200" 
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))'
        }}
      >
        <defs>
          <linearGradient id="pikaBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFDE59" />
            <stop offset="100%" stopColor="#FFBD59" />
          </linearGradient>
          <linearGradient id="pikaCheekGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5757" />
            <stop offset="100%" stopColor="#E63946" />
          </linearGradient>
        </defs>

        {/* Tai trái */}
        <path 
          d="M 50 70 Q 20 10 40 5 Q 65 30 70 65 Z" 
          fill="url(#pikaBodyGrad)"
          stroke="#D4A017"
          strokeWidth="3"
        />
        <path d="M 28 17 Q 20 10 40 5 Q 48 18 38 28 Z" fill="#222222" />

        {/* Tai phải */}
        <path 
          d="M 150 70 Q 180 10 160 5 Q 135 30 130 65 Z" 
          fill="url(#pikaBodyGrad)"
          stroke="#D4A017"
          strokeWidth="3"
        />
        <path d="M 172 17 Q 180 10 160 5 Q 152 18 162 28 Z" fill="#222222" />

        {/* Thân & Đầu tròn nhắn */}
        <circle cx="100" cy="115" r="72" fill="url(#pikaBodyGrad)" stroke="#E5A912" strokeWidth="3" />

        {/* Má đỏ trái & phải */}
        <circle cx="52" cy="130" r="14" fill="url(#pikaCheekGrad)" />
        <circle cx="148" cy="130" r="14" fill="url(#pikaCheekGrad)" />

        {/* Mắt */}
        {isCelebrating ? (
          <>
            <path d="M 68 102 Q 78 90 88 102" fill="none" stroke="#222" strokeWidth="5" strokeLinecap="round" />
            <path d="M 112 102 Q 122 90 132 102" fill="none" stroke="#222" strokeWidth="5" strokeLinecap="round" />
          </>
        ) : isThinking ? (
          <>
            <circle cx="78" cy="98" r="8" fill="#222" />
            <circle cx="76" cy="94" r="3" fill="#FFF" />
            <circle cx="122" cy="98" r="8" fill="#222" />
            <circle cx="120" cy="94" r="3" fill="#FFF" />
          </>
        ) : (
          <>
            <circle cx="78" cy="102" r="10" fill="#222" />
            <circle cx="75" cy="98" r="4" fill="#FFF" />
            <circle cx="122" cy="102" r="10" fill="#222" />
            <circle cx="119" cy="98" r="4" fill="#FFF" />
          </>
        )}

        {/* Mũi nhỏ */}
        <ellipse cx="100" cy="112" rx="3" ry="2" fill="#222" />

        {/* Miệng */}
        {isSpeaking ? (
          <path d="M 88 122 Q 100 142 112 122 Z" fill="#E63946" stroke="#222" strokeWidth="2" />
        ) : isCelebrating ? (
          <path d="M 86 120 Q 100 138 114 120 Q 100 126 86 120 Z" fill="#E63946" stroke="#222" strokeWidth="2" />
        ) : (
          <path d="M 88 122 Q 94 128 100 122 Q 106 128 112 122" fill="none" stroke="#222" strokeWidth="3.5" strokeLinecap="round" />
        )}

        {/* Chi tiết trang trí cài áo / nơ nhỏ */}
        <polygon points="100,165 92,180 108,180" fill="#3B82F6" />
        <circle cx="100" cy="165" r="5" fill="#EF4444" />
      </svg>

      {/* Nhãn trạng thái */}
      {isListening && (
        <span 
          style={{
            position: 'absolute',
            bottom: '-6px',
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '9px',
            fontWeight: 'bold',
            padding: '1px 6px',
            borderRadius: '10px',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Đang nghe...
        </span>
      )}
      {isSpeaking && (
        <span 
          style={{
            position: 'absolute',
            bottom: '-6px',
            backgroundColor: '#10b981',
            color: '#fff',
            fontSize: '9px',
            fontWeight: 'bold',
            padding: '1px 6px',
            borderRadius: '10px',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Đang nói 🔊
        </span>
      )}
    </div>
  )
}
