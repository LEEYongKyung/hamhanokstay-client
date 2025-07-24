export default function LocationSection() {
    return (
        <section className="py-16 bg-white">
            <h3 className="text-center text-2xl font-semibold mb-6">HAMHanokStay 위치 </h3>
            <div className="w-full max-w-4xl h-[400px] mx-auto rounded overflow-hidden shadow">
                <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12647.848507599096!2d126.97124657265996!3d37.579509502561045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3122ec6638b%3A0xb7f4eb8415ae0c45!2z7ZWoIO2VnOyYpSDsiqTthYzsnbQgfCBIQU0gaGFub2sgc3RheQ!5e0!3m2!1sko!2skr!4v1753243671664!5m2!1sko!2skr" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="HAMHanokStay Location Map">
                </iframe>
            </div>
        </section>
    )
}