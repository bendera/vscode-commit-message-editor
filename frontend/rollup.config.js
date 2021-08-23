/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import alias from '@rollup/plugin-alias';
import vizualizer from 'rollup-plugin-visualizer';
import filesize from 'rollup-plugin-filesize';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';

const baseConfig = ({vizualizerFilename, vizualizerTitle}) => {
  return {
    onwarn(warning) {
      if (warning.code !== 'THIS_IS_UNDEFINED') {
        console.error(`(!) ${warning.message}`);
      }
    },
    plugins: [
      alias({
        entries: [
          {
            find: 'lit-html/lib/shady-render.js',
            replacement: 'node_modules/lit-html/lit-html.js',
          },
        ],
      }),
      replace({
        'Reflect.decorate': 'undefined',
        'process.env.NODE_ENV': "'production'",
      }),
      resolve(),
      minifyHTML(),
      terser({
        module: true,
        warnings: true,
        mangle: {
          properties: {
            regex: /^__/,
          },
        },
        format: {
          comments: false,
        },
      }),
      filesize({
        showBrotliSize: true,
      }),
      vizualizer({filename: vizualizerFilename, title: vizualizerTitle}),
    ],
  };
};

export default [
  {
    ...baseConfig({
      vizualizerFilename: 'stats_editor.html',
      title: 'Editor Page',
    }),
    input: 'dist/pages/cme-editor-page.js',
    output: {
      file: 'dist/editor.bundled.js',
      format: 'esm',
    },
  },
  {
    ...baseConfig({
      vizualizerFilename: 'stats_settings.html',
      title: 'Settings Page',
    }),
    input: 'dist/pages/cme-settings-page.js',
    output: {
      file: 'dist/settings.bundled.js',
      format: 'esm',
    },
  },
];
