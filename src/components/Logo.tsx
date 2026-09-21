import Image from "next/image";
// static import so the URL picks up basePath on GitHub Pages
import logo from "../../public/logo.png";

/** The ring mark cropped from logo.png (which also carries the wordmark) + a typeset wordmark. */
export default function Logo({ size = 34 }: { size?: number }) {
  // the ring occupies roughly the top 72% of the image
  const markH = Math.round(size * (logo.height / logo.width) * 0.72);
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative block overflow-hidden" style={{ width: size, height: markH }}>
        <Image src={logo} alt="" priority style={{ width: size, height: "auto", maxWidth: "none" }} />
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-white">Entanglix</span>
    </span>
  );
}
