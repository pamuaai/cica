import { IssueStates } from "../pages/Issues.types";

export function getIssueStateName(type: IssueStates): string {
  switch (type) {
    case "NEW":
      return "Új";
    case "REFUSED":
      return "Elutasítva";
    case "BLOCKED":
      return "Blokkolva";
    case "INPROGRESS":
      return "Folyamatban";
    case "REVIEW":
      return "Felülvizsgálat alatt";
    case "DONE":
      return "Kész";
    default:
      return "";
  }
}
