interface RadialProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: 'green' | 'yellow' | 'red'
}

const colorMap = {
  green: '#65BA74',
  yellow: '#FFBA18',
  red: '#E5484D',
}

export function RadialProgress({
  value,
  size = 16,
  strokeWidth = 2,
  color = 'green',
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(181, 185, 196, 0.4)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
    </div>
  )
}
