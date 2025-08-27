import IntroImageSlider from "./IntroImageSlider";
import AmenitySection from "./AmenitySection";
import LocationSection from "../components/LocationSection";
import AmenityTable from "./AmenityTable";

export default function IntroSection() {
    return (             
        // <section className="py-10 bg-white font-gowundodum-regula">

        //     <h2 className="text-center text-3xl font-bold mb-8">HAMHanokStay의 캐치 프라이즈 문구 </h2>
        //     <IntroImageSlider />
        //     <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
        //         100년 된 전통 가구와 감성 조명이 어우러진 <strong className="font-semibold text-black">HAMHanokStay</strong>는 <br />
        //         조용한 골목 속에서 자연과 쉼을 느낄 수 있는 독채 한옥 입니다. 
        //     </p>
            

        // </section>
        
        <section className="py-16 bg-white font-gowun">
            <div className="max-w-5xl mx-auto px-5">
                {/* 1) 캐치 프라이즈 문구  */}
                <h2 className="text-center text-3xl md:text-4xl font-bold">
                    HAMHanokStay의 캐치 프라이즈 문구 
                </h2>
                {/* 2) 서브 인트로 문구  */}
                <p className="mt-4 text-center text-lg text-gray-600 leading-relaxed">
                    100년 된 전통 가구와 감성 조명이 어우러징 <strong className="font-semibold text-black">HAMHanokStay</strong>는 
                    조용한 골목 속에서 자연과 쉼을 느낄 수 있는 독채 한옥 입니다. 
                </p>

                {/* 3) 한옥 이밎 슬라이드 */}
                <div className="mt-10">
                    <IntroImageSlider />
                </div>
                {/* 4) 한옥 설명 문구 */}
                <p className="mt-8 text-center text-gray-700 leading-relaxed">
                    전통의 공간미와 현대적 편의가 조화된 한옥에서, 일상의 피로를 내려놓고 온전한 휴식을 즐겨보세요. 
                    가족·연인·친구와 함께 머물기에 충분한 넓은 마루와 프라이빗한 마당이 준비되어 있습니다.
                </p>

                {/* 시설 안내 */}
                <h3 className="mt-14 text-center text-2xl md:text-3xl font-semibold ">
                    한옥의 어메니티 & 시설 안내 
                </h3>
                {/* 6) 어메니티 표 */}
                <AmenityTable />

            </div>

        </section>

    );
}