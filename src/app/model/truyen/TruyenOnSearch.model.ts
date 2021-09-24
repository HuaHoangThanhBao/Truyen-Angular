import { TacGia } from "../tacGia/TacGia.model";
import { Chuong } from '../chuong/Chuong.model';

export interface TruyenOnSearch{
    truyenID?: number;
    tacGia?: TacGia;
    newestChapter: Chuong;
    tenTruyen: string;
    tenKhac: string;
    hinhAnh: string;
}