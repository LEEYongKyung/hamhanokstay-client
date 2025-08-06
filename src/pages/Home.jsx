import Header from "../components/Header";
import MainVideo from "../components/MainVideo";
import IntroSection from "../components/IntroSection";
import Footer from "../components/Footer";
import logowhite from "../assets/logo_white.png";
import leessihamwhite from "../assets/leessiham_white.png";
import emblemwhite from "../assets/emblem_white.png";

export default function Home() {
    return (
        <main className="h-screen overflow-y-scroll overflow-contain lg:snap-y lg:snap-mandatory lg:snap-always">
            {/* 페이지1: Header + MainVideo 한화면  */}
            <section className="relative h-screen snap-start">
                {/* 비디오를 배경처럼 깔기 */}
                <div className="absolute inset-0 -z-10 ">
                    <MainVideo />
                </div>
                {/* 엠블럼 오버레이 레이어 */}
                {/* <img
                    src={emblemwhite}
                    alt="HAM HanokStay emblem"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-auto max-w-none pointer-events-none" // 가운데 정렬
                >
                </img> */}
                {/* 이씨함 오버레이 레이어 */}
                <img
                    src={leessihamwhite}
                    alt="HAM HanokStay Logo"
                    className="absolute bottom-8 right-8 w-32 md:w-40 lg:w-48 drop-shadow pointer-events-none z-10"
                >
                </img>
                 {/* 헤더(오버레이용) */}
                <Header varient="overlay"/>
                
            </section>
            {/* 페이지2: 다음 콘텐츠들 한화면 */}
            <section className="h-screen lg:snap-start">
                <IntroSection />
            </section>
            <Footer />
            
           
        </main>

    )
}