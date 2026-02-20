import { ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-vscode-bg border border-vscode-border rounded-lg w-full max-w-md mx-4 max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-vscode-border">
          <span className="text-sm font-medium">{title}</span>
          <button onClick={onClose} className="opacity-50 hover:opacity-100 text-lg leading-none">
            ×
          </button>
        </div>
        <div className="overflow-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
