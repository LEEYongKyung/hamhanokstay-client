import React, {useEffect, useMemo, useState} from "react";
import { withBase } from "@/utils/path";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// ===========날짜 유형===========
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());
const fromISO = (v) => {
    if (!v) return null;
    if (v instanceof Date) return isValidDate(v) ? v : null;
    if (typeof v === "string") {
        const s = v.includes("T") ? v: `${v}T00:00:00`;
        const d = new Date(s);
        return isValidDate(d) ? d: null;
    }
    return null;
}
const isSameDay = (a,b) => isValidDate(a) && isValidDate(b) && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isBefore = (a,b) => isValidDate(a) && isValidDate(b) && a.getTime() < b.getTime();
const addMonths = (d, m) => new Date(d.getFullYear() , d.getMonth() + m, 1);
const diffDays = (a,b) => (isValidDate(a) && isValidDate(b)) ? Math.round((b-a)/86400000):0;
const fmtK = (iso) => {
    if(!iso) return"";
    const d = fromISO(iso);
    return isValidDate(d) ? `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`: "";
};
const makeCells = (y,m) => {
    const first = new Date(y,m,1);
    const offset = first.getDay();
    const days = new Date(y,m+1, 0).getDate();
    const cells = [];
    for (let i=0; i<42; i++) {
        const day = i- offset +1;
        cells.push (day >= 1 && day<=days ? new Date(y,m,day) : null);
    }
    return cells;
};

// 오늘 00:00:00 기준 ISO (로컬타임), 오늘 이전 날짜 차단용
const startOfToday = new Date();
startOfToday.setHours(0,0,0,0);
const today = toISO(startOfToday);
const minMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

// ===========ICS 파서(간단): DTSTART/DTEND YYYYMMDD 형태만 처리===========
function parseIcsDates(text) {
    const disabled = new Set();
    if (!text) return disabled;
    const lines = text.split(/\r?\n/);
    let s = null, e=null;
    for (const ln of lines) { 
        const mS = ln.match(/DTSTART[^:]*:(\d{8})/);
        const mE = ln.match(/DTEND[^:]*:(\d{8})/);
        if (mS) s = mS[1];
        if (mE) e = mE[1];
        if (ln.startsWith("END:VEVENT") && s) {
            const yy = (v) => Number(v.slice(0,4));
            const mm = (v) => Number(v.slice(4,6))-1;
            const dd = (v) => Number(v.slice(6,8));
            const ds = new Date(yy(s), mm(s), dd(s));
            const de = e ? new Date(yy(e), mm(e), dd(e)) : new Date(yy(s), mm(s), dd(s));
            for (let d= new Date(ds); d<de; d.setDate(d.getDate()+1)) {
                disabled.add(toISO(d));
            }
            s=e= null;
        }
    }
    return disabled;
}

// 모바일 환경 캘린더 조정 
function useSmDown() {
  const [smDown, setSmDown] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639.98px)');
    const onChange = () => setSmDown(mql.matches);
    onChange(); // 최초 1회
    // Safari 호환
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, []);
  return smDown;
}


// ===========브랜딩 컬러===========
const BRAND= "#402a1c";
const BRAND_DARK = "#2f1e14" // hover
const RANGE_BG = "rgba(255, 255, 255, .15)"// 주간 하이라이트
const RING = "rgba(64,42, 28,.35)" // 사직/끝 링 


// ===========컴포넌트===========
export default function ReserveSection({
    shareCalendars = [
    "/booking/v1/export?t=2b9c85f1-2ce8-4686-b829-2ecfde2044cb",
    "/airbnb/calendar/ical/1141509028517381236.ics?s=4ff6139029b739ac857b7faa0e522542",
    "/agoda/en-us/api/ari/icalendar?key=Mq%2f3dKl3aQT1CaFASpd7juPktu8s1wp%2f",
  ],
  onReserve,

}) {

    const HEADER = {
        eyebrow : "ENJOY HANOK",
        title : "함한옥스테이와 함께 조선시대를 스테이 해보세요.",
        description:"한옥의 아름다운 풍경과 따뜻한 분위기 속에 지친 몸과 마음이 잠시나마 휴식을 취할 수 있는 시간이 되시길 바랍니다."
    };

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const subtitle = useMemo(() => {
        const s = fromISO(checkIn);
        const e = fromISO(checkOut);
        if (isValidDate(s) && isValidDate(e)) return `함한옥스테이에서의 ${diffDays(s, e)}박`;
        if (isValidDate(s)) return "체크아웃 날짜를 선택하세요.";
        return "체크인 날짜 선택";
    }, [checkIn, checkOut]);

    const subDesc = useMemo(() => {
        if (checkIn && checkOut) {
            const s = fromISO(checkIn);
            const e = fromISO(checkOut);
            if (isValidDate(s) && isValidDate(e)) return `${fmtK(s)} - ${fmtK(e)}`;
        }
        return "여행 날짜를 입력하여 정확한 요금을 확인하세요. "
    }, [checkIn, checkOut]);

    const [disabledDates, setDisabledDates] = useState(new Set());
    useEffect(() => {
        let alive = true ; 
        (async () => {
            try {
                const sets = await Promise.all(
                    shareCalendars.map(async (url) => {
                        try {
                            const r = await fetch(url, {mode:"cors"});
                            const t = await r.text();
                            return parseIcsDates(t)
                        } catch {
                            return new Set();
                        }
                    })
                );
                if (!alive) return;
                const merged = new Set();
                sets.forEach((s) => s.forEach((d) => merged.add(d)));
                setDisabledDates(merged);
            }catch{ /* empty */ }
        })();
        return () => {alive=false;};
    }, [shareCalendars]);

    const months = useSmDown() ? 1 : 3;

    const [view, setView] = useState (() => {
        const base = fromISO(checkIn)  || new Date();
        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    const prevDisabled = new Date(view.getFullYear(), view.getMonth(), 1).getTime() <= minMonth.getTime();

    const pick = (iso) => {
        const d = fromISO(iso) ;
        if (!isValidDate(d)) return;
        if (disabledDates.has(iso)) return;

        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(iso);
            setCheckOut("");
            return;
        }
        const s = fromISO(checkIn);
        if (isBefore(d, s) || isSameDay(d, s)) {
                setCheckIn(iso);
                setCheckOut("");
                return;
            }
        setCheckOut(iso);
    };

    const clearDates = () => {
        setCheckIn("");
        setCheckOut("");
    };
    const canReserve = Boolean(checkIn && checkOut);
    const handleReserve = () => {
        if(!canReserve) return;
        const payload = {checkIn, checkOut};
        if (onReserve) onReserve(payload);
        else alert (`예약 요청 : ${fmtK(checkIn)} - ${fmtK(checkOut)}`);
    };


    const Month = ({base}) => {
        const cells = makeCells(base.getFullYear(), base.getMonth());
        const s = fromISO(checkIn);
        const e = fromISO(checkOut);

        return (
            <div className="w-[320px]">
                <div className="text-center font-semibold mb-3 text-white" >
                    {base.getFullYear()}년 {base.getMonth()+1}월
                </div>
                <div 
                    className="grid grid-cols-7 text-center text-xs text-neutral-300 mb-1"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                >
                    {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
                        <div key={w} className="py-1">{w}</div>
                    ))}
                </div>
                <div 
                    className="grid grid-cols-7 gap-1"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 4 }}    
                >
                    {cells.map((d,i) => {
                        const empty = !d;
                        const iso =d ? toISO(d) : "";
                        const blockedPast = d && iso < today;
                        const blocked =d && (disabledDates.has(iso) || blockedPast);
                        const isStart = d && s && isSameDay(d, s); 
                        const isEnd = d && e && isSameDay(d, e);
                        const inRange = 
                            d && s && e &&
                            (isBefore(s,d) || isSameDay(s,d)) && 
                            (isBefore(d,e) || isSameDay(e,d));

                        const style = {};
                        let className =
                            "relative h-10 rounded-md text-sm transition text-white " +
                            (empty ? "opacity-0 pointer-events-none " : "") +
                            (blocked ? "text-neutral-500 cursor-not-allowed " : "hover:bg-white/10 ");

                        if(blocked) style.color = "rgb(107 114 128)";
            
                        if(inRange) style.background = RANGE_BG;
                        if(isStart || isEnd) {
                            style.background = BRAND;
                            style.color = "#fff";
                        }
                        return (
                            <button
                                key={i}
                                disabled={empty || blocked}
                                onClick={() => pick(iso)}
                                className={className} 
                                style={style}
                            >
                                {!empty && d.getDate()}
                                {(isStart || isEnd) && (
                                    <span
                                        className="absolute inset-0 rounded-md pointer-events-none"
                                        style={{boxShadow: `0 0 0 2px ${RING} inset`}}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const monthBases = useMemo(
        () => Array.from({length: months}, (_,i) => addMonths(view,i)),
        [view, months]
    );

    return (
        <section id="reserve" className="relative min-h-screen">
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            >
                <source src={withBase("video/reserve_bg.mp4")} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60 -z-10" />

            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
                <header className="text-center">
                    <span className="inline-block text-[11px] sm:text-xs tracking-[0.3em] uppercase text-white/90">
                        {HEADER.eyebrow}
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold leading-tight text-white">
                        {HEADER.title}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-neutral-200/90 max-w-2xl mx-auto">
                        {HEADER.description}
                    </p>
                </header>

                <hr className="my-8 border-white/20" />

                <div className="mb-6">
                    <div className="text-lg font-semibold text-white">{subtitle}</div>
                    <div className="text-sm text-neutral-300 mt-1">{subDesc}</div>
                </div>

                <div className="rounded-2xl border bg-black/20 shadow-lg p-4 md:p-6 border-white/20 backdrop-blur-sm" >
                    <div className="flex items-center justify-between mb-4">
                        <button 
                            onClick={() => !prevDisabled && setView(addMonths(view, -1))}
                             disabled={prevDisabled}
                            className={"inline-flex items-center gap-2 rounded-md border border-white/20 text-white px-3 py-1.5 hover:bg-white/10" +
                            (prevDisabled ? " opacity-40 cursor-not-allowed" : "")}>
                            <FaChevronLeft className="h-4 w-4" />
                            <span className="text-sm">이전</span>
                        </button>

                        <div className="text-sm text-neutral-300">
                            {view.getFullYear()}년 {view.getMonth()+1}월부터 {months}개월 보기
                        </div>

                        <button
                            onClick={() => setView(addMonths(view, 1))}
                            className="inline-flex items-center gap-2 rounded-md border border-white/20 text-white px-3 py-1.5 hover:bg-white/10">
                            <span className="text-sm">다음</span>
                            <FaChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-6 justify-center">
                        {monthBases.map ((b,idx) => (
                            <Month key={idx} base={b} />
                        ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={clearDates}
                            className="rounded-md border border-white/20 text-white px-4 py-2 hover:bg-white/10"
                        >
                            날짜 지우기
                        </button>
                        <button
                            onClick={handleReserve}
                            disabled={!canReserve}
                            className="rounded-xl px-5 py-3 text-sm font-semibold transition"
                            style={{
                                background: canReserve ? BRAND : "rgba(255,255,255,.1)",
                                color: canReserve ? "#fff" : "rgb(156 163 175)",
                                cursor: canReserve ? "pointer" : "not-allowed",
                            }}
                            onMouseEnter={(e)=> {
                                if (canReserve) e.currentTarget.style.background = BRAND_DARK;
                            }}
                            onMouseLeave={(e)=> {
                                if (canReserve) e.currentTarget.style.background = BRAND;
                            }}
                        >
                            <span className={canReserve? "shiny-text": ""}> 예약하기</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .shiny-text {
                    position: relative ;
                    display:inline-block;
                    background: linear-gradient(115deg, #fff 0%, #fff 20%, #c7b3a6 40%, #fff 60%,#fff 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color : transparent;
                    animation: hamShiny 1.6s linear infinite;
                    }
                @keyframes hamShiny {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}
            </style>
        </section>
    );
}