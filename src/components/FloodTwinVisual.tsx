"use client";

import Image, { type StaticImageData } from "next/image";
import { useId, useState } from "react";
import f1730 from "@/assets/floodtwin/sandy-1730.webp";
import f1930 from "@/assets/floodtwin/sandy-1930.webp";
import f2030 from "@/assets/floodtwin/sandy-2030.webp";
import f2124 from "@/assets/floodtwin/sandy-2124.webp";

/* ───────────────────── FloodTwin — Hurricane Sandy replay ───────────────────── */

// Frames rendered by the FloodTwin model (depth view, 4 m grid, corrected Battery record);
// the read-outs are the model's own values at each frame.
type Frame = { img: StaticImageData; time: string; level: string; area: string; reached: string; loss: string };

const FRAMES: Frame[] = [
  { img: f1730, time: "17:30", level: "1.68 m", area: "0.05 km²", reached: "6", loss: "$53M" },
  { img: f1930, time: "19:30", level: "2.74 m", area: "1.20 km²", reached: "315", loss: "$424M" },
  { img: f2030, time: "20:30", level: "3.09 m", area: "2.29 km²", reached: "1,863", loss: "$1.48B" },
  { img: f2124, time: "21:24", level: "3.22 m", area: "2.72 km²", reached: "2,623", loss: "$2.12B" },
];

const DEPTH_RAMP = "linear-gradient(to right, #cde2fb, #86b6ef, #3987e5, #1c5cab, #0d366b)";

export function FloodTwinVisual({ interactive = true }: { interactive?: boolean }) {
  const [i, setI] = useState(FRAMES.length - 1);
  const f = FRAMES[i];
  // the visual is mounted twice (hero + product section); ids must not collide
  const inputId = `ft-time-${useId().replace(/:/g, "")}`;

  return (
    <div>
      <div className="relative aspect-[1080/680] bg-[#0b0e10]">
        {FRAMES.map((fr, k) => (
          <Image
            key={fr.time}
            src={fr.img}
            alt={`FloodTwin depth view of Hoboken and the Hudson at ${fr.time} EDT on 29 October 2012`}
            fill
            sizes="(min-width: 1024px) 560px, 92vw"
            className="object-cover transition-opacity duration-500"
            style={{ opacity: k === i ? 1 : 0 }}
            priority={k === FRAMES.length - 1}
          />
        ))}
        <div className="absolute left-3 top-3 rounded-lg bg-black/55 backdrop-blur px-2.5 py-1.5">
          <span className="block text-[10px] text-ink-3">Mon 29 Oct 2012</span>
          <span className="block font-mono text-[13px] text-white tabular-nums">{f.time} EDT</span>
        </div>
        <div className="absolute left-3 bottom-3 rounded-lg bg-black/55 backdrop-blur px-2.5 py-1.5 w-[150px]">
          <span className="block text-[10px] text-ink-2 mb-1">Water Depth</span>
          <span className="block h-1.5 rounded-sm" style={{ background: DEPTH_RAMP }} />
          <span className="flex justify-between text-[9px] text-ink-3 mt-0.5 font-mono"><span>0</span><span>1.5</span><span>3 m</span></span>
        </div>
      </div>

      {interactive && (
        <div className="flex items-center gap-4 px-5 pt-3 pb-3">
          <label htmlFor={inputId} className="text-[11px] font-mono text-ink-3">Time</label>
          <input
            id={inputId}
            type="range"
            min={0}
            max={FRAMES.length - 1}
            step={1}
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            className="range"
            aria-label="Time during Hurricane Sandy, 29 October 2012"
            aria-valuetext={`${f.time} EDT`}
          />
          <span className="font-mono text-[13px] text-white tabular-nums w-16 whitespace-nowrap text-right">{f.time}</span>
        </div>
      )}

      <div className="grid grid-cols-4 border-t border-white/[0.07]">
        {[
          { k: "Water Level", ks: "Level", v: f.level, c: "text-[#7cc4ff]" },
          { k: "Flooded Land", ks: "Flooded", v: f.area, c: "text-white" },
          { k: "Buildings", ks: "Buildings", v: f.reached, c: "text-white" },
          { k: "Expected Loss", ks: "Loss", v: f.loss, c: "text-[#ffb340]" },
        ].map((r) => (
          <div key={r.k} className="px-2.5 sm:px-4 py-3 border-r border-white/[0.07] last:border-r-0 min-w-0">
            <span className="block text-[10px] font-mono text-ink-3 mb-1 whitespace-nowrap">
              <span className="sm:hidden">{r.ks}</span>
              <span className="hidden sm:inline">{r.k}</span>
            </span>
            <span className={`block text-[14px] sm:text-lg font-semibold tracking-tight tabular-nums whitespace-nowrap ${r.c}`}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
