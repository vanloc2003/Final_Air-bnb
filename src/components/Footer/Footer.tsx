import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const FooterPage = () => {
    const [showButton, setShowButton] = useState(false);
    const sections = [
        {
            title: 'GIỚI THIỆU',
            items: [
                'Phương thức hoạt động của Airbnb', 'Trang tin tức', 'Nhà đầu tư', 'Airbnb Plus', 'Airbnb Luxe',
                'HotelTonight', 'Airbnb for Work', 'Nhờ có Host, mọi điều đều có thể', 'Cơ hội nghề nghiệp'
            ],
        },
        {
            title: 'CỘNG ĐỒNG',
            items: [
                'Sự đa dạng và Cảm giác thân thuộc', 'Tiện nghi phù hợp cho người khuyết tật',
                'Đối tác liên kết Airbnb', 'Chỗ ở cho tuyến đầu', 'Lượt giới thiệu của khách', 'Airbnb.org'
            ],
        },
        {
            title: 'ĐÓN TIẾP KHÁCH',
            items: [
                'Cho thuê nhà', 'Tổ chức Trải nghiệm trực tuyến', 'Tổ chức Trải nghiệm',
                'Đón tiếp khách có trách nhiệm', 'Trung tâm tài nguyên', 'Trung tâm cộng đồng'
            ],
        },
        {
            title: 'HỖ TRỢ',
            items: [
                'Biện pháp ứng phó đại dịch COVID-19', 'Trung tâm trợ giúp', 'Các tuỳ chọn huỷ',
                'Hỗ trợ khu dân cư', 'Tin cậy và an toàn'
            ],
        },
    ]


    // Show button when scrollY > 200
    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-gray-100 text-sm text-gray-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                {sections.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="font-semibold mb-3">{section.title}</h3>
                        <ul className="space-y-2">
                            {section.items.map((item, i) => (
                                <li key={i} className="hover:text-black hover:underline cursor-pointer">{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className=" bottom-0 w-full border-t border-white">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
                    <div className="mb-2 md:mb-0">
                        © 2025 Airbnb, Inc.
                        <span className="mx-1">·</span> Quyền riêng tư
                        <span className="mx-1">·</span> Điều khoản
                        <span className="mx-1">·</span> Sơ đồ trang web
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center gap-1">🌐 Tiếng Việt (VN)</span>
                        <span>USD</span>
                        <a href="#" className="hover:underline">Hỗ trợ tài nguyên</a>
                    </div>
                </div>
            </div>

            {showButton && (
                <button
                    onClick={scrollToTop}
                    className="cursor-pointer fixed bottom-5 right-5 p-3 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition duration-300"
                >
                    <FaArrowUp />
                </button>
            )}
        </footer>
    );
};

export default FooterPage;
