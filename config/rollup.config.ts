import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
  // https://github.com/rollup/rollup/issues/1828
  watch: {
    chokidar: {
      usePolling: true,
    },
  },
  input: ['src/index.ts'],
  output: {
    dir: 'dist'
  },
  plugins: [
    nodeResolve(),
    typescript({
      include: ['src/**/*'],
    }),
    replace({
      'process.env.VITEST': false,
      preventAssignment: true,
    }),
  ],
});
