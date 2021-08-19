import { TheoDoi } from '../theodoi/TheoDoi.model';
import { BinhLuan } from '../binhluan/BinhLuan.model';

export interface User {
    userID: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    quyen: number;
    password: string;
    tinhTrang: number;
    hinhAnh: string;
    theoDois: TheoDoi[];
    binhLuans: BinhLuan[];
}