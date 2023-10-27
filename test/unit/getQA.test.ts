import { ReelsMediaFeedResponseItem } from 'instagram-private-api';
import { getQA } from '../../src/server/getQA';
import archivedStories from './responses/archivedStories.json';
import qaStories from './responses/qastories.json';

describe('getQA', () => {
  it('can fetch arcived stories, keeps those with QA and fit into desired shape', () => {
    expect(getQA(archivedStories as unknown as ReelsMediaFeedResponseItem[])).toEqual(qaStories);
  });
});
