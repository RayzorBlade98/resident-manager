import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { IconButton, AppBar as MuiAppBar, Toolbar } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import View from '../../../routes';
import { APPBAR_HEIGHT } from '../../../styles';

const styles = {
  appbar: {
    height: APPBAR_HEIGHT,
    minHeight: APPBAR_HEIGHT,
  },
  toolbar: {
    minHeight: APPBAR_HEIGHT,
    height: APPBAR_HEIGHT,
  },
};

interface AppBarProps {
  /**
   * Route to where the back button should navigate
   */
  returnRoute: View;
}

/**
 * Toolbar that provides functionality to navigate backwards
 */
function AppBar(props: AppBarProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <MuiAppBar position="static">
      <Toolbar variant="dense" sx={styles.appbar}>
        <IconButton
          size="small"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={() => {
            navigate(props.returnRoute);
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
}

export default AppBar;
