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
declare function getGAPIInstance(): void;
declare function setUpAdmin(): void;
declare function authenticate();
declare function loadClient(apiKey);
declare function execute(folderID);
declare function searchSubFolder(chapterFolderID, parentFolderName, subFolderName);

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {

  truyens: Truyen[];
  chuongs: Chuong[];
  tacGias: TacGia[];
  noiDungChuongs: NoiDungChuong[] = [];
  theLoais: TheLoai[];
  phuLucsOfTruyen: PhuLuc[];

  addForm: FormGroup;
  addChuongForm: FormGroup;
  danhSachHinhAnhTruyens: DriveModel[] = [];

  hinhAnhChosen: string = "";
  soLuong: number[];

  //currentTruyenID: number;
  currentTruyen: Truyen;
  searchResult: Truyen[];

  noImageToShow: boolean = false;
  googleLogIn: boolean = false;
  btnSubmitLocked: boolean = false;

  idTacGiaOnSearch: number;

  gapi: any;

  constructor(private truyenService: TruyenService, private tacGiaService: TacGiaService, private toast: ToastAlertService,
    private chuongService: ChuongService, private noiDungChuongService: NoiDungChuongService, private phuLucService: PhuLucService,
    private theLoaiService: TheLoaiService) {
    this.gapi = getGAPIInstance();
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
      tenKhac: new FormControl(''),
      moTa: new FormControl('', [Validators.required]),
      tacGia: new FormControl(''),
    });

    this.addChuongForm = new FormGroup({
      tenChuong: new FormControl(''),
      folderID: new FormControl('')
    });

    this.gapi.load("client:auth2", () => {
      this.gapi.auth2.init({ client_id: environment.clientId });
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

  addTruyen = (addFormValues, modalID) => {
    this.btnSubmitLocked = true;

    if (this.hinhAnhChosen == "") {
      this.btnSubmitLocked = false;
      this.toast.showToast("L???i", "B???n ch??a ch???n h??nh ???nh cho truy???n", "error");
      return;
    }

    const formValues = { ...addFormValues };

    if (formValues.moTa == "" || formValues.tenTruyen == "" || formValues.hinhAnh == "") {
      this.btnSubmitLocked = false;
      this.toast.showToast("L???i", "Vui l??ng ??i???n ?????y ????? th??ng tin", "error");
      return;
    }

    if (formValues.tacGiaID == "" && !this.idTacGiaOnSearch) {
      this.toast.showToast("L???i", "B???n ch??a ch???n t??c gi??? cho truy???n", "error");
    }

    const truyen: Truyen[] = [{
      moTa: formValues.moTa,
      tenTruyen: formValues.tenTruyen,
      tenKhac: formValues.tenKhac === "" ? null: formValues.tenKhac,
      tacGiaID: formValues.tacGia === "" ? this.idTacGiaOnSearch : formValues.tacGia,
      hinhAnh: this.hinhAnhChosen
    }]

    //console.log(truyen)

    this.truyenService.post(truyen)
      .subscribe(res => {
        this.btnSubmitLocked = false;
        if (!res?.error) {
          this.toast.showToast("Th??nh c??ng", "Th??m truy???n th??nh c??ng", "success");
          this.hinhAnhChosen = "";

          this.closeModal(modalID);

          this.truyenService.getList().subscribe(truyens => {
            this.truyens = truyens;
          })
        }
      });
  }

  searchTacGia(name: string) {
    this.tacGiaService.getList().subscribe(tacgias => {
      for (let i = 0; i < tacgias.length; i++) {
        if (tacgias[i].tenTacGia == name.toLowerCase()) {
          this.idTacGiaOnSearch = tacgias[i].tacGiaID;
          break;
        }
      }
    })
  }

  chooseImage(url: string) {
    this.hinhAnhChosen = url;
  }

  async loadTruyenFolderData() {
    if (!this.googleLogIn) {
      this.toast.showToast("L???i", "Vui l??ng ????ng nh???p google tr?????c", "error");
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
      this.btnSubmitLocked = false;
      if (!res?.error) {
        this.toast.showToast("Th??nh c??ng", "Ph?? duy???t truy???n th??nh c??ng", "success");

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

  parentFolderName: string;
  subFolderName: string;
  searchSubFolderResultTitle: string;
  searchSubFolderResultID: string;

  attachParentFolder(name) {
    this.parentFolderName = name;
    this.searchForSubFolder();
  }
  attachSubFolder(name) {
    this.subFolderName = name;
    this.searchForSubFolder();
  }

  async searchForSubFolder() {
    if (!this.googleLogIn) {
      this.btnSubmitLocked = false;
      this.toast.showToast("L???i", "Vui l??ng ????ng nh???p google tr?????c", "error");
      return;
    }

    const result = await searchSubFolder(environment.folderChapterID, this.parentFolderName, this.subFolderName);
    //console.log(result);
    this.searchSubFolderResultID = result.id;
    this.searchSubFolderResultTitle = result.title;
  }

  addDanhSachChuong = (form, modalID) => {
    this.btnSubmitLocked = true;

    if (!this.googleLogIn) {
      this.btnSubmitLocked = false;
      this.toast.showToast("L???i", "Vui l??ng ????ng nh???p google tr?????c", "error");
      return;
    }

    const formValues = { ...form };
    //v?? modal c?? s??? d???ng Model n??y n??n ph???i reset l???i
    this.noiDungChuongs = [];
    //console.log(formValues);

    if (formValues.tenChuong == "" || formValues.folderID == "") {
      this.btnSubmitLocked = false;
      this.toast.showToast("L???i", "Vui l??ng ??i???n ?????y ????? th??ng tin", "error");
      return;
    }

    const chuong: Chuong[] = [{
      truyenID: this.currentTruyen.truyenID,
      tenChuong: "chap " + formValues.tenChuong
    }];


    this.loadNoiDungTruyenFolderData(formValues.folderID).then(result => {
      //console.log(result);
      this.chuongService.post(chuong).subscribe(newChuong => {
        if (!newChuong?.error) {
          result.forEach((f) => {
            const n: NoiDungChuong = {
              chuongID: newChuong[0].chuongID,
              hinhAnh: f.id
            };
            this.noiDungChuongs.push(n);
            //console.log(this.noiDungChuongs);
          })

          this.noiDungChuongService.post(this.noiDungChuongs).subscribe(res => {
            this.btnSubmitLocked = false;
            if (!res?.error) {
              //console.log(res);
              this.toast.showToast("Th??nh c??ng", "Th??m ch????ng v?? n???i dung th??nh c??ng", "success");
              this.noiDungChuongs = [];

              //this.closeModal(modalID);

              this.truyenService.getDetail(this.currentTruyen.truyenID).subscribe(details => {
                this.currentTruyen = details;
              })

              this.chuongService.getListExtend(`${this.currentTruyen.truyenID}/chuongbytruyenid`).subscribe(chuongs => {
                this.chuongs = chuongs;
              });
            }
          })
        }
        else {
          this.btnSubmitLocked = false;
        }
      });
    })
      .catch(_ => {
        this.btnSubmitLocked = false;
        this.toast.showToast("L???i", "Kh??ng th??? load h??nh ???nh trong folder", "error")
      });
  }

  pheDuyetChuong(chuong: Chuong) {
    chuong.trangThai = 1;
    this.chuongService.updateWithID(chuong.chuongID.toString(), chuong).subscribe(res => {
      if (!res?.error) {
        this.toast.showToast("Th??nh c??ng", "Ph?? duy???t ch????ng th??nh c??ng", "success");
        this.truyenService.getDetail(this.currentTruyen.truyenID).subscribe(details => {
          this.currentTruyen = details;
        })
      }
    })
  }

  disableChuong(chuong: Chuong) {
    chuong.trangThai = 0;
    this.chuongService.updateWithID(chuong.chuongID.toString(), chuong).subscribe(res => {
      if (!res?.error) {
        this.toast.showToast("C???n th???n", "Ch????ng n??y t???m th???i b??? ???n n??n user s??? kh??ng th???y ???????c. H??y c???n th???n", "success");
        this.truyenService.getDetail(this.currentTruyen.truyenID).subscribe(details => {
          this.currentTruyen = details;
        })
      }
    })
  }



  ///////////////////////////////////////
  showHinhAnh(chuongID: number) {
    this.noiDungChuongs = [];
    this.chuongService.getDetail(chuongID).subscribe(chuong => {
      //console.log(this.noiDungChuongs)

      this.noiDungChuongs = chuong.noiDungChuongs;
      this.noImageToShow = this.noiDungChuongs.length > 0 ? false : true;
    })
  }

  chooseHinhAnhForUpdate(nd: NoiDungChuong) {
    nd.tinhTrang == false ? nd.tinhTrang = true : nd.tinhTrang = false;
    //console.log(this.noiDungChuongs)
  }

  updateAllNoiDungChuong(modalID) {
    this.btnSubmitLocked = true;

    if (this.noiDungChuongs.length == 0 || !this.noiDungChuongs) {
      this.btnSubmitLocked = false;
      this.toast.showToast("L???i", "B???n ch??a ch???n ch????ng ????? c???p nh???t", "error");
      return;
    }
    this.noiDungChuongService.updateExtendRoute("multiple", this.noiDungChuongs).subscribe(res => {
      this.btnSubmitLocked = false;
      if (!res?.error) {
        //console.log(res);
        this.toast.showToast("Th??nh c??ng", "C???p nh???t ch????ng th??nh c??ng", "success");
        this.noiDungChuongs = [];

        this.closeModal(modalID);

        this.truyenService.getDetail(this.currentTruyen.truyenID).subscribe(details => {
          this.currentTruyen = details;
        })
      }
    })
  }





  ///////////////////////////////////////
  openModalWithID(truyenID: number, id: string) {
    this.noiDungChuongs = [];
    this.hinhAnhChosen = "";

    this.truyenService.getDetail(truyenID).subscribe(details => {
      const modal = document.getElementById(id);
      modal.style.display = "block";

      //console.log(details);

      this.currentTruyen = details;
    })

    this.chuongService.getListExtend(`${truyenID}/chuongbytruyenid`).subscribe(chuongs => {
      this.chuongs = chuongs;
    });

    this.theLoaiService.getList().subscribe(theLoais => {
      this.theLoais = theLoais;
      //console.log(theLoais)
    });

    this.phuLucService.getListExtend(`${truyenID}`).subscribe(phulucs => {
      this.phuLucsOfTruyen = phulucs;
      //console.log(phulucs)
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

  updateAllPhulucs(modalID) {
    this.btnSubmitLocked = true;
    const tmp: PhuLuc[] = [...this.phuLucsOfTruyen];

    var checkBoxes = document.querySelectorAll('.phu-luc-checkbox') as NodeListOf<HTMLInputElement>;
    checkBoxes.forEach(item => {
      //console.log(item.value + "/" + item.checked);

      const found = this.checkTheLoaiIDNormal(parseInt(item.value))
      if (!found && item.checked) {
        const newPhuLuc: PhuLuc = {
          theLoaiID: parseInt(item.value),
          truyenID: this.currentTruyen.truyenID,
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

    this.phuLucService.update(tmp).subscribe(res => {
      this.btnSubmitLocked = false;
      if (!res?.error) {
        this.toast.showToast("Th??nh c??ng", "C???p nh???t danh s??ch ph??? l???c th??nh c??ng", "success");

        this.closeModal(modalID);

        this.phuLucService.getListExtend(`${this.currentTruyen.truyenID}`).subscribe(phulucs => {
          this.phuLucsOfTruyen = phulucs;
        });
      }
    })
  }

  openModal(id: string) {
    const modal = document.getElementById(`${id}`);
    modal.style.display = "block";
  }

  closeModal(id: string) {
    const modal = document.getElementById(`${id}`);
    modal.style.display = "none";
  }




  /////////Info

  getTruyenName(truyenID: number): string {
    if (truyenID) {
      return this.truyens.find(truyen => {
        return truyen.truyenID === truyenID
      }).tenTruyen;
    }
    else return "";
  }

  getMoTa(truyenID: number): string {
    if (truyenID) {
      return this.truyens.find(truyen => {
        return truyen.truyenID === truyenID
      }).moTa;
    }
    else return "";
  }
  
  getTenKhac(truyenID: number): string {
    if (truyenID) {
      return this.truyens.find(truyen => {
        return truyen.truyenID === truyenID
      }).tenKhac;
    }
    else return "";
  }

  updateTruyen = (addFormValues, modalID) => {
    this.closeModal(modalID);
    this.btnSubmitLocked = true;
    const formValues = { ...addFormValues };
    const t = this.truyens.find(truyen => {
      return truyen.truyenID === this.currentTruyen.truyenID
    })

    const truyen: Truyen = {
      moTa: formValues.moTa === "" ? t.moTa : formValues.moTa,
      tenTruyen: formValues.tenTruyen === "" ? t.tenTruyen : formValues.tenTruyen,
      tenKhac: formValues.tenKhac === "" ? t.tenKhac: formValues.tenKhac,
      tacGiaID: formValues.tacGia === "" ? t.tacGiaID : formValues.tacGia,
      hinhAnh: this.hinhAnhChosen === "" ? t.hinhAnh : formValues.hinhAnh,
      tinhTrang: t.tinhTrang,
      trangThai: t.trangThai,
    }

    this.truyenService.updateWithID(this.currentTruyen.truyenID.toString(), truyen)
      .subscribe(res => {
        this.btnSubmitLocked = false;
        if (!res?.error) {
          this.toast.showToast("Th??nh c??ng", "C???p nh???t truy???n th??nh c??ng", "success");
          this.hinhAnhChosen = "";

          this.closeModal(modalID);

          this.truyenService.getList().subscribe(truyens => {
            this.truyens = truyens;
          })
        }
      });
  }
}
