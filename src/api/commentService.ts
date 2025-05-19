import { https } from "./config";

export interface CommentsTheoMaPhong {
    id: number,
    ngayBinhLuan: string,
    noiDung: string,
    saoBinhLuan: number,
    tenNguoiBinhLuan: string,
    avatar: string,
}
export interface PostComment {
    id: number,
    maPhong: number,
    ngayDen: string,
    ngayDi: string,
    soLuongKhach: number,
    maNguoiDung: number,
    noiDung: string,
    saoBinhLuan: number
}
export interface CommentSectionProps {
    maPhong: number,
    maNguoiDung: number
}
export const getCommentService = (maPhong: number) => {
    return https.get(`/api/binh-luan/lay-binh-luan-theo-phong/${maPhong}`);
}
export const postCommentService = (payload: PostComment) => {
    return https.post(`/api/binh-luan`, payload);
}