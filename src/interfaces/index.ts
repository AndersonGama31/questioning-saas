export enum ELevel {
  A1 = 'a1',
  A2 = 'a2',
  B1 = 'b1',
  B2 = 'b2',
  C1 = 'c1',
  C2 = 'c2'
}

export interface IFetchQuestionsResponse {
  questions: IQuestion[];
}

export interface IQuestion {
  id: string;
  text: string;
  explanation: string;
  level: ELevel;
  options: IOption[];
  correctAnswer: string;
}

export interface IOption {
  id: string;
  text: string;
}
