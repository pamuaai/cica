export type IssueStates =
  | "NEW"
  | "REFUSED"
  | "INPROGRESS"
  | "BLOCKED"
  | "REVIEW"
  | "DONE";

export const ISSUE_STATE_NAMES: {
  state: IssueStates;
  name: string;
  color: string;
}[] = [
  { state: "NEW", name: "Új", color: "warning" },
  { state: "REFUSED", name: "Elutasítva", color: "danger" },
  { state: "INPROGRESS", name: "Folyamatban", color: "info" },
  { state: "BLOCKED", name: "Blokkolva", color: "danger" },
  { state: "REVIEW", name: "Felülvizsgálat", color: "danger" },
  { state: "DONE", name: "Kész", color: "success" },
];
export interface IssueType {
  id: number;
  name: string;
  createdAt: string;
  description: string;
  owner: any;
  state: IssueStates;
  updatedAt: string;
}

export interface UserType {
  id: number;
  username: string;
  email: string;
}
