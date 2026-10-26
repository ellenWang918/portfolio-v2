import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CalendarBlank, Cursor, GearSix } from '@phosphor-icons/react';
import { chromium } from 'playwright';
import { heritageFilm, heritageScene, setHeritageFrame } from '../src/motion/heritageSchedule.ts';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'output/heritage-schedule-video');
await mkdir(join(output, 'qa'), { recursive: true });
const binaries = join(output, 'tools/imageio_ffmpeg/binaries');
const ffmpeg = process.env.FFMPEG_PATH ?? join(binaries, (await readdir(binaries)).find(file => file.endsWith('.exe'))!);
const workspace = await readFile(join(root, 'public/assets/heritage-motion/ism-workspace.svg'));
const cursor = renderToStaticMarkup(createElement(Cursor, { weight: 'fill', color: '#121920' }));
const calendar = renderToStaticMarkup(createElement(CalendarBlank, { color: '#8aa8c5' }));
const gear = renderToStaticMarkup(createElement(GearSix, { color: '#65c9ff' }));
const html = heritageScene(`data:image/svg+xml;base64,${workspace.toString('base64')}`, cursor, calendar, gear);
await writeFile(join(output, 'composition.html'), html);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: heritageFilm.width, height: heritageFilm.height }, deviceScaleFactor: 1 });
try {
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
  const sampleTimes = [0, .7, 1.95, 2.7, 3.85, 4.3, 5.1, 6.7, 8.6, 10.95, 12.3, 14.4, 15.4, 16.95];
  for (const time of sampleTimes) {
    await page.evaluate(setHeritageFrame, time);
    await page.screenshot({ path: join(output, `qa/frame-${time.toFixed(2)}.jpg`), type: 'jpeg', quality: 95, animations: 'disabled' });
  }
  if (process.argv.includes('--stills')) {
    console.log(`Saved ${sampleTimes.length} storyboard frames.`);
  } else {
    const movie = join(root, 'public/assets', heritageFilm.fileName);
    const encoder = spawn(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'warning', '-f', 'image2pipe', '-vcodec', 'mjpeg', '-framerate', String(heritageFilm.fps), '-i', '-', '-an', '-vf', 'scale=in_color_matrix=bt601:out_color_matrix=bt709:out_range=tv', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv', '-movflags', '+faststart', '-r', String(heritageFilm.fps), '-metadata', 'title=Heritage Schedule — login to annual planning', movie], { stdio: ['pipe', 'inherit', 'inherit'], windowsHide: true });
    const finished = once(encoder, 'exit');
    encoder.stdin.on('error', error => console.error('Encoder input error:', error.message));
    const count = heritageFilm.fps * heritageFilm.duration;
    for (let frame = 0; frame < count; frame++) {
      await page.evaluate(setHeritageFrame, frame / heritageFilm.fps);
      const image = await page.screenshot({ type: 'jpeg', quality: 96, animations: 'disabled' });
      if (!encoder.stdin.write(image)) await once(encoder.stdin, 'drain');
      if (frame % 60 === 0) console.log(`Rendering ${frame}/${count} frames`);
    }
    encoder.stdin.end();
    const [code] = await finished;
    if (code !== 0) throw new Error(`Video encoder exited with ${code}`);
    await page.evaluate(setHeritageFrame, 8.6);
    await page.screenshot({ path: join(root, 'public/assets/heritage-motion/gantt-poster.jpg'), type: 'jpeg', quality: 94 });
    await page.evaluate(setHeritageFrame, 12.3);
    await page.screenshot({ path: join(root, 'public/assets/heritage-motion/configuration-poster.jpg'), type: 'jpeg', quality: 94 });
    console.log(`Exported ${movie} (${heritageFilm.width} × ${heritageFilm.height}, ${heritageFilm.fps} fps, ${heritageFilm.duration}s)`);
  }
} finally {
  await browser.close();
}
