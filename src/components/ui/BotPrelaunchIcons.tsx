import { assetPath } from "@/lib/asset-path";
import { TelegramBadgeIcon } from "@/components/ui/TelegramBadgeIcon";

const botAvatar = assetPath("/images/shared/hero-bot-avatar.webp");

type BotPrelaunchIconsProps = {
  compact?: boolean;
};

/** Аватар + Telegram badge для карточки «Бот предзаписи». */
export function BotPrelaunchIcons({ compact = false }: BotPrelaunchIconsProps) {
  if (compact) {
    return (
      <span className="relative block size-[28px] shrink-0">
        <span className="absolute inset-[-7.5%_-12.5%_-12.5%_-7.5%]">
          <TelegramBadgeIcon className="size-full" />
        </span>
        <img
          loading="lazy"
          alt=""
          className="absolute right-0 top-0 hidden size-[18px] rounded-full object-cover sm:block sm:size-[20px]"
          src={botAvatar}
          width={20}
          height={20}
        />
      </span>
    );
  }

  return (
    <span className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] leading-none">
      <span className="col-start-1 row-start-1 ml-[34px] size-[40px] overflow-hidden rounded-full">
        <img loading="lazy"
          alt=""
          className="size-full object-cover"
          src={botAvatar}
          width={40}
          height={40}
        />
      </span>
      <span className="col-start-1 row-start-1 relative ml-0 size-[40px]">
        <span className="absolute inset-[-7.5%_-12.5%_-12.5%_-7.5%]">
          <TelegramBadgeIcon className="size-full" />
        </span>
      </span>
    </span>
  );
}
