export interface Thought {
  thought: string;
  loc: Loc;
}

export interface Loc {
  lat: string;
  long: string;
  accuracy: number;
}
