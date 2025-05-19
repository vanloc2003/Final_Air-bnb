

const places = [
    {
        image:
            'https://rawn-airbnb.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Frawn%2Fimage%2Fupload%2Ff_webp%2Fq_auto%3Abest%2Fv1628329222%2Fmjwqhra4wbzlvoo2pe27.jpg&w=1920&q=75',
        label: 'Toàn bộ nhà',
    },
    {
        image:
            'https://rawn-airbnb.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Frawn%2Fimage%2Fupload%2Ff_webp%2Fq_auto%3Abest%2Fv1628329186%2Ffmoml05qcd0yk2stvl9r.jpg&w=1920&q=75',
        label: 'Chỗ ở độc đáo',
    },
    {
        image:
            'https://rawn-airbnb.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Frawn%2Fimage%2Fupload%2Ff_webp%2Fq_auto%3Abest%2Fv1628329121%2Fguagj5r2bkccgr1paez3.jpg&w=1920&q=75',
        label: 'Trang trại và thiên nhiên',
    },
    {
        image:
            'https://rawn-airbnb.vercel.app/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Frawn%2Fimage%2Fupload%2Ff_webp%2Fq_auto%3Abest%2Fv1628329252%2Fgqhtg9ua6jdrffhbrfv1.jpg&w=1920&q=75',
        label: 'Cho phép mang theo thú cưng',
    },
];

export default function AnyWherePage() {
    return (
        <div className=" cursor-pointer p-8">
            <h1 className="text-2xl font-bold mb-6">Ở bất cứ đâu</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {places.map((place, index) => (
                    <div
                        key={index}
                        className="text-center rounded-xl overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl bg-white"
                    >
                        <img
                            src={place.image}
                            alt={place.label}
                            className="w-full h-60 object-cover"
                        />
                        <p className="text-sm font-medium mt-3 mb-4">{place.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
