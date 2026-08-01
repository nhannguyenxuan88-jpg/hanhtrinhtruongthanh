import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Uncaught Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0f172a',
          color: '#f8fafc',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            background: '#1e293b',
            padding: '30px 24px',
            borderRadius: '24px',
            maxWidth: '480px',
            border: '2px solid #38bdf8',
            boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
          }}>
            <span style={{ fontSize: '56px', display: 'block', marginBottom: '12px' }}>🚀</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 10px', color: '#38bdf8' }}>
              Ứng Dụng Đang Khởi Động Lại
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: '0 0 20px', lineHeight: '1.6' }}>
              Đã xử lý sự cố kết nối. Bé hoặc Bố mẹ vui lòng bấm nút bên dưới để tải lại ứng dụng mượt mà nhé!
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.hash = ''
                window.location.reload()
              }}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '16px',
                fontSize: '1.05rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              🔄 Tải lại ứng dụng ngay
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
