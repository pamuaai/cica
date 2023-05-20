export type IssueStates = "NEW" | "INPROGRESS" | "REVIEW" | "DONE";
export interface IssueType {
  id: number;
  name: string;
  createdAt: string;
  description: string;
  owner: any;
  state: IssueStates;
  updatedAt: string;
}
