import React from 'react'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-semibold'
  const variantStyles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-300 text-gray-800 hover:bg-gray-400'

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles}`}
    >
      {children}
    </button>
  )
}

export default Button
