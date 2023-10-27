import React from 'react';
import { QAStory } from '../common/QAStory';

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
        <div key={story.timestamp}>
          <h3 id={story.timestamp.toString()}>{story.question}</h3>
          <ul>
            {story.responders.map((responder) => (
              <li key={responder.timestamp}>
                {responder.username}
                :
                {' '}
                {responder.response}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
