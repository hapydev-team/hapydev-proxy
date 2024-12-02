import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default [
  {
    name: 'apimisRuntime',
    input: 'proxy-server/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
    plugins: [resolve(), typescript(), commonjs(), json(), terser()],
  },
];
