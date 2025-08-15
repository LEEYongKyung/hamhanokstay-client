import Header from "../components/Header";
import MainVideo from "../components/MainVideo";
import IntroSection from "../components/IntroSection";
import Footer from "../components/Footer";
import logowhite from "../assets/logo_white.png";
import leessihamwhite from "../assets/leessiham_white.png";
import emblemwhite from "../assets/emblem_white.png";
import HeaderoverlayTest from "../components/HeaderOverlayTest";
import AmenitySection from "../components/AmenitySection";
import LocationSection from "../components/LocationSection";
import ArtisanSection from "../components/ArtisanSection";
import HamStaySection from "../components/HamStaySection";
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
                {/* <Header variant="overlay"/>  */}
                <HeaderoverlayTest />
                
            </section>
            {/* 페이지2: Artisan  */}
            <section className="h-screen lg:snap-start overflow-y-auto">
                <ArtisanSection />
            </section>
            {/* 페이지3: HAM숙소 소개  */}
            <section className="h-screen lg:snap-start overflow-y-auto">
                <HamStaySection
                    // images={[ "/imgs/ham/1.jpg", "/imgs/ham/2.jpg", ... ]}
                    // addressText="전북 전주시 완산구 ○○길 12"
                    addressMapUrl="https://maps.app.goo.gl/aXTt5T1NUE9Ehfif8"
                    // ratings={{ airbnb: 4.89, booking: 9.8, naver: 9.8 }}
                    onReserve={(p)=>console.log("reserve payload:", p)}
                
                />
            </section>

            {/* 페이지2: Intro + Amenity */}
            <section className="h-screen lg:snap-start overflow-y-auto">
                <IntroSection />
                <AmenitySection />
            </section>

            {/* 페이지3: Location */}
            <section className="h-screen lg:snap-start">
                <LocationSection />
            </section>
            <Footer />
            
           
        </main>

    )
}