import {Link} from "react-router-dom";
import logoWhite from "../assets/logo_white.png";
import { RxHamburgerMenu } from "react-icons/rx";

export default function HeaderOverlayTest() {
    return (
        // 비디오 위에 얹는 투명 헤더 
        <header className="absolute inset-x-0 top-0 z-20">
            {/* group 컨테이너 하나로 묶되 , 'peer'를 nav에 주고 아래 배경 레이어가 peer-hover로 반응하게 구성 */}
            <div className="relative">
                {/* 실제 헤더 컨텐츠 (로고 좌측 / 메뉴 우측) */}
                <div className="peer relative z-10 flex items-center justify-between px-6 lg:px-10 py-5">
                    {/* 로고: 좌측 , 투명 배경  */}
                    <Link to="/" className="shrink-0">
                        <img src={logoWhite} alt="HAMHanokStay" className="h-[130px] w-auto" />
                    </Link>
                
                    {/* 메뉴: 우측 , hover시 배경 어둡게 만들기 위해 peer 사용  */}
                    <nav className="hidden md:flex items-center gap-8 text-white/90 font-medium tracking-wide">
                        <Link to="/about" className="hover:underline">ABOUT</Link>
                        <Link to="/review" className="hover:underline">REVIEWS</Link>
                        <Link to="/reserve" className="hover:underline">RESERVE</Link>
                        <Link to="/contact" className="hover:underline">Contact</Link>
                    </nav>
                    {/* (옵션) 모바일 메뉴 버튼 자리 */}
                    <button className="md:hidden text-white/90" aria-label="Open menu">
                        <RxHamburgerMenu className="w-6 h-6" />
                    </button>
                </div>

                {/* 배경 레이어 : 기본은 투명, 메뉴(nav) hover 시 어두워짐  */}
                <div 
                    className="pointer-events-none absolute inset-0 z-0 bg-transparent transition-colors duration-300 peer-hover:bg-black/60"
                />

            </div>
            

        </header>
    )
}