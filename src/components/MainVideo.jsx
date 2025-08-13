
import { useEffect, useRef, useState } from "react";

const VIDEOS = [
        "/video/hero_1.mp4",
        "/video/hero_2.mp4",
        "/video/hero_3.mp4"
    ];

export default function MainVideo() {

    const [idx, setIndex] = useState(0); // 현재 비디오 인덱스 상태
    const videoRef = useRef(null); // 비디오 요소에 대한 참조

    const goNext = () => setIndex((prev) => (prev + 1) % VIDEOS.length); // 다음 비디오로 이동하는 함수

    const handleError = () => goNext(); // 비디오 로드 실패 시 다음 비디오로 이동

    // 인덱스가 바뀔때마다 소스 재로딩 + 자동재생 보장 
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.load(); // 비디오 소스 재로딩
        const playPromise = v.play(); // 비디오 자동재생 시도
        // 일부 브라우저에서 자동재생이 실패할 수 있으므로, 실패 시 다음 비디오로 이동
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
        }
    }, [idx]);
    
    return (
        // 부모 섹션의 높이에 맞추어 화면이꽉 차도록 설정합니다.
        <div className="w-full h-full relative overflow-hidden">
            {/* <video 
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                >
            <source src="../../video/hero_2.mp4" />
            </video> */}
            <video 
                ref = {videoRef}
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded = {goNext}
                onError={handleError}
            >
                <source key= {idx} src={VIDEOS[idx]} type="video/mp4"/>

            </video>

                {/* 가독성을 위한 그라데이션 오버레이 (살짝 어둡게) */}
            <div className="absolute inset-0 z-[1] pointer-events-non bg-gradient-to-b from-black/60 via-black/15 to-transparent">
                
            </div>
            {/* 중앙 문구 */}
            <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center">
                {/* 중앙 기준으로 아래로 10~14vh 정도 내리기  */}
                <div className="translate-y-[12vh] text-center px-6">
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)]">
                    조선의 작품과 만나다. 
                    </h1>
                    <div className="mt-4 text-white/90 text-base sm:text-lg md:text-xl tracking-[0.2em] font-medium">
                        HAMHanokStay
                    </div> 


                </div>
                    
                

            </div>

            
        </div>
    );
}