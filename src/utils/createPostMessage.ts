const createPostMessage = (command: string, payload: any = undefined): object => ({
  command,
  payload,
});

export default createPostMessage;
