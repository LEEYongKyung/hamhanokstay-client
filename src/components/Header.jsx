import { useState } from "react";
// import {HiLanguage } from "react-icons/fa"; // 지구본 아이콘(언어 설정)
import { HiLanguage } from "react-icons/hi2"
import { Link } from "react-router-dom";


export default function Header(variant="default") {
    const [langOpen, setLangOpen] = useState(false);
    const toggleLangMenu = () => setLangOpen(!langOpen); // 버튼 클릭 시 열림 토글 
    // const mode = varient ?? variant; //오타 호환
    const isOverlay = variant === "overlay"; // 오버레이 모드 여부 확인
    return (
        <header className={
            isOverlay
            // 오버레이 모드일 때: 배경 비디오 위에 텍스트가 오도록 설정
            ? "absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white "
            : // 일반 모드일 때: 상단 고정 헤더
            "bg-white w-full text-center px-4 py-2 shadow-md"
            }
        >
            {/* 상단로고 + 언어 선택 아이콘 중앙에 배치  */}
            <div
                className={
                    isOverlay
                    ? "flex flex-col items-center"
                    : "flex justify-between items-center max-w-8xl mx-auto"
                }
            >
                {/* 로고 이미지  */}
                <Link to="/" className={isOverlay ?"block":"mx-auto"}>
                    <img 
                        src="../assets/logo.svg" 
                        alt="HAMHanokStay Logo"
                        style={{height: "130px"}} 
                    />
                </Link>
                {!isOverlay && (
                 
                    <div className="relative ">
                        <button onClick={toggleLangMenu}>
                            <HiLanguage  className="text-2xl text-gray-500" />
                        </button>
                        {langOpen && (
                            <ul className="absolute right-0 mt-2 bg-white border rounded text-sm shadow-md z-10">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">한국어</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">English</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">日本語</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Deutsch</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">中文</li>
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {/* 네비게이션 메뉴 */}
            <nav className={
                isOverlay
                ? "mt-8 space-x-6 font-medium"
                : "space-x-6 font-medium"
            }
            >
                <Link to="/about" className={isOverlay ? "hover:underline" : "hover:underline"}>About</Link>
                <Link to="/review" className={isOverlay ? "hover:underline" : "hover:underline"}>Review</Link>
                <Link to="/reserve"className={isOverlay ? "hover:underline" : "hover:underline"}>Reserve</Link>
                <Link to="/contact"className={isOverlay ? "hover:underline" : "hover:underline"}>Contact</Link>
            </nav>


        </header>
    )
    
}