import {useState, useEffect, useRef, useMemo} from "react";
import { withBase } from "@/utils/path";
import { useTranslation } from "react-i18next";

// 화면 폭에 따라 모바일 여부 감지
function useIsMobile() {
    const [is, setIs] = useState(false);
    useEffect(() => {
        if(typeof window === "undefined") return;
        const mq = window.matchMedia("(max-width: 640px)"); 
        const onChange = (e) => setIs(e.matches);
        setIs(mq.matches);
        // addEventListener/new +  구형 브라우저 대응
        mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
        return () => mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange);
    }, []);
    return is;
}

//  페이지 회전 관련 변수 정의 
const FLIP_MS = 900;    // 페이지 회전 시간 (왼쪽/오른쪽 동일하게)
const AUTO_MS = 4000;   // 자동 넘김 간격 (4초)
const clamp = (v, min, max) => Math.min(Math.max(v,min), max);

const ARTIST = {
    name: "이성구",
    portrait: withBase("images/artisan_section_bg.png"),
    eyebrow:"GALLERY HANOK",
    title: "전통 가구의 장인이신 이성구 작가님의 작품과 생활할 수 있는 Gallery Hanok",
    description: "이성구 작가님은 전통 가구의 현대적 재해석을 통해, 전통과 현대가 조화를 이루는 공간을 창조하고 있습니다."
};
//  --- FURNITURE 리스트를 i18n에서 로드
const FURNITURE_KEYS = [
    "furniture_1",
    "furniture_2",
    "furniture_3",
    "furniture_4",
    "furniture_5",
    "furniture_6"
]


export default function ArtisanSection() {
    const { t, i18n } = useTranslation(); // 번역
    const FURNITURE = useMemo(() => FURNITURE_KEYS.map((key) => ({
        src:withBase(t(`artisan_section.furniture.${key}.image`)),
        title: t(`artisan_section.furniture.${key}.name`),
        material: t(`artisan_section.furniture.${key}.material`),
        desc: t(`artisan_section.furniture.${key}.description`)

    })),[i18n.language])

    const [isVisible , setIsVisible] = useState(false);
    const [brochureOpen, setBrochureOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isClosed, setIsClosed] = useState(true) ; //  초기 접힌상태 Evan
    const [openedOnce, setOpenedOnce] = useState(false); // 초기 오픈 애니메이션 동작여부 확인 Evan
    const [hasTriggered, setHasTriggered] = useState(false); // 이미 한번 열었는지
    const sectionRef = useRef(null);
    const [flipDir, setFlipDir] = useState('next'); // JSX는 제네릭X
    const [autoDir, setAutoDir] = useState('next') // 자동 진행 방향 : 'next' 또는 'prev'

     const isMobile = useIsMobile();
// Evan
    //  뷰포트 진입 시 1회 트리거 
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || hasTriggered) return;
        const io = new IntersectionObserver (
            ([entry])=> {
                if(entry.isIntersecting) { 
                    setHasTriggered(true);
                    setIsVisible(true); // 살짝 페이드 /스케인 등증 
                    setTimeout(() => setBrochureOpen(true), 300); //0.3s 뒤 오픈 
                    io.disconnect(); // 진입 직후 해제 
                }
            },
            {threshold: 0.45, rootMargin: "0px 0px -10% 0px"}
        );
        io.observe(el);
        return () => io.disconnect();
    }, [hasTriggered]);

// Evan
    // brochureOpen 이 true가 되면, 한 프레임 뒤 왼쪽 페이지를 펴고, 
    // 페이지 회전 트랜지션(0.8s) 종료 시점에 openedOnce = true로 전환 
    useEffect(() => {
        if (!brochureOpen) return ; 
        const raf = requestAnimationFrame(() => setIsClosed(false)); // rotateY(180->0)
        const DURATION = 900; // ms 아래 왼쪽 페이지 transition 시간과 동일하게
        const timer = setTimeout(() => setOpenedOnce(true), DURATION +20); // 드랜지션 끝난 뒤 
        return () => {cancelAnimationFrame(raf); clearTimeout(timer);};
    }, [brochureOpen]);

    //  자동 플립 (왕복)
    useEffect(() => {
        if(!openedOnce) return; // 처음 책이 펼쳐진 이후부터 자동
        const id = setInterval(() => {
            if (isFlipping) return; 
            const last = FURNITURE.length -1; 
            if(autoDir === 'next'){
                if (currentPage < last){
                    nextPage();
                }else {
                    // 끝에 닿으면 방향 전환 후 즉시 한 장 뒤로 
                    setAutoDir('prev');
                    if(currentPage>0) prevPage(); 
                }
            }else { // 'prev'
                if(currentPage>0) {
                    prevPage();
                }else {
                    // 처음 페이지에서 방향 전환 후 즉시 한 장 앞으로 
                    setAutoDir('next');
                    if(currentPage< last) nextPage();
                }

            }
        }, AUTO_MS);
        return () => clearInterval(id);

    }, [openedOnce, autoDir, currentPage, isFlipping]);

    const nextPage = () => {
        if(isFlipping || currentPage >= FURNITURE.length -1) return;
        setFlipDir('next'); // 방향 지정 Evan
        setIsFlipping(true);
        setTimeout(() => {
            setCurrentPage((prev) =>prev + 1);
            setIsFlipping(false);
        }, FLIP_MS);
    };

    const prevPage = () => {
        if(isFlipping || currentPage <= 0) return;
        setFlipDir('prev');
        setIsFlipping(true);
        setTimeout(() => {
            setCurrentPage((prev) => prev-1);
            setIsFlipping(false);
        }, FLIP_MS);
    };



    const currentFurniture = FURNITURE[currentPage] ;

    return(
        <section id="artisan" ref={sectionRef} className= "relative overflow-hidden min-h-[calc(100svh-56px)] sm:min-h-[calc(100svh-64px)] flex items-center justify-center py-8  md:py-12 lg:py-16">
            {/* 배경 이성구 선생 사진 */}
            <div className = "absolute inset-0 -z-10">
                <img 
                    src={ARTIST.portrait}
                    alt={`${ARTIST.name} 선생 사진 배경`}
                    className="absolute inset-0 h-full w-full object-cover "
                />
                <div className = "absolute inset-0 bg-black/50" />
                <div className = "absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"/>
            </div>

            {/* 헤더 : 모바일 타이포/ 여백 축소 + 가독성 향상 */}
            <div className="absolute left-0 right-0 text-center text-white z-20 top-3 sm:top-6 md:top-8 px-4">
                <span className="inline-block text-[10px] sm:text-xs tracking-[0.30em] uppercase text-white/70">
                    {t("artisan_section.header.eyebrow")}
                </span>
                <h2 className="mt-1 sm:mt-2 font-bold drop-shadow-lg text-[clamp(1rem ,4.2vw, 1.5rem)] md:text-3xl lg:text-4xl leading-tight px-2">
                    {t("artisan_section.header.title")}
                </h2>
                <p className="mt-1 sm:mt-2 text-white/85 drop-shadow text-[12px] sm:text-sm md:text-base max-w-[880px] mx-auto px-3">
                    {t("artisan_section.header.description")}
                </p>
            </div>
            {/* Flipbook 컨테이너: 모바일에서 헤더와 겹치지 않게 여백 추가  */}
            <div className="relative w-full max-w-4xl mx-auto px-3 sm:px-4 mt-24 sm:mt-20 md:mt-16">
                <div 
                    className={`flipbook-container ${isVisible ? 'visible': ''}`}
                    style= {{
                        width: "min(90vw, 700px)",
                        height: "calc(min(90vw, 700px)*0.72)",
                        margin: "0 auto",
                        perspective: '2500px',
                        position: 'relative'
                    }}
                >
                {/* 그림자 */}
                <div
                    className= {`book-shadow  ${isVisible ? 'visible' : ''}`}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        right: '-12px',
                        bottom: '-12px',
                        background: 'rgba(0, 0, 0, 0.18)',
                        borderRadius: '12px',
                        filter: 'blur(18px)',
                        zIndex: -1
                    }}
                   />
                   {/* Flipbook 본책*/}
                   <div
                        className={`flipbook ${brochureOpen ? 'opened' : 'closed'}`}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: "100%",
                            transformStyle: 'preserve-3d',
                            transition: 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            // 오픈 전 살짝 비틀림 -> 오픈 후 정면 Evan
                            transform: brochureOpen
                            ? (openedOnce ? 'rotateY(0deg)' : 'rotateY(8deg)')
                            : 'rotateY(0deg)',
                        }}
                   >
                    {/* 왼쪽 고정 페이지  */}
                    <div 
                        className="page page-left"
                        style = {{
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            width: '50%',
                            height: '100%',
                            transformOrigin: "right center",
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px 4px 4px 12px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.10)',
                            
                            // Evan 왼 화살표 버튼 눌렀을 때 , 미리보기 개선을 위한 2차 개선
                            // 초기 오픈때는 isClosed가 true-> 0deg로 펼침 
                            // 이후 '이전(prev)'일 때만 다시 180deg로 회전
                            transform: isClosed || (isFlipping && flipDir === 'prev')
                                ? 'rotateY(180deg)'
                                : 'rotateY(0deg)',
                            // 뒤집히는 동안은 zIndex를 위로 올려서 항상 맨 위에서 보이게 
                            zIndex: !openedOnce || (isFlipping && flipDir == 'prev' ) ? 6:2,
                            pointerEvents: openedOnce ? 'none' : 'auto',
                        }}
                    >
                        {/* 왼쪽 앞면 (오픈 후 텍스트 카드) */}
                        <div
                            style={{
                                padding: '0',
                                height: '100%',
                                display:'flex',
                                alignItems:'center',
                                justifyContent: 'center',
                                backfaceVisibility: 'hidden'
                                
                            }}
                        >
                            {brochureOpen && (
                                // 열린 상태 - 텍스트 내용 
                                <div style={{padding:'24px 16px', width: '100%', textAlign:'center'}}>
                                    {/* 레이블 모바일 숨김 */}
                                    {!isMobile && (
                                        <div style={{marginBottom:'14px'}}>
                                        <div 
                                            style={{
                                                fontSize: '10px',
                                                letterSpacing: '0.3em',
                                                textTransform:'uppercase',
                                                color: '#6b7280',
                                                marginBottom: '6px'
                                            }}
                                        >
                                            Traditional Furniture
                                        </div>
                                        <div
                                            style={{
                                                width: '36px',
                                                height: '1px',
                                                background: '#d1d5db',
                                                margin: '0 auto'
                                            }}
                                        />

                                    </div>

                                    )}
                                    
                                    <h3
                                        style={{
                                            fontSize: isMobile ? '18px' : 'clamp(18px, 4.6vw, 24px)',
                                            fontWeight: '700',
                                            color : '#1f2937',
                                            margin: '10px 0',
                                            lineHeight: 1.25,
                                        }}
                                        >
                                        {currentFurniture.title}
                                    </h3>
                                    <div style={{margin: '10px 0'}}>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                padding: '5px 12px',
                                                background: '#f3f4f6',
                                                color: '#4b5563',
                                                fontSize: isMobile ? '12px' : '13px',
                                                fontWeight: '500',
                                                borderRadius: '16px'
                                            }}
                                        >
                                            {currentFurniture.material}
                                        </span>
                                    </div>

                                    <p
                                        style={{
                                            fontSize: isMobile ? '12px' : '13px',
                                            lineHeight: '1.6',
                                            color: '#4b5563',
                                            margin: '16px 0',
                                            wordBreak:'break-word',
                                            overflowWrap:'anywhere'
                                        }}
                                    >
                                      {currentFurniture.desc}  
                                    </p>

                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: '#9ca3af',
                                            marginTop: '10px'
                                        }}
                                    >
                                        {currentPage +1 }/{FURNITURE.length}

                                    </div>
                                </div>
                            )}

                        </div>
                        {/* 왼쪽 뒷면 (이전 미리보기) */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'white',
                                borderRadius: '15px 5px 5px 15px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                backfaceVisibility:'hidden',
                                transform:'rotateY(180deg) scaleX(-1)', // 좌측 페이지 뒷면 보정 
                                padding: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            

                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: '#f9fafb',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)',
                                    borderRadius: 8 
                                }}
                            >
                                {(!brochureOpen) ? (
                                     //  표지  - HAM 엠블럼 
                                    <div
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            // border: '3px solid #6b7280',
                                            // borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center ',
                                            justifyContent: 'center',
                                            backgroundColor: '#f9fafb',
                                            textAlign: 'center'
                                        }}
                                    >
                                        
                                            {/* <div style={{fontSize: '12px', color: '#9ca3af', marginBottom:'8px'}}>
                                                HAM Logo
                                            </div>
                                            <div style={{ fontSize:'10px', color: "#9ca3af"}}>
                                                이미지 영역
                                            </div> */}
                                            <img 
                                                src={withBase("images/emblem.png")}
                                                alt="HAMHanokStay emblem"
                                                style={{ height: "100%"}}
                                            />
                                        
                                    </div>
                                ): (
                                    // 오픈 이후 : 이전(prev) 미리보기 
                                    (() => {
                                        const previewIndex= Math.max(currentPage-1, 0);
                                        const preview = FURNITURE[previewIndex]
                                        return(
                                            <img 
                                                src={preview.src}
                                                alt={preview.title}
                                                style={{maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: 4}}
                                            />
                                        )
                                    })
                                )()}

                            </div>

                        </div>
                        {/* 중앙 바인딩 라인 */}
                        <div
                            style={{
                                position: 'absolute',
                                right:'-1px',
                                top: '16px',
                                bottom: '16px',
                                width: '2px',
                                background: 'linear-gradient(to bottom, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent) '
                            }}
                            />

                        </div>
                        {/* 오른쪽 페이지 (flipbook 효과)  */}
                        <div
                            className={`page page-right ${isFlipping ? 'flipping': ''}`}
                            style={{
                                position: 'absolute',
                                right: '0',
                                top: '0',
                                width: '50%',
                                height: '100%',
                                transformOrigin: 'left center',
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                // zIndex: isFlipping ? 5:3,
                                // transform: isFlipping 
                                // ? (flipDir === 'next'?'rotateY(-180deg)': 'rotateY(180deg)')
                                // : 'rotateY(0deg)',
                                // Evan 추가 2차 수정 
                                zIndex: isFlipping && flipDir === 'next' ? 5:3,
                                transform: isFlipping && flipDir === 'next'
                                    ? 'rotateY(-180deg)' // 오직 'next' 때만 오른쪽 페이지 회전 
                                    : 'rotateY(0deg)'

                            }}
                        >
                            {/* 페이지 앞면 */}
                            <div
                                className="page-front"
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '4px 12px 12px 4px',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                                    backfaceVisibility: 'hidden',
                                    padding: '20px'
                                }}
                            >
                                {brochureOpen && (
                                    <div 
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: '#f9fafb',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <img 
                                            src={currentFurniture.src}
                                            alt={currentFurniture.title}
                                            style={{
                                                maxWidth: '90%',
                                                maxHeight: "90%",
                                                objectFit: 'contain',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* 페이지 뒷면 (다음 페이지 미리보기) */}
                            <div
                                className="page-back"
                                style={{
                                    position: 'absolute',
                                    width: "100%",
                                    height: '100%',
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '4px 12px 12px 4px',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                                    backfaceVisibility: 'hidden',
                                    // 회전 방향에 따라 미러 보정이 달라짐
                                    transform: flipDir === 'next'
                                    ? 'rotateY(180deg) scaleX(-1)'  // → (기존) 다음으로 넘길 때
                                    : 'rotateY(180deg)',            // ← 이전으로 넘길 때
                                    padding: '20px'
                                }}
                            >
                                {brochureOpen &&  (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            background: '#f9fafb',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems:'center',
                                            justifyContent: 'center',
                                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {(() => {
                                            const len = FURNITURE.length; 
                                            const previewIndex = flipDir === 'next'
                                                ? Math.min(currentPage +1, len -1)
                                                : Math.max(currentPage -1 , 0 );
                                            const preview = FURNITURE[previewIndex];
                                            return(
                                                <img 
                                                    src={preview.src}
                                                    alt={preview.title}
                                                    style={{maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: 4}}
                                                />
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* 네비게이션 버튼  */}
                    {brochureOpen && (
                        <>
                            <button
                                onClick={prevPage}
                                disabled= {isFlipping || currentPage === 0}
                                style={{
                                    position: 'absolute',
                                    left: 0, //고정 값 대신 엣지로 붙이고
                                    top : '50%',
                                    transform: isMobile ? 'translate(-50%, -50%)' : 'translate(-90%, -50%)', 
                                    width: isMobile ? '40px' : '46px',
                                    height: isMobile ? '40px' : '46px',
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent:'center',
                                    cursor: currentPage === 0 || isFlipping ? 'not-allowed': 'pointer',
                                    transition: 'all 0.2s',
                                    color: '#4b5563',
                                    zIndex: 10,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    opacity: currentPage === 0 || isFlipping ? 0.4: 1


                                }}
                                onMouseEnter={(e)=> {
                                    if (currentPage > 0 && !isFlipping) {
                                        const btn = e.currentTarget; // 꼭 currentTarget
                                        btn.style.background = '#f3f4f6';
                                        // btn.style.transform = 'translate(-50% -50%) scale(1.1)';
                                        btn.style.transform =  isMobile ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-90%, -50%) scale(1.1)';
                                        btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                                    }
                                }}
                                onMouseLeave={(e)=> {
                                    const btn = e.currentTarget; // 꼭 currentTarget
                                    btn.style.background = 'white';
                                    // btn.style.borderRadius= '50%'
                                    // btn.style.transform = 'translate(-50% -50%) scale(1)';
                                    btn.style.transform = isMobile ? 'translate(-50%, -50%) scale(1)' : 'translate(-90%, -50%) scale(1)';
                                    btn.style.boxShadow="0 4px 12px rgba(0,0,0, 0.10)";
                                }}
                            >
                                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ pointerEvents: 'none' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={nextPage}
                                disabled = {isFlipping || currentPage === FURNITURE.length -1}
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top : '50%',
                                    transform: isMobile ? 'translate(50%, -50%)' : 'translate(90%, -50%)',
                                    width: isMobile ? '40px' : '46px',
                                    height: isMobile ? '40px' : '46px',
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: currentPage === FURNITURE.length-1 || isFlipping ? 'not-allowed' : 'pointer',
                                    transition: 'transform .2s, box-shadow .2s, background .2s',
                                    color : '#4b5563',
                                    zIndex: 10,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    opacity: currentPage === FURNITURE.length -1 || isFlipping ? 0.4: 1,
                                    willChange: 'transform'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage < FURNITURE.length -1 && !isFlipping) {
                                        const btn = e.currentTarget;
                                        btn.style.background = '#f3f4f6';
                                        // btn.style.transform = 'translate(50% -50%) scale(1.1)';
                                        btn.style.transform = isMobile ? 'translate(50%, -50%) scale(1.1)' : 'translate(90%, -50%) scale(1.1)';
                                        btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                                    }
                                }}
                                onMouseLeave={(e)=> {
                                    const btn = e.currentTarget;
                                    btn.style.background = 'white';
                                    // btn.style.transform = 'translate(50% -50%) scale(1)';
                                    btn.style.transform = isMobile ? 'translate(50%, -50%) scale(1)' : 'translate(90%, -50%) scale(1)';
                                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                }}
                                >
                                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ pointerEvents: 'none' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
                {/* 페이지 인디케이터 */}
                {brochureOpen && (
                    <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                        {FURNITURE.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => !isFlipping && setCurrentPage(index)}
                                disabled={isFlipping}
                                style={{
                                    width: currentPage === index? '22px':'8px',
                                    height: '8px',
                                    borderRadius: currentPage === index? '9999px': '9999%',
                                    background: currentPage === index?'white': 'rgba(255, 255, 255, 0.55)',
                                    border: 'none',
                                    cursor: isFlipping? 'not-allowed': 'pointer',
                                    transition: 'all 0.25s'
                                }}
                                onMouseEnter={(e) => {
                                    if (index !== currentPage && !isFlipping) {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.7)';
                                    }
                                    }}
                                    onMouseLeave={(e) => {
                                    if (index !== currentPage) {
                                        e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                                    }
                                    }}
                            />
                        ))}

                    </div>

                )}

            </div>
        </section>
    )
}