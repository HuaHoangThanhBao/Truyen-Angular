import { TheoDoi } from '../theodoi/TheoDoi.model';
import { BinhLuan } from '../binhluan/BinhLuan.model';

export interface User {
    userID?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    hinhAnh: string;
    theoDois?: TheoDoi[];
    binhLuans?: BinhLuan[];
}