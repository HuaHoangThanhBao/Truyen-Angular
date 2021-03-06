import { Chuong } from '../chuong/Chuong.model';
import { Truyen } from '../truyen/Truyen.model';
import { User } from '../user/User.model';

export interface BinhLuan{
    binhLuanID?: number;
    chuong?: Chuong;
    chuongID?: number;
    danhGiaSao?: number;
    ngayBL?: string;
    noiDung?: string;
    tinhTrang?: boolean;
    truyen?: Truyen;
    user?: User;
    userID?: string;
    truyenID?: number;
}