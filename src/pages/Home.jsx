import Header from "../components/Header";
import MainVideo from "../components/MainVideo";
import IntroSection from "../components/IntroSection";
import Footer from "../components/Footer";
import logowhite from "../assets/logo_white.png";
import leessihamwhite from "../assets/leessiham_white.png";
import emblemwhite from "../assets/emblem_white.png";
import AmenitySection from "../components/AmenitySection";
import LocationSection from "../components/LocationSection";
import ArtisanSection from "../components/ArtisanSection";
import HamStaySection from "../components/HamStaySection";
import ReviewSection from "../components/ReviewsSection";
import ReserveSection from "../components/ReserveSection";
import ContactFab from "../components/ContactFab";
import { withBase } from "../utils/path";
import { SHARE_CALENDARS } from "../config/calendars";
export default function Home() {
    const totalReservations = 123;
    return (
        <main id="app-scroll" className="h-screen overflow-y-auto lg:snap-y lg:snap-mandatory lg:snap-always">
            {/* 페이지1: Header + MainVideo 한화면  */}
            <section className="relative min-h-screen snap-start overflow-visible">
                {/* 헤더(오버레이용) */}
                {/* <Header variant="overlay"/>  */}
                <Header />
                {/* 비디오를 배경처럼 깔기 */}
                <div className="absolute inset-0 -z-10 ">
                    <MainVideo />
                </div>
                {/* 이씨함 오버레이 레이어 */}
                <img
                    src={leessihamwhite}
                    alt="HAM HanokStay Logo"
                    className="absolute bottom-8 left-8 w-32 md:w-40 lg:w-48 drop-shadow pointer-events-none z-10"
                >
                </img>
                 
            </section>
            {/* 페이지2: Artisan  */}
            <section id="artisan" className="min-h-screen lg:snap-start overflow-visible">
                <ArtisanSection />
            </section>
            {/* 페이지3: HAM숙소 소개  */}
            <section id="hamstay" className="min-h-screen lg:snap-start overflow-visible">
                <HamStaySection
                    // images={[ "/imgs/ham/1.jpg", "/imgs/ham/2.jpg", ... ]}
                    // addressText="전북 전주시 완산구 ○○길 12"
                    addressMapUrl="https://maps.app.goo.gl/aXTt5T1NUE9Ehfif8"
                    // ratings={{ airbnb: 4.89, booking: 9.8, naver: 9.8 }}
                    onReserve={(p)=>console.log("reserve payload:", p)}
                    shareCalendars = {SHARE_CALENDARS}
                    
                
                />
            </section>
            {/* 페이지4: ReviewSection  */}
            <section id="reviews" className="min-h-screen lg:snap-start overflow-visible">
                <ReviewSection totalCount = {totalReservations} />
            </section>

            {/* 페이지5: ReserveSection */}
            <section id="reserve" className="min-h-screen lg:snap-start overflow-visible">
                <ReserveSection
                    shareCalendars = {SHARE_CALENDARS}
                />
            
                <Footer />
            </section>

            <ContactFab />
            
           
        </main>
                

    )
}