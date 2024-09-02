interface ComponentDisplayProps {
    chatWidth: number
    minChatWidth: number
  }
  
  export function ComponentDisplay({ chatWidth, minChatWidth }: ComponentDisplayProps) {
    return (
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Component Display</h2>
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Resizable Area</h3>
          <p>Drag the divider to resize the chat area.</p>
          <p>Current chat width: {chatWidth.toFixed(2)}%</p>
          <p>Minimum chat width: {minChatWidth}px or 20% of container width</p>
        </div>
      </div>
    )
  }