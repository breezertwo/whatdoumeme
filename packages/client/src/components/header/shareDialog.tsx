import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import LinkIcon from '@material-ui/icons/Link';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import Cookies from 'js-cookie';
import { makeStyles, TextField } from '@material-ui/core';
import { useEffect } from 'react';

const useStyles = makeStyles({
  dialogBody: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
    gap: '1em',
    '& .MuiInputBase-input': {
      height: '0.1876em',
    },
  },
  dialogHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkIcon: {
    transform: 'rotate(-45deg)',
    '&:hover': {
      transform: 'rotate(-55deg) scale(1.20)',
    },
  },
  closeIcon: {
    transform: 'scale(1.5)',
    '&:hover': {
      transform: 'scale(1.6)',
    },
  },
  customButtonColor: {
    color: '#323333',
    border: '2px solid #323333',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#5c99ed',
      border: '2px solid #5c99ed',
    },
  },
  font: {
    '& *': {
      fontFamily: 'Dosis, sans-serif !important',
    },
  },
});

const Transition = React.forwardRef(function Transition(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export const ShareDialog = (): JSX.Element => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  let linkValue = getShareURL();
  let textValue: HTMLInputElement;

  useEffect(() => {
    linkValue = getShareURL();
  }, [open]);

  const copyCodeToClipboard = () => {
    textValue.select();
    document.execCommand('copy');
  };

  const handleCopy = () => {
    copyCodeToClipboard();
    setOpen(false);
  };

  const handleClickOpen = () => {
    if (Cookies.get('roomId')) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <LinkIcon onClick={handleClickOpen} className={classes.linkIcon} />
      <Dialog
        className={classes.font}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle id="alert-dialog-slide-title">
          <div className={classes.dialogHeader}>
            <h3>Invite your friend!</h3>
            <HighlightOffIcon onClick={handleClose} className={classes.closeIcon} />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className={classes.dialogBody}>
            <TextField
              id="filled-read-only-input"
              label="Link"
              value={linkValue}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              inputRef={(ref) => {
                textValue = ref;
              }}
            />
            <Button
              className={classes.customButtonColor}
              onClick={handleCopy}
              variant="outlined"
              color="primary">
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function getShareURL(): string {
  return `${window.location.href}join?id=${Cookies.get('roomId')}`;
}
