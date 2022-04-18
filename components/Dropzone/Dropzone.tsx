import { Group, Text, useMantineTheme, MantineTheme, Center } from '@mantine/core';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import ImageUploadIcon from './DropzoneIcon';

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  if (status.accepted) return theme.colors[theme.primaryColor][6];
  else if (status.rejected) return theme.colors.red[6];
  return theme.colors.gray[7];
}

export const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
  <Center style={{ height: '100%', pointerEvents: 'none' }}>
    <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />
  </Center>
);
