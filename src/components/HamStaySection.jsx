
import React, {useState, useMemo} from "react";
import { FaChevronCircleLeft, FaChevronCircleRight , FaStar, FaMapPin, FaUser, FaCalendar, FaImage} from "react-icons/fa";


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
    onReserve,
    addressMapUrl="https://maps.app.goo.gl/aXTt5T1NUE9Ehfif8"

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
        const [gallerIndex, setGalleryIndex] = useState(0);

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

    return (
        <section id="ham-hanok-stay" className="bg-blue-100 relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 ">
            {/* 헤더 */}
            <header className="bg-yellow-100 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
                <span className="text-neutral-500 font-semibold">{subtitle}</span>
            </header>

            {/* 상단 그리드 : 사진들 + 예약카드 */}
            <div className="bg-green-100 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 사진 그리드 */}
                <div className="relative lg:col-span-8">
                    <div className="bg-red-100 grid grid-cols-3 grid-rows-2 gap-2 rounded-2xl overflow-hidden">
                        {/* 메인 (좌측 큰 이미지) */}
                        <button 
                            className="col-span-2 row-span-2 group relative" 
                            onClick={()=> openGallery(0)}
                            aria-label="대표사진 크게 보기"
                            >
                            <img
                                src={fallback[0]}
                                alt="HAM Hanok 대표사진"
                                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                            />
                        </button>
                        {/* 우측 4개 */}
                        {fallback.slice(1,5).map((src, i) => (
                            <button
                                key={i}
                                className="relative"
                                onClick={() => openGallery(i+1)}
                                aria-label = {`사진 ${i+2} 크게 보기`}
                            >
                                <img src={src} alt= {`사진 ${i+2}`} className="h-full w-full object-cover" />
                            </button>
                        ))}

                    </div>
                    {/* 사진 모두 보기 버튼 */}
                    <button
                        onClick={() => openGallery(0)}
                        className="flex items-center gap-2 absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold hover:bg-white"
                    >
                        <FaImage className="h-4 w-4" />
                        사진 모두 보기 
                    </button>
                </div>
                {/*  예약 코드  */}
                <aside className="lg:col-span-4 bg-purple-300">
                    <div className="rounded-2xl border border-neutral-200 bg-white/90 shadow-sm p-5 sticky">
                        <h3 className="text-lg font-semibold mb-4">날짜를 선택해 요금확인  </h3>
                        <div className="space-y-3 bg-yellow-300">
                            {/* 체크인/아웃 */}
                            <div className="grid grid-cols-2 gap-2">
                                <label className="flex flex-col" >
                                    <span className="text-xs font-semibold text-neutral-600 mb-1">체크인</span>
                                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                                        <FaCalendar className="h-4 w-4"/>
                                        <input 
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            className="w-full outline-none"
                                            />
                                    </div>
                                </label>
                                <label className="flex flex-col" >
                                    <span className="text-xs font-semibold text-neutral-600 mb-1">체크아웃</span>
                                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                                        <FaCalendar className="h-4 w-4"/>
                                        <input 
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            className="w-full outline-none"
                                            />
                                    </div>
                                </label>
                            
                             </div>
                             {/* 인원 */}
                             <label className="flex flex-col ">
                                <span className="text-xs font-semibold text-neutral-600 mb-1">인원</span>
                                <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                                    <FaUser className="h-4 w-4"/>
                                    <select 
                                        value={guests} 
                                        onChange={(e)=> setGuests(Number(e.target.value))}
                                        className="w-full outline-none bg-transparent"
                                        >
                                            {[1,2,3,4].map(n => <option key={n} value={n}> 게스트 {n}명</option>)}
                                    </select>
                                </div>
                             </label>
                             {/* 예약하기 */}
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
            {/* 하단 정보 (주소/ 특징 리뷰) */}
            <div className="mt-6 flex flex-col gap-3">
                <div className="flex flex-wrap  items-center gap-x-6 gap-y-2 text-sm">
                    <button
                        onClick={() => window.open(addressMapUrl, "_blank")}
                        className="inline-flex  items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow border hover:bg-neutral-50" aria-label="지도에서 보기"
                    >
                        <FaMapPin className="h-4 w-4"/>
                        <span>{addressText}</span>
                    </button>
                    <span> 최대 인원 4명 · 침실 2개 · 욕실 2개 </span>
                </div>
                {/* 외부 평점 */}
                <div className="flex flex-wrap items-center gap-4 tex-sm">
                    {ratings?.airbnb && (
                        <div className="flex items-center gap-1.5"> 
                            <FaStar className="h-4 w-4 fill-red-400 text-red-400" />
                            <b>Airbnb</b> &nbsp;{ratings.airbnb.toFixed(2)}
                        </div>
                    )}
                    {ratings?.booking && (
                        <div className="flex items-center gap-1.5"> 
                            <FaStar className="h-4 w-4 fill-blue-400 text-blue-400" />
                            <b>Booking.com</b> &nbsp;{ratings.booking.toFixed(1)}
                        </div>
                    )}
                    {ratings?.naver && (
                        <div className="flex items-center gap-1.5"> 
                            <FaStar className="h-4 w-4 fill-green-400 text-green-400" />
                            <b>Naver</b> &nbsp;{ratings.naver.toFixed(2)}
                        </div>
                    )}
                </div>
            </div>
        
        </section>
        
    );
};