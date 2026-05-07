import { Offer } from "./types";

export default function OfferArtwork({ art }: { art: Offer["art"] }) {
  const styles =
    art === "summer"
      ? "from-[#84D7FF] via-[#6E85FF] to-[#A343F6]"
      : art === "winter"
        ? "from-[#FFD65C] via-[#FF8A00] to-[#FF4D2E]"
        : "from-[#FFD67B] via-[#FF6A8D] to-[#FFA13B]";

  const symbol = art === "summer" ? "S" : art === "winter" ? "%" : "P";

  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${styles} text-[12px] font-bold text-white shadow-sm`}>
      {symbol}
    </div>
  );
}
