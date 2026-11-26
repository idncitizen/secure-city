"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Compass, Sparkles, Lock, CheckCircle2, MapPin, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

const CITY_ORNAMENTS = [
  { id: "tree-1", type: "tree", x: 9, y: 12 },
  { id: "tree-2", type: "tree", x: 31, y: 11 },
  { id: "tree-3", type: "tree", x: 56, y: 12 },
  { id: "tree-4", type: "tree", x: 89, y: 13 },
  { id: "tree-5", type: "tree", x: 92, y: 61 },
  { id: "tree-6", type: "tree", x: 18, y: 90 },
  { id: "tree-7", type: "tree", x: 46, y: 91 },
  { id: "tree-8", type: "tree", x: 74, y: 91 },
  { id: "fountain-1", type: "fountain", x: 50, y: 49 },
  { id: "lamp-1", type: "lamp", x: 27, y: 36 },
  { id: "lamp-2", type: "lamp", x: 53, y: 36 },
  { id: "lamp-3", type: "lamp", x: 76, y: 36 },
  { id: "lamp-4", type: "lamp", x: 27, y: 64 },
  { id: "lamp-5", type: "lamp", x: 74, y: 64 },
  { id: "car-1", type: "car", x: 36, y: 35.5, color: "#EF4444", dir: "h" },
  { id: "car-2", type: "car", x: 64, y: 63.5, color: "#0EA5E9", dir: "h" }
];

export default function CityInteractiveMap({
  buildings,
  avatar,
  studentName,
  completedBuildings = [],
  lockedBuildings = [],
  activeBuildingId = null,
  onApproachBuilding,
  disabled = false
}) {
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [facing, setFacing] = useState("right");
  const [isMoving, setIsMoving] = useState(false);
  const [nearbyBuilding, setNearbyBuilding] = useState(null);
  const keysPressedRef = useRef(new Set());
  const lastTriggeredRef = useRef({ id: null, time: 0 });

  const checkProximity = useCallback(
    (pos) => {
      if (disabled) {
        setNearbyBuilding(null);
        return null;
      }
      let closest = null;
      let minDist = Infinity;

      for (const b of buildings) {
        const cx = b.position.x;
        const cy = b.position.y;
        const dist = Math.hypot(pos.x - cx, pos.y - cy);
        const triggerRadius = Math.max(b.width, b.height) * 0.72 + 5.5;
        if (dist <= triggerRadius && dist < minDist) {
          minDist = dist;
          closest = b;
        }
      }

      setNearbyBuilding(closest);

      if (closest) {
        const now = Date.now();
        const isCompleted = completedBuildings.includes(closest.id);
        const isLocked = lockedBuildings.includes(closest.id);
        if (
          !isCompleted &&
          !isLocked &&
          (lastTriggeredRef.current.id !== closest.id || now - lastTriggeredRef.current.time > 2500)
        ) {
          lastTriggeredRef.current = { id: closest.id, time: now };
          onApproachBuilding?.(closest);
        }
      }
      return closest;
    },
    [buildings, completedBuildings, lockedBuildings, onApproachBuilding, disabled]
  );

  const stepMove = useCallback(
    (dx, dy) => {
      if (disabled) return;
      if (dx < 0) setFacing("left");
      else if (dx > 0) setFacing("right");

      setPlayerPos((prev) => {
        const nextX = Math.max(6, Math.min(94, prev.x + dx));
        const nextY = Math.max(8, Math.min(92, prev.y + dy));
        const next = { x: nextX, y: nextY };
        checkProximity(next);
        return next;
      });
    },
    [checkProximity, disabled]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;
      const key = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        e.preventDefault();
        keysPressedRef.current.add(key);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      keysPressedRef.current.delete(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const interval = setInterval(() => {
      if (disabled) {
        setIsMoving(false);
        return;
      }
      const keys = keysPressedRef.current;
      let dx = 0;
      let dy = 0;
      const speed = 1.65;

      if (keys.has("arrowleft") || keys.has("a")) dx -= speed;
      if (keys.has("arrowright") || keys.has("d")) dx += speed;
      if (keys.has("arrowup") || keys.has("w")) dy -= speed;
      if (keys.has("arrowdown") || keys.has("s")) dy += speed;

      if (dx !== 0 || dy !== 0) {
        if (dx !== 0 && dy !== 0) {
          dx *= 0.72;
          dy *= 0.72;
        }
        setIsMoving(true);
        stepMove(dx, dy);
      } else {
        setIsMoving(false);
      }
    }, 40);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(interval);
    };
  }, [disabled, stepMove]);

  const moveAvatarToBuilding = (building) => {
    if (disabled) return;
    const targetX = building.position.x;
    const targetY = Math.min(88, building.position.y + building.height * 0.52 + 4);
    setFacing(targetX >= playerPos.x ? "right" : "left");
    setIsMoving(true);
    const next = { x: targetX, y: targetY };
    setPlayerPos(next);
    setTimeout(() => {
      setIsMoving(false);
      lastTriggeredRef.current = { id: null, time: 0 };
      checkProximity(next);
      onApproachBuilding?.(building);
    }, 180);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Banner Info Kontrol */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-teal-50 to-amber-50 px-4 py-2.5 text-xs text-slate-700 shadow-sm">
        <div className="flex items-center gap-2 font-medium">
          <Compass className="h-4 w-4 text-sky-600 shrink-0" />
          <span>
            Gerakkan avatar dengan <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-sky-700 border border-sky-200">WASD</kbd> / <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-sky-700 border border-sky-200">Panah</kbd>, tombol arah, atau klik gedung untuk berjalan mendekat.
          </span>
        </div>
        {nearbyBuilding && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/90 px-3 py-1 font-semibold text-slate-900 shadow-xs">
            <MapPin className="h-3.5 w-3.5" />
            Dekat: {nearbyBuilding.name}
          </span>
        )}
      </div>

      {/* Kanvas Kota Cerah Full-Width */}
      <div
        className="relative w-full h-[540px] lg:h-[600px] overflow-hidden rounded-3xl border-2 border-sky-300/80 shadow-xl select-none"
        style={{
          background:
            "radial-gradient(circle at 20% 15%, #E0F7FA 0%, #DCFCE7 45%, #FEF9C3 100%)"
        }}
      >
        {/* Blok Taman / Rumput Cerah */}
        <div className="pointer-events-none absolute inset-0">
          {/* Jalan Utama Horizontal & Vertikal */}
          <div
            className="absolute left-0 right-0 h-11 bg-slate-600/90 border-y-2 border-slate-200 shadow-inner"
            style={{ top: "36%" }}
          >
            <div className="h-full w-full flex items-center justify-around px-6">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="h-1 w-7 rounded-full bg-amber-300/90" />
              ))}
            </div>
          </div>

          <div
            className="absolute left-0 right-0 h-11 bg-slate-600/90 border-y-2 border-slate-200 shadow-inner"
            style={{ top: "64%" }}
          >
            <div className="h-full w-full flex items-center justify-around px-6">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="h-1 w-7 rounded-full bg-amber-300/90" />
              ))}
            </div>
          </div>

          <div
            className="absolute top-0 bottom-0 w-12 bg-slate-600/90 border-x-2 border-slate-200 shadow-inner"
            style={{ left: "26%" }}
          />

          <div
            className="absolute top-0 bottom-0 w-12 bg-slate-600/90 border-x-2 border-slate-200 shadow-inner"
            style={{ left: "74%" }}
          />

          {/* Bundaran Kota di Tengah */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border-4 border-dashed border-amber-300 bg-emerald-200/80 shadow-md flex items-center justify-center"
            style={{ left: "50%", top: "50%" }}
          >
            <div className="h-12 w-12 rounded-full bg-sky-200 border-2 border-sky-400 flex items-center justify-center text-sky-700 font-bold text-[10px] tracking-wider uppercase shadow-inner">
              Plaza
            </div>
          </div>
        </div>

        {/* Ornamen Kota: Pohon, Air Mancur, Lampu Jalan, Mobil */}
        {CITY_ORNAMENTS.map((item) => {
          if (item.type === "tree") {
            return (
              <div
                key={item.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                <div className="h-7 w-7 rounded-full bg-emerald-500 border-2 border-emerald-700 shadow-sm flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-lime-300/80 -translate-x-1 -translate-y-1" />
                </div>
                <div className="h-2.5 w-1.5 bg-amber-800 rounded-b-xs" />
              </div>
            );
          }
          if (item.type === "fountain") {
            return (
              <div
                key={item.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-cyan-300/90 border-4 border-white shadow-md flex items-center justify-center"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                <Sparkles className="h-5 w-5 text-sky-700 animate-pulse" />
              </div>
            );
          }
          if (item.type === "lamp") {
            return (
              <div
                key={item.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                <div className="h-3 w-3 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.95)] border border-amber-500" />
                <div className="h-3 w-0.5 bg-slate-700" />
              </div>
            );
          }
          if (item.type === "car") {
            return (
              <div
                key={item.id}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 h-4 w-8 rounded-md border border-white/80 shadow-md flex items-center justify-around px-1"
                style={{ left: `${item.x}%`, top: `${item.y}%`, backgroundColor: item.color }}
              >
                <span className="h-1.5 w-2 rounded-xs bg-sky-100/90" />
                <span className="h-1.5 w-1 rounded-xs bg-amber-200" />
              </div>
            );
          }
          return null;
        })}

        {/* 10 Gedung Perkotaan */}
        {buildings.map((b, idx) => {
          const isCompleted = completedBuildings.includes(b.id);
          const isLocked = lockedBuildings.includes(b.id);
          const isActive = activeBuildingId === b.id;

          return (
            <button
              key={b.id}
              type="button"
              onClick={() => moveAvatarToBuilding(b)}
              disabled={disabled}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 focus:outline-none ${
                isLocked
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:-translate-y-[54%] hover:scale-[1.03] cursor-pointer"
              }`}
              style={{
                left: `${b.position.x}%`,
                top: `${b.position.y}%`,
                width: `${b.width}%`,
                minWidth: "112px",
                zIndex: isActive ? 20 : 10
              }}
            >
              {/* Atap & Badan Gedung 2.5D Cerah */}
              <div className="relative flex flex-col items-center">
                {/* Badge Status */}
                <div className="mb-1 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold shadow-sm border border-slate-200">
                  <span className="text-slate-500">#{idx + 1}</span>
                  {isCompleted && (
                    <span className="inline-flex items-center gap-0.5 text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" /> Selesai
                    </span>
                  )}
                  {isLocked && !isCompleted && (
                    <span className="inline-flex items-center gap-0.5 text-rose-600">
                      <Lock className="h-3 w-3" /> Terkunci
                    </span>
                  )}
                  {!isCompleted && !isLocked && (
                    <span className="text-sky-700">Masuk</span>
                  )}
                </div>

                {/* Struktur Gedung */}
                <div
                  className={`w-full rounded-2xl border-2 p-2.5 shadow-lg transition-shadow ${
                    isActive
                      ? "ring-4 ring-amber-400 border-white"
                      : isCompleted
                      ? "border-emerald-300"
                      : isLocked
                      ? "border-rose-300"
                      : "border-white/90 group-hover:shadow-xl"
                  }`}
                  style={{
                    background: `linear-gradient(165deg, ${b.accent} 0%, ${b.color} 100%)`
                  }}
                >
                  {/* Baris Jendela Gedung */}
                  <div className="grid grid-cols-3 gap-1 mb-1.5">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <div
                        key={j}
                        className={`h-2 rounded-xs ${
                          isLocked ? "bg-slate-900/35" : "bg-white/75"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Papan Nama Gedung */}
                  <div className="rounded-lg bg-white/95 px-2 py-1 text-left shadow-xs">
                    <div className="truncate text-[11px] font-extrabold text-slate-800 leading-tight">
                      {b.name}
                    </div>
                    <div className="truncate text-[9px] font-medium text-slate-500">
                      {b.district}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {/* Objek Avatar Mahasiswa yang Dapat Digerakkan */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
          style={{
            left: `${playerPos.x}%`,
            top: `${playerPos.y}%`,
            zIndex: 30
          }}
        >
          {/* Ring Pijakan Avatar */}
          <div className="flex flex-col items-center">
            <div className="mb-1 rounded-full bg-slate-900/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md whitespace-nowrap border border-amber-300">
              {studentName || "Mahasiswa"}
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border-3 border-white bg-gradient-to-br from-amber-300 via-yellow-200 to-sky-200 text-2xl shadow-xl ${
                isMoving ? "scale-110 -translate-y-1" : ""
              } ${facing === "left" ? "-scale-x-100" : ""}`}
            >
              <span className={facing === "left" ? "-scale-x-100" : ""}>
                {avatar?.emoji || "🦊"}
              </span>
            </div>
            <div className="mt-0.5 h-2 w-9 rounded-full bg-slate-900/25 blur-[1px]" />
          </div>
        </div>

        {/* Kontrol Arah Layar (On-Screen D-Pad) */}
        <div className="absolute bottom-3 right-3 z-30 flex flex-col items-center gap-1 rounded-2xl bg-white/90 p-2 shadow-lg border border-sky-200 backdrop-blur-xs">
          <button
            type="button"
            onClick={() => stepMove(0, -4)}
            disabled={disabled}
            aria-label="Gerak ke atas"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 active:scale-95 disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => stepMove(-4, 0)}
              disabled={disabled}
              aria-label="Gerak ke kiri"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 active:scale-95 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => stepMove(0, 4)}
              disabled={disabled}
              aria-label="Gerak ke bawah"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 active:scale-95 disabled:opacity-40"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => stepMove(4, 0)}
              disabled={disabled}
              aria-label="Gerak ke kanan"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 active:scale-95 disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
