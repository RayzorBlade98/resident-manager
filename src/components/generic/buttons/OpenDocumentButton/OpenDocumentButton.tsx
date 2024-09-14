import FileOpenIcon from '@mui/icons-material/FileOpen';
import { IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { DocumentTarget } from '_/ipc/utils/persistence/documentTarget';

type OpenDocumentButtonProps = {
  documentId: string | undefined;
  documentTarget: DocumentTarget;

  tooltip?: string;
};

/**
 * Icon button that opens the specified document in a new window
 */
export function OpenDocumentButton(props: OpenDocumentButtonProps) {
  const { documentId, documentTarget } = props;

  if (!documentId) {
    return null;
  }

  const tooltip = props.tooltip ?? 'Dokument anzeigen';

  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={() => {
          void window.ipcAPI.windows.openDocumentWindow(
            documentId,
            documentTarget,
          );
        }}
      >
        <FileOpenIcon />
      </IconButton>
    </Tooltip>
  );
}
