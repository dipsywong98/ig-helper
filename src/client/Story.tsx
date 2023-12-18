import React, { useReducer, useState } from 'react';
import { Box } from '@mui/material';
import { QAStory } from '../common/QAStory';
import { Responder } from './Responder';
import { download } from './download';
import { sleep } from '../common/utils';

interface Props {
  story: QAStory
}

enum View {
  LIST,
  GRID,
}

export function Story({ story }: Props) {
  const [view, setView] = useState(View.LIST);
  const [selected, toggleSelected] = useReducer(
    (current: Record<string, string>, [response, dataUrl]: [string, string]) => {
      const { [response]: existing, ...rest } = current;
      if (existing) {
        return rest;
      }
      return { ...rest, [response]: dataUrl };
    },
    {},
  );
  const downloadSelectedAsPngs = async () => {
    const now = Date.now();
    let k = 1;
    // eslint-disable-next-line no-restricted-syntax
    for (const dataUrl of Object.values(selected)) {
      download(`IG-Helper-Export_${story.question}-${now}-${k}.png`, dataUrl);
      k += 1;
      // eslint-disable-next-line no-await-in-loop
      await sleep(1000);
    }
  };
  return (
    <div>
      <h3 id={story.timestamp.toString()}>
        {story.question}
      </h3>
      <button
        type="button"
        onClick={() => { setView(view === View.LIST ? View.GRID : View.LIST); }}
      >
        {view === View.LIST ? 'View as images' : 'View as list'}
      </button>
      <button
        type="button"
        onClick={downloadSelectedAsPngs}
      >
        Download Selected
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
            selected={selected}
            toggleSelected={(...param) => toggleSelected(param)}
          />
        ))}
      </Box>
    </div>
  );
}
