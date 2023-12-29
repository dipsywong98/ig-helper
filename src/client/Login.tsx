import React, { useEffect, useState } from 'react';

import {
  Card, Typography, TextField, Button, Box,
} from '@mui/material';
import { useIgSession } from './IgSessionContext';

export default function Login() {
  const { login, provideMFA, getMe } = useIgSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [needMfa, setNeedMfa] = useState(false);
  const [code, setCode] = useState('');
  const [logedIn, setLogedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('error');

  const handleLogin = () => {
    login(username, password, true).then((result) => {
      if (result.mfa) {
        setNeedMfa(true);
      } else {
        setLogedIn(true);
      }
    }).catch((error) => {
      console.log(error);
      setErrorMessage(error.response.data.message);
    });
  };

  const handleMfa = () => {
    provideMFA(code).then(() => {
      console.log('success');
      setLogedIn(true);
    }).catch((error) => {
      console.log(error);
      setErrorMessage(error.response.data.message);
    });
  };

  useEffect(() => {
    if (logedIn) {
      getMe().then(console.log);
    }
  }, [logedIn]);

  return (
    <Card>
      <Typography>
        Login
      </Typography>
      <TextField label="username" value={username} onChange={({ target }) => setUsername(target.value)} />
      <TextField label="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      <Button onClick={handleLogin}>Login</Button>
      {
        needMfa && (
          <Box>
            <TextField label="2fa" value={code} onChange={({ target }) => setCode(target.value)} />
            <Button onClick={handleMfa}>Mfa Login</Button>
          </Box>
        )
      }
      <Typography color="error">{errorMessage}</Typography>
    </Card>
  );
}
