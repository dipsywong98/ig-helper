export interface QAStory {
  imagePreview: string
  imageShow: string
  timestamp: number
  question: string
  responders: QAStoryResponder[]
}

export interface QAStoryResponder {
  response: string
  nickname: string
  username: string
  profilePicUrl: string
  timestamp: number
}
