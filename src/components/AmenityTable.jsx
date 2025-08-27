

export default function AmenityTable({
    items,
    totalCount=39,
    onSeeAll, // 클릭 시 동작(모달/페이지 이동) 연결하고 싶으면 전달 
}) {
    const data =
        items ??
        [
            "샤워기", "에어컨", "블루투스 스피커", "커피캡슐", "칫솔/치약", "샴푸/린스/바디워시", "수건", "드라이어"
        ];

    return (
        <section className="mt-8">
            {/* 타이틀 + 개수 */}
            <div className="flex items-baseline gap-2">
                <h3 className="text-[22px] font-semibold text-gray-900">시설안내</h3>
                <span className="text-gray-500 text-base">{totalCount}</span>
            </div>
            {/* 텍스트 그리드 */}
            <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-16 gap-y-6 text-gray-800">
                {data.map((label, i) => (
                    <li key={i} className="leading-7">{label}</li>
                ))}
            </ul>
            {/* 모두 보기 버튼  */}
            <button
                type='button'
                onClick={onSeeAll}
                className='mt-8 w-full rounded border px-4 py-3 flex items-center justify-between text-gray-600 hover:bg-gray-50 transition'
            >
                <span>시설 안내 모두 보기 {totalCount}</span>
                <span aria-hidden>→</span>

            </button>

        </section>
    )
}