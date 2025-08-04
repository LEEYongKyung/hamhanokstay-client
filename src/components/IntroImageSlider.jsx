

import Slider from "react-slick"

const imageList = [
    "/images/hanok1.jpg",
    "/images/hanok2.JPG",
    "/images/hanok3.JPG",
    "/images/hanok4.JPG",
];

export default function IntroImageSlider() {
    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 1000, // 1초 간격
        speed: 600, //전환 속도
        fade: true // 페이드 인/아웃 효과

    };

    return ( 
        <div className="w-full max-w-4xl mx-auto mt-10 rounded overflow-hidden shadow">
            <Slider {...settings}>
                {imageList.map((src, idx) => (
                    <div key={idx}>
                        <img 
                        src={src} 
                        alt={`hanok ${idx+1}`}
                        className="w-full h-[400px] object-cover" />

                    </div>
                ))}

            </Slider>

        </div>
    );
}