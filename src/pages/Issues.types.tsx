export type IssueStates =
  | "NEW"
  | "REFUSED"
  | "INPROGRESS"
  | "BLOCKED"
  | "REVIEW"
  | "DONE";
export interface IssueType {
  id: number;
  name: string;
  createdAt: string;
  description: string;
  owner: any;
  state: IssueStates;
  updatedAt: string;
}
