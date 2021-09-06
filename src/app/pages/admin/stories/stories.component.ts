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
import { environment } from '../../../../environments/environment';
import { PhuLucService } from '../../../services/model-service/phuLucService.service';
import { PhuLuc } from '../../../model/phuluc/PhuLuc.model';
import { TheLoaiService } from '../../../services/model-service/theLoaiService.service';
import { TheLoai } from '../../../model/theloai/TheLoai.model';
declare function setUpAdmin(): void;
declare function authenticate();
declare function loadClient(apiKey);
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
  theLoais: TheLoai[];
  phuLucsOfTruyen: PhuLuc[];

  addForm: FormGroup;
  addChuongForm: FormGroup;
  danhSachHinhAnhTruyens: DriveModel[] = [];

  hinhAnhChosen: string = "";
  soLuong: number[];

  currentTruyenID: number;
  currentTruyen: Truyen;
  searchResult: Truyen[];

  noImageToShow: boolean = false;
  googleLogIn: boolean = false;
  btnSubmitLocked: boolean = false;

  constructor(private truyenService: TruyenService, private tacGiaService: TacGiaService, private toast: ToastAlertService,
    private chuongService: ChuongService, private noiDungChuongService: NoiDungChuongService, private phuLucService: PhuLucService,
    private theLoaiService: TheLoaiService) {
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

  filter(value: string) {
    this.searchResult = [];
    for (let i = 0; i < this.truyens.length; i++) {
      if (this.truyens[i].tenTruyen.toLowerCase().includes(value)) {
        this.searchResult.push(this.truyens[i])
      }
    }
  }


  async loadAuth() {
    return await authenticate();
  }

  async loadAuthClient() {
    return await loadClient(environment.googleApiKey);
  }

  googleSignInProcess() {
    this.loadAuth().then(this.loadAuthClient).then(m => this.googleLogIn = true);
  }

  addTruyen = (addFormValues) => {
    this.btnSubmitLocked = true;

    if (this.hinhAnhChosen == "") {
      this.btnSubmitLocked = false;
      this.toast.showToast("Lỗi", "Bạn chưa chọn hình ảnh cho truyện", "error");
      return;
    }

    const formValues = { ...addFormValues };

    if (formValues.moTa == "" || formValues.tenTruyen == "" || formValues.tacGiaID == "" || formValues.hinhAnh == "") {
      this.btnSubmitLocked = false;
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
          this.btnSubmitLocked = false;
          this.toast.showToast("Thành công", "Thêm truyện thành công", "success");
          this.hinhAnhChosen = "";

          this.truyenService.getList().subscribe(truyens => {
            this.truyens = truyens;
          })
        }
      });
  }

  chooseImage(url: string) {
    this.hinhAnhChosen = url;
  }

  async loadTruyenFolderData() {
    if (!this.googleLogIn) {
      this.toast.showToast("Lỗi", "Vui lòng đăng nhập google trước", "error");
      return;
    }
    const result = await execute(environment.folderGGDriveImageID);
    this.danhSachHinhAnhTruyens = result;
    //console.log(this.danhSachHinhAnhTruyens);
  }

  pheDuyetTruyen(truyen: Truyen) {
    this.btnSubmitLocked = true;

    truyen.trangThai = 1;
    this.truyenService.updateWithID(truyen.truyenID.toString(), truyen).subscribe(res => {
      if(!res?.error){
        this.btnSubmitLocked = false;
        this.toast.showToast("Thành công", "Phê duyệt truyện thành công", "success");
  
        this.truyenService.getList().subscribe(truyens => {
          this.truyens = truyens;
        })
      }
    })
  }





  ///////////////////////////////////////
  async loadNoiDungTruyenFolderData(folderID) {
    const result = await execute(folderID);
    return result;
  }

  addDanhSachChuong = (form) => {
    this.btnSubmitLocked = true;

    if (!this.googleLogIn) {
      this.btnSubmitLocked = false;
      this.toast.showToast("Lỗi", "Vui lòng đăng nhập google trước", "error");
      return;
    }

    const formValues = { ...form };
    //vì modal có sử dụng Model này nên phải reset lại
    this.noiDungChuongs = [];
    //console.log(formValues);

    if (formValues.tenChuong == "" || formValues.folderID == "") {
      this.btnSubmitLocked = false;
      this.toast.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const chuong: Chuong[] = [{
      truyenID: this.currentTruyenID,
      tenChuong: "Chap " + formValues.tenChuong
    }];


    this.loadNoiDungTruyenFolderData(formValues.folderID).then(result => {
      this.chuongService.post(chuong).subscribe(newChuong => {
        result.forEach((f) => {
          const n: NoiDungChuong = {
            chuongID: newChuong[0].chuongID,
            hinhAnh: f.id
          };
          this.noiDungChuongs.push(n);
        })

        this.noiDungChuongService.post(this.noiDungChuongs).subscribe(res => {
          if (!res?.error) {
            this.btnSubmitLocked = false;
            console.log(res);
            this.toast.showToast("Thành công", "Thêm chương và nội dung thành công", "success");
            this.noiDungChuongs = [];


            this.truyenService.getDetail(this.currentTruyenID).subscribe(details => {
              this.currentTruyenID = details.truyenID;
              this.currentTruyen = details;
            })
          }
        })
      });
    })
      .catch(_ => {
        this.btnSubmitLocked = false;
        this.toast.showToast("Lỗi", "Không thể load hình ảnh trong folder", "error")
      });
  }

  pheDuyetChuong(chuong: Chuong) {
    chuong.trangThai = 1;
    this.chuongService.updateWithID(chuong.chuongID.toString(), chuong).subscribe(res => {
      if(!res?.error){
        this.toast.showToast("Thành công", "Phê duyệt chương thành công", "success");
        this.truyenService.getDetail(this.currentTruyenID).subscribe(details => {
          this.currentTruyenID = details.truyenID;
          this.currentTruyen = details;
        })
      }
    })
  }

  disableChuong(chuong: Chuong) {
    chuong.trangThai = 0;
    this.chuongService.updateWithID(chuong.chuongID.toString(), chuong).subscribe(res => {
      if(!res?.error){
        this.toast.showToast("Cẩn thận", "Chương này tạm thời bị ẩn nên user sẽ không thấy được. Hãy cẩn thận", "success");
        this.truyenService.getDetail(this.currentTruyenID).subscribe(details => {
          this.currentTruyenID = details.truyenID;
          this.currentTruyen = details;
        })
      }
    })
  }



  ///////////////////////////////////////
  showHinhAnh(chuongID: number) {
    this.noiDungChuongs = [];
    this.chuongService.getDetail(chuongID).subscribe(chuong => {
      console.log(this.noiDungChuongs)

      this.noiDungChuongs = chuong.noiDungChuongs;
      this.noImageToShow = this.noiDungChuongs.length > 0 ? false : true;
    })
  }

  chooseHinhAnhForUpdate(nd: NoiDungChuong) {
    nd.tinhTrang == false ? nd.tinhTrang = true : nd.tinhTrang = false;
    console.log(this.noiDungChuongs)
  }

  updateAllNoiDungChuong() {
    this.btnSubmitLocked = true;

    if (this.noiDungChuongs.length == 0 || !this.noiDungChuongs) {
      this.btnSubmitLocked = false;
      this.toast.showToast("Lỗi", "Bạn chưa chọn chương để cập nhật", "error");
      return;
    }
    this.noiDungChuongService.updateExtendRoute("multiple", this.noiDungChuongs).subscribe(res => {
      if (!res?.error) {
        this.btnSubmitLocked = false;
        console.log(res);
        this.toast.showToast("Thành công", "Cập nhật chương thành công", "success");
        this.noiDungChuongs = [];


        this.truyenService.getDetail(this.currentTruyenID).subscribe(details => {
          this.currentTruyenID = details.truyenID;
          this.currentTruyen = details;
        })
      }
    })
  }





  ///////////////////////////////////////
  openModelWithID(truyenID: number, id: string) {
    this.noiDungChuongs = [];
    this.hinhAnhChosen = "";
    
    this.truyenService.getDetail(truyenID).subscribe(details => {
      const modal = document.getElementById(id);
      modal.style.display = "block";
      this.currentTruyenID = details.truyenID;

      console.log(details);
      this.currentTruyen = details;
    })

    this.theLoaiService.getList().subscribe(theLoais => {
      this.theLoais = theLoais;
      //console.log(theLoais)
    });

    this.phuLucService.getListExtend(`${truyenID}`).subscribe(phulucs => {
      this.phuLucsOfTruyen = phulucs;
      console.log(phulucs)
    });
  }

  checkTheLoaiID(theLoaiID: number): boolean {
    const checkCallBack = (element) => element.theLoaiID == theLoaiID && !element.tinhTrang;
    return this.phuLucsOfTruyen.some(checkCallBack);
  }

  checkTheLoaiIDNormal(theLoaiID: number): boolean {
    const checkCallBack = (element) => element.theLoaiID == theLoaiID;
    return this.phuLucsOfTruyen.some(checkCallBack);
  }

  updateAllPhulucs() {
    this.btnSubmitLocked = true;
    const tmp: PhuLuc[] = [...this.phuLucsOfTruyen];

    var checkBoxes = document.querySelectorAll('.phu-luc-checkbox') as NodeListOf<HTMLInputElement>;
    checkBoxes.forEach(item => {
      //console.log(item.value + "/" + item.checked);

      const found = this.checkTheLoaiIDNormal(parseInt(item.value))
      if (!found && item.checked) {
        const newPhuLuc: PhuLuc = {
          theLoaiID: parseInt(item.value),
          truyenID: this.currentTruyenID,
          tinhTrang: false
        }
        tmp.push(newPhuLuc);
      }
      else {
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i].theLoaiID == parseInt(item.value)) {
            tmp[i].tinhTrang = !item.checked;
            break;
          }
        }
      }
    })
    console.log(tmp);
    this.phuLucService.update(tmp).subscribe(res => {
      if(!res?.error){
        this.phuLucService.getListExtend(`${this.currentTruyenID}`).subscribe(phulucs => {
          this.phuLucsOfTruyen = phulucs;
          this.btnSubmitLocked = false;
        });
      }
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




  /////////Avatar
  updateAvatar() {
    this.btnSubmitLocked = true;

    if(this.hinhAnhChosen == ""){
      this.btnSubmitLocked = false;
      this.toast.showToast("Lỗi", "Bạn chưa chọn hình ảnh", "error");
      return;
    }

    this.currentTruyen.hinhAnh = this.hinhAnhChosen;
    this.truyenService.updateWithID(this.currentTruyen.truyenID.toString(), this.currentTruyen).subscribe(res => {
      if(!res?.error){
        this.btnSubmitLocked = false;
        this.toast.showToast("Thành công", "Cập nhật avatar cho truyện thành công", "success");
  
        this.truyenService.getList().subscribe(truyens => {
          this.truyens = truyens;
          //console.log(truyens)
        })
      }
    })
  }
}
