import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useField, useFormikContext } from "formik";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import DateOption = flatpickr.Options.DateOption;
import "./date-picker.css";

type PropsType = {
  id: string;
  name: string;
  mode?: "single" | "multiple" | "range" | "time";
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
};

export default function DatePicker({
  id,
  name,
  mode = "single",
  defaultDate,
  label,
  placeholder = "Select a date",
  className = "",
  disabled = false,
  required = false,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
      mode,
      static: true,
      appendTo: document.body, // key fix
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate: field.value || defaultDate,
      disableMobile: true, // key fix

      onChange: (selectedDates, dateStr) => {
        if (mode === "single") {
          setFieldValue(name, dateStr || "");
        } else {
          const formatted = selectedDates.map((d) =>
            fp.formatDate(d, "Y-m-d")
          );
          setFieldValue(name, formatted);
        }
      },
    });

    return () => {
      fp.destroy();
    };
  }, [mode, name, setFieldValue, defaultDate, field.value]);

  const error = meta.touched && meta.error;

  return (
    <div className="w-full">
      {label && (
        <Label className="mt-3" htmlFor={id}>
          {label}
          {
            required && <span className="text-error-500">*</span>
          }
        </Label> 
      )}

      <div className="relative">
        <input
          {...field}
          id={id}
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-11 sm:h-12 w-full rounded-lg border appearance-none px-3 sm:px-4 py-2.5 text-sm sm:text-base shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 ${className}`}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-4" />
        </span>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-error-500">
          {meta.error}
        </p>
      )}
    </div>
  );
}