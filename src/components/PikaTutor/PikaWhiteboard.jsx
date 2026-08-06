import React, { useRef, useState, useEffect } from 'react'

export default function PikaWhiteboard({ onSendImage, onClose }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#2563EB') // Mặc định xanh dương
  const [lineWidth, setLineWidth] = useState(4)
  const [isEraser, setIsEraser] = useState(false)

  const COLORS = ['#2563EB', '#DC2626', '#16A34A', '#D97706', '#9333EA', '#111827']

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    // Đặt nền trắng sạch cho canvas
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    const { x, y } = getCoordinates(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color
    ctx.lineWidth = isEraser ? lineWidth * 4 : lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleSend = () => {
    const canvas = canvasRef.current
    const imageBase64 = canvas.toDataURL('image/png')
    onSendImage(imageBase64)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      onSendImage(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-xl border-2 border-amber-200 max-w-xl w-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          ✏️ Bảng Nháp & Soi Bài Tập Cho Pika
        </h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold px-2 text-xl"
          >
            ✕
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-50 p-2 rounded-xl">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false) }}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                color === c && !isEraser ? 'scale-125 border-gray-800 shadow' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`px-3 py-1 text-xs font-bold rounded-lg border transition ${
              isEraser ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🧹 Cục tẩy
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            🗑️ Xóa hết
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border-2 border-dashed border-amber-300 rounded-xl overflow-hidden bg-white touch-none">
        <canvas
          ref={canvasRef}
          width={600}
          height={340}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-auto cursor-crosshair block"
        />
        <div className="absolute bottom-2 right-2 text-[11px] text-gray-400 pointer-events-none">
          Bé có thể viết số, đặt tính hoặc vẽ hình ở đây 🎨
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <label className="cursor-pointer px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-xl flex items-center gap-1">
          📷 Tải ảnh bài tập
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>

        <button
          onClick={handleSend}
          className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition hover:scale-105 active:scale-95"
        >
          🚀 Gửi cho Pika ngay
        </button>
      </div>
    </div>
  )
}
