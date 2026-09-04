import { assetPath } from "@/lib/asset-path";

const PROGRAM_PHOTO_WIDTHS = [120, 240, 360] as const;

/** Базовое имя без расширения — для responsive webp `-120/-240/-360`. */
export function programPhotoBase(image: string): string {
  return image.replace(/\.(png|jpe?g|webp)$/i, "");
}

export type ProgramPhotoDir = "postpartum" | "pregnancy";

/** src/srcSet/sizes + приоритет загрузки для фото в карточке «Программа курса». */
export function programPhotoProps(
  imageDir: ProgramPhotoDir,
  image: string,
  index: number,
) {
  const base = programPhotoBase(image);
  const dir = `/images/${imageDir}`;
  const srcSet = PROGRAM_PHOTO_WIDTHS.map(
    (w) => `${assetPath(`${dir}/${base}-${w}.webp`)} ${w}w`,
  ).join(", ");

  return {
    src: assetPath(`${dir}/${base}-240.webp`),
    srcSet,
    sizes: "(min-width: 1200px) 180px, 60px",
    loading: (index < 2 ? "eager" : "lazy") as "eager" | "lazy",
    ...(index === 0 ? { fetchPriority: "high" as const } : {}),
  };
}

/** Путь для `<link rel="preload">` — первая карточка ленты. */
export function programPhotoPreloadHref(
  imageDir: ProgramPhotoDir,
  image: string,
  width: (typeof PROGRAM_PHOTO_WIDTHS)[number] = 360,
): string {
  return `/images/${imageDir}/${programPhotoBase(image)}-${width}.webp`;
}
