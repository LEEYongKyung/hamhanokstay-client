import { useMemo, useState } from "react";
import { withBase } from "@/utils/path";
import { SiKakaotalk, SiWhatsapp, SiInstagram } from "react-icons/si";
import { MdEmail } from "react-icons/md";

export default function ContactFab() {
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () => [
      {
        key: "kakao",
        icon: <SiKakaotalk className="text-[22px]" />,
        href: "http://pf.kakao.com/_SYKxan/chat",
        label: "카카오톡으로 문의",
      },
      {
        key: "whatsapp",
        icon: <SiWhatsapp className="text-[22px]" />,
        href: "https://wa.me/821090441306",
        label: "WhatsApp으로 문의",
      },
      {
        key: "instagram",
        icon: <SiInstagram className="text-[22px]" />,
        href:
          "https://www.instagram.com/hamhanokstay?igsh=MWwyaTljcmhrOTl1eQ%3D%3D&utm_source=qr",
        label: "Instagram 방문",
      },
      {
        key: "mail",
        icon: <MdEmail className="text-[22px]" />,
        href: "mailto:hamhanokstay@gmail.com",
        label: "이메일 보내기",
      },
    ],
    []
  );

  // 아이콘 간격과 첫 아이콘과 버튼 사이 여백
  const GAP = 56;          // 아이콘 사이 간격(px)
  const GAP_FROM_BTN = 8;  // 버튼과 첫 아이콘 사이 여백(px)
  const STAGGER_OPEN = 60; // 펼칠 때 간격(ms)
  const STAGGER_CLOSE = 50;// 접을 때 간격(ms)
  const totalMs = 500 + (items.length - 1) * STAGGER_OPEN; // 엠블럼 회전시간

  return (
    <div className="fixed bottom-6 right-6 z-[95] select-none">
      {/* 버튼과 아이콘을 같은 원점으로 겹치기 위한 래퍼 */}
      <div className="relative w-14 h-14">
        {/* 아이콘 리스트: 버튼 기준 오른쪽·아래 모서리에서 시작 */}
        <ul
          className="absolute right-1 bottom-1 overflow-visible"
          style={{ pointerEvents: open ? "auto" : "none" }}
        >
          {items.map((it, idx) => {
            const offset = (idx + 1) * GAP + GAP_FROM_BTN; // 위로 쌓아 올릴 거리
            const delayOpen = `${idx * STAGGER_OPEN}ms`;
            const delayClose = `${(items.length - 1 - idx) * STAGGER_CLOSE}ms`;

            return (
              <li
                key={it.key}
                className="absolute right-0 bottom-0 will-change-transform"
                style={{
                  transform: open
                    ? `translateY(-${offset}px)`
                    : "translateY(0)",
                  opacity: open ? 1 : 0,
                  transition:
                    "transform .45s cubic-bezier(.22,.76,.25,1), opacity .25s ease",
                  transitionDelay: open ? delayOpen : delayClose,
                  zIndex: 50 + (items.length - idx), // 겹침 순서 조절
                }}
              >
                <a
                  href={it.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={it.label}
                  className="inline-flex items-center justify-center w-12 h-12 text-main rounded-full bg-white shadow-[0_10px_25px_rgba(0,0,0,.18)] hover:shadow-[0_12px_30px_rgba(0,0,0,.25)] hover:-translate-y-0.5 transition"
                
                >
                  {it.icon}
                </a>
              </li>
            );
          })}
        </ul>

        {/* 엠블럼 버튼 (라벨 제거, 수평 이동도 제거) */}
        <button
          type="button"
          aria-label={open ? "문의 버튼 접기" : "문의하기"}
          onClick={() => setOpen((o) => !o)}
          className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-white border border-neutral-200 shadow-[0_14px_35px_rgba(0,0,0,.24)] transition-transform"
        >
          <img
            src={withBase("images/emblem.png")}
            alt="HAMHanokStay 엠블럼"
            className="w-9 h-9"
            style={{ animation: `fabSpin ${totalMs}ms linear 1` }}
            key={open ? "spin-open" : "spin-close"}
          />
        </button>
      </div>

      {/* 로컬 키프레임 */}
      <style>{`
        @keyframes fabSpin {
          from { transform: rotate(0) }
          to { transform: rotate(360deg) }
        }
      `}</style>
    </div>
  );
}
