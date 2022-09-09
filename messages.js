module.exports = {
  Loading: "loading", // appStatus loading
  Ready: "ready", // appStatus readyBasic
  Offline: "offline", // appStatus from online to offline
  Online: "online", // appStatus from offline to ready
  StatusChanged: "statusChanged", // playground status changed
  LspStatusChanged: "lspStatusChanged", // The status of Lsp server is changed
  PlaygroundChanged: "playgroundChanged", // playground environment has changed, for example, switch question
  Following: "following", // Current user has been following somebody
  UnFollowing: "unFollowing", // Current user has been following somebody
  RunStatusChanged: "runStatusChanged", // The excution status is changed
  FileStructureChanged: "fileStructureChanged", // The files tree changed, which is caused by ether files or directories
  FileContentChanged: "fileContentChanged", // The files changed, which is caused by editing the content in files
  AppendToConsole: "appendToConsole", // New content arrived to append to the console
  AppendToTerminal: "appendToTerminal", // New content arrived to append to the terminal
  ApplicationAvailable: "ApplicationAvailable", // The application ran successfully and became accessable
  PlaybackInfo: "playbackInfo", // The information of playback is available
  ReplayStart: "ReplayStart", // Begin for replaying
  ReplayEnd: "ReplayEnd", // End for replaying
  Customize: "customize", // playack customize event
  UserEnter: "userEnter", // User enter
  UserLeave: "userLeave", // User leave
  UsersUpdated: "usersUpdated", // UserInfo has changed, follow, cursor, scroll, etc

  // Error message
  ConnectionBroken: "connectionBroken", // The connection to the server is broken, you should route to another server
  ConnectionFailed: "connectionFailed", // The connection to the server is failed, you should route to another server
  AuthorizationFailed: "authorizationFailed", // The authorization failed so you need to sign in again or get a new ticket
  FileStructureDamaged: "fileStructureDamaged", // The connection to the server is broken
  ErrorFromServer: "errorFromServer", // The connection to the server is broken
  AppendCustomizeFrameData: "appendCustomizeFrameData",
  LineAction: "lineAction",
  // file
  FileInfo: "fileInfo", // 文件信息
  InsertTextById: "insertTextById",
  SwitchFreezeCode: "switchFreezeCode",
};
