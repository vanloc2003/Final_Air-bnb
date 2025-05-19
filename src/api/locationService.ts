import { https } from "./config"
import axios from 'axios';

export interface Location {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
}
export interface AddLocation {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
}
export interface UpdateLocation {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
}
export const getLocationService = () => {
    return https.get("/api/vi-tri");
}
export const getLocationListService = (pageIndex: number, pageSize: number) => {
    return https.get(`/api/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}`);
}
export const getLocationSearchService = (
    pageIndex: number,
    pageSize: number,
    keyword: string
) => {
    return axios.get("https://airbnbnew.cybersoft.edu.vn/api/vi-tri/phan-trang-tim-kiem", {
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
export const addLocationService = (location: AddLocation) => {
    return https.post(`/api/vi-tri`, location);
}
export const deleteLocationService = (id: number) => {
    return https.delete(`/api/vi-tri/${id}`);
}
export const updateLocationService = (location: UpdateLocation) => {
    return https.put(`/api/vi-tri/${location.id}`, location);
}