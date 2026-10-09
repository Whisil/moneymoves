import { readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pnpmPackages = await readdir(path.join(root, "node_modules/.pnpm"));
const sharpPackage = pnpmPackages.find((name) => name.startsWith("sharp@"));

if (!sharpPackage) {
  throw new Error("Sharp is required to generate the BBH Bartle wordmark.");
}

const sharp = require(path.join(root, "node_modules/.pnpm", sharpPackage, "node_modules/sharp"));
const font = await readFile(path.join(root, "docs/fonts/BBH_Bartle/BBHBartle-Regular.ttf"));
const fontData = font.toString("base64");
const pressStartFont = await readFile(path.join(root, "docs/fonts/Press_Start_2P/PressStart2P-Regular.ttf"));
const pressStartFontData = pressStartFont.toString("base64");

const fontFace = `
  @font-face {
    font-family: "BBH Bartle Exact";
    src: url("data:font/ttf;base64,${fontData}") format("truetype");
  }
`;

const pressStartFontFace = `
  @font-face {
    font-family: "Press Start 2P Exact";
    src: url("data:font/ttf;base64,${pressStartFontData}") format("truetype");
  }
`;

const makeFlecks = (width, height, count, top = 0) => Array.from({ length: count }, (_, index) => {
  const x = (index * 149 + 37) % width;
  const y = top + ((index * 83 + 19) % (height - top));
  const size = 1 + ((index * 17) % 4);
  const opacity = 0.07 + ((index * 11) % 14) / 100;
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" opacity="${opacity}" />`;
}).join("");

const wordmarkWidth = 3200;
const wordmarkHeight = 620;
const wordmarkFlecks = makeFlecks(wordmarkWidth, wordmarkHeight, 520, 74);
const wordmarkSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${wordmarkWidth}" height="${wordmarkHeight}" viewBox="0 0 ${wordmarkWidth} ${wordmarkHeight}">
  <style>
    ${fontFace}
    .word {
      font-family: "BBH Bartle Exact";
      font-size: 390px;
      font-style: normal;
      font-weight: 400;
      letter-spacing: -8px;
    }
  </style>
  <defs>
    <text id="word" class="word" x="80" y="470">MONEYMOVES</text>
    <clipPath id="word-clip"><use href="#word" /></clipPath>
    <clipPath id="glitch-one"><rect x="0" y="220" width="${wordmarkWidth}" height="13" /></clipPath>
    <clipPath id="glitch-two"><rect x="0" y="352" width="${wordmarkWidth}" height="10" /></clipPath>
    <clipPath id="glitch-three"><rect x="0" y="407" width="${wordmarkWidth}" height="6" /></clipPath>
    <pattern id="halftone" width="22" height="22" patternUnits="userSpaceOnUse">
      <rect x="3" y="3" width="6" height="6" fill="#080808" />
      <rect x="15" y="15" width="4" height="4" fill="#080808" opacity=".86" />
    </pattern>
    <linearGradient id="dot-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="white" stop-opacity="0" />
      <stop offset=".48" stop-color="white" stop-opacity=".08" />
      <stop offset=".7" stop-color="white" stop-opacity=".72" />
      <stop offset="1" stop-color="white" stop-opacity="1" />
    </linearGradient>
    <mask id="dot-mask">
      <rect width="${wordmarkWidth}" height="${wordmarkHeight}" fill="url(#dot-fade)" />
    </mask>
  </defs>

  <use href="#word" x="10" y="1" fill="#00e2df" stroke="#00e2df" stroke-width="18" stroke-linejoin="round" paint-order="stroke" />
  <use href="#word" x="-10" y="4" fill="#f10d18" stroke="#f10d18" stroke-width="18" stroke-linejoin="round" paint-order="stroke" />
  <use href="#word" fill="#f3efe5" stroke="#f3efe5" stroke-width="18" stroke-linejoin="round" paint-order="stroke" />

  <g clip-path="url(#word-clip)" fill="#b6afa4">${wordmarkFlecks}</g>
  <rect x="0" y="320" width="${wordmarkWidth}" height="210" fill="url(#halftone)" clip-path="url(#word-clip)" mask="url(#dot-mask)" />

  <g clip-path="url(#glitch-one)">
    <use href="#word" x="34" fill="#f3efe5" stroke="#f3efe5" stroke-width="18" paint-order="stroke" />
    <use href="#word" x="24" fill="#f10d18" stroke="#f10d18" stroke-width="18" paint-order="stroke" />
  </g>
  <g clip-path="url(#glitch-two)">
    <use href="#word" x="-45" fill="#080808" />
    <use href="#word" x="-34" fill="#f3efe5" stroke="#f3efe5" stroke-width="18" paint-order="stroke" />
  </g>
  <g clip-path="url(#glitch-three)">
    <use href="#word" x="28" fill="#f3efe5" stroke="#f3efe5" stroke-width="18" paint-order="stroke" />
    <use href="#word" x="38" fill="#00e2df" stroke="#00e2df" stroke-width="18" paint-order="stroke" />
  </g>
</svg>`;

const squareSize = 1254;
const squareFlecks = makeFlecks(squareSize, 940, 360, 330);
const makeSquareSvg = ({ transparent = false, compact = false } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${squareSize}" height="${squareSize}" viewBox="0 0 ${squareSize} ${squareSize}">
  <style>
    ${fontFace}
    .mark {
      font-family: "BBH Bartle Exact";
      font-size: ${compact ? 530 : 560}px;
      font-weight: 400;
      font-style: normal;
      letter-spacing: -20px;
      text-anchor: middle;
    }
  </style>
  <defs>
    <text id="mark" class="mark" x="627" y="812">MM</text>
    <clipPath id="mark-clip"><use href="#mark" /></clipPath>
    <clipPath id="slice-a"><rect x="0" y="535" width="${squareSize}" height="14" /></clipPath>
    <clipPath id="slice-b"><rect x="0" y="684" width="${squareSize}" height="10" /></clipPath>
    <clipPath id="slice-c"><rect x="0" y="753" width="${squareSize}" height="7" /></clipPath>
    <pattern id="square-halftone" width="22" height="22" patternUnits="userSpaceOnUse">
      <rect x="3" y="3" width="6" height="6" fill="#080808" />
      <rect x="15" y="15" width="4" height="4" fill="#080808" opacity=".84" />
    </pattern>
    <linearGradient id="square-dot-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="white" stop-opacity="0" />
      <stop offset=".55" stop-color="white" stop-opacity=".08" />
      <stop offset=".78" stop-color="white" stop-opacity=".84" />
      <stop offset="1" stop-color="white" stop-opacity="1" />
    </linearGradient>
    <mask id="square-dot-mask">
      <rect width="${squareSize}" height="${squareSize}" fill="url(#square-dot-fade)" />
    </mask>
  </defs>

  ${transparent ? "" : `<rect width="${squareSize}" height="${squareSize}" fill="#050505" />`}
  <use href="#mark" x="12" y="-2" fill="#00e2df" stroke="#00e2df" stroke-width="16" stroke-linejoin="round" paint-order="stroke" />
  <use href="#mark" x="-12" y="5" fill="#f10d18" stroke="#f10d18" stroke-width="16" stroke-linejoin="round" paint-order="stroke" />
  <use href="#mark" fill="#f3efe5" stroke="#f3efe5" stroke-width="16" stroke-linejoin="round" paint-order="stroke" />

  <g clip-path="url(#mark-clip)" fill="#b6afa4">${squareFlecks}</g>
  <rect x="0" y="620" width="${squareSize}" height="270" fill="url(#square-halftone)" clip-path="url(#mark-clip)" mask="url(#square-dot-mask)" />

  ${compact ? "" : `
    <g clip-path="url(#slice-a)">
      <use href="#mark" x="35" fill="#f3efe5" stroke="#f3efe5" stroke-width="16" paint-order="stroke" />
      <use href="#mark" x="24" fill="#f10d18" stroke="#f10d18" stroke-width="16" paint-order="stroke" />
    </g>
    <g clip-path="url(#slice-b)">
      <use href="#mark" x="-42" fill="#080808" />
      <use href="#mark" x="-31" fill="#f3efe5" stroke="#f3efe5" stroke-width="16" paint-order="stroke" />
    </g>
    <g clip-path="url(#slice-c)">
      <use href="#mark" x="29" fill="#f3efe5" stroke="#f3efe5" stroke-width="16" paint-order="stroke" />
      <use href="#mark" x="39" fill="#00e2df" stroke="#00e2df" stroke-width="16" paint-order="stroke" />
    </g>
  `}
</svg>`;

const makePressStartYoutubeSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="${squareSize}" height="${squareSize}" viewBox="0 0 ${squareSize} ${squareSize}">
  <style>
    ${pressStartFontFace}
    .mark {
      font-family: "Press Start 2P Exact";
      font-size: 410px;
      font-weight: 400;
      text-anchor: middle;
    }
  </style>
  <defs>
    <text id="press-mark" class="mark" x="627" y="760">MM</text>
    <clipPath id="press-mark-clip"><use href="#press-mark" /></clipPath>
    <clipPath id="press-slice-a"><rect x="0" y="530" width="${squareSize}" height="18" /></clipPath>
    <clipPath id="press-slice-b"><rect x="0" y="696" width="${squareSize}" height="12" /></clipPath>
    <pattern id="press-pixels" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect x="4" y="4" width="5" height="5" fill="#080808" />
      <rect x="16" y="16" width="4" height="4" fill="#080808" opacity=".82" />
    </pattern>
    <linearGradient id="press-pixel-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="white" stop-opacity="0" />
      <stop offset=".52" stop-color="white" stop-opacity=".05" />
      <stop offset="1" stop-color="white" stop-opacity="1" />
    </linearGradient>
    <mask id="press-pixel-mask">
      <rect width="${squareSize}" height="${squareSize}" fill="url(#press-pixel-fade)" />
    </mask>
  </defs>

  <rect width="${squareSize}" height="${squareSize}" fill="#050505" />
  <use href="#press-mark" x="13" y="-4" fill="#00e2df" />
  <use href="#press-mark" x="-13" y="5" fill="#f10d18" />
  <use href="#press-mark" fill="#f3efe5" />
  <rect x="0" y="575" width="${squareSize}" height="230" fill="url(#press-pixels)" clip-path="url(#press-mark-clip)" mask="url(#press-pixel-mask)" />

  <g clip-path="url(#press-slice-a)">
    <use href="#press-mark" x="38" fill="#f3efe5" />
    <use href="#press-mark" x="26" fill="#f10d18" />
  </g>
  <g clip-path="url(#press-slice-b)">
    <use href="#press-mark" x="-32" fill="#f3efe5" />
    <use href="#press-mark" x="-43" fill="#00e2df" />
  </g>
</svg>`;

const wordmark = await sharp(Buffer.from(wordmarkSvg))
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();
const youtubeMark = await sharp(Buffer.from(makeSquareSvg()))
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();
const faviconMaster = await sharp(Buffer.from(makeSquareSvg({ transparent: true, compact: true })))
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();
const pressStartYoutubeMark = await sharp(Buffer.from(makePressStartYoutubeSvg()))
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();

await Promise.all([
  writeFile(path.join(root, "public/images/moneymoves-wordmark-bbh-transparent.png"), wordmark),
  writeFile(path.join(root, "public/images/moneymoves-logo-bbh-bartle-youtube.png"), youtubeMark),
  writeFile(path.join(root, "public/images/moneymoves-youtube-avatar.png"), youtubeMark),
  writeFile(path.join(root, "public/images/moneymoves-favicon-master.png"), faviconMaster),
  writeFile(path.join(root, "public/images/moneymoves-logo-press-start-2p-youtube.png"), pressStartYoutubeMark),
]);

const faviconPng = await sharp(faviconMaster).resize(256, 256).png({ compressionLevel: 9 }).toBuffer();
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(0, 6);
icoHeader.writeUInt8(0, 7);
icoHeader.writeUInt8(0, 8);
icoHeader.writeUInt8(0, 9);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(faviconPng.length, 14);
icoHeader.writeUInt32LE(22, 18);
await writeFile(path.join(root, "src/app/favicon.ico"), Buffer.concat([icoHeader, faviconPng]));

console.log("Generated BBH Bartle and Press Start 2P brand assets from the provided font files");
