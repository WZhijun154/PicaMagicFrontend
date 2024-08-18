import {
  Progress,
  Button,
  Card,
  CardBody,
  Image,
  CardFooter,
  CardProps,
} from "@nextui-org/react";

import { useTransition } from "react";
import { useDictionary } from "../dictionary-provider";
export interface CardWithThumbnailProps {
  props?: CardProps;
  imgSrc: string;
  isRunning?: boolean;
  isSuccess?: boolean;
  isFailed?: boolean;
  isUploading?: boolean;
  secondaryAction?: () => void;
  primaryAction?: () => any;
  progress?: number;
  caption?: string;
  description?: string;
  action_text?: string;
}

export function CardWithThumbnail({
  props,
  imgSrc,
  isRunning = false,
  isSuccess = false,
  isFailed = false,
  isUploading = false,
  progress = 100,
  caption,
  description,
  action_text,
  primaryAction,
  secondaryAction,
}: CardWithThumbnailProps) {
  const dictionary = useDictionary();

  let progressBar;
  if (isSuccess) {
    progressBar = <Progress size="sm" value={100} color="success" />;
  } else if (isRunning) {
    progressBar = <Progress isIndeterminate size="sm" />;
  } else if (isFailed) {
    progressBar = <Progress size="sm" value={100} color="warning" />;
  } else if (isUploading) {
    progressBar = <Progress size="sm" value={progress} />;
  } else {
    progressBar = <Progress size="sm" value={100} />;
  }

  const [isPending, startTransition] = useTransition();

  let _primaryAction;

  _primaryAction = () => {
    startTransition(async () => {
      await primaryAction!();
    });
  };

  let primaryButton;
  if (isSuccess) {
    primaryButton = (
      <Button
        color="success"
        onClick={_primaryAction}
        variant="flat"
        isLoading={isPending}
      >
        {dictionary.imageCard.download}
      </Button>
    );
  } else if (isRunning) {
    primaryButton = (
      <Button isDisabled>{dictionary.imageCard.processing}</Button>
    );
  } else if (isFailed) {
    primaryButton = (
      <Button color="warning" onClick={_primaryAction} variant="flat">
        {dictionary.imageCard.retry}
      </Button>
    );
  } else {
    primaryButton = (
      <Button color="primary" onClick={_primaryAction} variant="flat">
        {dictionary.imageCard.processing}
      </Button>
    );
  }

  let secondaryButton;
  if (isSuccess) {
    secondaryButton = (
      <Button color="default" variant="light" onClick={secondaryAction}>
        {dictionary.imageCard.seeDetails}
      </Button>
    );
  } else if (isRunning) {
    secondaryButton = (
      <Button isDisabled variant="light" onClick={secondaryAction}>
        {dictionary.cancel}
      </Button>
    );
  } else if (isFailed) {
    secondaryButton = (
      <Button color="default" variant="light" onClick={secondaryAction}>
        {dictionary.cancel}
      </Button>
    );
  } else {
    secondaryButton = (
      <Button color="default" variant="light" onClick={secondaryAction}>
        {dictionary.cancel}
      </Button>
    );
  }

  return (
    <Card
      className="w-[256px] bg-default-100/40 animate-appearance-in"
      {...props}
    >
      <CardBody className="px-3 pb-1 gap-4">
        <Image
          alt="Card image"
          className="aspect-square w-full object-cover object-center"
          src={imgSrc}
          isBlurred
          loading="lazy"
        />
        <div className="flex flex-col px-2">
          <p className="text-large font-medium truncate overflow-hidden">
            {caption}
          </p>
          <p className="text-small text-default-400">{description}</p>
        </div>
      </CardBody>
      <CardFooter className="justify-end gap-2">
        {isUploading ? (
          <Button variant="light" isLoading>
            Uploading
          </Button>
        ) : (
          <>
            {secondaryButton}
            {primaryButton}
          </>
        )}
      </CardFooter>
      {progressBar}
    </Card>
  );
}
