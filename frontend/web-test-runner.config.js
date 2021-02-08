export default {
  files: ['dist/test/**/*.test.js', 'dist/test/**/*.test.html'],
  testRunnerHtml: (testFramework) =>
    `<html>
      <head>
        <script>window.process = { env: { NODE_ENV: "development" } }</script>
        <script type="module">
          import sinon from 'sinon';

          window.acquireVsCodeApi = sinon.spy(() => ({
            setState: sinon.fake(),
            getState: sinon.fake(),
            postMessage: sinon.fake(),
          }));
        </script>
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`,
};
