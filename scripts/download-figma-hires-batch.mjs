#!/usr/bin/env node
/**
 * Прямая загрузка hi-res ассетов из Figma MCP (качество > вес).
 * URL → filename mapping из get_design_context (август 2026).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "images");

/** @type {Array<[dir: string, filename: string, assetId: string, ext?: string]>} */
const ASSETS = [
  // ——— beauty-health ———
  ["beauty-health", "imgImage3.png", "b38acc2f-b8eb-41dc-a550-d708f6e06102"],
  ["beauty-health", "imgImage4.png", "f3ebd470-9dae-401d-8fcf-f5177668ec19"],
  ["beauty-health", "imgImage5.png", "a29ce904-88f6-4dcd-8b23-92a71be09a8d"],
  ["beauty-health", "imgHugeiconsBodyPartMuscle.svg", "b07f0490-c190-4284-aaf1-ac698fca0f0b"],
  ["beauty-health", "imgMdiBabyCarriage.svg", "0af1ac11-2e69-44e8-942a-8a258bd0f6ed"],
  ["beauty-health", "imgGroup.svg", "925ad6ad-b806-45b3-9431-31a986af56eb"],
  ["beauty-health", "imgImage1.png", "342982af-ccda-4c19-875d-b6aeab45a0da"],
  ["beauty-health", "imgIPhone15Pro.png", "c004a89b-a3b8-4b80-81ce-e5d1ac2c8770"],
  ["beauty-health", "imgImage11.png", "ff5d14ee-a5fb-41b9-8a25-9f560be8fe42"],
  ["beauty-health", "imgExclude.svg", "fe3f8c40-e0ed-47ff-b645-d52e39d026c2"],
  ["beauty-health", "img.svg", "55822e88-6e45-4c02-857f-78a718ed6ee0"],
  ["beauty-health", "img54.png", "98706e1b-4a28-48bd-81ac-723d01384b88"],
  ["beauty-health", "imgImage8.png", "e66fbf23-3cef-4d76-a296-fabf74aa7a0e"],
  ["beauty-health", "imgImage9.png", "af6c6daf-17f5-4e9e-8513-c04f08a6632d"],
  ["beauty-health", "imgShadow.png", "8626692d-690e-475b-a0c8-f07a6f152567"],
  ["beauty-health", "imgIPhone16Pro.png", "9aacb036-e7af-4196-9832-2d5500e21b92"],
  ["beauty-health", "imgChangeThis1.png", "588a9c0e-41d0-4e1e-9eda-88b4e1d4e66c"],
  ["beauty-health", "imgChangeThis.svg", "cba225c3-a121-4170-a790-97621d229bdc"],

  // ——— postpartum ———
  ["postpartum", "imgImage.png", "f1282bca-79bd-456b-ae26-a61cb8eb66aa"],
  ["postpartum", "imgImage1.png", "cd197c62-22bf-4ee0-8abe-eacc199317a8"],
  ["postpartum", "imgImage2.png", "b35edc17-329b-4f01-8d8d-3a98d47c1635"],
  ["postpartum", "imgBannerImage.png", "d25211f1-5a3b-439e-978e-93f79a6481e7"],
  ["postpartum", "imgBannerImage1.png", "26447393-c9c7-4058-96eb-a074e18ab069"],
  ["postpartum", "imgBannerImage2.png", "ec8dcf13-fb7c-4d27-a0dc-1f67b562a72e"],
  ["postpartum", "imgBannerImage3.png", "feaad3a6-68d1-461e-b6e8-e677b58026cb"],
  ["postpartum", "imgBannerImage4.png", "9d6809a9-e78b-424b-a375-14631d71c2a9"],
  ["postpartum", "imgBannerImage5.png", "fbdad2ee-b771-4cf7-bc3d-bcf20ab46f72"],
  ["postpartum", "imgBannerImage6.png", "f3d793e3-f24e-45c1-9806-1cb11d859c5a"],
  ["postpartum", "imgBannerImage7.png", "55166ad0-47af-4eec-95d2-e2a5d08653fa"],
  ["postpartum", "imgChatGptImage2420261720451.png", "ce2f132e-50e2-488f-b19b-721bf1c3d0de"],
  ["postpartum", "imgHf20260520113803Accb8Bac783540Ad9B063Eae4D01114F1.png", "d4abfd86-b0d6-40b7-af26-c6efec79ec16"],

  // ——— pelvic-floor ———
  // raw fill 2222:2507 — side plank + egg prop (NOT thumbnail 226ecb69 = exercise ball)
  ["pelvic-floor", "img8892.png", "4b8f564c-8e64-4770-af95-e2e0fd81a358"],
  ["pelvic-floor", "imgImage.png", "4d2ad623-535f-4ebc-a843-914efade1b37"],
  ["pelvic-floor", "imgImage1.png", "91c80aec-e198-4218-bd80-56a69fc24854"],
  ["pelvic-floor", "imgImage2.png", "9349f88a-04f7-4a67-89b0-f5da336c7cec"],
  ["pelvic-floor", "imgIndicatorImage.png", "da104bc1-65b0-48c3-9eb9-6382c3828bb0"],
  ["pelvic-floor", "imgIndicatorImage1.png", "c7cd3d0c-bb4f-4a26-ba0f-af3e0f8dca7f"],

  // ——— pregnancy ———
  ["pregnancy", "imgImage2398.png", "a7ffae81-a6d4-4dac-84bd-23fc5ddc0aaa"],
  ["pregnancy", "imgChatGptImage2420261720451.png", "27d21086-48d9-488a-ade6-74cfc2679dd9"],
  ["pregnancy", "imgImage.png", "729fb285-859f-4a44-9c7f-a7455facaa32"],
  ["pregnancy", "imgImage1.png", "8894a3f7-1f07-4268-8bf8-41d9c12a3ebc"],
  ["pregnancy", "imgImage2.png", "742f4573-0b76-4e80-9c84-0531f1619ae8"],

  // ——— home ———
  // raw fills (download_assets rawImages[0]) — NOT MCP thumbnail exports
  // 2241:5287 / 5317 / 5358 / 2260:1674/1693/1779 — raw fill download_assets
  ["home", "imgImage.png", "82e0224e-3cef-401b-8852-1cc7de728b37"],
  ["home", "imgImage1.png", "91703359-77c9-4709-a13c-b194c76adf68"],
  // Прекомпозит группы 2265:2885 @2x — НЕ отдельный слой асфальта
  ["home", "imgAuthorSectionBg.png", "7cfc0714-3e4d-4b87-8e4c-f01bd30deb28"],
  ["home", "imgSectionImage1.png", "e9ca4a31-c550-4b67-8a5c-d4b99d159f20"],
  ["home", "imgAuthorImage.png", "8fe04e93-cb04-4a3f-b7bc-6e99f277247d"],
  ["home", "imgRectangle29012.png", "d223cb31-0ca6-4d4b-a8d9-19d6681c2121"],
  ["home", "imgRectangle29017.png", "fc3262aa-aa23-4dc5-b8bf-338afd7e41e4"],
  ["home", "imgRectangle29018.png", "1537a2ad-92cc-43a3-a257-a7aaf8bc80a0"],
  ["home", "imgRectangle29019.png", "0fae3faa-a0fa-456b-b96c-e01f84d5c0b3"],
  ["home", "imgSectionImage.png", "b9f3abc4-809d-47a2-9498-671411fc05da"],
  ["home", "imgCourseImage.jpg", "15613acb-59bf-4ed9-bc91-86f2c8c5fce2"],
  ["home", "imgRectangle29425.png", "9f64f339-9fc8-4f61-83ca-e4b69aad2be6"],
  ["home", "imgRectangle29426.png", "377ac302-f9ed-4b6d-bf58-04e49d1cf1ee"],
  ["home", "imgRectangle29427.png", "ecd4bfa3-271a-49e3-a824-c690f94846f4"],
  ["home", "imgTelegramCloudPhotoSize25217572614337927521Y61.png", "910ce395-7077-43e1-8630-b3e4e8efca38"],
  ["home", "imgTelegramCloudPhotoSize25217572614337927521Y62.png", "f3c39558-396a-4703-b24f-1b0a313dca4c"],
  ["home", "imgShadow.png", "18a44890-cc72-4e78-92a0-06f0ad7727e7"],
  ["home", "imgIPhone16Pro.png", "4886a2f7-79f6-4eec-b234-ad0d7cca8ee1"],
  ["home", "imgChangeThis1.png", "218a7285-3548-4b82-b5d1-884f8dfaf783"],
  ["home", "imgChangeThis.svg", "00eff252-4c81-4a78-b231-005decc9533a"],
  ["home", "img202605131451311.png", "4367faf7-dd18-447a-8aed-994ba7f26868"],
  ["home", "imgRectangle29016.png", "1c527096-4bd8-4e4d-980a-f28b8f6d55ec"],
];

/** ExpectCourseSection: те же phone-ассеты на всех курсах */
const EXPECT_FILES = [
  "imgShadow.png",
  "imgIPhone16Pro.png",
  "imgChangeThis1.png",
  "imgChangeThis.svg",
];

let ok = 0;
let fail = 0;

for (const [dir, filename, assetId] of ASSETS) {
  const ext = path.extname(filename) || ".png";
  const urlExt = ext === ".svg" ? ".svg" : ".png";
  const url = `https://www.figma.com/api/mcp/asset/${assetId}${urlExt}`;
  const outDir = path.join(ROOT, dir);
  const outFile = path.join(outDir, filename);
  await mkdir(outDir, { recursive: true });
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAIL ${dir}/${filename} ${res.status}`);
      fail++;
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(outFile, buf);
    console.log(`ok ${dir}/${filename} ${(buf.length / 1024).toFixed(0)}K`);
    ok++;
  } catch (e) {
    console.error(`FAIL ${dir}/${filename}`, e.message);
    fail++;
  }
}

// Копируем expect-ассеты beauty → остальные курсы
import { copyFile } from "node:fs/promises";
for (const targetDir of ["pregnancy", "postpartum", "pelvic-floor"]) {
  for (const file of EXPECT_FILES) {
    const src = path.join(ROOT, "beauty-health", file);
    const dest = path.join(ROOT, targetDir, file);
    try {
      await copyFile(src, dest);
      console.log(`copy beauty-health/${file} → ${targetDir}/`);
      ok++;
    } catch (e) {
      console.error(`copy fail ${targetDir}/${file}`, e.message);
      fail++;
    }
  }
}

console.log(`\ndone: ${ok} ok, ${fail} fail`);
process.exit(fail > 0 ? 1 : 0);
