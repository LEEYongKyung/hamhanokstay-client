// src/components/RangeCalendarPopover.jsx
import React from "react";
import { createPortal } from "react-dom";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/* ===== Date helpers ===== */
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (s) => (s ? new Date(`${s}T00:00:00`) : null);
const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isBefore = (a, b) => a && b && a.getTime() < b.getTime();
const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth() + m, 1);
const makeCells = (y, m) => {
  const first = new Date(y, m, 1);
  const offset = first.getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const day = i - offset + 1;
    cells.push(day >= 1 && day <= days ? new Date(y, m, day) : null);
  }
  return cells;
};
const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
const todayISO = toISO(todayStart);

/* 간단 ICS 파서 (DTSTART/DTEND, YYYYMMDD) */
function parseIcsDates(text) {
  const disabled = new Set();
  if (!text) return disabled;
  const lines = text.split(/\r?\n/);
  let s = null, e = null;
  const YY = (v) => +v.slice(0, 4), MM = (v) => +v.slice(4, 6) - 1, DD = (v) => +v.slice(6, 8);
  for (const ln of lines) {
    const mS = ln.match(/DTSTART[^:]*:(\d{8})/);
    const mE = ln.match(/DTEND[^:]*:(\d{8})/);
    if (mS) s = mS[1];
    if (mE) e = mE[1];
    if (ln.startsWith("END:VEVENT") && s) {
      const ds = new Date(YY(s), MM(s), DD(s));
      const de = e ? new Date(YY(e), MM(e), DD(e)) : new Date(YY(s), MM(s), DD(s));
      for (let d = new Date(ds); d < de; d.setDate(d.getDate() + 1)) disabled.add(toISO(d));
      s = e = null;
    }
  }
  return disabled;
}

export default function RangeCalendarPopover({
  open,
  anchorRef,          // 트리거 버튼 ref
  onClose,
  startISO,           // 체크인(YYYY-MM-DD)
  endISO,             // 체크아웃
  onChange,           // (startISO, endISO) => void
  disabledSet,        // 외부에서 받은 불가일 Set<string> (옵션)
  shareCalendars = [],// ics URL 배열(옵션: 주면 여기서 병합 fetch)
  theme = "#402a1c",  // 메인 컬러
}) {
  const panelRef = React.useRef(null);
  const arrowRef = React.useRef(null);

  // 반응형: md 이상 2개월, 미만 1개월
  const [months, setMonths] = React.useState(
    window.matchMedia("(min-width: 768px)").matches ? 2 : 1
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = (e) => setMonths(e.matches ? 2 : 1);
    mq.addEventListener?.("change", onMq);
    mq.addListener?.(onMq);
    return () => {
      mq.removeEventListener?.("change", onMq);
      mq.removeListener?.(onMq);
    };
  }, []);

  // 위치 계산 (왼쪽 팝오버, 화면 밖 보정)
  const [pos, setPos] = React.useState({ top: 0, left: 0, maxH: 560, arrowX: 0 });
  const reflow = React.useCallback(() => {
    if (!open || !anchorRef?.current) return;
    const gap = 12;
    const rect = anchorRef.current.getBoundingClientRect();
    const guessW = months === 1 ? 360 : 720;
    const maxW = Math.min(guessW, window.innerWidth - 24);
    const top = clamp(rect.top - 8, 12, window.innerHeight - 300);
    let left = rect.left - maxW - gap; // 트리거의 왼쪽으로
    if (left < 12) left = 12;         // 좌측 오버플로 방지
    const arrowX = clamp(rect.left - left, 24, maxW - 24);
    setPos({ top, left, maxH: window.innerHeight - 24, arrowX });
  }, [open, anchorRef, months]);

  React.useEffect(() => {
    if (!open) return;
    reflow();
    const onScroll = () => reflow();
    const onResize = () => reflow();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [open, reflow]);

  // ESC 닫기
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* ===== 달력 상태 ===== */
  const [view, setView] = React.useState(() => {
    const base = fromISO(startISO) || todayStart;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [s, setS] = React.useState(fromISO(startISO));
  const [e, setE] = React.useState(fromISO(endISO));

  // 불가일: 외부 세트 + ics 병합
  const [disabledDates, setDisabledDates] = React.useState(new Set());
  React.useEffect(() => {
    let alive = true;
    (async () => {
      // 외부로부터 받은 disabledSet 먼저
      const merged = new Set(disabledSet || []);
      // ics 주어지면 병합 fetch
      if (shareCalendars && shareCalendars.length) {
        try {
          const sets = await Promise.all(
            shareCalendars.map(async (url) => {
              try {
                const r = await fetch(url, { mode: "cors" });
                const t = await r.text();
                return parseIcsDates(t);
              } catch { return new Set(); }
            })
          );
          sets.forEach((st) => st.forEach((d) => merged.add(d)));
        } catch {/* noop */}
      }
      if (alive) setDisabledDates(merged);
    })();
    return () => { alive = false; };
  }, [disabledSet, shareCalendars]);

  React.useEffect(() => { setS(fromISO(startISO)); setE(fromISO(endISO)); }, [startISO, endISO]);

  const pick = (d) => {
    const iso = toISO(d);
    // 과거/불가일 차단
    if (iso < todayISO || disabledDates.has(iso)) return;
    if (!s || (s && e)) {
      setS(d); setE(null);
    } else {
      if (!d || isBefore(d, s) || isSameDay(d, s)) { setS(d); setE(null); return; }
      setE(d);
      onChange?.(toISO(s), toISO(d));
      onClose?.();
    }
  };

  const BRAND = theme;
  const RANGE_BG = "rgba(64,42,28,.08)";
  const RING = "rgba(64,42,28,.35)";

  if (!open) return null;

  const Month = ({ base }) => {
    const cells = makeCells(base.getFullYear(), base.getMonth());
    return (
      <div className="w-[320px]">
        <div className="text-center font-semibold mb-3" style={{ color: BRAND }}>
          {base.getFullYear()}년 {base.getMonth() + 1}월
        </div>
        <div className="grid grid-cols-7 text-center text-xs mb-1" style={{ color: BRAND, opacity: 0.65 }}>
          {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
            <div key={w} className="py-1">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            const empty = !d;
            const iso = d ? toISO(d) : "";
            const blocked = d && (iso < todayISO || disabledDates.has(iso));
            const isStart = d && s && isSameDay(d, s);
            const isEnd   = d && e && isSameDay(d, e);
            const inRange = d && s && e &&
              (isBefore(s, d) || isSameDay(s, d)) &&
              (isBefore(d, e) || isSameDay(e, d));

            const style = {};
            let cls = "relative h-10 rounded-md text-sm transition ";
            if (empty) cls += "opacity-0 pointer-events-none ";
            else cls += "hover:bg-neutral-50 ";

            if (blocked) cls += "text-neutral-400 cursor-not-allowed ";
            else cls += "text-[color:var(--ham-date,#111)] ";

            if (inRange) style.background = RANGE_BG;
            if (isStart || isEnd) { style.background = BRAND; style.color = "#fff"; }

            return (
              <button
                key={i}
                disabled={empty || blocked}
                onClick={() => d && pick(d)}
                className={cls}
                style={style}
              >
                {!empty && d.getDate()}
                {(isStart || isEnd) && (
                  <span
                    className="absolute inset-0 rounded-md pointer-events-none"
                    style={{ boxShadow: `0 0 0 2px ${RING} inset` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const bases = Array.from({ length: months }, (_, i) => addMonths(view, i));
  const nights = s && e ? Math.round((e - s) / 86400000) : 0;

  return createPortal(
    <>
      {/* 오버레이(클릭 닫기) */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose} style={{ background: "transparent" }} />

      {/* 팝오버 패널 */}
      <div
        ref={panelRef}
        className="fixed z-[9999] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
        style={{
          top: pos.top,
          left: pos.left,
          maxHeight: pos.maxH,
          maxWidth: "96vw",
          overflow: "auto",
          width: months === 1 ? 360 : 720,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단: 액션바 */}
        <div className="flex items-center justify-between gap-2 p-4 border-b">
          <div className="text-sm font-medium" style={{ color: BRAND }}>
            {nights > 0 ? `${nights}박` : "여행 날짜를 입력하여 정확한 요금을 확인하세요."}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setS(null); setE(null); onChange?.("", ""); }}
              className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
              style={{ color: BRAND }}
            >
              날짜 지우기
            </button>
            <button
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 text-neutral-600"
            >
              닫기
            </button>
          </div>
        </div>

        {/* 네비게이션 + 달력 */}
        <div className="flex items-center justify-between px-4 pt-4">
          <button
            onClick={() => setView(addMonths(view, -1))}
            className="rounded-md border px-2 py-1 hover:bg-neutral-50"
            style={{ color: BRAND }}
          >
            ◀
          </button>
          <button
            onClick={() => setView(addMonths(view, 1))}
            className="rounded-md border px-2 py-1 hover:bg-neutral-50"
            style={{ color: BRAND }}
          >
            ▶
          </button>
        </div>

        <div className="p-4 md:p-6 flex gap-6 justify-center">
          {bases.map((b, i) => <Month key={i} base={b} />)}
        </div>
      </div>

      {/* 트리거 방향을 가리키는 화살표 */}
      <div
        ref={arrowRef}
        className="fixed z-[9999]"
        style={{
          top: pos.top + 24,
          left: pos.left + pos.arrowX - 10,
          width: 0,
          height: 0,
          borderLeft: "10px solid white",
          borderTop: "10px solid transparent",
          borderBottom: "10px solid transparent",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
        }}
      />
    </>,
    document.body
  );
}
