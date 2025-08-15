
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
        "/images/HamStay/ham_4.jpg"
    ],

    title = "조선시대 전통가구가 살아 숨 쉬는 한옥공간 함한옥스테이",
    subtitle = "HAMHanokStay",
    addressText = "서울특별시 종로구 계동6길 4-1",
    ratings = {airbnb: 4.89, booking: 9.8, naver: 9.8},
    onReserve

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
                                className="w-full h-full object-cover transition group-hover:scale-[1.02]"
                            />
                        </button>
                        {/* 우측 4개 */}
                        {fallback.slice(1,5).map((src, i) => (
                            <button
                                key={i}
                                className="relative"
                                onClick={() => openGallery(i+1)}
                                aria-label = {`사진 ${i+1} 크게 보기`}
                            >
                                <img src={src} alt= {`사진 {i+2}`} />
                            </button>
                        ))}

                    </div>

                </div>

            </div>
        
        </section>
        
    );
};