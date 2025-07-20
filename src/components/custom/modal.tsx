import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Modal = ({ open, onClose, children }: ModalProps) => {
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
    <dialog ref={modalRef} className="backdrop:backdrop-contrast-50">
      <div className="relative">
        <div
          className="absolute right-1 top-1 hover:bg-muted rounded-full p-1"
          onClick={onClose}
        >
          <X size="16" />
        </div>
      </div>
      <div className="px-4 py-6">{children}</div>
    </dialog>
  );
};

export default Modal;
