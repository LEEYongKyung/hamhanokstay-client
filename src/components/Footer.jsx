// import {
//     FaInstagram,
//     FaWhatsapp,
//     FaCommentDots
// } from "react-icons/fa";
import { SiKakaotalk, SiWhatsapp, SiInstagram } from "react-icons/si";
import {MdEmail} from "react-icons/md";
import {Link} from "react-router-dom";
import logo from "../assets/logo.svg";


// +----------------------------+------------------------+--------------------------+
// | [로고]                    | 사이트맵               | 연락처 + 이메일 버튼    |
// | SNS 아이콘들 (선택)       | About / Reserve 등     | 카카오ID, WhatsApp, Email|
// +----------------------------+------------------------+--------------------------+
// | 하단 바 – 회사 정보, 저작권, 이용약관/정책 링크                              |
// +-------------------------------------------------------------------------+


export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 text-gray-700 text-sm">
            <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* 1. 왼쪽 : 로고  */}
                <div className="flex flex-col items-start gap-4">
                    <img src={logo} alt="HAMHanokStay Logo" className="h-12 w-auto" />
                    <div className="flex gap-3 text-lg">
                        <a 
                            href="http://pf.kakao.com/_SYKxan/chat" 
                            target="_blank" 
                            rel="noreferrer"
                        >
                            <SiKakaotalk className="hover:text-gray-500 cursor-pointer" />
                        </a>

                        <a 
                            href="https://wa.me/821090441306" 
                            target="_blank" 
                            rel="noreferrer"
                        >
                            <SiWhatsapp className="hover:text-gray-500 cursor-pointer" />
                        </a>
                        <a 
                            href="https://www.instagram.com/hamhanokstay?igsh=MWwyaTljcmhrOTl1eQ%3D%3D&utm_source=qr" 
                            target="_blank" 
                            rel="noreferrer"
                        >
                            <SiInstagram className="hover:text-gray-500 cursor-pointer" />
                        </a>
                        <a 
                            href="mailto:hamhanokstay@gmail.com"
                        >
                             <MdEmail className="hover:text-gray-500 cursor-pointer" />
                        </a>
                    </div>
                </div>
                {/* 2. 중앙 : 사이트맵 */} 
                <div>
                    <h4 className="font-semibold mb-3">HAMHanokStay</h4>
                    <ul className="space-y-1">
                        <li><Link to="/about" className="hover:underline">About </Link></li>
                        <li><Link to="/review" className="hover:underline">Reviews </Link></li>
                        <li><Link to="/reserve" className="hover:underline">Reserve </Link></li>
                        <li><Link to="/contact" className="hover:underline">Contact </Link></li>
                    </ul>
                </div>
                {/* 3. 오른쪽 : 연락처 + 이메일 */}
                <div>
                    <h4 className="font-semibold mb-3">Contact</h4>
                    <a 
                            href="http://pf.kakao.com/_SYKxan/chat" 
                            target="_blank" 
                            rel="noreferrer"
                        >
                            <p className="mb-1"><strong>카카오ID: </strong> hamhanok</p>
                    </a>
                    <a 
                            href="https://wa.me/821090441306" 
                            target="_blank" 
                            rel="noreferrer"
                        >
                            <p className="mb-1"><strong>WhatsApp: </strong> +82 10-9044-1306</p>
                    </a>
                   
                    <p className="mb-3"><strong>Email: </strong> hamhanokstay@gmail.com</p>
                    <a 
                            href="mailto:hamhanokstay@gmail.com"
                        >
                             <button className="border border-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition">
                                 CONTACT EMAIL
                             </button>
                        </a>
                    
                </div>
            </div>
            {/* 하단 바  */}
            <div className="border-t border-gray-100 py-6 text-xs text-gray-500 text-center px-6">
                <p className="mb-2">
                    HAMHanokStay | 대표 이용경 | 서울특별시 종로구 | 사업자 등록번호 101-40-12955
                </p>
                <div className="flex justify-center gap-4 mt-1">
                    <Link to="/terms" className="hover:underline"> Terms of Use</Link>
                    <Link to="/policy" className="hover:underline"> Privacy Policy</Link>
                </div>
                <p className="mt-2">© 2025 HAMHanokStay. All rights reserved.</p>
            </div>

        </footer>
    )

}
