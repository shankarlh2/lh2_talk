
export interface MeetingAnalysis {
  date: string;
  title: string;
  summary: string;
  transcript: string;
  minutesOfMeeting: {
    topic: string;
    points: string[];
  }[];
  actionItems: {
    task: string;
    assignee?: string;
  }[];
  keyLearnings: string[];
}
