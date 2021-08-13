import { Chuong } from '../chuong/Chuong.model';
import { BinhLuan } from '../binhluan/BinhLuan.model';
import { PhuLuc } from '../phuluc/PhuLuc.model';
import { TheoDoi } from '../theodoi/TheoDoi.model';

export interface Truyen{
    binhLuans: BinhLuan[],
    chuongs: Chuong[],
    hinhAnh: string,
    moTa: string,
    phuLucs: PhuLuc[],
    tacGia: string,
    tenTruyen: string,
    theoDois: TheoDoi[],
    tinhTrang: boolean,
    trangThai: number,
    truyenID: number
}