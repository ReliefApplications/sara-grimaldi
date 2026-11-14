// `npm start`: prepares the content, starts the Angular dev server and
// prepares the content again whenever a file in /content changes, so edits
// show up in the browser on save.
import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { join } from 'node:path';
import { buildContent } from './build-content.mjs';

const report = () =>
  buildContent().forEach((message) => console.error(`content problem: ${message}`));
report();

let timer;
watch(join(import.meta.dirname, '..', 'content'), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(report, 200);
});

const server = spawn('npx', ['ng', 'serve', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
server.on('exit', (code) => process.exit(code ?? 0));
