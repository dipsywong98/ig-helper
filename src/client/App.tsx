import axios from 'axios';
import React, { useState } from 'react';
import './App.css';
import { QAStory } from '../common/QAStory';
import { Stories } from './Stories';

function App(): JSX.Element {
  const [stories, setStories] = useState<QAStory[] | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const handleLogin = () => {
    setMessage('loading...');
    axios.post('/api/stories', { username, password, otp })
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
      <h1>IG Helper - Stories QA Extractor</h1>
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
