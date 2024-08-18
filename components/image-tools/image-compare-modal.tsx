import { Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/modal";
import ReactCompareImage from "react-compare-image";
import { useDictionary } from "../dictionary-provider";

export interface ImageCompareModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  leftImage: string;
  rightImage: string;
}

export function ImageCompareModal({
  isOpen,
  onOpenChange,
  leftImage,
  rightImage,
}: ImageCompareModalProps) {
  const dictionary = useDictionary();

  return (
    <Modal
      size="xl"
      shouldBlockScroll={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <ModalBody>
            <ModalHeader className="flex-col gap-2 px-0 justify-center items-start">
              <p className="text-30px text-default-600 font-normal">
                {dictionary.imageCompareModal.details}
              </p>
              <p className="text-16px text-default-400 font-normal">
                {dictionary.imageCompareModal.dragInstructions}
              </p>
            </ModalHeader>
            <div className="pb-4">
              <ReactCompareImage
                leftImage={leftImage}
                rightImage={rightImage}
              />
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  );
}
