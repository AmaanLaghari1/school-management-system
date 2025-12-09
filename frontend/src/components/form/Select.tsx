import { useState } from "react";
import { Field } from "formik";
import Label from "./Label";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  onChange?: (value: string) => void; // ✅ new optional prop
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  options,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  required = false,
  hint,
  onChange, // ✅ destructure it here
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Field name={name}>
      {({ field, form, meta }: any) => {
        const error = meta.touched && meta.error;
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

        const filteredOptions = options.filter((opt) =>
          (opt.label || "").toLowerCase().includes((searchTerm || "").toLowerCase())
        );

        return (
          <div className="relative">
            {label && (
              <Label htmlFor={name} className="mt-3">
                {label}
                {required && <span className="text-error-400">*</span>}
              </Label>
            )}

            <div className="relative">
              <input
                type="text"
                value={
                  open
                    ? searchTerm
                    : options.find((o) => o.value === field.value)?.label || ""
                }
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setOpen(true);
                }}
                onBlur={() => {
                  // Close dropdown after short delay so click works
                  setTimeout(() => setOpen(false), 150);
                }}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClasses}
              />

              {open && filteredOptions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white dark:bg-gray-900 shadow-md">
                  {filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      onMouseDown={() => {
                        // ✅ Update Formik
                        form.setFieldValue(name, option.value);

                        // ✅ Call external handler if provided
                        if (onChange) onChange(option.value);

                        setSearchTerm("");
                        setOpen(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        field.value === option.value
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {(meta.touched && meta.error) || hint ? (
              <p
                className={`text-xs ${
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
      }}
    </Field>
  );
};

export default Select;
