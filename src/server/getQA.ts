import { ReelsMediaFeedResponseItem } from 'instagram-private-api';
import { QAStory, QAStoryResponder } from '../common/QAStory';
import logger from './logger';

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

export const getQA = (archivedStories: ReelsMediaFeedResponseItem[]): QAStory[] => {
  const qaStories = archivedStories.filter((story) => !!story.story_questions?.length);
  return qaStories.map((story) => ({
    imagePreview: story.image_versions2.candidates[1].url,
    imageShow: story.image_versions2.candidates[0].url,
    question: story.story_questions[0].question_sticker.question,
    responders: extractResponse(story),
    timestamp: Number(story.device_timestamp),
  }));
};
