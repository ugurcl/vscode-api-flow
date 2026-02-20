import { ReactNode } from "react";

interface IconButtonProps {
  onClick: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function IconButton({ onClick, title, children, className = "" }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1 rounded opacity-50 hover:opacity-100 hover:bg-vscode-list-hover transition-opacity ${className}`}
    >
      {children}
    </button>
  );
}
