export type Message = {
  body: string;
  username: string;
  timestamp: string;
  userID: number;
  recipientID: number | null;
  recipientUsername: string;
};
