import { TheoDoi } from '../theodoi/TheoDoi.model';
import { BinhLuan } from '../binhluan/BinhLuan.model';

export interface User {
    userID?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    hinhAnh: string;
    quyen?: boolean;
    theoDois?: TheoDoi[];
    binhLuans?: BinhLuan[];
    tinhTrang?: boolean;
    lockoutEnabled?: boolean;
}