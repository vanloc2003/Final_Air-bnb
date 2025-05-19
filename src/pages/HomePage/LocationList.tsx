import  { useEffect, useState } from 'react'
import { getLocationListService } from '../../api/locationService';
import { useNavigate } from 'react-router';

interface LocationList {
    id: number,
    tenViTri: string,
    tinhThanh: string,
    quocGia: string,
    hinhAnh: string,
}

function toSlug(str: string) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

export default function LocationList() {
    const [locations, setLocations] = useState<LocationList[]>([]);
    const navigate = useNavigate();

    const getLocationList = async () => {
        const res = await getLocationListService(1, 8);
        const data: LocationList[] = res.data.content.data;
        setLocations(data);
    }

    const handleSearch = (location: LocationList) => {
        const slug = toSlug(location.tenViTri);
        navigate(`/rooms/${slug}?id=${location.id}`);
    };

    useEffect(() => {
        getLocationList();
    }, []);

    return (
       <div className='mt-3.5'>
        <h1 className="text-3xl font-bold text-center">Địa Điểm Du Lịch, Độc Đáo </h1>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-36 pt-10 pb-20">
            {locations.map((location) => (
                <div
                    onClick={() => handleSearch(location)}
                    key={location.id}
                    className="cursor-pointer shadow-lg hover:shadow-xl/20 rounded-lg overflow-hidden"
                >
                    <img src={location.hinhAnh} alt={location.tenViTri} className="w-full h-40 object-cover" />
                    <div className="p-3">
                        <div className='text-[12px]'><i class="fa-solid fa-globe"></i><span className='ml-1.5'>{location.tenViTri},{location.tinhThanh}, {location.quocGia}</span></div>
                        <h3 className="text-lg font-semibold">{location.tenViTri}</h3>
                        <p className="text-sm text-gray-500">{location.tinhThanh}, {location.quocGia}</p>
                    </div>
                </div>
            ))}
        </div>
       </div>
    );
};
