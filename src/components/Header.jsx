import {Link} from "react-router-dom";
import logoWhite from "../assets/logo_white.png";
import logo from "/images/logo.svg"
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useState } from "react";
import {FiMenu, FiX} from "react-icons/fi";
import { header } from "framer-motion/client";


const scrollTo = (id) => {
  const el = document.getElementById(id);
  const container = document.getElementById("app-scroll");
  if (!el || !container) return;

  const headerOffset = 80; // 고정 헤더 높이에 맞게 조절
  const targetY =
    el.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    headerOffset;

  container.scrollTo({ top: targetY, behavior: "smooth" });
};
const NAV = [
    { label: "HAM",   target: "artisan" },
    { label: "ABOUT",   target: "hamstay" },
    { label: "REVIEWS", target: "reviews" },
    { label: "RESERVE", target: "reserve" },
];


export default function Header() {

    const [open , setOpen] = useState(false);
    useEffect(() => {
        document.body.style.overflow = open ? "hidden":"";
        return () => (document.body.style.overflow = ""); 
    }, [open])

    // id를 인자로 받아 현재 열려있는 메뉴나 모달을 닫을 뒤 (SetOpen(false)), 해당 id를 가진 요소가 있는 위치로 화면을 부드럽게 이동 
    const go = (id) => {
        setOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({behavior: "smooth", block:"start"});
    }
    

    return (
        // 비디오 위에 얹는 투명 헤더 
        <header className="absolute inset-x-0 top-0 z-20">
            {/* group 컨테이너 하나로 묶되 , 'peer'를 nav에 주고 아래 배경 레이어가 peer-hover로 반응하게 구성 */}
            <div className="relative">
                {/* 실제 헤더 컨텐츠 (로고 좌측 / 메뉴 우측) */}
                <div className="peer relative z-10 flex items-center justify-between px-6 lg:px-10 py-5">
                    {/* 로고: 좌측 , 투명 배경  */}
                    <Link to="/" className="shrink-0">
                        <img src={logoWhite} alt="HAMHanokStay" className="h-[100px] w-auto" />
                    </Link>
                
                   {/* 데스크톱 메뉴 */}
                    <nav className="hidden md:flex items-center gap-8 text-white/90 font-medium tracking-wide">
                        {NAV.map((item) => (
                        <button
                            key={Array.isArray(item.target) ? item.target[0] : item.target}
                            onClick={() => scrollTo(item.target)}
                            className="text-sm font-medium hover:opacity-80 transition"
                            type="button"
                        >
                            {item.label}
                        </button>
                        ))}
                    </nav>
                    {/* (옵션) 모바일 메뉴 버튼 자리 */}
                    <button 
                        className="md:hidden text-white/90" 
                        aria-label="Open menu" 
                        aria-expanded={open}
                        onClick={()=> setOpen(true)}
                        type="button">
                        <RxHamburgerMenu className="w-7 h-7" />
                    </button>
                </div>

                {/* 배경 레이어 : 기본은 투명, 메뉴(nav) hover 시 어두워짐  */}
                <div 
                    className="pointer-events-none absolute inset-0 z-0 bg-transparent transition-colors duration-300 peer-hover:bg-black/60"
                />

            </div>
            {/*  모바일 오버레이 & 슬라이드 페널 */}
            {open && (
                <>
                    {/* 배경 오버레이 클릭 시 닫기  */}
                    <button
                        className="fixed inset-0 z-40 bg-black/40"
                        aria-label= "close menu backdrop"
                        onClick={() => setOpen(false)}
                        type="button"
                    />
                    {/* 우측 그라이드 메뉴 */}
                    <nav
                        className="fixed right-0 top-0 bottom-0 z-50 w-72 max-w-[80vw] bg-white shadow-2xl flex flex-col"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* 패널 헤더 */}
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <img src={logo} alt="HAMHanokStay" className="h-9 w-auto" />
                            <button
                                className="p-2 rounded-md hover:bg-neutral-100"
                                aria-label="Close menu"
                                onClick={() => setOpen(false)}
                                type="button"
                            >
                                <FiX className="w-6 h-6" />
                            </button>
                        </div>

                        {/* 패널 링크 */}
                        <ul className="flex-1 px-5 py-4 space-y-2 text-neutral-800">
                            {NAV.map((item) => (
                            <li key={item.target}>
                                <button
                                    onClick={() => go(item.target)}
                                    className="w-full text-left px-3 py-3 rounded-md hover:bg-neutral-100 font-medium"
                                    type="button"
                                >
                                    {item.label}
                                </button>
                            </li>
                            ))}
                        </ul>

                        {/*  하단 여백 (안전영역) */}
                        <div className="h-6" />

                    </nav>
                    
                </>
            )}
            

        </header>
    )

    // return (
    //     <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-neutral-200"> 
    //         <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
    //             <button onClick={() => go("home")} className="font-semibold ">

    //             </button>
    //         </div>
    //     </header>
    // )
}