"""Render a travelling dot trail using the actual dots in the approved artwork."""
from pathlib import Path
import json
import math
import subprocess
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/assets/heritage-schedule-diamonds-v2.png'
OUTPUT = ROOT / 'public/assets/heritage-diamond-breathing-v4.mp4'
QA = ROOT / 'output/heritage-diamond-breathing-v4'
QA.mkdir(parents=True, exist_ok=True)
FPS, DURATION = 30, 10
source = Image.open(SOURCE).convert('RGB')
width, height = source.size
grey = source.convert('L').tobytes()
remaining = {index for index, value in enumerate(grey) if value < 234}
# One continuous route: centre, around the left diamond, then around the right.
vertices = [(836, 470), (480, 110), (100, 470), (480, 820),
            (836, 470), (1190, 110), (1550, 470), (1190, 820), (836, 470)]
lengths = [math.dist(a, b) for a, b in zip(vertices, vertices[1:])]
total_length = sum(lengths)
dots = []
while remaining:
    stack = [remaining.pop()]
    component = []
    while stack:
        index = stack.pop()
        component.append(index)
        for neighbour in (index - 1, index + 1, index - width, index + width):
            if neighbour in remaining:
                remaining.remove(neighbour)
                stack.append(neighbour)
    if len(component) < 2:
        continue
    x = sum(index % width for index in component) / len(component)
    y = sum(index // width for index in component) / len(component)
    best_distance, route_position, walked = float('inf'), 0., 0.
    for a, b, length in zip(vertices, vertices[1:], lengths):
        dx, dy = b[0] - a[0], b[1] - a[1]
        along = max(0., min(1., ((x - a[0]) * dx + (y - a[1]) * dy) / length ** 2))
        distance = math.hypot(x - a[0] - along * dx, y - a[1] - along * dy)
        if distance < best_distance:
            best_distance = distance
            route_position = (walked + along * length) / total_length
        walked += length
    xs, ys = [index % width for index in component], [index // width for index in component]
    box = (max(0, min(xs) - 2), max(0, min(ys) - 2),
           min(width, max(xs) + 3), min(height, max(ys) + 3))
    corners = [source.getpixel(point) for point in ((box[0], box[1]), (box[2] - 1, box[1]),
               (box[0], box[3] - 1), (box[2] - 1, box[3] - 1))]
    background = tuple(round(sum(colour[channel] for colour in corners) / 4) for channel in range(3))
    darkest = min(component, key=lambda index: grey[index])
    ink = source.getpixel((darkest % width, darkest // width))
    patch = source.crop(box)
    background_luma = sum(background) / 3
    contrast = max(1., background_luma - sum(ink) / 3)
    # Preserve each source dot's grey ink and antialiasing; animate geometry only.
    alpha = Image.new('L', patch.size)
    alpha.putdata([max(0, min(255, round((background_luma - sum(pixel) / 3) / contrast * 255)))
                   for pixel in patch.getdata()])
    sprite = Image.new('RGBA', patch.size, ink)
    sprite.putalpha(alpha)
    dots.append((x, y, route_position, box, background, sprite))


def frame_at(time):
    # A local cluster breathes gently while the area follows the existing route.
    progress = time / DURATION
    breath = .5 - .5 * math.cos(2 * math.pi * time * 3 / DURATION)
    image = source.convert('RGBA')
    active = []
    for x, y, position, box, background, sprite in dots:
        age = (progress - position + .5) % 1 - .5
        strength = math.exp(-(age / .08) ** 2)
        if strength < .01:
            continue
        scale = 1 + strength * (-.55 + 1.15 * breath)
        # Clear all original footprints before placing resized dots to avoid overlaps.
        image.paste(background, box)
        active.append((x, y, sprite, scale))
    for x, y, sprite, scale in active:
        scaled = sprite.resize((sprite.width * 4, sprite.height * 4), Image.Resampling.LANCZOS)
        # Fractional affine scaling avoids whole-pixel jumps as the dots breathe.
        half = max(sprite.size) // 2 + 5
        size = half * 2
        factor = 4 / scale
        scaled = scaled.transform((size, size), Image.Transform.AFFINE,
            (factor, 0, scaled.width / 2 - half * factor,
             0, factor, scaled.height / 2 - half * factor), Image.Resampling.BICUBIC)
        image.alpha_composite(scaled, (round(x) - half, round(y) - half))
    return image.convert('RGB')


ffmpeg = next((ROOT / 'output/heritage-schedule-video/tools/imageio_ffmpeg/binaries').glob('ffmpeg*.exe'))
encoder = subprocess.Popen([str(ffmpeg), '-y', '-hide_banner', '-loglevel', 'warning',
    '-f', 'rawvideo', '-pixel_format', 'rgb24', '-video_size', f'{width}x{height}',
    '-framerate', str(FPS), '-i', '-', '-an', '-vf', 'pad=ceil(iw/2)*2:ceil(ih/2)*2:0:0:color=0xf6f4f1',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', '-metadata', 'title=Heritage Schedule — travelling double diamond', str(OUTPUT)], stdin=subprocess.PIPE,
    creationflags=subprocess.CREATE_NO_WINDOW)
sample_frames = {0, 50, 100, 150, 200, 250, 299}
for index in range(FPS * DURATION):
    frame = frame_at(index / FPS)
    encoder.stdin.write(frame.tobytes())
    if index in sample_frames:
        frame.save(QA / f'frame-{index:03}.jpg', quality=95)
        print(f'Rendered frame {index + 1}/{FPS * DURATION}', flush=True)
encoder.stdin.close()
if encoder.wait() != 0:
    raise RuntimeError('Video encoding failed')
(QA / 'composition.json').write_text(json.dumps({'source': str(SOURCE), 'output': str(OUTPUT),
    'fps': FPS, 'duration': DURATION, 'dot_count': len(dots), 'route': vertices}, indent=2))
print(f'Exported {OUTPUT.name}: {len(dots)} original dots, {DURATION}s, {FPS}fps', flush=True)
