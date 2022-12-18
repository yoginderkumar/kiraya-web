import { useOverlayTriggerState } from '@react-stately/overlays';
import { ButtonLink } from './Button';
import { DocumentDownloadIcon } from './Icons';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Box, BoxOwnProps } from './Box';
import { SyntheticEvent } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export function Image({
  thumbUrl,
  imageUrl,
  onPreview,
  onDownload,
  imageLabel,
  isNonDownloadable,
  downloadLabel = 'Download',
  alt,
  ...props
}: BoxOwnProps & {
  thumbUrl: string;
  imageUrl: string;
  alt?: string;
  imageLabel?: string;
  downloadLabel?: string;
  onPreview?: () => void;
  onDownload?: () => void;
  className?: string;
  isNonDownloadable?: boolean;
}) {
  const state = useOverlayTriggerState({ defaultOpen: false });
  return (
    <>
      <Box
        {...props}
        as="img"
        src={thumbUrl}
        alt={alt}
        borderWidth="1"
        rounded="md"
        padding="px"
        cursor="pointer"
        onClick={(e: SyntheticEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onPreview?.();
          state.open();
        }}
      />
      <Modal
        isOpen={state.isOpen}
        title={imageLabel ? imageLabel : 'Image'}
        onClose={state.close}
        isDismissable
      >
        <ModalBody>
          <img
            src={imageUrl}
            className="w-auto h-auto max-w-full rounded border"
            alt={imageLabel}
          />
        </ModalBody>
        {isNonDownloadable ? null : (
          <ModalFooter>
            <ButtonLink
              href={imageUrl}
              download="file.png"
              target="_blank"
              rel="noopner noreferrer"
              level="primary"
              onClick={() => {
                onDownload?.();
              }}
            >
              <DocumentDownloadIcon /> {downloadLabel}
            </ButtonLink>
          </ModalFooter>
        )}
      </Modal>
    </>
  );
}

export function LazyImage({
  height,
  width,
  alt,
  src,
  ...props
}: BoxOwnProps & { alt: string; src: string }) {
  return (
    <Box {...props}>
      <LazyLoadImage
        alt={alt}
        height={height}
        src={src} // use normal <img> attributes as props
        width={width}
      />
    </Box>
  );
}
