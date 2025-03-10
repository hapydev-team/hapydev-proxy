import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [
  {
    name: 'hapydevProxyAgent',
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
    plugins: [resolve(), commonjs(), typescript(), json()],
  },
];
