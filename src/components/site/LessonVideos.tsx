/**
 * Kinescope-плееры уроков. Kinescope — защищённый видеохостинг курса,
 * нативной замены iframe для него нет (единственное допустимое исключение).
 */
export function LessonVideos({ videos }: { videos: readonly string[] }) {
  if (!videos.length) return null;
  return (
    <div className="mt-[28px] space-y-[20px]">
      {videos.map((src) => (
        <div
          key={src}
          className="relative w-full overflow-hidden rounded-[16px] bg-[#0b0b0c]"
          style={{ aspectRatio: "16 / 9" }}
        >
          <iframe
            src={src}
            className="absolute inset-0 size-full border-0"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            loading="lazy"
            title="Видео урока Kochfit"
          />
        </div>
      ))}
    </div>
  );
}
