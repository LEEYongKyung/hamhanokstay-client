import {useState, useEffect, useRef} from "react";

//  페이지 회전 관련 변수 정의 
const FLIP_MS = 900;    // 페이지 회전 시간 (왼쪽/오른쪽 동일하게)
const AUTO_MS = 4000;   // 자동 넘김 간격 (4초)
const clamp = (v, min, max) => Math.min(Math.max(v,min), max);

const ARTIST = {
    name: "이성구",
    portrait: "/images/artisan_section_bg.png",
    eyebrow:"GALLERY HANOK",
    title: "전통 가구의 장인이신 이성구 작가님의 작품과 생활할 수 있는 Gallery Hanok",
    description: "이성구 작가님은 전통 가구의 현대적 재해석을 통해, 전통과 현대가 조화를 이루는 공간을 창조하고 있습니다."
};

const FURNITURE = [
    { src: "/images/Furniture/furniture_1.jpg", title: "사방탁자", material: "오동나무 · 옻칠", desc: "사방에서 사용할 수 있도록 설계된 탁자로, 오동나무의 가벼우면서도 견고한 특성을 살려 제작되었습니다. 전통 옻칠 기법으로 마감하여 자연스러운 광택과 내구성을 겸비하였습니다." },
  { src: "/images/Furniture/furniture_2.jpg", title: "문갑", material: "소나무 · 옻칠", desc: "문서와 귀중품을 보관하던 전통 가구로, 소나무의 직선적인 결이 아름다운 문양을 연출합니다. 정교한 장부 맞춤으로 제작되어 오랜 시간이 지나도 견고함을 유지합니다." },
  { src: "/images/Furniture/furniture_3.jpg", title: "반닫이", material: "밤나무 · 철물", desc: "상부를 들어 올려 여닫는 수납 가구로, 밤나무의 단단함과 아름다운 결을 활용하여 제작되었습니다. 전통 철물 장식이 기능성과 미적 아름다움을 동시에 제공합니다." },
  { src: "/images/Furniture/furniture_4.jpg", title: "책장", material: "소나무 · 전통장부", desc: "장부맞춤으로 제작된 견고한 책장으로, 못 하나 사용하지 않고도 완벽한 결합을 이루어냅니다. 소나무의 자연스러운 향과 결이 책을 보관하기에 최적의 환경을 제공합니다." },
  { src: "/images/Furniture/furniture_5.jpg", title: "경상", material: "느티나무", desc: "다과와 차 도구를 올려두는 낮은 상으로, 느티나무의 우아한 결과 따뜻한 색감이 차를 마시는 시간을 더욱 특별하게 만들어줍니다. 안정적인 구조로 일상 사용에 적합합니다." },
  { src: "/images/Furniture/furniture_6.jpg", title: "장", material: "소나무 · 옻칠", desc: "생활용품을 보관하던 전통 장으로, 소나무의 견고함과 옻칠의 아름다운 마감이 조화를 이룹니다. 넉넉한 수납공간과 실용적인 구조로 현대 생활에서도 유용하게 사용할 수 있습니다." },
];

export default function ArtisanSection() {
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
        const t = setTimeout(() => setOpenedOnce(true), DURATION +20); // 드랜지션 끝난 뒤 
        return () => {cancelAnimationFrame(raf); clearTimeout(t);};
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
        <section id="artisan" ref={sectionRef} className= "relative py-16 lg:py-24 overflow-hidden min-h-screen flex items-center justify-center">
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

            {/* 헤더  */}
            <div className="absolute top-8 left-0 right-0 text-center text-white z-20">
                <span className="inline-block text-xs tracking-[0.3em] uppercase text-white/70">
                    {ARTIST.eyebrow}
                </span>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold drop-shadow-lg">
                    {ARTIST.title}
                </h2>
                <p className="mt-2 text-white/85 drop-shadow">
                    {ARTIST.description}
                </p>
            </div>
            {/* Flipbook 컨테이너 */}
            <div className="relative w-full max-w-4xl mx-auto px-4">
                <div 
                    className={`flipbook-container ${isVisible ? 'visible': ''}`}
                    style= {{
                        width: '700px',
                        height: '500px',
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
                        top: '20px',
                        left: '20px',
                        right: '-20px',
                        bottom: '-20px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '15px',
                        filter: 'blur(20px)',
                        zIndex: -1
                    }}
                   />
                   {/* Flipbook */}
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
                            borderRadius: '15px 5px 5px 15px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            
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
                                <div style={{padding:'40px 30px', width: '100%', textAlign:'center'}}>
                                    <div style={{marginBottom:'24px'}}>
                                        <div 
                                            style={{
                                                fontSize: '11px',
                                                letterSpacing: '0.3em',
                                                textTransform:'uppercase',
                                                color: '#6b7280',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            Traditional Furniture
                                        </div>
                                        <div
                                            style={{
                                                width: '40px',
                                                height: '1px',
                                                background: '#d1d5db',
                                                margin: '0 auto'
                                            }}
                                        />

                                    </div>
                                    <h3
                                        style={{
                                            fontSize: '28px',
                                            fontWeight: 'bold',
                                            color : '#1f2937',
                                            margin: '16px 0'
                                        }}
                                        >
                                        {currentFurniture.title}
                                    </h3>
                                    <div style={{margin: '16px 0'}}>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                padding: '6px 16px',
                                                background: '#f3f4f6',
                                                color: '#4b5563',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                borderRadius: '20px'
                                            }}
                                        >
                                            {currentFurniture.material}
                                        </span>
                                    </div>

                                    <p
                                        style={{
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            color: '#4b5563',
                                            margin: '20px 0'
                                        }}
                                    >
                                      {currentFurniture.desc}  
                                    </p>

                                    <div
                                        style={{
                                            fontSize: '12px',
                                            color: '#9ca3af',
                                            marginTop: '24px'
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
                                padding: 30,
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
                                            width: '220px',
                                            height: '220px',
                                            // border: '3px solid #6b7280',
                                            // borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center ',
                                            justifyContent: 'center',
                                            backgroundColor: '#f9fafb',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div>
                                            {/* <div style={{fontSize: '12px', color: '#9ca3af', marginBottom:'8px'}}>
                                                HAM Logo
                                            </div>
                                            <div style={{ fontSize:'10px', color: "#9ca3af"}}>
                                                이미지 영역
                                            </div> */}
                                            <img 
                                                src="/images/emblem.png"
                                                alt="HAMHanokStay emblem"
                                                style={{ height: "100%"}}
                                            />
                                        </div>
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
                                top: '20px',
                                bottom: '20px',
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
                                    borderRadius: '5px 15px 15px 5px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    backfaceVisibility: 'hidden',
                                    padding: '30px'
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
                                    borderRadius: '5px 15px 15px 5px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    backfaceVisibility: 'hidden',
                                    // 회전 방향에 따라 미러 보정이 달라짐
                                    transform: flipDir === 'next'
                                    ? 'rotateY(180deg) scaleX(-1)'  // → (기존) 다음으로 넘길 때
                                    : 'rotateY(180deg)',            // ← 이전으로 넘길 때
                                    padding: '30px'
                                }}
                            >
                                {/* {brochureOpen && currentPage < FURNITURE.length -1 && (
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
                                        <img
                                            src={FURNITURE[currentPage + 1].src}
                                            alt={FURNITURE[currentPage +1].title}
                                            style={{
                                                maxWidth: '90%',
                                                maxHeight: '90%',
                                                objectFit: 'contain',
                                                borderRadius: '4px'
                                            }}
                                            />
                                    </div>
                                )} */}

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
                                    transform: 'translate(-120%, -50%)', // 반쯤 밖으로 
                                    width: '50px',
                                    height: '50px',
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '50%',
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
                                        btn.style.transform = 'translate(-120%, -50%) scale(1.1)';
                                        btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                                    }
                                }}
                                onMouseLeave={(e)=> {
                                    const btn = e.currentTarget; // 꼭 currentTarget
                                    btn.style.background = 'white';
                                    // btn.style.borderRadius= '50%'
                                    // btn.style.transform = 'translate(-50% -50%) scale(1)';
                                    btn.style.transform = 'translate(-120%, -50%) scale(1)';
                                    btn.style.boxShadow="0 4px 12px rgba(0,0,0, 0.1)";
                                }}
                            >
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ pointerEvents: 'none' }}>
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
                                    transform: 'translate(120%, -50%)', // 오른쪽에도 엣지 기준
                                    width: '50px',
                                    height: '50px',
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '50%',
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
                                        btn.style.transform = 'translate(120%, -50%) scale(1.1)';
                                        btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
                                    }
                                }}
                                onMouseLeave={(e)=> {
                                    const btn = e.currentTarget;
                                    btn.style.background = 'white';
                                    // btn.style.transform = 'translate(50% -50%) scale(1)';
                                    btn.style.transform = 'translate(120%, -50%) scale(1)';
                                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                }}
                                >
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ pointerEvents: 'none' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
                {/* 페이지 인디케이터 */}
                {brochureOpen && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '8px',
                            marginTop: '40px'
                        }}
                    >
                        {FURNITURE.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => !isFlipping && setCurrentPage(index)}
                                disabled={isFlipping}
                                style={{
                                    width: currentPage === index? '24px':'8px',
                                    height: '8px',
                                    borderRadius: currentPage === index? '12px': '50%',
                                    background: currentPage === index?'white': 'rgba(255, 255, 255, 0.5)',
                                    border: 'none',
                                    cursor: isFlipping? 'not-allowed': 'pointer',
                                    transition: 'all 0.3s'
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