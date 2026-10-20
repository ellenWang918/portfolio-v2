import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const client = new URL('../dist/client/', import.meta.url);
const projects = JSON.parse(await readFile(new URL('../src/data/projects.json', import.meta.url), 'utf8'));

for (const { id } of projects) {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid static project ID: ${id}`);
  const directory = new URL(`work/${id}/`, client);
  await mkdir(directory, { recursive: true });
  await copyFile(new URL('index.html', client), new URL('index.html', directory));
}

console.log(`Prepared ${projects.length} static case-study routes in ${fileURLToPath(client)}`);
