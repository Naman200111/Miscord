import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, children, className }: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalRef && modalRef.current) {
      const modalInstance = modalRef.current;
      if (open) {
        modalInstance.showModal();
      } else {
        modalInstance.close();
      }
    }
  }, [open]);

  return (
    <dialog
      ref={modalRef}
      className={cn(
        "backdrop:backdrop-contrast-50 max-w-[90%] max-h-[500px] overflow-y-auto rounded-lg p-0 m-auto",
        className
      )}
      onClick={(e) => {
        const target = e.target as HTMLDialogElement;
        if (target.nodeName === "DIALOG") {
          modalRef.current?.close();
          onClose();
        }
      }}
    >
      <div className="relative px-4 py-6 h-full">
        <div
          className="absolute right-1 top-1 hover:bg-muted rounded-full p-1 cursor-pointer"
          onClick={onClose}
        >
          <X size="16" />
        </div>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
