import { ReactNode } from "react";

interface MainHeadingProps {
  children: ReactNode;
}

const MainHeading = ({ children }: MainHeadingProps) => {
  return (
    <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">
      {children}
    </h2>
  );
};

export default MainHeading;
