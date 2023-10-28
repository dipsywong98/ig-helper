import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import axios from 'axios';
import React, { useState } from 'react';
import './App.css';
import { Typography } from '@mui/material';
import { QAStory } from '../common/QAStory';
import { Stories } from './Stories';
import { Responder } from './Responder';

function App(): JSX.Element {
  const [stories, setStories] = useState<QAStory[] | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const handleLogin = () => {
    setMessage('loading...');
    axios.post(
      '/api/stories-sample',
      { username, password, otp },
    )
      .then(({ data }) => {
        setStories(data);
        setMessage('');
      })
      .catch((e) => {
        console.log(e);
        setMessage(e.response.data.message);
      });
  };
  return (
    <div>
      <Typography variant="h3">IG Helper - Stories QA Extractor</Typography>
      <div className="responders">
        <Responder
          question="大家為什麼看/學習人格學+你的MBTI / 九型"
          response="my answer"
        />
        <Responder
          question="大家為什麼看/學習人格學+你的MBTI / 九型"
          response="my answer"
        />
        <Responder
          question="大家為什麼看/學習人格學+你的MBTI / 九型"
          response="my answer"
        />
      </div>
      <p>
        username:
        {' '}
        <input value={username} onChange={({ target }) => { setUsername(target.value); }} />
      </p>
      <p>
        password:
        {' '}
        <input type="password" value={password} onChange={({ target }) => { setPassword(target.value); }} />
      </p>
      <p>
        otp:
        {' '}
        <input value={otp} onChange={({ target }) => { setOtp(target.value); }} />
      </p>
      <p>
        otp is 6 digit number from your authenticator app (e.g. google Authenticator).
        Leave blank if you didnt enable 2FA. Currently not supporting SMS
      </p>
      <p><button type="button" onClick={handleLogin}>login</button></p>
      {message !== '' && (
      <p>
        Message:
        {message}
      </p>
      )}
      {
        stories === null ? 'please log in' : <Stories stories={stories} />
      }
    </div>
  );
}

export default App;
