import axios from "axios";
import { https, CYBER_TOKEN } from './config';

export interface BookedRooms {
    id: number,
    maPhong: number,
    ngayDen: string,
    ngayDi: string,
    soLuongKhach: number,
    maNguoiDung: number
}
export interface AddBooking {
    id: number,
    maPhong: number,
    ngayDen: string,
    ngayDi: string,
    soLuongKhach: number,
    maNguoiDung: number
}
export interface UpdateBooking {
    id: number,
    maPhong: number,
    ngayDen: string,
    ngayDi: string,
    soLuongKhach: number,
    maNguoiDung: number
}
export const getBookedRoomService = (maNguoiDung: number) => {
    return https.get(`/api/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`);
}
export const getBookingService = () => {
    return axios.get("https://airbnbnew.cybersoft.edu.vn/api/dat-phong", {
        headers: {
            TokenCybersoft: CYBER_TOKEN,
        },
    });
};
export const addBookingService = (booking: AddBooking) => {
    return https.post(`/api/dat-phong`, booking);
}
export const deleteBookingService = (id: number) => {
    return https.delete(`/api/dat-phong/${id}`);
}
export const updateBookingService = (booking: UpdateBooking) => {
    return https.put(`/api/dat-phong/${booking.id}`, booking);
};
