import { Component, OnInit } from '@angular/core';
import { TruyenService } from '../../../services/model-service/truyenService.service';
import { Truyen } from '../../../model/truyen/Truyen.model';
import { TacGiaService } from '../../../services/model-service/tacGiaService.service';
import { TacGia } from '../../../model/tacGia/TacGia.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DriveModel } from '../../../model/google-drive/DriveModel.model';
import { ToastAlertService } from '../../../services/others/toast-alert-service.service';
import { ChuongService } from '../../../services/model-service/chuongService.service';
import { Chuong } from '../../../model/chuong/Chuong.model';
import { NoiDungChuong } from '../../../model/noidungchuong/NoiDungChuong.model';
import { NoiDungChuongService } from '../../../services/model-service/noiDungChuongService.service';
declare function setUpAdmin(): void;
declare function authenticate();
declare function loadClient();
declare function execute(folderID);

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {

  truyens: Truyen[];
  tacGias: TacGia[];
  noiDungChuongs: NoiDungChuong[] = [];
  addForm: FormGroup;
  addChuongForm: FormGroup;
  danhSachHinhAnhTruyens: DriveModel[] = [];

  hinhAnhChosen: string = "";
  soLuong: number[];

  currentTruyenID: number;
  currentTruyen: Truyen;
  searchResult: Truyen[];

  constructor(private truyenService: TruyenService, private tacGiaService: TacGiaService, private toast: ToastAlertService,
    private chuongService: ChuongService, private noiDungChuongService: NoiDungChuongService) {
  }

  ngOnInit(): void {
    setUpAdmin();

    this.truyenService.getList().subscribe(truyens => {
      this.truyens = truyens;
      //console.log(truyens)
    })

    this.tacGiaService.getList().subscribe(tacGias => {
      this.tacGias = tacGias;
    })

    ///

    this.addForm = new FormGroup({
      tenTruyen: new FormControl('', [Validators.required]),
      moTa: new FormControl('', [Validators.required]),
      tacGia: new FormControl(''),
    });

    this.addChuongForm = new FormGroup({
      tenChuong: new FormControl(''),
      folderID: new FormControl('')
    });
  }

  filter(value: string){
    this.searchResult = [];
    for(let i = 0; i < this.truyens.length; i++){
      if(this.truyens[i].tenTruyen.toLowerCase().includes(value)){
        this.searchResult.push(this.truyens[i])
      }
    }
  }

  addTruyen = (addFormValues) => {
    if (this.hinhAnhChosen == "") {
      this.toast.showToast("Lỗi", "Bạn chưa chọn hình ảnh cho truyện", "error");
      return;
    }

    const formValues = { ...addFormValues };

    if (formValues.moTa == "" || formValues.tenTruyen == "" || formValues.tacGiaID == "" || formValues.hinhAnh == "") {
      this.toast.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const truyen: Truyen[] = [{
      moTa: formValues.moTa,
      tenTruyen: formValues.tenTruyen,
      tacGiaID: formValues.tacGia,
      hinhAnh: this.hinhAnhChosen
    }]

    console.log(truyen)

    this.truyenService.post(truyen)
      .subscribe(res => {
        if (!res?.error) {
          this.toast.showToast("Thành công", "Thêm truyện thành công", "success");
          this.hinhAnhChosen = "";
        }
      });
  }

  chooseImage(url: string) {
    this.hinhAnhChosen = url;
  }

  async loadTruyenFolderData() {
    const result = await execute("1ViYgS-kn329JigKiCJuavoMTMpvbudmm");
    this.danhSachHinhAnhTruyens = result;
    //console.log(this.danhSachHinhAnhTruyens);
  }





  ///////////////////////////////////////
  async loadNoiDungTruyenFolderData(folderID) {
    const result = await execute(folderID);
    return result;
  }

  addDanhSachChuong = (form) => {
    const formValues = { ...form };
    //console.log(formValues);

    if (formValues.tenChuong == "" || formValues.folderID == "") {
      this.toast.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const chuong: Chuong[] = [{
      truyenID: this.currentTruyenID,
      tenChuong: formValues.tenChuong
    }];

    this.chuongService.post(chuong).subscribe(newChuong => {
      //console.log(newChuong);

      this.loadNoiDungTruyenFolderData(formValues.folderID).then(result => {
        console.log(result);

        result.forEach((f) => {
          const n: NoiDungChuong = {
            chuongID: newChuong[0].chuongID,
            hinhAnh: f.id
          };
          this.noiDungChuongs.push(n);
        })

        //console.log(this.noiDungChuongs);

        this.noiDungChuongService.post(this.noiDungChuongs).subscribe(nd => {
          if (!nd?.error) {
            console.log(nd);
            this.toast.showToast("Thành công", "Thêm chương và nội dung thành công", "success");
            this.noiDungChuongs = [];
          }
        })
      });
    })
  }





  ///////////////////////////////////////
  openModelChuong(truyendID: number) {
    this.truyenService.getDetail(truyendID).subscribe(details => {
      const modal = document.getElementById('modal-chuong');
      modal.style.display = "block";
      this.currentTruyenID = details.truyenID;

      console.log(details);
      this.currentTruyen = details;
    })
  }

  openModel(id: string) {
    const modal = document.getElementById(`${id}`);
    modal.style.display = "block";
  }

  closeModel(id: string) {
    const modal = document.getElementById(`${id}`);
    modal.style.display = "none";
  }
}
