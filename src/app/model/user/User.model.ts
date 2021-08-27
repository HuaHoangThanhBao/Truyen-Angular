import { TheoDoi } from '../theodoi/TheoDoi.model';
import { BinhLuan } from '../binhluan/BinhLuan.model';

export interface User {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    hinhAnh: string;
    theoDois: TheoDoi[];
    binhLuans: BinhLuan[];
}