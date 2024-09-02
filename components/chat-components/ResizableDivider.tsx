import React from 'react'

interface ResizableDividerProps {
  onResize: (clientX: number) => void
}

export function ResizableDivider({ onResize }: ResizableDividerProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    onResize(e.clientX)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className="w-1 bg-border cursor-col-resize flex items-center justify-center"
      onMouseDown={handleMouseDown}
    >
      <div className="h-8 w-1 bg-muted rounded-full"></div>
    </div>
  )
}