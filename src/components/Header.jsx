import { useState } from "react";
import {FaGlobe} from "react-icons/fa"; // 지구본 아이콘(언어 설정)
import { Link } from "react-router-dom";


export default function Header() {
    const [langOpen, setLangOpen] = useState(false);
    const toggleLangMenu = () => setLangOpen(!langOpen); // 버튼 클릭 시 열림 토글 

    return (
        <header className="bg-cream w-full text-center px-4 py-2 shadow-md">
            {/* 상단 로고 + 언어 선택 아이콘 */}
            <div className="flex justify-between items-center max-w-8xl mx-auto ">
                {/* 로고 이미지  */}
                <Link to="/" className="mx-auto">
                    <img src="../assets/logo.svg" alt="HAMHanokStay Logo"  style={{ height: '130px' }} />
                </Link>
                {/* 언어 선택 드롭다운 */}
                <div className="relative">
                    <button onClick={toggleLangMenu}>
                        <FaGlobe className="text-2xl text-gray-700"></FaGlobe>
                    </button>
                    {langOpen && (
                        <ul className="absolute right-0 mt-2 bg-white border rounded text-sm shadow-md z-10">
                            <li className="px-4 py-2 hover:bg-gray=100 cursor-pointer">한국어</li>
                            <li className="px-4 py-2 hover:bg-gray=100 cursor-pointer">English</li>
                            <li className="px-4 py-2 hover:bg-gray=100 cursor-pointer">日本語</li>
                            <li className="px-4 py-2 hover:bg-gray=100 cursor-pointer">Deutsch </li>
                            <li className="px-4 py-2 hover:bg-gray=100 cursor-pointer">中文</li>
                        </ul>
                    )}
                </div>
            </div>
            {/* 네비게이션 메뉴 */}
            <nav className="space-x-6 font-medium">
                <Link to="/about" className="hover:underline">About</Link>
                <Link to="/review" className="hover:underline">Review</Link>
                <Link to="/reserve" className="hover:underline">Reserve</Link>
                <Link to="/contact" className="hover:underline">Contact</Link>
            </nav>
        </header>
    );
}