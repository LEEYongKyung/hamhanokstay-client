
import React, {useState, useMemo, useRef, useEffect} from "react";
import { FaChevronLeft, FaChevronRight , FaStar, FaMapPin, FaUser, FaCalendar, FaImage, FaLandmark, FaMedal } from "react-icons/fa";
import { FaAirbnb } from "react-icons/fa";
import {FaX } from "react-icons/fa6";
import {BsTrainFront, BsDoorOpen} from "react-icons/bs"
import { CiCircleAlert, CiRollingSuitcase } from "react-icons/ci";
import { SiNaver } from "react-icons/si";
import { TbBrandBooking } from "react-icons/tb";

// Amenity 아이콘 리스트
import { FaWifi as WifiIcon, FaTv as TvIcon ,FaCar as CarIcon,FaBriefcase as CarrierIcon ,FaShower as ShowerIcon } from "react-icons/fa";
import { FaRegSnowflake as AirconIcon } from "react-icons/fa6";
import { LuToilet as ToiletIcon ,LuCctv as CctvIcon, LuMicrowave as MicrowaveIcon,LuRefrigerator as RefrigeratorIcon, LuAlarmSmoke as SmokeAlarmIcon ,LuCoffee as CoffeeIcon, LuDoorOpen as CheckInIcon, LuTreePine as TreeIcon, LuCalendarFold as CalendarIcon, LuKeyRound as KeyIcon, LuCookingPot as CookingIcon} from "react-icons/lu";
import { PiHairDryerLight as HairDryerIcon, PiHandSoapThin as SoapIcon, PiTowel as TowelIcon, PiCoatHangerThin as HangerIcon, PiForkKnife as ForkKnifeIcon, PiThermometerHotLight as HotWaterIcon ,PiFireExtinguisher as FireExtinguisherIcon, PiFirstAidKit as FirstAidKitIcon} from "react-icons/pi";
import { CiSpeaker as SpeakerIcon } from "react-icons/ci";
import { MdOutlineCoffeeMaker as CoffeeMakerIcon, MdOutlineYard as YardIcon } from "react-icons/md";
import { GiWineGlass as WineGlassIcon, GiDoorHandle as DoorlockIcon } from "react-icons/gi";
import { TbDeviceTvOff as TvOffIcon } from "react-icons/tb";
import RangeCalendarPopover from "./RangeCalendarPopover";
import { withBase } from "@/utils/path";
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

const HEADER = {
    eyebrow : "STAY HANOK",
    title: "조선시대 전통가구가 살아 숨 쉬는 한옥공간 함한옥스테이",
    description: "HAMHanokStay"

}

export default function HamStaySection({
    // props 섹션
    images =[
        withBase("images/HamStay/ham_1.png"),
        withBase("images/HamStay/ham_2.jpg"),
        withBase("images/HamStay/ham_3.jpg"),
        withBase("images/HamStay/ham_4.jpg"),
        withBase("images/HamStay/ham_5.jpg"),
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
    description = 
    `※ 숙박업 등록된 합법적인 숙소입니다
        (가구와 소품의 위치나 디자인은 조금씩 변동이 있을 수 있습니다. )

        ※ 정확한 인원수로 예약해주세요. 기본 숙박비는 최대 2인 기준이며 3인까지 숙박가능, 3인부터는 추가금 반영됩니다.

        ※ 지내시는 동안 게스트님만 사용가능한 현관 도어락 비밀번호라 안전합니다.

        ※ 재실 청소는 비용 발생

        ꔷ 해운대의 명소 미포 해변 열차(도보 이동)로 청사포,송정 기차여행

        ꔷ 구남로, 아쿠아리움, 더베이101, 동백섬, 해운대 온천, 달맞이 고개, 해운대 재래시장 도보로 가능

        ꔷ 클럽디 오아시스 워터파크 & 스파 35% 할인, 아쿠아리움 할인, 요트 투어 할인 쿠폰 제공

        ꔷ 1분 내에 해운대 해변 이동 가능 (길건너)

        ꔷ 24시간 무료 러기지보관 (체크아웃후에도 이용가능)

        ꔷ 무료 주차공간, 넷플릭스, 와이파이 가능

        ꔷ 휘트니스센터와 골프연습장 무료 이용

        ꔷ 해운대 지하철역, 시외버스터미널, 시내버스정류장과도 도보로 가까운 거리
        숙소
        ※ 퀸침대 1개, 싱글침대 1개, 철저한 시트교체

        ※ 주방이 포함된 넓은 공간의 싱글룸

        ※ 충분한 식기와 주방용품, 전자레인지, 정수기, 냉동/냉장고

        ※ 주방에 조리기구가 준비되어 있어 간단조리 가능

        ※ 숙소 내 세탁기가 있어 세탁 및 건조 가능

        ※ CUCKOO 정수기 있으므로 물 구매 안하셔도 됩니다

        ※ 수건 샴푸 린스 바디클렌저 핸드워시

        ※ 무료 와이파이

        ※ 넷플릭스,유튜브 시청 가능
        게스트 이용 가능 공간/시설
        ※ 무료 주차 (B1 ~ B7)

        ※ 휘트니스룸(A동3층), 골프연습장(A동5층)은 출입카드로 무료로 이용 가능

        ※ 1층 라운지 대기 공간

        ※ 빌딩내에 무료 짐보관 공간 (예약 후 안내)
        기타 주의사항
        ※ 원하시는 날짜에 예약이 불가할 때는 제 계정의 프로필을 통해 다른 숙소를 보실 수 있습니다.

        ※ 숙소의 정확한 위치는 앱의 지도와 약간의 차이가 있을 수 있고 저희 숙소는 파라다이스호텔 가까이에 위치합니다.

        ※ 체크인 매뉴얼은 체크인 하루 전 날 보내드립니다.

        ※ 예약 일정 변경은 체크인 10일 전까지 가능하며
        변경 시점으로부터 30일 이내의 기간으로 1회 가능합니다.

        ※ 미성년자는 보호자 동의서를 작성해 주셔야 숙박 가능합니다. 제출 안하실 경우 과태료를 물 수 있습니다.

        ※ 주차는 1대까지 무료로 하실 수 있고 미리 "차량 번호" 전체를 알려주세요. 그렇지 않으면 주차료가 부과됩니다.(추가차량 1박 10,000원)

        ※ 시설물과 비품은 소중히 다루어 주시고 체크아웃 전에 설거지 및 정리정돈 부탁드립니다 :)

        주의 : 숙소 내 흡연 금지 (과태료 10만원)
        등록 세부 정보
        발급 지역: 부산광역시, 해운대구
        허가 유형: 일반숙박업
        허가번호: 제 2022-00005 호`,
        shareCalendars = [
            "/booking/v1/export?t=2b9c85f1-2ce8-4686-b829-2ecfde2044cb",
            "/airbnb/calendar/ical/1141509028517381236.ics?s=4ff6139029b739ac857b7faa0e522542",
            "/agoda/en-us/api/ari/icalendar?key=Mq%2f3dKl3aQT1CaFASpd7juPktu8s1wp%2f",
        ],


}){
    //예시 이미지 (없으면 Unplash 프리뷰 사용)
    //  ===================== 갤러리 영역 변수 및 함수  ========================================
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

        const openGallery = (idx = 0) => {setGalleryIndex(idx); setGalleryOpen(true);};
        const closeGallery = () => setGalleryOpen(false);
        const prev = () => setGalleryIndex((i) => (i -1 + fallback.length) % fallback.length);
        const next = () => setGalleryIndex((i) => (i +1) % fallback.length);

        //  ===================== 예약카드 영역 변수 및 함수  ========================================
        const [checkIn, setCheckIn] = useState("");
        const [checkOut, setCheckOut] = useState("");
        const [guests, setGuests] = useState(1);
        const [calOpen, setCalOpen] = useState(false); // 달력 모달 
        const reserve = () => {
            const payload = {checkIn, checkOut, guests};
            if (onReserve) onReserve(payload);
            else alert(`예약 확인: ${JSON.stringify(payload, null, 2)}`);
        };
        const checkinBtnRef = useRef(null);
        const checkoutBtnRef = useRef(null);

        const [openWhich, setOpenWhich] = useState(null);
        // const [checkIn, setCheckIn] = useState(null);
        // const [checkOut, setCheckOut] = useState(null);

        // ReserveSection에서 만든 Set<number> 그대로 재사용 (UTC 지정 ) 
        const disabledSet = React.useMemo(() => new Set(), []); /* 예약불가 날짜 Set<number> */

        const handleChange = (s, e) => {
            setCheckIn(s);
            setCheckOut(e);
            // 둘 다 선택되면 자동 닫기
            if (s && e) setOpenWhich(null);
        };

        //  ===================== 하단 정보 영역 변수 및 함수  ========================================

        const features = [
            {icon: FaLandmark, label:"상징적 도시"},
            {icon: BsTrainFront, label:"안국역 근처"},
            {icon: FaMedal, label:"슈퍼 호스트"},
            {icon: BsDoorOpen, label:"셀프 체크인"},
            {icon: CiRollingSuitcase, label:"짐 맡기기 가능"},
        ]

        const descRef = React.useRef(null);
        const [isOverflow, setIsOverflow] =  useState(false); // 3줄 초과 여부
        const [showAll, setShowAll] = useState(false); // 모두 보기

        useEffect(() => {
            const el =descRef.current;
            if (!el) return;
            // 랜더 후 실제로 3줄을 넘는지 측정 
            const overflow = el.scrollHeight - 1 > el.clientHeight;
            setIsOverflow(overflow);
            
        }, [description])


        // ==================== 애니메이션 추가 =====================
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
            const runSpark = () => { setSpark(true); setTimeout(() => setSpark(false), 1200); };
            const runShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

            // const runShake = () => {
            //     setShake(true) ; // 예약 카드 좌우로 흔들
            //     setTimeout(()=> setShake(false), 600) ; // 쉐이크 종료
            // };

            runSpark();
            runShake();
            const idSpark = setInterval(runSpark, 3000);
            const idShake = setInterval(runShake, 6000);
            return () => { clearInterval(idSpark); clearInterval(idShake); }; // ← 이렇게
        }, [inView])


        //  ===================== 어메니티 상태  ========================================
        // 편의시설 데이터 상태
        const [amenity, setAmenity] = useState(null);
        const [amenityOpen, setAmenityOpen] = useState(false);

        // 아이콘 매핑(없으면 CircleAlert로 대체
        const AmenityIcon = ({ id, className="h-5 w-5 "}) => {

            const map ={
            kitchen: ForkKnifeIcon,
            wifi: WifiIcon,
            airConditioning:AirconIcon,
            carrier: CiRollingSuitcase,
            refrigerator: RefrigeratorIcon,
            speaker: SpeakerIcon,
            yard: YardIcon,
            hairDryer: HairDryerIcon,
            microwaveMachine: MicrowaveIcon,
            cctv: CctvIcon,
            shampoo: SoapIcon,
            conditioner: SoapIcon,
            showerGel: SoapIcon,
            towel: TowelIcon,
            hanger:HangerIcon,
            boiler: HotWaterIcon,
            smokeAlarm: SmokeAlarmIcon,
            fireExtinguisher: FireExtinguisherIcon,
            firstAidKit: FirstAidKitIcon,
            coffeeMaker: CoffeeMakerIcon,
            wineGlass: WineGlassIcon,
            coffee: CoffeeIcon,
            calendar: CalendarIcon,
            selfCheckIn: KeyIcon,
            smartDoorLock: DoorlockIcon,
            cooking:CookingIcon
        };
        const Icon = map[id] || CiCircleAlert;
        return <Icon className={className} />
        };


        // JSON 불러오기
        useEffect(() => {
            let alive = true;
            fetch(withBase("docs/amenity.json"))
                .then(r => r.json())
                .then(data => {if (alive) setAmenity(data);})
                .catch(() => {
                    // 실패 시 간단한 디폴트 
                    if(alive) setAmenity({
                        highlights: ["kitchen", "wifi", "airConditioning","yard", "carrier", "hairDryer", "refrigerator","microwaveMachine", "speaker", "cctv"],
                        categories: [{title:"기본", items: [
                            {id:"kitchen", label: "주방" },
                            {id:"wifi", label: "와이파이" },
                            {id:"airConditioning", label: "에어컨" },
                            {id:"중정(앞마당)", label: "yard" },
                            {id:"carrier", label: "여행 가방 보관 가능" },
                            {id:"hairDryer", label: "헤어드라이어" },
                            {id:"refrigerator", label: "냉장고" },
                            {id:"microwaveMachine", label: "전자레인지" },
                            {id:"speaker", label: "블루투스 스피커" },
                            {id:"cctv", label: "숙소 내 실외 보안 카메라" }
                        ]}]
                    });
                });
                return () => {alive = false;};
        }, []);

        // id -> 라벨 찾기 유틸 
        const findLabel = (id) => {
            if (!amenity) return id; 
            for (const cat of amenity.categories) {
                const f = cat.items.find(it => it.id === id);
                if (f) return f.label;
            }
            return id;
        };

        // 총 아이템 수 
        const amenityCount = useMemo(() => {
            if (!amenity) return 0;
            return amenity.categories.reduce((sum,c) => sum + c.items.length, 0);

        }, [amenity]);

        // 그리드용 하이라이트 10개 
        const highlight10 = useMemo(() => {
            if(!amenity) return [];
            const list = amenity.highlights || [];
            // 10개 미만이면 카테고리에서 채워 넣기 
            const pool = new Set(list);
            for (const c of amenity.categories) {
                for (const it of c.items){
                    if (pool.size>=10) break;
                    pool.add(it.id);
                }
                if (pool.size >=10) break;
            }
            return Array.from(pool).slice(0,10);
        }, [amenity]);


        const smDown = useSmDown();

        const highlightsToShow = useMemo(() => {
            return smDown ? highlight10.slice(0, 6) : highlight10;
        }, [highlight10, smDown]);

        
    return (
        <section id="ham-hanok-stay" ref={sectionRef} className=" relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 md:pt-8 md:pb-16 lg:pb-24 ">
            {/* 헤더 모바일에서는 흐름 위에 표시 md 부터 절대배치 */}
            <div className="md:absolute  sm:top-6 md:top-8 left-0 right-0 text-center text-main z-20 px-2">
                <span className="inline-block text-[10px] sm:text-xs tracking-[0.3em] uppercase text-main/70">
                    {HEADER.eyebrow}
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl leading-tight font-bold drop-shadow-lg">
                    {HEADER.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm  text-main/85 drop-shadow">
                    {HEADER.description}
                </p>
            </div>
            {/* 사진 grid: 헤더 바로 아래 전체 폭  모바일에선 헤더 높이만큼 간격을 줄이고, md는 기존 여백 유지 */}
            <div className="relative mt-3 md:mt-20 rounded-2xl overflow-hidden">
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
                    className="flex items-center gap-2 absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-main font-semibold shadow hover:bg-white rounded-xl"
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
                    <div className="mt-4 flex items-center gap-3 text-xs sm:text-sm flex-nowrap overflow-x-auto no-scrollbar">
                        {ratings?.airbnb && (
                            <a 
                                href={reservationUrls.airbnb} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={spark ? {animation: "hamFlash 900ms ease-out both",  animationDelay: "0ms",willChange:"filter, transform"}:{}}
                                className="flex items-center gap-1.5 text-[#FF385C] hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
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
                                className="flex items-center gap-1.5 text-[#013B94] hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
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
                                className="flex items-center gap-1.5 text-green-400 hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
                                <SiNaver className="h-4 w-4 fill-green-400" />
                                <b>Naver</b> &nbsp;{ratings.naver.toFixed(2)}
                            </a>
                        )}
                    </div>
                    {/* 실선 */}
                    <hr className="my-6 border-neutral-200"></hr>

                    {/* 숙소의 특징 icon grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-6">
                        {features.map(({icon:Icon, label},i)=> (
                            <div key={i} className="flex items-center gap-4">
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5 fill-main"/>
                                <span className="text-[13px] sm:text-sm text-main">{label}</span>
                            </div>
                        ))}
                    </div>
                    {/* 실선 */}
                    <hr className="my-6 border-neutral-200"></hr>
                    {/* 숙소 설명  더보기 추가*/}
                    {/* <p className="text-neutral-700 leading-relaxed">{description}</p> */}
                    <div className="relative">
                        <p 
                            className="text-neutral-700 leading-relaxed pr-8 text-[13px] sm:text-sm" 
                            ref={descRef}
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3, 
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                
                            }}
                            >
                                {description}
                        </p>
                        {/* '...' 시각적 표시 (multi-line ellipsis 대체) */}
                        {/* {isOverflow && (
                            <span className="pointer-event-none absolute bottom-0 right-10 bg-white/90 px-1 text-main">
                                ...
                            </span>
                        )} */}
                        {/* 더보기 버튼 */}
                        {isOverflow && (
                            
                            <button
                                onClick={() => setShowAll(true)}
                                className=" mt-2 inline-flex items-center gap-1 rounded-lg border px-5 py-3 text-[13px] sm:text-sm font-bold bg-neutral-100 hover:bg-white"
                                aria-haspopup= "dialog"
                            >
                                더보기
                            </button>
                            )

                        }
                        

                    </div>
                </div>

                {/* 우측 예약 카드 : 하단 정보 옆으로 배치  */}
                <aside className="lg:col-span-4">
                    <div 
                        className="rounded-2xl border border-neutral-200 bg-white/90 shadow-2xl p-5 lg:sticky lg:top-4"
                        style={shake? {animation:"hamShake 550ms ease-in-out both"}:{}}>
                        <h3 className="w-full text-center text-base sm:text-lg font-semibold mb-4 text-main">날짜를 선택해 요금확인</h3>
                        <div className="space-y-3 ">
                            
                            {/*  달력 모듈 변경 */}
                            <div className="relative">
                                <span className="text-xs font-semibold text-main mb-1 block">날짜</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        ref={checkinBtnRef}
                                        onClick={() => setOpenWhich((v) => (v === "in" ? null : "in"))}
                                        className="w-full rounded-lg border px-3 py-2 text-left hover:bg-neutral-50 text-[13px] sm:text-sm"
                                    >
                                        {checkIn ? checkIn.replaceAll("-", ". ") : "연도. 월. 일."}

                                    </button>
                                    
                                     {/* 체크아웃 버튼 */}
                                    <button
                                        ref={checkoutBtnRef}
                                        onClick={() => setOpenWhich((v) => (v === "out" ? null : "out"))}
                                        className="w-full rounded-lg border px-3 py-2 text-left hover:bg-neutral-50 text-[13px] sm:text-sm"
                                    >
                                        {checkOut ? checkOut.replaceAll("-", ". ") : "연도. 월. 일."}
                                    </button>
                                </div>

                               
                                
                                    {/* 2개월 달력 팝오버 (좌측으로 펼침) */}
                                    <RangeCalendarPopover
                                    open={openWhich === "in" || openWhich === "out"}
                                    anchorRef={openWhich === "in" ? checkinBtnRef : checkoutBtnRef}
                                    onClose={() => setOpenWhich(null)}
                                    startISO={checkIn}
                                    endISO={checkOut}
                                    onChange={handleChange}
                                    disabledSet={undefined}          // 외부 세트 없으면 생략 가능
                                    shareCalendars={shareCalendars}  // ← ReserveSection과 동일 ics 적용
                                    theme="#402a1c"
                                    placement="over"
                                    />


                                </div>

                            
                            <label className="flex flex-col" >
                                <span className="text-xs font-semibold text-main mb-1">인원</span>
                                <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
                                    <FaUser className="h-4 w-4 fill-main" />
                                    <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full outline-none bg-transparent text-main text-[13px] sm:text-sm">
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
            {/* 실선 */}
            <hr className="my-6 border-neutral-200"></hr>
            {/* 어메니티 부분 */}
            <div >
                <h4 className="mb-3 text-base font-semibold text-main">숙소 편의시설</h4>
                {/* 5행 x 2열 하이라이트 */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-2 sm:gap-y-5 sm:gap-x-8">
                    {highlightsToShow.map((id) => (
                        <div key={id} className="flex items-center gap-3">
                            <AmenityIcon id={id} className="h-4 w-4 text-main"/>
                            <span className="text-[13px] sm:text-sm text-main">{findLabel(id)}</span>
                        </div>
                    ))}
                </div>
                {/*  모두 보기 버튼 */}
                <button 
                    onClick={() => setAmenityOpen(true)}
                    className="mt-3 inline-flex items-center gap-1 text-[13px] sm:text-sm rounded-lg border px-5 py-3 text-sm font-bold bg-neutral-100 hover:bg-white text-main"
                    disabled={!amenity}
                >
                    편의시설 {amenityCount}개 모두 보기
                </button>
                
            </div>

            {/* 실선 */}
            <hr className="my-6 border-neutral-200"></hr>
            {/* Google Map 부분 */}
            <div>
                <h4 className="mb-3 text-main font-semibold">
                    위치
                </h4>
                <div className="rounded-2xl overflow-hidden border">
                    <iframe
                        title="HAMHanokStay 위치" 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12647.848507599096!2d126.97124657265996!3d37.579509502561045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3122ec6638b%3A0xb7f4eb8415ae0c45!2z7ZWoIO2VnOyYpSDsiqTthYzsnbQgfCBIQU0gaGFub2sgc3RheQ!5e0!3m2!1sko!2skr!4v1753243671664!5m2!1sko!2skr" 
                        width="100%"
                        height="360"
                        style={{border:0}}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade" 
                         />
                </div>

                
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

            {/* description 모달 추가 */}
            {showAll && (
                <div
                    className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4"
                    role = "dialog"
                    aira-modal = "true"
                >
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h4 className="text-lg font-semibold"> 숙소 소개</h4>
                            {/* <button
                                onClick={() => setShowAll(false)}
                                className="rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-50"
                                aria-label="닫기"
                            >
                                닫기
                            </button> */}
                        </div>
                        <div className="p-5 max-h-[70vh] overflow-auto whitespace-pre-line text-neutral-700 leading-relaxed">
                            {description}
                        </div>
                        <div className="px-5 py-4 border-t flex justify-end">
                            <button
                                onClick={() => setShowAll(false)}
                                className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm"
                                >
                                확인
                            </button>
                        </div>
                    </div>

                </div>
                )}

            {/* 편의시설 전체 보기 모달 */}
            {amenityOpen && amenity &&(
                <div className="fixed inset-0 z-[120] bg-black/40 flex items-start justify-center justify-center p-4">
                    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* 헤더 */}
                        <div className="flex items-center justify-between px-5 py-4 border-b">
                            <h4 className="text-lg font-semibold text-main">숙소 편의시설</h4>
                            {/* <button
                                onClick={() => setAmenityOpen(false)}
                                className="rounded-full border h-8 w-8 flex items-center justify-center hover:bg-neutral-50"
                                aria-label="닫기"
                            >
                                <FaX />
                            </button> */}
                            
                        </div>
                        {/* 컨텐츠 */}
                        <div className="max-h-[70vh] overflow-auto">
                            {amenity.categories.map((cat, idx) => (
                                <div key={cat.title} className={idx ? "border-t px-5 py-4": "px-5 py-4 "}>
                                    <div className="text-[15px] font-semibold mb-3 text-main">{cat.title} </div>
                                        <ul className="divide-y">
                                            {cat.items.map((it) => (
                                                <li key={it.id} className="flex items-center gap-3 py-2">
                                                    <AmenityIcon id={it.id} className="h-5 w-5 text-main" />
                                                    <span className="text-[15px] text-main">{it.label}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    
                                </div>
                            ))}
                        </div>

                        {/* 푸터 */}
                        <div className="px-5 py-4 border-t flex justify-end">
                            <button
                                onClick={() => setAmenityOpen(false)}
                                className="rounded-mb bg-neutral-900 text-white px-4 py-2 text-sm"
                            >
                                닫기                                
                            </button>
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
                0% 100% {transform: translateX(0); translateY(0);}
                15% {transform: translateX(-4px) translateY(-4px);}
                30% {transform: translateX(4px) translateY(4px);}
                45% {transform: translateX(-3px) translateY(-3px);}
                60% {transform: translateX(3px) translateY(3px);}
                75% {transform: translateX(-2px) translateY(-2px);}
                90% {transform: translateX(2px) translateY(2px);}
                
            }    
            `}
            
        </style>
        </section>
       
        
    );
};

// ==================== 캘린더 선택 헬퍼 =====================
// ===== Date helpers =====
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fromISO = (s) => (s ? new Date(`${s}T00:00:00`) : null);
const isSameDay = (a,b) => a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
const isBefore  = (a,b) => a && b && a.getTime() < b.getTime();
const addMonths = (d, m) => new Date(d.getFullYear(), d.getMonth()+m, 1);
const diffDays  = (a,b) => Math.round((b - a) / 86400000);
const fmtK = (iso) => {
  if (!iso) return "";
  const d = fromISO(iso);
  return `${d.getFullYear()}. ${d.getMonth()+1}. ${d.getDate()}.`;
};

const makeCells = (y,m) => {
  const first = new Date(y,m,1);
  const offset = first.getDay();
  const days = new Date(y, m+1, 0).getDate();
  const cells = [];
  for (let i=0;i<42;i++){
    const day = i - offset + 1;
    cells.push(day>=1 && day<=days ? new Date(y,m,day) : null);
  }
  return cells;
};

// 오늘 00:00:00 (이전 날짜 차단용)
const todayStart = new Date(); todayStart.setHours(0,0,0,0);
const todayISO   = toISO(todayStart);

// 모바일 분기(hook)
function useSmDown() {
  const [sm, setSm] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(max-width: 639.98px)");
    const on = () => setSm(m.matches);
    on();
    if (m.addEventListener) m.addEventListener("change", on);
    else m.addListener(on);
    return () => {
      if (m.removeEventListener) m.removeEventListener("change", on);
      else m.removeListener(on);
    };
  }, []);
  return sm;
}

// 간단 ICS 파서 (DTSTART/DTEND YYYYMMDD)
function parseIcsDates(text) {
  const disabled = new Set();
  if (!text) return disabled;
  const lines = text.split(/\r?\n/);
  let s=null, e=null;
  for (const ln of lines) {
    const mS = ln.match(/DTSTART[^:]*:(\d{8})/);
    const mE = ln.match(/DTEND[^:]*:(\d{8})/);
    if (mS) s = mS[1];
    if (mE) e = mE[1];
    if (ln.startsWith("END:VEVENT") && s) {
      const yy = (v)=>+v.slice(0,4), mm=(v)=>+v.slice(4,6)-1, dd=(v)=>+v.slice(6,8);
      const ds = new Date(yy(s),mm(s),dd(s));
      const de = e? new Date(yy(e),mm(e),dd(e)) : new Date(yy(s),mm(s),dd(s));
      for (let d=new Date(ds); d<de; d.setDate(d.getDate()+1)) disabled.add(toISO(d));
      s=e=null;
    }
  }
  return disabled;
}

// 브랜딩 컬러
const BRAND = "#402a1c";
const BRAND_DARK = "#2f1e14";
const RANGE_BG = "rgba(64,42,28,.08)";
const RING = "rgba(64,42,28,.35)";
// ===== Range Calendar (2 months, Airbnb 스타일) =====

// ===== Range Calendar (데스크탑 2개월 / 모바일 1개월) =====
function RangeCalendar({
  open, onClose,
  startISO, endISO,
  onChange,            // (startISO, endISO)
  shareCalendars = [], // 예약 불가일 소스
}) {
  const smDown = useSmDown();
  const months = smDown ? 1 : 2;

  const boxRef = React.useRef(null);
  const start = fromISO(startISO);
  const end   = fromISO(endISO);

  const [view, setView] = React.useState(
    () => new Date((start||todayStart).getFullYear(), (start||todayStart).getMonth(), 1)
  );
  const [s, setS] = React.useState(start);
  const [e, setE] = React.useState(end);

  // 공유 캘린더 비활성일
  const [disabledDates, setDisabledDates] = React.useState(new Set());
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const sets = await Promise.all(
          (shareCalendars||[]).map(async (url) => {
            try {
              const r = await fetch(url, {mode:"cors"});
              const t = await r.text();
              return parseIcsDates(t);
            } catch { return new Set(); }
          })
        );
        if (!alive) return;
        const merged = new Set();
        sets.forEach(s => s.forEach(d => merged.add(d)));
        setDisabledDates(merged);
      } catch {/* noop */}
    })();
    return () => { alive = false; };
  }, [shareCalendars]);

  React.useEffect(()=>{ setS(start); setE(end); }, [startISO, endISO]);

  // 외부 클릭 닫기
  React.useEffect(()=>{
    if (!open) return;
    const fn = (ev) => { if (boxRef.current && !boxRef.current.contains(ev.target)) onClose?.(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open, onClose]);

  const pick = (d) => {
    const iso = toISO(d);
    // 과거/불가일 차단
    if (iso < todayISO || disabledDates.has(iso)) return;
    if (!s || (s && e)) {
      setS(d); setE(null);
    } else {
      if (!d || isBefore(d, s) || isSameDay(d, s)) { setS(d); setE(null); return; }
      setE(d);
      onChange?.(toISO(s), toISO(d));
      onClose?.();
    }
  };

  const Month = ({ base }) => {
    const cells = makeCells(base.getFullYear(), base.getMonth());
    return (
      <div className="w-[320px]">
        <div className="text-center font-semibold mb-3" style={{color: BRAND}}>
          {base.getFullYear()}년 {base.getMonth()+1}월
        </div>

        <div className="grid grid-cols-7 text-center text-xs mb-1" style={{color: BRAND, opacity:.65}}>
          {["일","월","화","수","목","금","토"].map(w=><div key={w} className="py-1">{w}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((d,i)=>{
            const empty = !d;
            const iso   = d ? toISO(d) : "";
            const blocked = d && (iso < todayISO || disabledDates.has(iso));
            const isStart = d && s && isSameDay(d,s);
            const isEnd   = d && e && isSameDay(d,e);
            const inRange = d && s && e &&
              (isBefore(s,d) || isSameDay(s,d)) &&
              (isBefore(d,e) || isSameDay(e,d));

            const style = {};
            let cls =
              "relative h-10 rounded-md text-sm transition " +
              (empty ? "opacity-0 pointer-events-none " : "hover:bg-neutral-50 ");

            if (blocked) { cls += "text-neutral-400 cursor-not-allowed "; }
            else { cls += "text-[color:var(--ham-date,#111)] "; }

            if (inRange) style.background = RANGE_BG;
            if (isStart || isEnd) { style.background = BRAND; style.color = "#fff"; }

            return (
              <button
                key={i}
                disabled={empty || blocked}
                onClick={()=> d && pick(d)}
                className={cls}
                style={style}
              >
                {!empty && d.getDate()}
                {(isStart || isEnd) && (
                  <span className="absolute inset-0 rounded-md pointer-events-none"
                        style={{boxShadow:`0 0 0 2px ${RING} inset`}}/>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!open) return null;
  const bases = Array.from({length: months}, (_,i)=> addMonths(view,i));
  const w = months===1 ? 340 : 680;
  const nights = s && e ? diffDays(s,e) : 0;

  return (
    <div ref={boxRef}
         className="absolute z-50 mt-2 rounded-2xl border bg-white shadow-2xl p-4"
         style={{width: w}}>
      {/* 상단 바 */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-bold" style={{color: BRAND}}>
          {nights>0 ? `${nights}박` : ""}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm" style={{color: BRAND}}>
            <span className="opacity-70">체크인</span>
            <strong>{s ? fmtK(toISO(s)) : "-"}</strong>
            {s && <button onClick={()=>{ setS(null); setE(null); onChange?.("",""); }}
                          className="ml-1 opacity-60 hover:opacity-100">×</button>}
          </div>
          <div className="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm" style={{color: BRAND}}>
            <span className="opacity-70">체크아웃</span>
            <strong>{e ? fmtK(toISO(e)) : "-"}</strong>
            {e && <button onClick={()=>{ setE(null); onChange?.(toISO(s)||"", ""); }}
                          className="ml-1 opacity-60 hover:opacity-100">×</button>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={()=>setView(addMonths(view,-1))}
                  className="rounded-md border px-2 py-1 hover:bg-neutral-50"
                  style={{color: BRAND}}>◀</button>
          <button onClick={()=>setView(addMonths(view, 1))}
                  className="rounded-md border px-2 py-1 hover:bg-neutral-50"
                  style={{color: BRAND}}>▶</button>
        </div>
      </div>

      {/* 달력들 */}
      <div className="flex gap-6 justify-center">
        {bases.map((b,i)=> <Month key={i} base={b}/>)}
      </div>

      {/* 하단 */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          onClick={()=>{ setS(null); setE(null); onChange?.("",""); }}
          className="rounded-md border px-3 py-1.5 hover:bg-neutral-50"
          style={{color: BRAND}}
        >날짜 지우기</button>
        <button onClick={onClose}
                className="rounded-md px-3 py-1.5 text-white"
                style={{background: BRAND}}
                onMouseEnter={(e)=> e.currentTarget.style.background = BRAND_DARK}
                onMouseLeave={(e)=> e.currentTarget.style.background = BRAND}
        >닫기</button>
      </div>
    </div>
  );
}
