export default function MainVideo() {
    const videoId = "8zNjhYtNZAM";
    // YouTube UI를 숨기기 위해 controls=0 파라미터는 유지합니다.
    const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&playlist=${videoId}`;

    return (
        // overflow-hidden을 통해 자식 요소가 이 섹션 밖으로 나가는 부분을 잘라냅니다.
        <section className="w-full h-screen relative overflow-hidden">
           <video 
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline

           >
            <source src="../../video/hero.mp4" />
           </video>
        </section>
    );
}