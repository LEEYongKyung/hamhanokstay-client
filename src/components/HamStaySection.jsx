
import React, {useState, useMemo, useRef, useEffect} from "react";
import { FaChevronLeft, FaChevronRight , FaStar, FaMapPin, FaUser, FaCalendar, FaImage, FaLandmark, FaMedal } from "react-icons/fa";
import {FaX} from "react-icons/fa6";
import {BsTrainFront, BsDoorOpen} from "react-icons/bs"
import { CiRollingSuitcase } from "react-icons/ci";
import { SiNaver } from "react-icons/si";
import { TbBrandBooking } from "react-icons/tb";
import { FaAirbnb } from "react-icons/fa";


/**
 * HAM HanokStay - Airbnb 스타일 섹션
 * 
 * props로 이미지를 넣으면 교체 가능 (미입력 시 예시 미지ㅣ 사용)
 * images : string() // 대표 썸네일용 (최소 5장 이상 )
 * title: string
 * subtitle: string
 * addressText: string // 클릭 시 이동한 지도 링크 
 * rating : {airbnb?: number, booking?:number, naver?:number}
 * onReserve?: (payload) => void
 * 
 */

export default function HamStaySection({
    // props 섹션
    images =[
        "/images/HamStay/ham_1.png",
        "/images/HamStay/ham_2.jpg",
        "/images/HamStay/ham_3.jpg",
        "/images/HamStay/ham_4.jpg",
        "/images/HamStay/ham_5.jpg",
    ],

    title = "조선시대 전통가구가 살아 숨 쉬는 한옥공간 함한옥스테이",
    subtitle = "HAMHanokStay",
    addressText = "서울특별시 종로구 계동6길 4-1",
    ratings = {airbnb: 4.89, booking: 9.8, naver: 9.8},
    reservationUrls = {
        airbnb: "https://www.airbnb.co.kr/rooms/1141509028517381236?guests=1&adults=1&s=67&unique_share_id=c7c78e2f-3f97-4418-a061-b63fcc6909be",
        booking: "https://www.booking.com/Share-ofy5NuJ",
        naver: "https://naver.me/55rXUyZA"
    },
    onReserve,
    addressMapUrl="https://maps.app.goo.gl/aXTt5T1NUE9Ehfif8",
    description = "백 년 목재와 전통가구가 어우러진 프라이빗 독채 한옥. 안국역 근처의 조용한 골목에서, 작품과 함께 머무는 특별한 숙박을 제안합니다."

}){
    //예시 이미지 (없으면 Unplash 프리뷰 사용)
        const fallback = useMemo(
            () => (images && images.length ? images : [
                "https://images.unsplash.com/photo-1560448075-bb4caa6cfcf0?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=801&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1533090368676-1fd25485db88?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1549187774-b4e9b0445b06?q=80&w=800&auto=format&fit=crop"
                
            ]),
            [images]
        );

        const [galleryOpen, setGalleryOpen] = useState(false); // 이미지 슬라이드 모달 
        const [galleryIndex, setGalleryIndex] = useState(0);

        const [checkIn, setCheckIn] = useState("");
        const [checkOut, setCheckOut] = useState("");
        const [guests, setGuests] = useState(1);

        const openGallery = (idx = 0) => {setGalleryIndex(idx); setGalleryOpen(true);};
        const closeGallery = () => setGalleryOpen(false);
        const prev = () => setGalleryIndex((i) => (i -1 + fallback.length) % fallback.length);
        const next = () => setGalleryIndex((i) => (i +1) % fallback.length);

        const reserve = () => {
            const payload = {checkIn, checkOut, guests};
            if (onReserve) onReserve(payload);
            else alert(`예약 확인: ${JSON.stringify(payload, null, 2)}`);
        };

        const features = [
            {icon: FaLandmark, label:"상징적 도시"},
            {icon: BsTrainFront, label:"안국역 근처"},
            {icon: FaMedal, label:"슈퍼 호스트"},
            {icon: BsDoorOpen, label:"셀프 체크인"},
            {icon: CiRollingSuitcase, label:"짐 맡기기 가능"},
        ]

        //  애니메이션 추가 
        const sectionRef = useRef(null); // useRef를 통해 sectionRef라는 이름의 이름표를 만듬. 나중에 <section>에 이름표를 붙여 감시
        const [inView, setInView] = useState(false); // inView라는 상태를 만듬. 나중에 sectionRef라는 이름표가 보이는지 확인하는 값. 원하는 섹션에 진입했는지 확인
        const [spark, setSpark] = useState(false); // 평점 반짝 트리거 
        const [shake, setShake] = useState(false); // 예약카드 쉐이크 트리거 

        //  섹션 가시성 감지 (화면에 들어오면 애니메이션 시작 )
        useEffect(() => {
            // 1. 섹션 가시성 감지( 화면에 들어오면 애니메니션 시작) 
            const io = new IntersectionObserver( // sectionRef 이름표가 붙은 실제 DOM요소를 관찰하라고 명령. "이제부터 이 요소를 지켜봐 의미"
                ([entry]) => setInView(entry.isIntersecting), // 3. 관찰자인 io가 감시하던 요소의 상태변화를 감지했을 때 콜백함수 . entry는 감시하던 객체의 정보 , entry.isIntersection 은 요소가 보이면 true
                {threshold: 0.35}// 4. 대상 요소가 얼마나 보여야 콜백함수를 실행하는지 결정 
            );
            // 2.관찰 시작 
            if (sectionRef.current) io.observe(sectionRef.current);
            // 5. 뒷 정리
            return () => io.disconnect();
        }, []);// 의존성 배열

        // 5초 마다 반짝 + 쉐이크 (가시 상태일 때만)
        useEffect(()=> {
            if (!inView) return;
            const runSpark = () => {
                setSpark(true) ;// 평점 부분 반짝 ( 지연은 각 아이템 delay로 처리)
                setTimeout(() => setSpark(false), 1200); //반짝이 종료
            };
            const runShake = () => {
                setShake(true) ; // 예약 카드 좌우로 흔들
                setTimeout(()=> setShake(false), 600) ; // 쉐이크 종료
            };

            runSpark(); // 직입 직후 한 번 실행 
            runShake(); // 직입 직후 한 번 실행 
            const idSpark = setInterval(runSpark, 3000); // 5초 마다 반복
            const idShake = setInterval(runShake, 6000); // 5초 마다 반복
            return () => clearInterval(idSpark,idShake);
        }, [inView])

    return (
        <section id="ham-hanok-stay" ref={sectionRef} className=" relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 ">
            {/* 헤더 */}
            <header className=" mb-6 text-center">
                <h2 className="text-2xl text-main sm:text-3xl font-bold tracking-tight mb-2">{title}</h2>
                <span className="text-main font-semibold ">{subtitle}</span>
            </header>
            {/* 사진 grid: 헤더 바로 아래 전체 폭 */}
            <div className=" relative rounded-2xl overflow-hidden">
                <div className=" grid grid-cols-4 grid-rows-2 gap-2">
                    {/* 메인 좌측 큰 대표 이미지 */}
                    <button
                        onClick={()=>openGallery(0) } 
                        className="col-span-2 row-span-2 group relative">
                            <div className="relative aspect-square">
                                <img 
                                    src={fallback[0]} 
                                    alt="대표사진 " 
                                    className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
                            </div>
                        
                    </button>
                    {/* 오른쪽 4개  */}
                    {fallback.slice(1,5).map((src, i)=> (
                        <button
                            key = {i}
                            onClick={() => openGallery(i+1)}
                            className="relative group"    
                            >
                                <div className="relative aspect-square">
                                    <img 
                                        src={src}
                                        alt={`사진 ${i+2}`}
                                        className="w-full h-full object-cover transition group-hover:scale-[1.02]"
                                    />

                                </div>
                            
                        </button>
                    ))}
                </div>
                <button 
                    onClick={()=>openGallery(0)}
                    className="flex items-center gap-2 absolute bottom-3 right-3 round-full bg-white/90 px-3 py-1.5 text-main font-semibold shadow hover:bg-white rounded-xl"
                >
                    <FaImage className="h-4 w-4 fill-main" />사진 모두 보기
                </button>

            </div>
            {/* 하단: [좌] 주소/평점/특징/설명 + [우] 예약 카드 */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 좌측 정보 */}
                <div className="lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <button
                        onClick={() => window.open(addressMapUrl, "_blank")}
                        className="inline-flex  items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow border hover:bg-neutral-50" aria-label="지도에서 보기"
                    >
                        <FaMapPin className="h-4 w-4 fill-main"/>
                        <span className="text-main">{addressText}</span>
                    </button>
                    <span className="text-main"> 최대 인원 4명 · 침실 2개 · 욕실 2개 </span>

                    </div>
                    {/* 평점 */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        {ratings?.airbnb && (
                            <a 
                                href={reservationUrls.airbnb} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={spark ? {animation: "hamFlash 900ms ease-out both",  animationDelay: "0ms",willChange:"filter, transform"}:{}}
                                className="flex items-center gap-1.5 text-[#FF385C] hover:opacity-80 transition-opacity">
                                <FaAirbnb className="h-5 w-5 text-[#FF385C]" />
                                <b>Airbnb</b> &nbsp;{ratings.airbnb.toFixed(2)}
                            </a>
                        )}
                        {ratings?.booking && (
                            <a 
                                href={reservationUrls.booking} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={spark ? {animation: "hamFlash 900ms ease-out both",  animationDelay: "180ms",willChange:"filter, transform"}:{}}
                                className="flex items-center gap-1.5 text-[#013B94] hover:opacity-80 transition-opacity">
                                <TbBrandBooking className="h-6 w-6 fill-[#013B94] text-white" />
                                <div className="text-[#013B94]">
                                    <b>Booking.com</b> &nbsp;{ratings.booking.toFixed(1)}
                                </div>
                            </a>
                        )}
                        {ratings?.naver && (
                            <a 
                                href={reservationUrls.naver} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={spark ? {animation: "hamFlash 900ms ease-out both",  animationDelay: "360ms",willChange:"filter, transform"}:{}}
                                className="flex items-center gap-1.5 text-green-400 hover:opacity-80 transition-opacity">
                                <SiNaver className="h-4 w-4 fill-green-400" />
                                <b>Naver</b> &nbsp;{ratings.naver.toFixed(2)}
                            </a>
                        )}
                    </div>
                    {/* 실선 */}
                    <hr className="my-6 border-neutral-200"></hr>

                    {/* 숙소의 특징 icon grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6">
                        {features.map(({icon:Icon, label},i)=> (
                            <div key={i} className="flex items-center gap-4">
                                <Icon className="h-5 w-5 fill-main"/>
                                <span className="text-sm fill-main">{label}</span>
                            </div>
                        ))}
                    </div>
                    {/* 실선 */}
                    <hr className="my-6 border-neutral-200"></hr>
                    {/* 숙소 설명  */}
                    <p className="text-neutral-700 leading-relaxed">{description}</p>
                </div>

                {/* 우측 예약 카드 : 하단 정보 옆으로 배치  */}
                <aside className="lg:col-span-4">
                    <div 
                        className="rounded-2xl border border-neutral-200 bg-white/90 shadow-2xl p-5 lg:sticky lg:top-4"
                        style={shake? {animation:"hamShake 550ms ease-in-out both"}:{}}>
                        <h3 className="w-full text-center text-lg font-semibold mb-4">날짜를 선택해 요금확인</h3>
                        <div className="space-y-3 ">
                            <div className="grid grid-cols-2 gap-2" >
                                <label className="flex flex-col">
                                    <span className="text-xs font-semibold text-neutral-600 mb-1">체크인</span>
                                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                                        <FaCalendar className="h-4 w-4"/>
                                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full outline-non" />
                                    </div>
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-xs font-semibold text-neutral-600 mb-1">체크아웃</span>
                                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                                        <FaCalendar className="h-4 w-4"/>
                                        <input type="date" value={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="w-full outline-non" />
                                    </div>
                                </label>
                            </div>
                            <label className="flex flex-col" >
                                <span className="text-xs font-semibold text-neutral-600 mb-1">인원</span>
                                <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                                    <FaUser className="h-4 w-4" />
                                    <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full outline-none bg-transparent">
                                        {[1,2,3,4].map(n=><option key={n} value={n}> 게스트 {n}명 </option>)}
                                    </select>
                                </div>
                            </label>

                            <button
                                onClick={reserve}
                                className="mt-2 w-full rounded-xl bg-rose-600 py-3 text-white font-semibold hover:bg-rose-700 active:scale-[.98]"
                            >
                                예약 가능 여부 보기
                            </button>

                        </div>
                    </div>
                </aside>
            </div>

           
            {/* 사진 모달 */}
            {galleryOpen && (
                // 반투명 배경 
                <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"> 
                    <div className="relative w-full max-w-5xl">
                        <button
                            onClick={closeGallery}
                            className="absolute -top-10 right-0  text-white/90 p-2 shadow hover:text-white"
                            aria-label = "닫기"
                        >

                            <FaX className="h-6 w-6"/>
                        </button>

                        <div className="relative rounded-2xl overflow-hidden bg-black" >
                            {/* 이미지확대 크기 설정 */}
                            <img 
                                src={fallback[galleryIndex]}
                                alt={`gallery ${galleryIndex+1}`}
                                className="w-full max-h-[75vh] object-contain bg-black"
                            />
                            {/* 좌우 네비게이션 */}
                            <button
                                onClick={prev}
                                className="absolute left-2 top-1/2  text-white/90 p-2 shadow hover:text-white"
                            >
                                <FaChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-2 top-1/2 text-white/90 p-2 shadow hover:text-white"
                            >
                                <FaChevronRight className="h-6 w-6"/>
                            </button>
                        </div>
                        {/* 썸네일 바 */}
                        <div className="mt-3 grid grid-cols-6 gap-2">
                            {fallback.map((src, i)=> (
                                <button 
                                    key={i}
                                    onClick={() => setGalleryIndex(i) }
                                    className={`rounded-lg overflow-hidden ring-2 ${i===galleryIndex? "ring-white": "ring-transparent"}`}
                                >
                                    <img src={src} alt={`thumb - ${i+1}`} className="h-20 w-full object-cover"/>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            )}
        {/* animations */}
        <style>{`
            @keyframes hamFlash {
                0% {
                    transform: translateY(-5px);
                    filter: none;
                    text-shadow: 0 0 0 rgba(255,255,255,0);
                }
                35% {
                    transform: translateY(0);
                    filter: brightness(1.85) saturate(1.35);
                    text-shadow: 0 0 10px rgba(255,255,255,.75);
                }
                70% {
                    filter: brightness(1.2) saturate(1.1);
                    text-shadow: 0 0 4px rgba(255,255,255,.35);
                }
                100% {
                    transform: translateY(0);
                    filter: none;
                    text-shadow: none;
                }
                }   
            
            @keyframes hamShake {
                0% 100% {transform: translateX(0);}
                15% {transform: translateX(-4px);}
                30% {transform: translateX(4px);}
                45% {transform: translateX(-3px);}
                60% {transform: translateX(3px);}
                75% {transform: translateX(-2px);}
                90% {transform: translateX(2px);}
                
            }    
            `}
            
        </style>
        </section>
       
        
    );
};