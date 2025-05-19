import { useEffect, useState } from 'react';
import { getRoomService } from '../../api/roomService';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckDesktop, CheckMobilePhone, CheckTablet } from '../../components/reponsive/ResponsiveCustom';

interface Room {
    id: number;
    tenPhong: string;
    khach: number;
    phongNgu: number;
    giuong: number;
    phongTam: number;
    moTa: string;
    giaTien: number;
    mayGiat: boolean;
    banLa: boolean;
    tivi: boolean;
    dieuHoa: boolean;
    wifi: boolean;
    bep: boolean;
    doXe: boolean;
    hoBoi: boolean;
    banUi: boolean;
    hinhAnh: string;
}

export default function RoomPage() {
    const { locationId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const [rooms, setRooms] = useState<Room[]>([]);

    const fetchRooms = async (id: string) => {
        try {
            const res = await getRoomService(id);
            const data: Room[] = res.data.content;
            setRooms(data);
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };

    const getAmenities = (room: Room) => {
        const amenities: string[] = [];
        if (room.wifi) amenities.push("Wifi");
        if (room.mayGiat) amenities.push("Máy giặt");
        if (room.tivi) amenities.push("TV");
        if (room.dieuHoa) amenities.push("Điều hòa");
        if (room.hoBoi) amenities.push("Hồ bơi");
        if (room.bep) amenities.push("Bếp");
        if (room.doXe) amenities.push("Đỗ xe");
        if (room.banUi) amenities.push("Bàn ủi");
        if (room.banLa) amenities.push("Bàn là");
        return amenities.join(" • ");
    };

    useEffect(() => {
        if (id) {
            fetchRooms(id);
        }
    }, [id]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 px-4 py-8 max-w-screen-xl mx-auto">
            {/* Danh sách phòng */}
            <div className="flex-1 space-y-6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold">Chỗ ở tại khu vực bạn đã chọn</h1>
                    <Link className="text-blue-600 font-medium hover:underline mt-2 inline-block" to="/">
                        Bạn muốn chọn khu vực khác? Click vào đây!
                    </Link>
                </div>

                {rooms.map((room) => (
                    <div key={room.id}>
                        <CheckDesktop>
                            <Link
                                className="flex cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                                to={`/rooms/${locationId}/${room.id}`}
                            >
                                <div className="relative w-1/3">
                                    <img
                                        src={room.hinhAnh}
                                        alt={room.tenPhong}
                                        className="w-full h-48 object-cover rounded-l-xl"
                                    />
                                </div>

                                <div className="p-4 flex-1">
                                    <h2 className="text-xl font-semibold truncate text-black">{room.tenPhong}</h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {room.khach} khách • {room.phongNgu} phòng ngủ • {room.giuong} giường • {room.phongTam} phòng tắm • {getAmenities(room)}
                                    </p>
                                    <p className="text-lg font-bold mt-2">${room.giaTien} / đêm</p>
                                </div>
                            </Link>
                        </CheckDesktop>

                        <CheckTablet>
                            <Link
                                className="flex flex-col cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                                to={`/rooms/${locationId}/${room.id}`}
                            >
                                <img
                                    src={room.hinhAnh}
                                    alt={room.tenPhong}
                                    className="w-full h-60 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold">{room.tenPhong}</h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {room.khach} khách • {room.phongNgu} phòng ngủ • {room.giuong} giường • {room.phongTam} phòng tắm • {getAmenities(room)}
                                    </p>
                                    <p className="text-lg font-bold mt-2">${room.giaTien} / đêm</p>
                                </div>
                            </Link>
                        </CheckTablet>

                        <CheckMobilePhone>
                            <Link
                                className="flex flex-col cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                                to={`/rooms/${locationId}/${room.id}`}
                            >
                                <img
                                    src={room.hinhAnh}
                                    alt={room.tenPhong}
                                    className="w-full h-60 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold">{room.tenPhong}</h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {room.khach} khách • {room.phongNgu} phòng ngủ • {room.giuong} giường • {room.phongTam} phòng tắm • {getAmenities(room)}
                                    </p>
                                    <p className="text-lg font-bold mt-2">${room.giaTien} / đêm</p>
                                </div>
                            </Link>
                        </CheckMobilePhone>
                    </div>
                ))}
            </div>

            {/* Bản đồ chỉ hiển thị trên desktop */}
            <div className="lg:w-[30%] w-full h-[400px] lg:h-[600px] sticky top-24 rounded-xl overflow-hidden shadow-xl hidden lg:block">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5026947706565!2d106.6584303152602!3d10.771707792323955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3beaaaad1f%3A0x847ffb652e74b99e!2zVHLGsOG7nW5nIMSQaeG7h24gdGjDoG5oIHRwIEjhu5MgQ2jDrSBNw61uaA!5e0!3m2!1svi!2s!4v1628861394379!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    );
}
