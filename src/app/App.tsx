import { GRIP_IMAGES } from '../gripImages';
import { useState, useRef, useEffect } from "react";
import {
  Wifi,
  Bluetooth,
  Airplay,
  Moon,
  Sun,
  Flashlight,
  Timer,
  Calculator,
  Camera,
  Music2,
  Volume2,
  Pause,
  Play,
  SkipForward,
  SkipBack,
  Signal,
  Battery,
  Lock,
  ArrowDown,
} from "lucide-react";
import { getContext, nextUrl } from './tallyFlow';
import { InstructionsOverlay } from './InstructionsOverlay';

declare global {
  interface Window {
    Tally: any;
  }
}

const APP_ICONS = [
  { name: "Messages", bg: "bg-green-500", icon: "💬" },
  { name: "Phone", bg: "bg-green-600", icon: "📞" },
  { name: "Safari", bg: "bg-blue-500", icon: "🧭" },
  { name: "Mail", bg: "bg-blue-400", icon: "✉️" },
  { name: "Maps", bg: "bg-green-400", icon: "🗺️" },
  { name: "Photos", bg: "bg-yellow-400", icon: "🖼️" },
  { name: "Camera", bg: "bg-zinc-500", icon: "📷" },
  { name: "Clock", bg: "bg-zinc-800", icon: "🕐" },
  { name: "Weather", bg: "bg-blue-400", icon: "🌤️" },
  { name: "Notes", bg: "bg-yellow-300", icon: "📝" },
  { name: "Reminders", bg: "bg-red-500", icon: "☑️" },
  { name: "Settings", bg: "bg-zinc-400", icon: "⚙️" },
  { name: "App Store", bg: "bg-blue-500", icon: "🛍️" },
  { name: "Podcasts", bg: "bg-purple-500", icon: "🎙️" },
  { name: "Music", bg: "bg-red-500", icon: "🎵" },
  { name: "Fitness", bg: "bg-green-400", icon: "🏃" },
  { name: "Wallet", bg: "bg-black", icon: "💳" },
  { name: "Health", bg: "bg-pink-400", icon: "❤️" },
  { name: "Files", bg: "bg-blue-300", icon: "📁" },
  { name: "Stocks", bg: "bg-black", icon: "📈" },
  { name: "Books", bg: "bg-orange-400", icon: "📚" },
  { name: "TV", bg: "bg-black", icon: "📺" },
  { name: "Translate", bg: "bg-blue-600", icon: "🌐" },
  { name: "FaceTime", bg: "bg-green-500", icon: "📹" },
];

const DOCK_ICONS = [
  { name: "Messages", bg: "bg-green-500", icon: "💬" },
  { name: "Phone", bg: "bg-green-600", icon: "📞" },
  { name: "Safari", bg: "bg-blue-500", icon: "🧭" },
  { name: "Mail", bg: "bg-blue-400", icon: "✉️" },
];

const ctx = getContext(); 

function useViewportSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    function update() {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

function useTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function StatusBar() {
  const time = useTime();
  const h = time.getHours();
  const m = time.getMinutes();
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-white text-[13px] font-semibold select-none">
      <span>{h % 12 === 0 ? 12 : h % 12}:{pad(m)}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={16} />
      </div>
    </div>
  );
}

function CCTile({
  children,
  active,
  onToggle,
  className = "",
}: {
  children: React.ReactNode;
  active: boolean;
  onToggle?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-95 ${active ? "bg-white text-black" : "bg-white/20 text-white"
        } ${className}`}
    >
      {children}
    </button>
  );
}

function Slider({
  value,
  onChange,
  icon: Icon,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="bg-white/20 rounded-2xl p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between text-white">
        <span className="text-[11px] font-medium uppercase tracking-wider opacity-70">{label}</span>
        <Icon size={14} />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full accent-white cursor-pointer"
      />
    </div>
  );
}

function MusicCard({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white/20 rounded-2xl p-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex-shrink-0 flex items-center justify-center">
          <Music2 size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[13px] font-semibold truncate">Blinding Lights</p>
          <p className="text-white/60 text-[11px] truncate">The Weeknd</p>
        </div>
        <div className="flex items-center gap-2 text-white">
          <button className="p-1 active:scale-90 transition-transform">
            <SkipBack size={16} />
          </button>
          <button onClick={onToggle} className="p-1 active:scale-90 transition-transform">
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="p-1 active:scale-90 transition-transform">
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ControlCenter({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplay, setAirplay] = useState(false);
  const [dnd, setDnd] = useState(false);
  const [flashlight, setFlashlight] = useState(false);
  const [brightness, setBrightness] = useState(70);
  const [volume, setVolume] = useState(55);
  const [playing, setPlaying] = useState(true);
  const [dragY, setDragY] = useState(0);
  const dragStart = useRef<number | null>(null);
  const isDragging = useRef(false);

  function onDragStart(clientY: number) {
    dragStart.current = clientY;
    isDragging.current = true;
  }

  function onDragMove(clientY: number) {
    if (!isDragging.current || dragStart.current === null) return;
    const delta = clientY - dragStart.current;
    setDragY(Math.min(0, delta)); // only allow dragging up
  }

  function onDragEnd(clientY: number) {
    if (!isDragging.current || dragStart.current === null) return;
    const delta = clientY - dragStart.current;
    if (delta < -60) onClose();
    setDragY(0);
    isDragging.current = false;
    dragStart.current = null;
  }

  const { h: viewportH } = useViewportSize();
  const translateY = visible ? dragY : -viewportH;

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col"
      style={{
        transform: `translateY(${translateY}px)`,
        transition: isDragging.current ? "none" : "transform 0.3s ease-in-out",
        background: "rgba(18, 18, 22, 0.9)",
        backdropFilter: "blur(50px) saturate(2)",
        WebkitBackdropFilter: "blur(50px) saturate(2)",
        pointerEvents: visible ? "auto" : "none",
        touchAction: "none",
      }}
      onMouseDown={(e) => onDragStart(e.clientY)}
      onMouseMove={(e) => { if (e.buttons === 1) onDragMove(e.clientY); }}
      onMouseUp={(e) => onDragEnd(e.clientY)}
      onMouseLeave={(e) => { if (isDragging.current) onDragEnd(e.clientY); }}
      onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
      onTouchMove={(e) => onDragMove(e.touches[0].clientY)}
      onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientY)}
    >
      {/* Dynamic island spacer */}
      <div className="h-14 flex-shrink-0" />

      {/* Scrollable content */}
      <div
        className="flex-1 px-4 flex flex-col gap-3 overflow-y-auto pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Connectivity + focus row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Connectivity block */}
          <div className="bg-white/20 rounded-2xl p-3 flex flex-col gap-3">
            <button
              onClick={() => setWifi(!wifi)}
              className="flex items-center gap-2 active:opacity-70 transition-opacity"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${wifi ? "bg-white" : "bg-white/30"
                  }`}
              >
                <Wifi size={14} className={wifi ? "text-black" : "text-white"} />
              </div>
              <div className="text-left">
                <p className="text-white text-[11px] font-semibold leading-none">Wi-Fi</p>
                <p className="text-white/60 text-[9px]">{wifi ? "Home Network" : "Off"}</p>
              </div>
            </button>
            <button
              onClick={() => setBluetooth(!bluetooth)}
              className="flex items-center gap-2 active:opacity-70 transition-opacity"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${bluetooth ? "bg-white" : "bg-white/30"
                  }`}
              >
                <Bluetooth size={14} className={bluetooth ? "text-black" : "text-white"} />
              </div>
              <div className="text-left">
                <p className="text-white text-[11px] font-semibold leading-none">Bluetooth</p>
                <p className="text-white/60 text-[9px]">{bluetooth ? "AirPods" : "Off"}</p>
              </div>
            </button>
            <button
              onClick={() => setAirplay(!airplay)}
              className="flex items-center gap-2 active:opacity-70 transition-opacity"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${airplay ? "bg-white" : "bg-white/30"
                  }`}
              >
                <Airplay size={14} className={airplay ? "text-black" : "text-white"} />
              </div>
              <div className="text-left">
                <p className="text-white text-[11px] font-semibold leading-none">AirDrop</p>
                <p className="text-white/60 text-[9px]">{airplay ? "On" : "Off"}</p>
              </div>
            </button>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-2">
            <CCTile
              active={dnd}
              onToggle={() => setDnd(!dnd)}
              className="flex-1 flex-col gap-1"
            >
              <Moon size={20} />
              <span className="text-[9px] font-semibold">Focus</span>
            </CCTile>
            <CCTile active={false} className="h-12">
              <Lock size={16} />
            </CCTile>
          </div>
        </div>

        {/* Music */}
        <MusicCard playing={playing} onToggle={() => setPlaying(!playing)} />

        {/* Brightness */}
        <Slider value={brightness} onChange={setBrightness} icon={Sun} label="Brightness" />

        {/* Volume */}
        <Slider value={volume} onChange={setVolume} icon={Volume2} label="Volume" />

        {/* Quick tiles */}
        <div className="grid grid-cols-4 gap-2">
          <CCTile
            active={flashlight}
            onToggle={() => setFlashlight(!flashlight)}
            className="aspect-square"
          >
            <Flashlight size={18} />
          </CCTile>
          <CCTile active={false} className="aspect-square">
            <Timer size={18} />
          </CCTile>
          <CCTile active={false} className="aspect-square">
            <Calculator size={18} />
          </CCTile>
          <CCTile active={false} className="aspect-square">
            <Camera size={18} />
          </CCTile>
        </div>
      </div>

      {/* Swipe-up handle */}
      <div className="flex flex-col items-center py-3 flex-shrink-0 gap-1">
        <p className="text-white/30 text-[9px] font-medium tracking-wide">swipe up to close</p>
        <div className="w-28 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  );
}

function HomeScreen() {
  const time = useTime();
  const h = time.getHours();
  const m = time.getMinutes();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center pt-14 pb-4 text-white select-none">
        <p className="text-[15px] font-medium opacity-80">
          {days[time.getDay()]}, {months[time.getMonth()]} {time.getDate()}
        </p>
        <p className="text-[72px] font-thin leading-none tracking-tight">
          {h % 12 === 0 ? 12 : h % 12}:{pad(m)}
        </p>
      </div>

      <div className="flex-1 px-5 pb-2 overflow-hidden">
        <div className="grid grid-cols-4 gap-4">
          {APP_ICONS.map((app) => (
            <button
              key={app.name}
              className="flex flex-col items-center gap-1 active:opacity-70 transition-opacity"
            >
              <div
                className={`w-[58px] h-[58px] ${app.bg} rounded-[14px] flex items-center justify-center text-2xl shadow-sm`}
              >
                {app.icon}
              </div>
              <span className="text-white text-[10px] font-medium drop-shadow-sm truncate w-full text-center">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="mx-6 mb-6 rounded-[26px] py-3 px-5 flex justify-around"
        style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(20px)" }}
      >
        {DOCK_ICONS.map((app) => (
          <button key={app.name} className="active:opacity-70 transition-opacity">
            <div
              className={`w-[58px] h-[58px] ${app.bg} rounded-[14px] flex items-center justify-center text-2xl shadow-sm`}
            >
              {app.icon}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// "right" triggers CC from the top-right corner; swap to "left" for the other condition
const CC_TRIGGER_SIDE: "right" | "left" = "right";

export default function App() {
  const startTimeRef = useRef<number>(Date.now());
  const timeToOpenRef = useRef<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [ccOpen, setCcOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [hasOpenedThreeTimes, setHasOpenedThreeTimes] = useState(false);

  function handleStart() {
    startTimeRef.current = Date.now(); // timer starts here, not on page load
    timeToOpenRef.current = null;
    setOpenCount(0);
    setHasOpenedThreeTimes(false);
    setShowInstructions(false);
  }

  function markOpened() {
    setOpenCount((prev) => {
      const next = prev + 1;
      if (next >= 3 && timeToOpenRef.current === null) {
        timeToOpenRef.current = Date.now() - startTimeRef.current;
        setHasOpenedThreeTimes(true);
      }
      return next;
    });
  }
  const mouseStartY = useRef<number | null>(null);

  function isInTriggerZone(clientX: number, rect: DOMRect) {
    const relX = clientX - rect.left;
    return CC_TRIGGER_SIDE === "right" ? relX > rect.width / 2 : relX < rect.width / 2;
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (showInstructions) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relY = e.clientY - rect.top;
    if (relY < 60 && isInTriggerZone(e.clientX, rect)) mouseStartY.current = relY;
  }

  function handleMouseUp(e: React.MouseEvent) {
    if (mouseStartY.current === null) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relY = e.clientY - rect.top;
    if (relY - mouseStartY.current > 30 && !ccOpen) {
      setCcOpen(true);
      markOpened();
    }
    mouseStartY.current = null;
  }

  const touchStartY = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    if (showInstructions) return;
    const t = e.touches[0];
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (t.clientY - rect.top < 60 && isInTriggerZone(t.clientX, rect)) {
      touchStartY.current = t.clientY;
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const t = e.changedTouches[0];
    if (t.clientY - touchStartY.current > 40 && !ccOpen) {
      setCcOpen(true);
      markOpened();
    }
    touchStartY.current = null;
  }

  const { w, h } = useViewportSize();

  function handleRateClick() {
    const ctx = getContext();
    // Falls back to time-since-start if they never completed all 3 opens,
    // so we still capture something rather than sending null.
    const elapsed = timeToOpenRef.current ?? (Date.now() - startTimeRef.current);
    const hiddenParams = {
      layout: "modal",
      hiddenFields: {
        pid: ctx.pid,
        pair: ctx.pair,
        variant: ctx.variant,
        step: ctx.step,
        elapsed_ms: elapsed,
        grip_type: ctx.grip,
        preference_step: ctx.preferenceStep, // 'skip' | 'two_way' | 'three_way'
      },
      onSubmit: () => {
        window.location.href = nextUrl(ctx)
      }
    }

    console.log(hiddenParams);

    window.Tally.openPopup("gD17jO", hiddenParams);
  }

  return (
    <div
      className="flex items-start justify-center"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      <div
        className="relative overflow-hidden select-none"
        style={{
          width: w,
          height: h,
          background: "#000",
          fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Wallpaper */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #1a0533 0%, #0d1b4f 35%, #0a2a3d 60%, #0d3b1a 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 15%, white, transparent), radial-gradient(1px 1px at 70% 25%, white, transparent), radial-gradient(1px 1px at 40% 60%, white, transparent), radial-gradient(1px 1px at 85% 10%, white, transparent), radial-gradient(1px 1px at 55% 40%, white, transparent)",
          }}
        />

        {/* Dynamic island */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 bg-black z-50"
          style={{ width: 120, height: 34, borderRadius: 20 }}
        />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-40">
          <StatusBar />
        </div>

        {/* Home screen */}
        <div className="absolute inset-0 z-10">
          <HomeScreen />
        </div>

        {/* Control Center */}
        <ControlCenter visible={ccOpen} onClose={() => setCcOpen(false)} />

        {/* Swipe hint, only shown once the participant has started the task */}
        {!showInstructions && !ccOpen && (
          <div
            className={`absolute top-3 z-50 pointer-events-none flex flex-col items-center gap-1 ${
              CC_TRIGGER_SIDE === "right" ? "right-3" : "left-3"
            }`}
          >
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center animate-bounce bg-black/20">
              <ArrowDown className="w-5 h-5 text-green-500" strokeWidth={3} />
            </div>
            <span className="text-green-500 text-[10px] font-bold tracking-wide">
              SWIPE
            </span>
          </div>
        )}

        {/* Home indicator */}
        {!ccOpen && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/40 rounded-full z-50" />
        )}

        {/* Info button (reopens instructions) + Rate button */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
          <button
            onClick={() => setShowInstructions(true)}
            aria-label="Show instructions again"
            className="w-11 h-11 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
          <button
            onClick={handleRateClick}
            disabled={!hasOpenedThreeTimes}
            className={`text-sm font-bold px-7 py-3 rounded-full transition-all ${
              hasOpenedThreeTimes
                ? "bg-blue-500 text-white shadow-[0_4px_20px_rgba(59,130,246,0.6)] active:scale-95"
                : "bg-white/20 text-white/40 cursor-not-allowed"
            }`}
          >
            Rate Now
          </button>
        </div>

        {/* Instructions overlay, shown until participant taps Start */}
        {showInstructions && (
          <InstructionsOverlay
            variant={ctx.variant}
            onStart={handleStart}
            gripImage={GRIP_IMAGES[ctx.grip]}
          />
        )}
      </div>


    </div>
  );
}