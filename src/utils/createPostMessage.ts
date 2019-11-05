const createPostMessage = (command: string, payload: object): object => ({
  command,
  payload,
});

export default createPostMessage;
