import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-semibold';
  const variantStyles =
    variant === 'primary'
      ? 'bg-primary text-white hover:bg-secondary'
      : 'bg-secondary text-gray-800 hover:bg-primary';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles}`}
    >
      {children}
    </button>
  );
};

export default Button;
