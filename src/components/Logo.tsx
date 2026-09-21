import Image from "next/image";

/** The ring mark cropped from logo.png (which also carries the wordmark) + a typeset wordmark. */
export default function Logo({ size = 34 }: { size?: number }) {
  // logo.png is 440×415; the ring occupies roughly the top 72%.
  const markH = Math.round(size * (415 / 440) * 0.72);
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative block overflow-hidden" style={{ width: size, height: markH }}>
        <Image src="/logo.png" alt="" width={440} height={415} priority style={{ width: size, height: "auto", maxWidth: "none" }} />
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-white">Entanglix</span>
    </span>
  );
}
