import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "success" | "secondary" | "danger" | "warning" | "info" | "dark" | "light" | "rounded" | "shadow" | "link"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  type?: "button" | "submit" | "reset"; // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type="button"
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  const variantClasses = {
  primary:
    "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",

  outline:
    "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",

  secondary:
    "bg-gray-500 text-white shadow-theme-xs hover:bg-gray-600 disabled:bg-gray-300",

  danger:
    "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300",

  success:
    "bg-green-500 text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300",

  warning:
    "bg-yellow-500 text-black shadow-theme-xs hover:bg-yellow-600 disabled:bg-yellow-300",

  info:
    "bg-blue-500 text-white shadow-theme-xs hover:bg-blue-600 disabled:bg-blue-300",

  light:
    "bg-gray-100 text-gray-800 shadow-theme-xs hover:bg-gray-200 disabled:bg-gray-300",

  dark:
    "bg-gray-900 text-white shadow-theme-xs hover:bg-gray-800 disabled:bg-gray-600",

  link:
    "text-blue-500 hover:text-blue-700 disabled:text-gray-300",

  rounded:
    "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 rounded-full",

  ghost:
    "bg-transparent text-brand-500 border-2 border-brand-500 hover:bg-brand-100 disabled:text-gray-300 disabled:border-gray-300",

  shadow:
    "bg-brand-500 text-white shadow-lg hover:shadow-xl disabled:bg-brand-300",
};


  return (
    <button
      className={`inline-flex flex-wrap items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {startIcon && <span className="flex flex-wrap items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex flex-wrap items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
