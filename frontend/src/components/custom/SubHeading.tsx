import { ReactNode } from "react";

interface SubHeadingProps {
  children: ReactNode;
}

const SubHeading = ({ children }: SubHeadingProps) => {
  return (
    <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
      {children}
    </h5>
  );
};

export default SubHeading;
