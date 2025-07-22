import Input from "@/components/custom/input";
import Modal from "@/components/custom/modal";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateNewServerModal = ({ open, onClose }: ModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-1">
        <p className="text-2xl font-bold">Create your own server</p>
        <p className="text-muted-foreground text-sm text-center">
          Give your server a personality with a name and an image. You can
          always change that later
        </p>
        <p>Image Uploader</p>

        <div className="mt-4 self-start ml-10 w-[80%]">
          <p className="font-semibold text-muted-foreground mb-1">
            Server Name
          </p>
          <Input
            placeholder="Enter your server name"
            className="py-2 bg-muted w-full"
          />
        </div>
      </div>
    </Modal>
  );
};

export default CreateNewServerModal;
