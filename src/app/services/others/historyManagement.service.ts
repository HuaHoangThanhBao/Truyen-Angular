import { Injectable } from "@angular/core";
import { Router } from '@angular/router';

@Injectable()
export class HistoryManagement {

    constructor(private route: Router) {

    }

    public getHistories() {
        const localHist = JSON.parse(localStorage.getItem("tr_hist"));
        if (localHist != null) {
            let hist_arr = [...localHist];
            return hist_arr;
        }
        return [];
    }

    public addToHistory(truyenID: number, tenTruyen: string, chuongID: number, tenChuong: string, hinhAnh: string) {
        const data = { "truyenID": truyenID, "tenTruyen": tenTruyen, "chuongID": chuongID, "tenChuong": tenChuong, "hinhAnh": hinhAnh };
        const localHist = JSON.parse(localStorage.getItem("tr_hist"));
        let hist_arr;
        let found;

        if (localHist != null) {
            hist_arr = [...localHist];
            found = checkDuplicate();

            //Kiểm tra có duplicate không?
            //Có: thì cập nhật lại thông tin truyện/chương đang đọc
            //không: sang bước kế
            function checkDuplicate() {
                for (let i = 0; i < hist_arr.length; i++) {
                    if (hist_arr[i]["truyenID"] === truyenID) {
                        hist_arr[i]["tenTruyen"] = tenTruyen;
                        hist_arr[i]["chuongID"] = chuongID;
                        hist_arr[i]["tenChuong"] = tenChuong;
                        hist_arr[i]["hinhAnh"] = hinhAnh;
                        return true;
                    }
                }
                return false;
            }
        }
        else hist_arr = [];

        if (!found) hist_arr.push(data);

        localStorage.setItem("tr_hist", JSON.stringify(hist_arr));
        this.route.navigate([`details/story-reading/${truyenID}/${chuongID}`]);
    }

    public delelteHistoryItem(truyenID: number) {
        const localHist = JSON.parse(localStorage.getItem("tr_hist"));
        const hist_arr = [...localHist];
        const index = hist_arr.findIndex((item) => {
            return item["truyenID"] === truyenID;
        });
        hist_arr.splice(index, 1);
        localStorage.setItem("tr_hist", JSON.stringify(hist_arr));
    }
}