import { Truyen } from '../truyen/Truyen.model';
import { TheLoai } from '../theloai/TheLoai.model';
export interface PhuLuc{
    phuLucID: number;
    truyenID: number;
    truyen: Truyen;
    theLoaiID: number;
    theLoai: TheLoai;
    tinhTrang: number
}