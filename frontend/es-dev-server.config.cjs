/* eslint-disable no-undef */
module.exports = {
  port: 8001,
  plugins: [
    {
      transform(context) {
        if (context.response.type === 'application/javascript') {
          return {
            body: context.body.replace(
              /process.env.NODE_ENV/g,
              '\'development\''
            ),
          };
        }
      },
    },
  ],
};
