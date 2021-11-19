class IFrameMessagesController {
  private origin: string;
  private height: number = 0;
  private messagesMap: {[key: string]: {
    resolve: (result: any) => void;
    reject: (result: any) => void;
  }} = {};
  private messagesListener = this.listener.bind(this);
  private ready: boolean;

  constructor(origin: string) {
    this.origin = origin;
    this.ready = origin !== undefined;

    if (this.ready) {
      window.addEventListener("message", this.messagesListener);
    } else console.warn("MESSAGE LISTENER NOT STARTED");
  }

  send(payload: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.ready) { reject(); }

      const height = (this.height++).toString();
      this.messagesMap[height] = { resolve, reject };

      if (window.top != null) {
        window.top.postMessage(JSON.stringify({
          key: height, payload, id: "ddd"
        }), this.origin);
      }
    });
  }

  listener(event: any) {
    if (event.origin !== this.origin) return;

    const { key, payload, error } = JSON.parse(event.data);

    const message = this.messagesMap[key];
    if (!this.messagesMap[key]) return;
    delete this.messagesMap[key];

    console.debug("RECEIVE FROM PARENT", key, error, payload, error, event);
    if (error) {
      message.reject(payload)
    } else {
      message.resolve(payload);
    }
  }

}

export { IFrameMessagesController }
