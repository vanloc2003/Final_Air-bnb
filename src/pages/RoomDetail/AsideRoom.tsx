import { useEffect, useState } from 'react'
import { getRoomDetailService, postBookingService, BookingPayload, RoomDetailType } from '../../api/roomService'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal, DatePicker, InputNumber, Button } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { RootState } from '../../main'



export default function AsideRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [roomDetail, setRoomDetail] = useState<RoomDetailType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [guestCount, setGuestCount] = useState(1);
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(7, 'day'));
    const { user } = useSelector((state: RootState) => state.userSlice);
    useEffect(() => {
        const fetchRoomDetail = async () => {
            const res = await getRoomDetailService(Number(roomId));
            const data = res.data.content;
            setRoomDetail(data);
        }
        fetchRoomDetail();
    }, [roomId]);

    if (!roomDetail) return <div></div>;

    const calculateNights = () => {
        if (startDate && endDate) {
            return endDate.diff(startDate, 'day') || 1;
        }
        return 1;
    }

    const calculateTotal = () => {
        const nights = calculateNights();
        return roomDetail.giaTien * nights + 8;
    }
    const handleBooking = async () => {
        if (!user) {
            toast.error("Bạn cần đăng nhập để đặt phòng!");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Vui lòng chọn ngày đến và ngày đi hợp lệ!");
            return;
        }

        const payload: BookingPayload = {
            maPhong: roomDetail.id,
            ngayDen: startDate.format("YYYY-MM-DD"),
            ngayDi: endDate.format("YYYY-MM-DD"),
            soLuongKhach: guestCount,
            maNguoiDung: user.id,
        };
        try {
            await postBookingService(payload);
            toast.success("Đặt phòng thành công");
        } catch (error) {
            console.log("Lỗi đặt phòng:", error);
            toast.error("Đặt phòng thất bại!");
        }
    };
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Tiêu đề */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{roomDetail.tenPhong}</h1>
                <div className="text-pink-500 mt-2 cursor-pointer" onClick={() => navigate(-1)}>
                    Chủ nhà siêu cấp - Xem thêm chỗ ở khác →
                </div>
            </div>

            {/* Ảnh */}
            <div className="relative w-full mb-10">
                <img
                    src={roomDetail.hinhAnh}
                    alt={roomDetail.tenPhong}
                    className="w-full h-full object-cover rounded-xl shadow-2xl cursor-pointer hover:opacity-90 transition"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            <Modal open={isModalOpen} footer={null} onCancel={() => setIsModalOpen(false)} centered>
                <img src={roomDetail.hinhAnh} alt={roomDetail.tenPhong} className="w-full h-auto object-cover rounded-lg" />
            </Modal>

            {/* Nội dung */}
            <div className="flex flex-col md:flex-row gap-10">

                {/* Thông tin phòng */}
                <div className="flex-1">
                    <div className="text-gray-600 text-lg mb-6">
                        {roomDetail.khach} khách • {roomDetail.phongNgu} phòng ngủ • {roomDetail.giuong} giường • {roomDetail.phongTam} phòng tắm
                    </div>

                    <p className="text-gray-700 mb-8">{roomDetail.moTa}</p>

                    <hr className="border-t-2 my-8" />

                    {/* Tiện nghi */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Tiện nghi</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {[
                                { name: "Wifi", icon: "📶", available: roomDetail.wifi },
                                { name: "Máy giặt", icon: "🧺", available: roomDetail.mayGiat },
                                { name: "TV", icon: "📺", available: roomDetail.tivi },
                                { name: "Điều hòa", icon: "❄️", available: roomDetail.dieuHoa },
                                { name: "Hồ bơi", icon: "🏊‍♂️", available: roomDetail.hoBoi },
                                { name: "Bếp", icon: "🍳", available: roomDetail.bep },
                                { name: "Đỗ xe", icon: "🚗", available: roomDetail.doXe },
                                { name: "Bàn ủi", icon: "🧹", available: roomDetail.banUi },
                                { name: "Bàn là", icon: "🪑", available: roomDetail.banLa },
                            ].map((item, index) =>
                                item.available ? (
                                    <div key={index} className="flex items-center gap-3 text-gray-700">
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.name}</span>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>

                    <hr className="border-t-2 my-8" />

                    {/* Thông tin thêm */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Thông tin thêm</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 text-gray-700">
                                <span className="text-2xl">🏠</span>
                                <span>Toàn bộ nhà — Bạn sẽ có chung cư cao cấp cho riêng mình.</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <span className="text-2xl">🧹</span>
                                <span>Vệ sinh tăng cường — Chủ nhà cam kết quy trình 5 bước của Airbnb.</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <span className="text-2xl">🌟</span>
                                <span>Phong là Chủ nhà siêu cấp — Được đánh giá cao và tận tâm phục vụ khách.</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <span className="text-2xl">🔄</span>
                                <span>Miễn phí hủy trong 48 giờ đầu tiên.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bảng giá */}
                <div className="w-full md:w-1/3 bg-white p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <div className="flex items-end gap-2 mb-6">
                        <span className="text-3xl font-bold text-gray-800">${roomDetail.giaTien}</span>
                        <span className="text-gray-600">/ đêm</span>
                    </div>

                    <div className="border rounded-lg overflow-hidden mb-6">
                        <div className="grid grid-cols-2">
                            <div className="border-r p-4">
                                <div className="text-xs font-bold uppercase text-gray-600 mb-1">Nhận phòng</div>
                                <DatePicker
                                    className="w-full"
                                    format="DD-MM-YYYY"
                                    value={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                                />
                            </div>
                            <div className="p-4">
                                <div className="text-xs font-bold uppercase text-gray-600 mb-1">Trả phòng</div>
                                <DatePicker
                                    className="w-full"
                                    format="DD-MM-YYYY"
                                    value={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    disabledDate={(current) => current && current < (startDate || dayjs()).startOf('day')}
                                />
                            </div>
                        </div>
                        <div className="border-t p-4">
                            <div className="text-xs font-bold uppercase text-gray-600 mb-1">Khách</div>
                            <InputNumber
                                min={1}
                                max={10}
                                value={guestCount}
                                onChange={(value) => setGuestCount(value || 1)}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 text-gray-700 text-sm">
                        <div className="flex justify-between">
                            <span>${roomDetail.giaTien} x {calculateNights()} đêm</span>
                            <span>${roomDetail.giaTien * calculateNights()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Cleaning fee</span>
                            <span>$8</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-semibold">
                            <span>Total</span>
                            <span>${calculateTotal()}</span>
                        </div>
                    </div>

                    <Button onClick={handleBooking} type="primary" className="w-full mt-6 py-3 rounded-full bg-pink-500 hover:bg-pink-600">
                        Đặt phòng
                    </Button>
                </div>

            </div>
        </div>
    )
}
