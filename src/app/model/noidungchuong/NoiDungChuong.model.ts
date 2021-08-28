import { Chuong } from '../chuong/Chuong.model';
export interface NoiDungChuong{
    noiDungChuongID?: number;
    chuongID: number;
    chuong?: Chuong;
    hinhAnh: string;
    tinhTrang?: number;
}