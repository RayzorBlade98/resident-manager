import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Button, Typography } from '@mui/material';
import React from 'react';

interface FileSelectProps {
  value: string | undefined;
  onChange: (file: string | undefined) => void;
  id?: string;
  errorMessage?: string;
}

function FileSelect(props: FileSelectProps) {
  function onClick() {
    void window.ipcAPI.selectFile().then((file) => props.onChange(file));
  }

  return (
    <div>
      <Typography variant="body2">{props.value}</Typography>
      <Typography variant="body2" color="error">
        {props.errorMessage}
      </Typography>
      <Button
        variant="contained"
        tabIndex={-1}
        startIcon={<UploadFileIcon />}
        onClick={() => onClick()}
        id={props.id}
      >
        Datei hochladen
      </Button>
    </div>
  );
}

export default FileSelect;
