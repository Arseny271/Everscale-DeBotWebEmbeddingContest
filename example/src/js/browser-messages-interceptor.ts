class DeBrowserMessagesInterceptor {
  private deBrowserOrigin: string;
  private iframeId: string;
  private iframe: HTMLIFrameElement | null;
  private window: Window | null;

  private messageEventListener = this.onMessageEvent.bind(this);
  private listener: (message: any) => Promise<any> = async () => {};

  constructor(iframeId: string, deBrowserOrigin: string) {
    this.deBrowserOrigin = deBrowserOrigin;
    this.iframeId = iframeId;
    this.iframe = window.document.getElementById(this.iframeId) as HTMLIFrameElement;
    this.window = (this.iframe) ? this.iframe.contentWindow : null;

    window.addEventListener("message", this.messageEventListener);
  }

  private onMessageEvent(event: any) {
    if (this.iframe === null || this.window === null) {
      this.iframe = window.document.getElementById(this.iframeId) as HTMLIFrameElement;
      this.window = (this.iframe) ? this.iframe.contentWindow : null;
    }

    if (event.origin !== this.deBrowserOrigin) return;
    const { key, payload } = JSON.parse(event.data);

    this.listener(payload).then((result: any) => {
      if (this.window === null) return;
      this.window.postMessage(JSON.stringify({
        key, payload: result
  		}), this.deBrowserOrigin);
    }, (error: any) => {
      if (this.window === null) return;
      this.window.postMessage(JSON.stringify({
        key, payload: error, error: true
  		}), this.deBrowserOrigin);
    });
  }

  public setListener(listener: (message: any) => Promise<any>) {
    this.listener = listener;
  }
}

export { DeBrowserMessagesInterceptor }
