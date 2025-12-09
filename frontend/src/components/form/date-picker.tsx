import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useField, useFormikContext } from "formik";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  name: string;
  mode?: "single" | "multiple" | "range" | "time";
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
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
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [field, meta, helpers] = useField(name);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
      mode,
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate: field.value || defaultDate,
      onChange: (selectedDates) => {
        if (mode === "single") {
          const selected = selectedDates[0] || null;
          setFieldValue(name, selected ? selected.toISOString().split("T")[0] : "");
        } else {
          setFieldValue(name, selectedDates.map(d => d.toISOString().split("T")[0]));
        }
      },
    });

    return () => {
      fp.destroy();
    };
  }, [mode, name, setFieldValue, defaultDate]);

  const error = meta.touched && meta.error;

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          {...field}
          id={id}
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 ${className}`}
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-1" />
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
