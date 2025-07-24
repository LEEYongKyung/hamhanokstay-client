import IntroImageSlider from "./IntroImageSlider";
import AmenitySection from "./AmenitySection";
import LocationSection from "../components/LocationSection";


export default function IntroSection() {
    return (
        <section className="py-10 bg-white">
            <h2 className="text-center text-3xl font-bold mb-8">HAMHanokStay의 캐치 프라이즈 문구 </h2>
            <IntroImageSlider />
            <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mt-6 leading-relaxed">
                100년 된 전통 가구와 감성 조명이 어우러진 <strong className="font-semibold text-black">HAMHanokStay</strong>는 <br />
                조용한 골목 속에서 자연과 쉼을 느낄 수 있는 독채 한옥 입니다. 
            </p>
            <AmenitySection />
            <LocationSection />

        </section>
        
    );
}