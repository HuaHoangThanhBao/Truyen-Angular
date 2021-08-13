import { Truyen } from '../truyen/Truyen.model';
import { BinhLuan } from '../binhluan/BinhLuan.model';
export interface Chuong{
    chuongID: number,
    truyenID: number,
    truyen: Truyen,

    binhLuans: BinhLuan[],
    noiDungChuongs: [],

    tenChuong: string,
    thoiGianCapNhat: string,

    luotXem: number,
    trangThai: number,
    tinhTrang: boolean
}