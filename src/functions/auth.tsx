export function checkLoggedIn(): boolean {
  //TODO: Check cookie, local storage or endpoint
  return false;
}

export function setCredentials(data: any): void {
  console.log("DATA:", data);
  // This should save the JWT token in local storage, maybe store username and/or ID somewhere
}
