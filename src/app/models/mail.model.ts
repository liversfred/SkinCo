export interface Mail {
  to: string[];
  message: Message;
}

export interface Message {
  subject: string,
  text?: string,
  html?: string,
}