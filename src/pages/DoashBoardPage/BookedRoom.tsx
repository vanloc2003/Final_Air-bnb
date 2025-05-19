import { useEffect, useState } from 'react'
import { BookedRooms, deleteBookingService, getBookedRoomService } from '../../api/bookroomService'
import { getRoomDetailService } from '../../api/roomService'
import { useSelector } from 'react-redux'
import { RootState } from '../../main'
import { CheckDesktop, CheckMobilePhone, CheckTablet } from '../../components/reponsive/ResponsiveCustom'
import { Link } from 'react-router-dom';
import { Button } from 'antd'
import toast from 'react-hot-toast'

interface EnrichedBooking extends BookedRooms {
    roomDetail: {
        tenPhong: string;
        hinhAnh: string;
        moTa: string;
        giaTien: number;
        maViTri: number;
    }; // Có thể khai báo cụ thể interface nếu muốn
}


export default function BookedRoom() {
    const [enrichedRooms, setEnrichedRooms] = useState<EnrichedBooking[]>([]);
    const { user } = useSelector((state: RootState) => state.userSlice);

    const fetchBookedRoom = async () => {
        try {
            if (!user?.id) return;

            const res = await getBookedRoomService(user.id);
            const data: BookedRooms[] = res.data.content;

            const enrichedData: EnrichedBooking[] = await Promise.all(
                data.map(async (booking): Promise<EnrichedBooking> => {
                    const roomRes = await getRoomDetailService(booking.maPhong);
                    const roomDetail = roomRes.data.content;
                    return { ...booking, roomDetail };
                })
            );

            setEnrichedRooms(enrichedData);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu phòng đã đặt:", error);
        }
    };
    const handleDeleteBooking = async (bookingId: number) => {
        if (!window.confirm("Bạn có chắc muốn hủy đặt phòng này không?")) return;

        try {
            await deleteBookingService(bookingId);
            setEnrichedRooms((prev) => prev.filter((room) => room.id !== bookingId));
            toast.success("Xóa đặt phòng thành công!");
        } catch (error) {
            console.error("Xoá đặt phòng thất bại:", error);
            toast.error("Xóa đặt phòng thất bại!")
        }
    };

    useEffect(() => {
        fetchBookedRoom();
    }, [user]);

    return (
        <div className="p-4">
            <p className='font-bold text-3xl'>Xin chào tôi là {user.name}</p>
            <h2 className="text-xl font-bold mb-4">Phòng đã thuê</h2>
            {enrichedRooms.length === 0 ? (
                <p>Bạn chưa đặt phòng nào.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {enrichedRooms.map((booking) => (
                        <div key={booking.id}>
                            <CheckDesktop>
                                <div className="flex border rounded-2xl overflow-hidden shadow bg-white hover:shadow-lg transition">
                                    <Link
                                        className="flex flex-col md:flex-row flex-1 overflow-hidden"
                                        to={`/rooms/${booking.roomDetail.maViTri}/${booking.maPhong}`}
                                    >
                                        <img
                                            src={booking.roomDetail?.hinhAnh}
                                            alt={booking.roomDetail?.tenPhong}
                                            className="w-full md:w-1/3 object-cover h-48 md:h-auto"
                                        />
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h2 className="text-xl font-semibold mb-1">{booking.roomDetail?.tenPhong}</h2>
                                                <p className="text-gray-600 text-sm mb-2">{booking.roomDetail?.moTa}</p>
                                                <div className="text-sm text-gray-700 space-y-1">
                                                    <p><strong>Ngày đến:</strong> {new Date(booking.ngayDen).toLocaleDateString()}</p>
                                                    <p><strong>Ngày đi:</strong> {new Date(booking.ngayDi).toLocaleDateString()}</p>
                                                    <p><strong>Số lượng khách:</strong> {booking.soLuongKhach}</p>
                                                </div>
                                            </div>
                                            <p className="text-right font-bold text-lg text-black mt-2">${booking.roomDetail?.giaTien} / đêm</p>
                                        </div>
                                    </Link>
                                    <div className="flex items-center px-4">
                                        <Button danger onClick={() => handleDeleteBooking(booking.id)}>
                                            Hủy đặt phòng
                                        </Button>
                                    </div>
                                </div>
                            </CheckDesktop>

                            <CheckTablet>
                                <div className="bg-white border rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                                    <Link
                                        className="block"
                                        to={`/rooms/${booking.roomDetail.maViTri}/${booking.maPhong}`}
                                    >
                                        <img
                                            src={booking.roomDetail?.hinhAnh}
                                            alt={booking.roomDetail?.tenPhong}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h2 className="text-lg font-semibold mb-1">{booking.roomDetail?.tenPhong}</h2>
                                            <p className="text-sm text-gray-600 mb-2">{booking.roomDetail?.moTa}</p>
                                            <div className="text-sm text-gray-700 space-y-1">
                                                <p><strong>Ngày đến:</strong> {new Date(booking.ngayDen).toLocaleDateString()}</p>
                                                <p><strong>Ngày đi:</strong> {new Date(booking.ngayDi).toLocaleDateString()}</p>
                                                <p><strong>Số lượng khách:</strong> {booking.soLuongKhach}</p>
                                            </div>
                                            <p className="text-right font-bold text-red-600 mt-2">${booking.roomDetail?.giaTien} / đêm</p>
                                        </div>
                                    </Link>
                                    <div className="p-4 border-t flex justify-end">
                                        <Button danger onClick={() => handleDeleteBooking(booking.id)}>
                                            Hủy đặt phòng
                                        </Button>
                                    </div>
                                </div>
                            </CheckTablet>
                            <CheckMobilePhone>
                                <div className="bg-white border rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                                    <Link
                                        className="block"
                                        to={`/rooms/${booking.roomDetail.maViTri}/${booking.maPhong}`}
                                    >
                                        <img
                                            src={booking.roomDetail?.hinhAnh}
                                            alt={booking.roomDetail?.tenPhong}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h2 className="text-lg font-semibold mb-1">{booking.roomDetail?.tenPhong}</h2>
                                            <p className="text-sm text-gray-600 mb-2">{booking.roomDetail?.moTa}</p>
                                            <div className="text-sm text-gray-700 space-y-1">
                                                <p><strong>Ngày đến:</strong> {new Date(booking.ngayDen).toLocaleDateString()}</p>
                                                <p><strong>Ngày đi:</strong> {new Date(booking.ngayDi).toLocaleDateString()}</p>
                                                <p><strong>Số lượng khách:</strong> {booking.soLuongKhach}</p>
                                            </div>
                                            <p className="text-right font-bold text-red-600 mt-2">${booking.roomDetail?.giaTien} / đêm</p>
                                        </div>
                                    </Link>
                                    <div className="p-4 border-t flex justify-end">
                                        <Button danger onClick={() => handleDeleteBooking(booking.id)}>
                                            Hủy đặt phòng
                                        </Button>
                                    </div>
                                </div>
                            </CheckMobilePhone>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
