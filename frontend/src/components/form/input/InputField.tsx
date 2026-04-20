import React from "react";
import { useField } from "formik";
import Label from "../Label";

interface InputProps {
  label?: string;
  name: string;
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  placeholder?: string;
  value?: string;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  className = "",
  value,
  min,
  max,
  step,
  disabled = false,
  required = false,
  hint,
  ...props
}) => {
  const [field, meta] = useField(props.name);

  const error = meta.touched && !!meta.error;
  const success = meta.touched && !meta.error;

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    inputClasses += ` border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      {label && (
        <Label
        className="mt-3"
          htmlFor={props.name}
        >
          {label}{required ? <span className="text-error-400">*</span> : ''}
        </Label>
      )}

      <input
        type={type}
        id={props.name}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={"mt-2"+inputClasses}
        {...field}
        {...props}
        onInput={(e) => {
          if(props.onInput) props.onInput(e)

          field.onChange(e)
        }}
      />

      {(meta.touched && meta.error) || hint ? (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {error ? meta.error : hint}
        </p>
      ) : null}
    </div>
  );
};

export default Input;
