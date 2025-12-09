import { useField } from "formik";

interface RadioProps {
  id: string; // Unique ID for the radio button
  name: string; // Radio group name
  value: string; // Value of the radio button
  label: string; // Label for the radio button
  className?: string; // Optional additional classes
  disabled?: boolean; // Optional disabled state
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  label,
  className = "",
  disabled = false,
}) => {
  const [field] = useField({ name, type: "radio", value });


  const isChecked = field.checked;

  return (
    <>
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${
        disabled
          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
          : "text-gray-700 dark:text-gray-400"
      } ${className}`}
    >
      <input
        {...field}
        id={id}
        type="radio"
        className="sr-only"
        disabled={disabled}
      />
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ${
          isChecked
            ? "border-brand-500 bg-brand-500"
            : "bg-transparent border-gray-300 dark:border-gray-700"
        } ${
          disabled
            ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
            : ""
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full bg-white ${
            isChecked ? "block" : "hidden"
          }`}
        ></span>
      </span>
      {label}
    </label>

    </>
  );
};

export default Radio;
