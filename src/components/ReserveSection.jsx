import React, {useEffect, useMemo, useRef, useState} from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// ===========날짜 유형===========
const pad = (n) => String(n).padStart(2, "0"); // 숫자(월,일)을 항상 두자리 문자열로 만들어줌. String(n)은 n개의 숫자를  n개의 숫자로 만드는 것이고, padStart(2,"0")은 문자열 길이가 2가 되도록 앞을 "0"으로 채워줌  .
const toISO = (d) => `${d.getFullYear()} - ${pad(d.getMonth()+1)}-${pad(d.getDate())}`;// Date 객체를 YYYY-MM-DD의 형태의 문자열로 변환하는 기능
const fromISO = (s) => (s ? new Date(`${s}T00:00:00`) : null);
const isSameDay = (a,b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isBefore = (a,b) => a && b && a.getTime() < b.getTime(); //getTime()은 연월일시분 모든 정보를 number 형태로 가지고옴
const addMonths = (d, m) => new Date(d.getFullYear() , d.getMonth() + m, 1);
const diffDays = (a,b) => Math.round((b-a)/86400000);// Date 형태인 두개의 날인 b,a와 를 서로 빼면 두 날의 차이는 밀리초 단위로 반환이 된다. 그 밀리초를 일단위로 표현하기 위해선 24시간을 밀리초로 나타낸 86400000로 나눠야 일로 표현이 가능하다. 그 결과값은 2.6 같은 값이 될텐데 Math.round()로 3일과 같은 정수값으로 반올림한다. 
const fmtK = (iso) => { // from 데이트 날짜를 프린트 
    if(!iso) return"";
    const d = fromISO(iso);
    return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
};
const makeCells = (y,m) => { // 달력을 만드는 데 사용되는 로직 , 특정 연도와 월을 입력받아 달력 UI 그리는데 필요한 42개의 셀 데이터를 생성 (일반적 달력 6주 * 7일 = 42개 칸)
    const first = new Date(y,m,1); // 입력받는 연도와 월의 1일에 해당하는 Date 객체를 만듬 
    const offset = first.getDay(); // 1일이 무슨 요일인지 알아냅 getDay()는 요일을 숫자로 변환 (0-일요일 1-월요일)
    const days = new Date(y,m+1, 0).getDate(); // 해당 월이 총 몇일이 있는지 계산, new Date(y,m+1, 0) 이번달의 마지막날 과 같음 
    const cells = [];
    for (let i=0; i<42; i++) {
        const day = i- offset +1;
        cells.push ( day >= 1 && day<=days ? new Date(y,m,day) : null);
    }
    return cells;
};

// ===========ICS 파서(간단): DTSTART/DTEND YYYYMMDD 형태만 처리===========
function parseIcsDates(text) { // ics 형식의 텍스트를 분석해서 , 그 안에 포함된 모든 이벤트 날짜 범위를 비활성화된(disabled) 날짜 목록으로 만드는 역활
    const disabled = new Set(); // 비활성화된 날짜들을 저장할 Set 객체를 만든다. Set은 중복된 값을 허용하지 않는다. 하여 같은 날이 겹쳐도 해당날짜는 한번만 저장
    if (!text) return disabled;
    const lines = text.split(/\r?\n/); // ics는 파일의 내용 전체가 하나의 문자열(text)로 전달된다. 하여 문자열의 줄바꾼 문자 기준으로 잘라서 한 줄씩 처리할 수 있도록 배열 정리
    let s = null, e=null; // 하나의 이벤트를 처리하는 동안 시작일(s)와 종료일(e)을 임시로 저장할 변수
    for (const ln of lines) { 
        const mS = ln.match(/DTSTART[^:]*:(\d{8})/); // 현재 줄에서 시작일 정보를 찾는다. e.g. DTSTART: 20250825
        const mE = ln.match(/DTEND[^:]*:(\d{8})/); // 현재 줄에서 종료일 정보를 찾는다. 
        if (mS) s = mS[1];
        if (mE) e = mE[1];
        if (ln.startsWith("END:VEVENT") && s) {  //하나의 이벤트 정보가 끝났음을 알리는 END:VEVENT 줄을 만나면 , 그동안 찾았던 시작일(s)과 종료일(e) 정보를 가지고 실체 날짜를 처리 
            const yy = (v) => Number(v.slice(0,4));
            const mm = (v) => Number(v.slice(4,6))-1;
            const dd = (v) => Number(v.slice(6,8));
            const ds = new Date(yy(s), mm(s), dd(s)); // 시작일 객체를 만듬 
            const de = e ? new Date(yy(e), mm(e), dd(e)) : new Date(yy(s), mm(s), dd(s)); // 종료일 객체를 만듬 종료일이 없으면 시작일과 같은 날로 처리 
            for (let d= new Date(ds); d<de; d.setDate(d.getDate()+1)) { // 시작일부터 종료일까지 하루씩 증가하면서 루프를 돌아감. 
                disabled.add(toISO(d));// 루프 안에서 만들어진 각 날짜를 YYYY-MM-DD 형식의 문자열로 변환 하여 disabled 목록에 추가 
            }
            s=e= null; // 하나의 이벤트가 끝났으므로 다음 이벤트 처리를 위해 시작일과 종료일 변수 초기화
        }
    }
    return disabled; // 모든 줄을 다 읽고나면 초기화 
}

// ===========브랜딩 컬러===========
const BRAND= "#402a1c";
const BRAND_DARK = "#2f1e14" // hover
const RANGE_BG = "rgba(64, 42, 28, .12)"// 주간 하이라이트
const RING = "rgba(64,42, 28,.35)" // 사직/끝 링 


// ===========컴포넌트===========
export default function ReserveSection({
    shareCalendars = [
    "https://ical.booking.com/v1/export?t=2b9c85f1-2ce8-4686-b829-2ecfde2044cb",
    "https://www.airbnb.co.kr/calendar/ical/1141509028517381236.ics?s=4ff6139029b739ac857b7faa0e522542",
    "https://ycs.agoda.com/en-us/api/ari/icalendar?key=Mq%2f3dKl3aQT1CaFASpd7juPktu8s1wp%2f",
  ],
  onReserve,

}) {

    const HEADER = {
        eyebrow : "ENJOY HANOK",
        title : "함한옥스테이와 함께 조선시대를 스테이 해보세요.",
        description:"한옥의 아름다운 풍경과 따뜻한 분위기 속에 지친 몸과 마음이 잠시나마 휴식을 취할 수 있는 시간이 되시길 바랍니다."
    };

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    const subtitle = useMemo(() => { // useMemo 이전에 값에 대해 포스트잇처럼 메모해 두었다가, 사용하는 함수로 동일한 입력값에 대해선 따로 계산하지 않고, 아래 checkIn, checkOut 값이 변하게 되면 재 랜더링
        if(checkIn && checkOut) { // 3.checkIn, checkOut 둘다 날짜가 선택되었을 때 
            const n = diffDays(fromISO(checkIn), fromISO(checkOut)); // fromISO로 날짜 시간대를 00:00:00 으로 맞춘 후 diffDays로 두날짜를 빼고 일수로 단위 변환
            return `함한옥스테이에서의 ${n}박`;
        }
        if (checkIn) return "체크아웃 날짜를 선택하세요.";// 2. 체크인 날짜가 선택되었을 때 
        return "체크인 날짜 선택"; // 1. 체크인 먼저 선택하도록 유도
    }, [checkIn, checkOut]);

    const subDesc = useMemo(() => { // sub Description 표현
        if (checkIn && checkOut) return `${fmtK(checkIn)} - ${fmtK(checkOut)}`; // 체크인과 체크아웃 날짜가 모두 정해졌으면 "YYYY년 MM월 DD일 - YYYY년 MM월 DD일 표현"
        return "여행 날짜를 입력하여 정확한 요금을 확인하세요. " // 그외에는 기본 문구 출력 
    }, [checkIn, checkOut]);

    const [disabledDates, setDisabledDates] = useState(new Set()); // ics 파일 기반의 안되는 날짜 저장 변수 및 함수 를 new Set()을 통해 종복 없이 삽입 
    useEffect(() => { // 비동기로 ics 을 통해 받아온 불가능한 날짜들에 대해 setDisabledDates() 에 저장 
        let alive = true ; 
        (async () => {
            try {
                const sets = await Promise.all(
                    shareCalendars.map(async (url) => {
                        try {
                            const r = await fetch(url, {mode:"cors"});
                            const t = await r.text();
                            return parseIcsDates(t)
                        } catch {
                            return new Set();
                        }
                    })
                );
                if (!alive) return;
                const merged = new Set();
                sets.forEach((s) => s.forEach((d) => merged.add(d)));
                setDisabledDates(merged);
            }catch{ /* empty */ }
        })();
        return () => {alive=false;};
    }, [shareCalendars]);
}


