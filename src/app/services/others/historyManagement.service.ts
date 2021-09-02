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
        //alert(truyenID + "/" + chuongID)
        const data = { "truyenID": truyenID, "tenTruyen": tenTruyen, "chuongID": chuongID, "tenChuong": tenChuong, "hinhAnh": hinhAnh };
        const localHist = JSON.parse(localStorage.getItem("tr_hist"));
        let hist_arr;
        let found;

        if (localHist != null) {
            hist_arr = [...localHist];
            found = checkDuplicate();

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

        if (!found)
            hist_arr.push(data);

        //console.log(hist_arr)
        localStorage.setItem("tr_hist", JSON.stringify(hist_arr));

        this.route.navigate([`details/story-reading/${truyenID}/${chuongID}`]);
    }

    public delelteHistoryItem(truyenID: number) {
        let hist_arr;
        const localHist = JSON.parse(localStorage.getItem("tr_hist"));

        if (localHist != null) {
            hist_arr = [...localHist];

            const index = findIndex();
            hist_arr.splice(index, 1);

            function findIndex() {
                for (let i = 0; i < hist_arr.length; i++) {
                    if (hist_arr[i]["truyenID"] === truyenID) {
                        return i;
                    }
                }
            }

            localStorage.setItem("tr_hist", JSON.stringify(hist_arr));

            //this.route.navigate(["/history"]);
        }
    }
}