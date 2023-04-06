export interface IButtonProps {
  label: string
  onClick: () => void
  color?: string

  // optional props
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  style?: React.CSSProperties
  icon?: React.ReactNode
  showLabel?: boolean
  children?: React.ReactNode
  textColor?: string
}

export default function Button({
                                 label,
                                 onClick,
                                 disabled = false,
                                 type = 'button',
                                 className = '',
                                 style = {},
                                 icon = null,
                                 showLabel = true,
                                 color,
                                 children,
                                 textColor
                               }: IButtonProps) {
  const setColor = color ? color : 'blue'
  var styleCollection = {
    color: 'white',
    ...style,
  }
  if (color) {
    styleCollection = {
      backgroundColor: setColor,
      ...style
    }
  }

  if (textColor) {
    styleCollection = {
      ...styleCollection,
      color: textColor
    }
  }
  return (
    <button
      type={type}
      className={`bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded ${className}`}
      style={styleCollection}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {showLabel && label}
      {children}
    </button>
  )
}