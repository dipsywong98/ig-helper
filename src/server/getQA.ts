import { IgApiClient, ReelsMediaFeedResponseItem } from 'instagram-private-api';
import { chunk } from 'lodash';
import { QAStory, QAStoryResponder } from '../common/QAStory';
import logger from './logger';
import { getArchivedStories } from './getArchivedStories';

const extractResponse = (story: any): QAStoryResponder[] => {
  if (!story.story_question_responder_infos?.length) {
    logger.error(`qa story dont have responder info ${story.id}`);
    return [{
      response: 'qa story dont have responder info',
      nickname: '~system',
      username: '~system',
      profilePicUrl: '',
      timestamp: Date.now(),
    }];
  }
  return story.story_question_responder_infos[0].responders.map((responder) => ({
    response: responder.response,
    nickname: responder.user.full_name,
    username: responder.user.username,
    profilePicUrl: responder.user.profile_pic_url,
    timestamp: responder.ts,
  }));
};

export const filterQA = (archivedStories: ReelsMediaFeedResponseItem[]): QAStory[] => {
  const qaStories = archivedStories.filter((story) => !!story.story_questions?.length);
  return qaStories.map((story) => ({
    imagePreview: story.image_versions2.candidates[1].url,
    imageShow: story.image_versions2.candidates[0].url,
    question: story.story_questions[0].question_sticker.question,
    responders: extractResponse(story),
    timestamp: Number(story.device_timestamp),
  }));
};

export const getArchivedQAStories = async (ig: IgApiClient, limit = 1): Promise<QAStory[]> => {
  const archiveItemChunks = chunk(await getArchivedStories(ig), 20);
  const qaStories: QAStory[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const archiveItems of archiveItemChunks) {
    // eslint-disable-next-line no-await-in-loop
    const items = await ig.feed.reelsMedia({ userIds: archiveItems.map((it) => it.id) }).items();
    qaStories.push(...filterQA(items));
    if (qaStories.length >= limit) {
      break;
    }
  }

  return qaStories;
};
