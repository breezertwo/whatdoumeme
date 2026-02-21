import { useRef, useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import Cookies from 'js-cookie';

import { SOCKET_SERVER_URL } from '../../socket/SocketProvider';

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
  </svg>
);

function getShareURL(): string {
  return `${SOCKET_SERVER_URL}/join?id=${Cookies.get('roomId')}`;
}

export const ShareDialog = () => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickOpen = () => {
    if (Cookies.get('roomId')) {
      setOpen(true);
    } else {
      alert('Create or join a room first!');
    }
  };

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
    }
    setOpen(false);
  };

  return (
    <div>
      <button className="share-link-icon" onClick={handleClickOpen} aria-label="Share invitation link">
        <LinkIcon />
      </button>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="dialog-backdrop" />
          <Dialog.Popup className="dialog-popup">
            <div className="dialog-header">
              <Dialog.Title render={<h3 />}>Invite your friend!</Dialog.Title>
              <Dialog.Close className="dialog-close" aria-label="Close">
                &times;
              </Dialog.Close>
            </div>
            <div className="dialog-body">
              <input ref={inputRef} className="share-input" value={getShareURL()} readOnly aria-label="Invitation link" />
              <button className="share-copy-btn" onClick={handleCopy}>
                Copy
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
