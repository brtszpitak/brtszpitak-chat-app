import { useEffect, useRef, useState } from "react";
export default function AvatarFace({ speaking }: { speaking: boolean }) {
  const [mouth, setMouth] = useState(0);
  const raf = useRef<number | null>(null);
  const t0 = useRef<number>(0);
  useEffect(() => {
    function tick(t: number) {
      if (!t0.current) t0.current = t;
      const dt = (t - t0.current) / 1000;
      const target = speaking ? (Math.sin(dt * 12) + 1) / 2 : 0;
      setMouth((m) => m + (target - m) * 0.25);
      raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [speaking]);
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40">
      <defs><radialGradient id="g" cx="50%" cy="40%" r="70%"><stop offset="0%" stopColor="#ffe"/><stop offset="100%" stopColor="#f3e0c0"/></radialGradient></defs>
      <circle cx="100" cy="100" r="90" fill="url(#g)" stroke="#999" />
      <ellipse cx="70" cy="85" rx="12" ry="8" fill="#222" />
      <ellipse cx="130" cy="85" rx="12" ry="8" fill="#222" />
      <path d={`M60,130 Q100,${130 + 30 * mouth} 140,130`} stroke="#c33" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

