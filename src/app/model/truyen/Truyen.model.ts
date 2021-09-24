import { Chuong } from '../chuong/Chuong.model';
import { BinhLuan } from '../binhluan/BinhLuan.model';
import { PhuLuc } from '../phuluc/PhuLuc.model';
import { TheoDoi } from '../theodoi/TheoDoi.model';
import { TacGia } from '../tacGia/TacGia.model';

export interface Truyen{
    binhLuans?: BinhLuan[];
    chuongs?: Chuong[];
    hinhAnh: string;
    moTa: string;
    phuLucs?: PhuLuc[];
    tacGiaID?: number;
    tacGia?: TacGia;
    tenTruyen: string;
    tenKhac?: string;
    theoDois?: TheoDoi[];
    tinhTrang?: boolean;
    trangThai?: number;
    truyenID?: number;
}