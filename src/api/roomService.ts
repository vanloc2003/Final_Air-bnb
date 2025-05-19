import { https } from "./config";
import axios from 'axios';

export interface RoomDetailType {
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
export interface BookingPayload {
    maPhong: number,
    ngayDen: string,
    ngayDi: string,
    soLuongKhach: number,
    maNguoiDung: number
}
export const getRoomService = (locationId: string) => {
    return https.get(`/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`);
}
export const getRoomDetailService = (roomId: number) => {
    return https.get(`/api/phong-thue/${roomId}`);

}
export const postBookingService = (payload: BookingPayload) => {
    return https.post(`/api/dat-phong`, payload);
}
export const getRoomSearchService = (
    pageIndex: number,
    pageSize: number,
    keyword: string
) => {
    return axios.get("https://airbnbnew.cybersoft.edu.vn/api/phong-thue/phan-trang-tim-kiem", {
        params: {
            pageIndex,
            pageSize,
            keyword,
        },
        headers: {
            tokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjAzLzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1Njg1NzYwMDAwMCIsIm5iZiI6MTcyOTcwMjgwMCwiZXhwIjoxNzU3MDA1MjAwfQ.nPo29RkxTkE_C16RhJnxw90M3v3cu3Ur91a47F5epxA"
        }
    });
};
export const addRoomService = (room: RoomDetailType) => {
    return https.post(`/api/phong-thue`, room);
}
export const deleteRoomService = (id: number) => {
    return https.delete(`/api/phong-thue/${id}`);
}
export const updateRoomService = (room: RoomDetailType) => {
    return https.put(`/api/phong-thue/${room.id}`, room);
}