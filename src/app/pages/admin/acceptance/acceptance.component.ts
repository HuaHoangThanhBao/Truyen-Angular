import { Component, OnInit } from '@angular/core';
import { Chuong } from 'src/app/model/chuong/Chuong.model';
import { Truyen } from 'src/app/model/truyen/Truyen.model';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { ChuongService } from '../../../services/model-service/chuongService.service';
declare function setUpAdmin(): void;

@Component({
  selector: 'app-acceptance',
  templateUrl: './acceptance.component.html',
  styleUrls: ['./acceptance.component.scss']
})
export class AcceptanceComponent implements OnInit {

  chuongs: Chuong[];
  
  constructor(private chuongService: ChuongService, private toast: ToastAlertService) {
   }

  ngOnInit(): void {
    setUpAdmin();
    
    this.chuongService.getListExtend("chuongwithnoidungchuong").subscribe(chuongs => {
      this.chuongs = chuongs;
      //console.log(chuongs)
    })
  }

  publishChapter(chuong: Chuong){
    chuong.trangThai = 1;//
    this.chuongService.updateWithID(chuong.chuongID + "", chuong).subscribe(res => {
      if (!res?.error) {
        this.toast.showToast("Thành công", "Xét duyệt chap thành công", "info");
      }
    });
  }
}
