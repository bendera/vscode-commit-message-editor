/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {legacyPlugin} from '@web/dev-server-legacy';

export default {
  appIndex: 'dev/index.html',
  nodeResolve: true,
  open: true,
  preserveSymlinks: true,
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
    legacyPlugin({
      polyfills: {
        // Manually imported in index.html file
        webcomponents: false,
      },
    }),
  ],
};
