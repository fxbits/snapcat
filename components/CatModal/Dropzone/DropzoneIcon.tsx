import { DropzoneStatus } from '@mantine/dropzone';
import React from 'react';
import { Upload, Photo, X, Icon as TablerIcon } from 'tabler-icons-react';

export default function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}
