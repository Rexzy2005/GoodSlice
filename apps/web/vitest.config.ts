import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({ plugins: [react()], resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }, test: {
  environment: 'node', include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'], restoreMocks: true,
  // The GoodDollar SDK's ESM build imports a CommonJS package by name; let Vite handle the interop as Next does.
  server: { deps: { inline: ['@goodsdks/citizen-sdk'] } },
} });
