import axios from 'axios';
import React, { useState } from 'react';
import './App.css';
import { QAStory } from '../common/QAStory';
import { sampleQAStories } from '../common/sampleQAStories';
import { Stories } from './Stories';

function App(): JSX.Element {
  const [stories, setStories] = useState<QAStory[] | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    axios.post('/api/stories', { username, password }).then(({ data }) => setStories(data));
    setStories(sampleQAStories);
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
      {/* <p>
        otp:
        {' '}
        <input />
      </p> */}
      <p><button type="button" onClick={handleLogin}>login</button></p>
      {
        stories === null ? 'please log in' : <Stories stories={stories} />
      }
    </div>
  );
}

export default App;
