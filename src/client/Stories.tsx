import React, { useState } from 'react';
import { Box } from '@mui/material';
import { QAStory } from '../common/QAStory';
import { Responder } from './Responder';

interface Props {
  stories: QAStory[]
}

enum View {
  LIST,
  GRID,
}

export function Stories({ stories }: Props) {
  const [view, setView] = useState(View.LIST);
  return (
    <div>
      <ul>
        {stories.map(({ question, timestamp }) => <li key={timestamp}><a href={`#${timestamp}`}>{question}</a></li>)}
      </ul>
      {stories.map((story) => (
        <div key={story.timestamp}>
          <h3 id={story.timestamp.toString()}>
            {story.question}
          </h3>
          <button
            type="button"
            onClick={() => { setView(view === View.LIST ? View.GRID : View.LIST); }}
          >
            {view === View.LIST ? 'View as images' : 'View as list'}
          </button>
          <ul style={{ display: view !== View.LIST ? 'none' : undefined }}>
            {story.responders.map((responder) => (
              <li key={responder.response}>
                {responder.username}
                :
                {' '}
                {responder.response}
              </li>
            ))}
          </ul>
          <Box
            sx={{
              height: view !== View.GRID ? 0 : undefined,
              overflow: 'hidden',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {story.responders.map((responder) => (
              <Responder
                key={responder.response}
                question={story.question}
                response={responder.response}
              />
            ))}
          </Box>
        </div>
      ))}
    </div>
  );
}
