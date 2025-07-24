import {
    FaShower,
    FaCoffee,
    FaTooth,
    FaWind,
    FaMusic,
    FaPumpSoap
} from "react-icons/fa";



const amenities  = [
    {name: "샤워기기", icon: FaShower},
    {name: "에어컨", icon: FaWind},
    {name: "블루투스 스피커", icon: FaMusic},
    {name: "커피캡슐", icon: FaCoffee},
    {name: "칫솔/치약", icon: FaTooth},
    {name: "샴푸/린스/바디워시", icon: FaPumpSoap   },
];

export default function AmenitySection() {
    return (
        <section className="py-8 bg-[#fff]">
            <h3 className="text-center text-2xl font-semibold mb-10">
                한옥의 어메니티 & 시설 안내 
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto px-4">
                {amenities.map((amenity, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
                        > 
                            <amenity.icon className="h-10  w-10 text-yellow-700 mb-2" />
                            <span className="text-gray-700 text-sm text-center"> {amenity.name}</span>
                        </div>    
                    )
                    )
                }
            </div>

        </section>
    )
}