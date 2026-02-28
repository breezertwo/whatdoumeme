import { ChangeEvent, useState } from 'react';
import { CustomButton } from '../gamescreen/views/subviews';
import { useSetUsername } from '../../context/username';
import Cookies from 'js-cookie';

const Username = () => {
  const [localUsername, setLocalUsername] = useState('');
  const setUsername = useSetUsername();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalUsername(event.target.value);
  };

  const onClick = () => {
    Cookies.set('userName', localUsername);
    setUsername(localUsername);
  };

  return (
    <div className="login-container">
      <input type="text" placeholder="Username" value={localUsername} onChange={handleUsernameChange} className="text-input" />
      <CustomButton onClick={onClick}>Set username</CustomButton>
    </div>
  );
};

export default Username;
