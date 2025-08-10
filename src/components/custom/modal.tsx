import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, children, className }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#2e2e2e]/50" />

      {/* Content */}
      <div
        className={cn(
          "relative max-w-[90%] w-[500px] max-h-[500px] overflow-y-auto rounded-lg bg-white dark:bg-neutral-900 p-0 shadow-lg",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 hover:bg-muted rounded-full p-1"
        >
          <X size={16} />
        </button>
        <div className="px-4 py-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
