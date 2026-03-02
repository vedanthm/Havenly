"use client";

import { useState } from "react";
import RatingDots from "./RatingDots";

const ROOMS = [
  "Entry",
  "Living Room",
  "Dining",
  "Kitchen",
  "Bedrooms",
  "Bathrooms",
  "Wardrobes",
  "Home Office",
  "Kids Room",
  "Storage Areas",
  "Balcony / Outdoor",
];

const CATEGORIES = ["Condition", "Clutter", "Storage", "Visual Appeal", "Lighting"];

export interface RoomRating {
  [category: string]: number;
}

export interface RoomData {
  ratings: RoomRating;
  action: string;
}

interface RoomAssessmentProps {
  rooms: Record<string, RoomData>;
  onChange: (rooms: Record<string, RoomData>) => void;
}

function getDefaultRoomData(): RoomData {
  const ratings: RoomRating = {};
  CATEGORIES.forEach((c) => (ratings[c] = 0));
  return { ratings, action: "" };
}

export function getDefaultRooms(): Record<string, RoomData> {
  const rooms: Record<string, RoomData> = {};
  ROOMS.forEach((r) => (rooms[r] = getDefaultRoomData()));
  return rooms;
}

function getRoomSummary(data: RoomData | undefined): { rated: number; avg: number } {
  if (!data) return { rated: 0, avg: 0 };
  const values = CATEGORIES.map((c) => data.ratings[c] || 0).filter((v) => v > 0);
  if (values.length === 0) return { rated: 0, avg: 0 };
  const avg = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  return { rated: values.length, avg };
}

/** Compact flat table for PDF capture — uses inline styles so html2canvas renders borders/colors reliably */
export function RoomPrintView({ rooms }: { rooms: Record<string, RoomData> }) {
  const border = "1px solid #E8DFD4";
  const thStyle: React.CSSProperties = {
    padding: "10px 8px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#8B7355",
    borderBottom: "2px solid #8B7355",
    textAlign: "center",
  };
  const tdStyle: React.CSSProperties = {
    padding: "8px",
    fontSize: 13,
    color: "#6B5D4F",
    borderBottom: border,
    textAlign: "center",
  };

  return (
    <div>
      <p style={{ fontSize: 12, color: "#9B8E80", marginBottom: 12, letterSpacing: "0.04em" }}>
        Rating Scale: <strong style={{ color: "#8B7355" }}>1</strong> (Complete Transformation) —{" "}
        <strong style={{ color: "#8B7355" }}>5</strong> (Showcase Ready)
      </p>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          border: "1px solid #D4C5B0",
        }}
      >
        <colgroup>
          <col style={{ width: "15%" }} />
          {CATEGORIES.map((cat) => (
            <col key={cat} style={{ width: "10%" }} />
          ))}
          <col style={{ width: "25%" }} />
        </colgroup>
        <thead>
          <tr style={{ backgroundColor: "#F5F0EA" }}>
            <th style={{ ...thStyle, textAlign: "left" }}>Space</th>
            {CATEGORIES.map((cat) => (
              <th key={cat} style={thStyle}>
                {cat}
              </th>
            ))}
            <th style={{ ...thStyle, textAlign: "left" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {ROOMS.map((room, i) => (
            <tr key={room} style={{ backgroundColor: i % 2 === 0 ? "#FAF8F5" : "#FFFFFF" }}>
              <td
                style={{
                  ...tdStyle,
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#3D3225",
                }}
              >
                {room}
              </td>
              {CATEGORIES.map((cat) => {
                const val = rooms[room]?.ratings[cat] || 0;
                return (
                  <td
                    key={cat}
                    style={{
                      ...tdStyle,
                      fontWeight: val > 0 ? 600 : 400,
                      color: val > 0 ? "#3D3225" : "#C4B8A8",
                    }}
                  >
                    {val > 0 ? val : "—"}
                  </td>
                );
              })}
              <td
                style={{
                  ...tdStyle,
                  textAlign: "left",
                  fontSize: 12,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {rooms[room]?.action || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RoomAssessment({ rooms, onChange }: RoomAssessmentProps) {
  const [openRoom, setOpenRoom] = useState<string | null>(null);

  const updateRating = (room: string, category: string, value: number) => {
    const updated = { ...rooms };
    updated[room] = {
      ...updated[room],
      ratings: { ...updated[room].ratings, [category]: value },
    };
    onChange(updated);
  };

  const updateAction = (room: string, value: string) => {
    const updated = { ...rooms };
    updated[room] = { ...updated[room], action: value };
    onChange(updated);
  };

  const toggle = (room: string) => {
    setOpenRoom((prev) => (prev === room ? null : room));
  };

  return (
    <div>
      <p className="text-xs text-text-muted font-sans mb-5 tracking-wide">
        Rating Scale: <span className="font-semibold text-accent">1</span> (Complete Transformation) —{" "}
        <span className="font-semibold text-accent">5</span> (Showcase Ready)
      </p>

      <div className="space-y-2">
        {ROOMS.map((room) => {
          const isOpen = openRoom === room;
          const { rated, avg } = getRoomSummary(rooms[room]);
          const isComplete = rated === CATEGORIES.length;

          return (
            <div
              key={room}
              className={`border rounded-xl transition-all ${
                isOpen ? "border-accent/30 shadow-sm bg-white" : "border-border bg-white hover:border-accent/20"
              }`}
            >
              {/* Collapsed header */}
              <button
                type="button"
                onClick={() => toggle(room)}
                className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`w-4 h-4 text-accent transition-transform ${isOpen ? "rotate-90" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-sm font-medium text-text-primary font-sans">{room}</span>
                </div>
                <div className="flex items-center gap-3">
                  {rated > 0 && (
                    <>
                      {/* Mini progress dots */}
                      <div className="hidden sm:flex gap-1">
                        {CATEGORIES.map((cat) => (
                          <div
                            key={cat}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              rooms[room]?.ratings[cat] > 0 ? "bg-accent" : "bg-border"
                            }`}
                            title={cat}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-semibold font-sans px-2 py-0.5 rounded-full ${
                        isComplete
                          ? "bg-accent/10 text-accent"
                          : "bg-cream-dark text-text-muted"
                      }`}>
                        {avg}/5
                      </span>
                    </>
                  )}
                  {rated === 0 && (
                    <span className="text-xs text-text-muted font-sans">Not rated</span>
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-5 pb-5 border-t border-border-light">
                  <div className="grid gap-4 pt-4">
                    {CATEGORIES.map((cat) => (
                      <div key={cat} className="flex items-center justify-between gap-4">
                        <label className="text-xs font-semibold tracking-[0.1em] uppercase text-text-secondary font-sans w-28 shrink-0">
                          {cat}
                        </label>
                        <RatingDots
                          value={rooms[room]?.ratings[cat] || 0}
                          onChange={(v) => updateRating(room, cat, v)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border-light">
                    <label className="text-xs font-semibold tracking-[0.1em] uppercase text-text-secondary font-sans block mb-2">
                      Recommended Action
                    </label>
                    <input
                      type="text"
                      value={rooms[room]?.action || ""}
                      onChange={(e) => updateAction(room, e.target.value)}
                      placeholder="What needs to be done in this space?"
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-text-primary bg-cream/50 font-sans"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
