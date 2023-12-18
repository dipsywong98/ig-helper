import React, { useReducer, useState } from 'react';
import { Box } from '@mui/material';
import { QAStory } from '../../common/QAStory';
import { Responder } from '../Responder';
import { Story } from './Story';

interface Props {
  stories: QAStory[]
}
export function Stories({ stories }: Props) {
  return (
    <div>
      <ul>
        {stories.map(({ question, timestamp }) => <li key={timestamp}><a href={`#${timestamp}`}>{question}</a></li>)}
      </ul>
      {stories.map((story) => (
        <Story key={story.question} story={story} />
      ))}
    </div>
  );
}
