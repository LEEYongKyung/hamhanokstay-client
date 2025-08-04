import Header from "../components/Header";
import MainVideo from "../components/MainVideo";
import IntroSection from "../components/IntroSection";
import Footer from "../components/Footer";



export default function Home() {
    return (
        <div >
            
            <Header/>
            {/* MainVideo 등 추가 컨텐츠 들어감.  */}
            <MainVideo />
            <IntroSection />
            <Footer />
            
           
           

        </div>
    )
}