import { ExtensionContext, WebviewView, WebviewViewProvider } from 'vscode';

export default class SecondaryEditorPanel implements WebviewViewProvider {
  public static readonly identifier = 'secondaryEditorPanel';

  constructor(private _context: ExtensionContext) {}

  resolveWebviewView(webviewView: WebviewView) {
    webviewView.webview.html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Document</title>
      </head>
      <body>
        <p>Hello</p>
      </body>
      </html>
    `;
  }
}
