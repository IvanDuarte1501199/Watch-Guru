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
  const baseStyles = 'px-6 py-2 rounded font-semibold mx-auto block mt-4 mb-6 lg:mb-12';
  const variantStyles =
    variant === 'primary'
      ? 'bg-primary text-white hover:bg-secondary'
      : 'bg-tertiary text-white hover:bg-secondary';

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
