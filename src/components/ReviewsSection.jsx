import React, { useEffect, useRef, useState } from "react";

/** JSON -> 내부 포맷 + 빈 텍스트 필터 */
function normalize(row) {
  const rating = row.rating ?? row["후기 평점"] ?? row.score ?? 5;
  const text =
    row.text ??
    row["긍정적 후기"] ??
    row["긍정적인 후기"] ??
    row["긍정적인 리뷰"] ??
    row.review ??
    "";
  const name = row.guest_name ?? row["투숙객 이름"] ?? row.name ?? "게스트";
  const rawDate = row.date ?? row["후기 등록일"] ?? "";
  const [y, m] = String(rawDate).split("-");
  const dateYM = y && m ? `${y}년 ${Number(m)}월` : rawDate || "";
  return { rating: Number(rating), text: String(text).trim(), name, dateYM };
}

const HEADER = {
  eyebrow: "JOIN HANOK",
  title: "  게스트와 함께한 함한옥스테이",
  description: "게스트들의 다양한 경험은 우리 한옥을 더욱 풍부하게 합니다."
}

// =============== 컴포넌트 =================
export default function ReviewsSection({
  totalCount = 0,
  src = "/docs/booking_reviews.json",
}) {
  const [rows, setRows] = useState([]);
  const pausedRef = useRef(false);

  const railRef = useRef(null);
  const seqRef = useRef(null);
  const animRef = useRef(0);
  const offsetRef = useRef(0);
  const seqWidthRef = useRef(0);
  const baseSpeedRef = useRef(60); // px/sec 기본 속도
  const speedRef = useRef(baseSpeedRef.current);
  const dirRef = useRef(-1); // 1:좌-> 우 , -1: 우-> 좌
  const dragRef = useRef({ active: false, startX: 0, lastX: 0 });

  // === Drag 튜닝 값 ===
  const DRAG_MULT = 2.8; // 드래그 1px당 레일 이동 배수 (2~3 추천)
  const SPEED_GAIN = 70; // 드래그 속도 → px/s 가속 환산 계수
  const MAX_SPEED = 1200; // 가속 상한(px/s)
  const DECAY = 0.985;     // 관성 감쇠(프레임당) - 천천히 기본속도로 복귀

  const pauseNow = () => {
    pausedRef.current = true;
    speedRef.current = 0;
  };
  const resumeNow = () => {
    pausedRef.current = false;
    if (!dragRef.current.active) speedRef.current = baseSpeedRef.current;
  };

  const viewportRef = useRef(null);

  // 데이터 로드 (빈 리뷰 텍스트 제외)
  useEffect(() => {
    let alive = true;
    fetch(src)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        const list = (Array.isArray(data) ? data : [])
          .map(normalize)
          .filter((r) => r.text.length > 0);
        setRows(list);
      })
      .catch(() => setRows([]));
    return () => {
      alive = false;
    };
  }, [src]);

  // 시퀀스 폭 측정 + 애니메이션 루프
  useEffect(() => {
    if (!seqRef.current || !railRef.current || rows.length === 0) return;

    const measure = () => {
      // 오른쪽으로 흐르는 효과 : 시작은 -seqWidth로 두고 0까지 이동 -> 다시 -seqWidth로 점프
      const seqW = seqRef.current.offsetWidth || 1;
      seqWidthRef.current = seqW;

      offsetRef.current = -seqWidthRef.current;
      railRef.current.style.transform = `translate3d(${offsetRef.current}px, 0,0)`;
    };

    measure();
    window.addEventListener("resize", measure);

    let last = performance.now();
    const tick = (now) => {
      const rail = railRef.current;
      if (!rail) return;
      // 주사율에 따라 달라지는 애니메이션을 일정속도로 표현하기 위해 사용
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!pausedRef.current && rows.length) {
        // 관성: 드래그 중이 아닐 땐 속도를 서서히 기본 속도로 복귀
        if (!dragRef.current.active) {
          const base = baseSpeedRef.current;
          speedRef.current = base + (speedRef.current - base) * Math.pow(DECAY, dt * 60);
        }
        // offset 업데이트
        offsetRef.current += dirRef.current * speedRef.current * dt;

        // 루프 래핑
        const W = seqWidthRef.current || 1;
        if (dirRef.current === 1) {
          // 좌 -> 우 : -W ~ 0 범위에서 움직임
          if (offsetRef.current >= 0) offsetRef.current -= W;
        } else {
          // 우-> 좌 : 0 ~ -W 범위에서 움직임
          if (offsetRef.current <= -W) offsetRef.current += W;
        }
        rail.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }
      // 애니메이션 지속
      animRef.current = requestAnimationFrame(tick);
    };
    // 애니메이션 시작
    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", measure);
    };
  }, [rows.length]);

  // 드래그 (가속/병합) 처리
  const onPointerDown = (e) => {
    // 클릭은 정상 동작시키기 위해 여기서 preventDefault/capture 하지 않습니다.
    dragRef.current.active = true;
    dragRef.current.dragging = false; // ← 아직 드래그 시작 전
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragRef.current.startX = x;
    dragRef.current.lastX = x;
    pausedRef.current = false;
    e.currentTarget.style.cursor = "grabbing";
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;

    // 드래그 시작 임계값(6px) 넘으면 그때부터 capture + 가속
    const totalDx = x - dragRef.current.startX;
    if (!dragRef.current.dragging && Math.abs(totalDx) > 6) {
      dragRef.current.dragging = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }

    const dx = x - dragRef.current.lastX;
    dragRef.current.lastX = x;

    if (dragRef.current.dragging) {
      // ① 레일을 '즉시' 더 많이 이동 (확 움직이는 느낌)
      offsetRef.current += dx * DRAG_MULT;
      // 래핑
      const W = seqWidthRef.current || 1;
      while (offsetRef.current > 0) offsetRef.current -= W;
      while (offsetRef.current < -W) offsetRef.current += W;
      railRef.current?.style.setProperty(
        "transform",
        `translate3d(${offsetRef.current}px,0,0)`
      );

      // ② 진행 방향 + 강한 가속
      dirRef.current = dx >= 0 ? 1 : -1;
      const target = Math.min(
        MAX_SPEED,
        baseSpeedRef.current + Math.abs(dx) * SPEED_GAIN
      );
      speedRef.current = target;
      e.preventDefault(); // 드래그 중에만 기본동작 차단
    }
  };

  const onPointerUp = (e) => {
    if (!dragRef.current.active) return;
    if (dragRef.current.dragging) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
    dragRef.current.active = false;
    dragRef.current.dragging = false;
    // 드래그로 가속된 속도를 유지하되 너무 느리면 조금 보태줌
    speedRef.current = Math.max(speedRef.current, baseSpeedRef.current * 2);
    e.currentTarget.style.cursor = "grab";
    resumeNow();
  };

  //  모달 상태
  const [modal, setModal] = useState(null);
  useEffect(() => {
    if (modal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => (document.body.style.overflow = prev);
    }
  }, [modal]);

  return (
    <section id="reviews" style={section} onMouseLeave={resumeNow}>
      {/* 헤더 */}
      
      <div className="absolute top-8 left-0 right-0 text-center text-white z-20">
        
        <span className="inline-block text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/70">
          {HEADER.eyebrow}
        </span>
        <h2 className="mt-2 font-bold drop-shadow-lg text-[22px] leading-tight md:text-4xl">
          <span className="text-3xl md:text-5xl font-extrabold align-middle mr-1"> {totalCount}</span>
          {HEADER.title}
        </h2>
        <p className="mt-2 text-white/85 drop-shadow text-[12px] md:text-base max-w-xl mx-auto">
          {HEADER.description}
        </p>
      </div>

      {/*  무한 가로 레일 */}
      <div
        ref={viewportRef}
        style={viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={railRef} style={rail}>
          {/* 시퀀스 A */}
          <div ref={seqRef} style={sequence}>
            {rows.map((r, i) => (
              <ReviewCard
                key={`a-${i}-${r.name}`}
                data={r}
                onOpen={() => setModal(r)}
                onHoverPause={(v) => (v ? pauseNow() : resumeNow())}
              />
            ))}
          </div>
          {/* 시퀀스 B (복제) */}
          <div style={sequence}>
            {rows.map((r, i) => (
              <ReviewCard
                key={`b-${i}-${r.name}`}
                data={r}
                onOpen={() => setModal(r)}
                onHoverPause={(v) => (v ? pauseNow() : resumeNow())}
              />
            ))}
          </div>
        </div>
      </div>
      {/* 모달 */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 flex-shrink-0">
              <h4 className="text-lg font-semibold text-neutral-800">
                리뷰 상세
              </h4>
              <button
                onClick={() => setModal(null)}
                className="text-3xl leading-none text-neutral-500 hover:text-neutral-800 transition-colors"
                aria-label="닫기"
              >
                &times;
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="p-5 max-h-[60vh] overflow-auto">
              <div className="mb-4">
                <Stars10 value={modal.rating} />
              </div>
              <p className="whitespace-pre-wrap text-neutral-700 leading-relaxed">
                {modal.text}
              </p>
            </div>

            {/* 모달 푸터 */}
            <div className="px-5 py-4 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center rounded-b-2xl flex-shrink-0">
              <div className="text-sm text-neutral-600">
                <span className="font-bold">{modal.name}</span>
                {modal.dateYM && (
                  <span className="ml-2 text-neutral-500">{modal.dateYM}</span>
                )}
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-md bg-neutral-800 text-white px-4 py-2 text-sm font-semibold hover:bg-neutral-900"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
//  ================= 하위 컴포넌트 =======================
function ReviewCard({ data, onOpen, onHoverPause }) {
  return (
    <button
      type="button"
      style={card}
      className="review-card"
      onClick={onOpen}
      onMouseEnter={() => onHoverPause(true)}
      onMouseLeave={() => onHoverPause(false)}
      aria-label="리뷰 상세 보기 "
    >
      {/*  상단 : 이름 + 날짜 */}
      <div style={rowTop}>
        <div style={guestName}>{data.name}</div>
        {data.dateYM && <div style={dataText}>{data.dateYM}</div>}
      </div>

      {/*  별점 (10점 만점) */}
      <div style={{ margin: "4px 0 10px" }}>
        <Stars10 value={data.rating} />
      </div>

      {/* 본문 (클램핑) */}
      <p style={reviewClamp}>{data.text}</p>
    </button>
  );
}

function Stars10({ value = 0, size = 16 }) {
  const filled = Math.max(0, Math.min(10, Math.round(Number(value) || 0)));
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < filled ? "#f59e0b" : "transparent"}
          stroke={i < filled ? "#f59e0b" : "#e5e7eb"}
          strokeWidth="2"
        >
          <polygon points="12 2 15 9 22 9 16.5 13.5 18.5 21 12 16.8 5.5 21 7.5 13.5 2 9 9 9 12 2" />
        </svg>
      ))}
    </div>
  );
}

//  ================= 스타일 =======================
const section = {
  position: "relative",
  padding: "56px 0 64px",
  overflow: "hidden",
  color: "black",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#000000",
  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), transparent), url("/images/bg_review.jpg")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

const viewport = {
  position: "relative",
  width: "100vw",
  marginLeft: "50%",
  marginTop: "auto",
  marginBottom: "auto",
  transform: "translateX(-50%)",
  overflow: "hidden",
  padding: "12px 0",
  // ✨ 중요: 모바일에서 가로 드래그를 브라우저가 가로 스와이프로 먹지 않게
  touchAction: "pan-y",
  cursor: "grab",
};

const rail = {
  display: "flex",
  willChange: "transform",
};

const sequence = {
  display: "flex",
  gap: 20,
  padding: "8px 10px",
};

const card = {
  width: "min(55vw, 320px)",
  height: "min(46vh, 360px)",
  background: "#fff",
  color: "#111",
  borderRadius: 24,
  border: "1px solid rgba(0,0,0,.06)",
  boxShadow: "0 8px 24px rgba(0,0,0,.12)",
  padding: "18px 18px 16px",
  textAlign: "left",
  cursor: "pointer",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  minWidth: 0,
};

const rowTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
};
const guestName = { fontWeight: 700, fontSize: 16 };
const dataText = { fontSize: 13, color: "#6b7280" };

const reviewClamp = {
  marginTop: 6,
  fontSize: 15,
  lineHeight: 1.7,
  color: "#111",
  display: "-webkit-box",
  WebkitLineClamp: 6,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxHeight: "17.0em",
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};