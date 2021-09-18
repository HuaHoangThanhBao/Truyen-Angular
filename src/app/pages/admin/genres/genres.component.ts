import { Component, OnInit } from '@angular/core';
import { TheLoaiService } from '../../../services/model-service/theLoaiService.service';
import { TheLoai } from '../../../model/theloai/TheLoai.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';

declare function setUpAdmin(): void;

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {

  theLoais: TheLoai[];
  addForm: FormGroup;
  searchResult: TheLoai[];
  searchValue: string = "";
  currentTheLoaiID: number;
  btnSubmitLocked: boolean = false;

  constructor(private theLoaiService: TheLoaiService, private toast: ToastAlertService) {
  }

  ngOnInit(): void {
    setUpAdmin();

    this.theLoaiService.getList().subscribe(theLoais => {
      this.theLoais = theLoais;
    })

    this.addForm = new FormGroup({
      tenTheLoai: new FormControl('', [Validators.required]),
    });
  }

  filter(value: string) {
    this.searchValue = value;
    this.searchResult = this.theLoais.filter((theLoai) => {
      return theLoai.tenTheLoai.toLowerCase().includes(value);
    });
  }

  addTheLoai = (addFormValues) => {
    this.btnSubmitLocked = true;

    const formValues = { ...addFormValues };

    if (formValues.tenTheLoai == "") {
      this.btnSubmitLocked = false;
      this.toast.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const theLoai: TheLoai[] = [{
      tenTheLoai: formValues.tenTheLoai
    }]

    this.theLoaiService.post(theLoai)
      .subscribe(res => {
        if (!res?.error) {
          this.btnSubmitLocked = false;
          this.toast.showToast("Thành công", "Thêm thể loại thành công", "success");

          this.theLoaiService.getList().subscribe(theLoais => {
            this.theLoais = theLoais;
          })
        }
      });
  }

  deleteTheLoai(theLoai: TheLoai) {
    this.btnSubmitLocked = true;
    this.theLoaiService.delete("", theLoai.theLoaiID).subscribe(res => {
      this.btnSubmitLocked = false;//thành công/không thành công thì mở lại button
      if (!res?.error) {
        this.toast.showToast("Thành công", "Ẩn thể loại thành công", "success");

        this.theLoaiService.getList().subscribe(theLoais => {
          this.theLoais = theLoais;
          if (this.searchValue != "")
            this.filter(this.searchValue);
        })
      }
    })
  }

  activeTheLoai(theLoai: TheLoai) {
    this.btnSubmitLocked = true;
    theLoai.tinhTrang = false;
    this.theLoaiService.updateWithID(theLoai.theLoaiID.toString(), theLoai).subscribe(res => {
      this.btnSubmitLocked = false;//thành công/không thành công thì mở lại button
      if (!res?.error) {
        this.toast.showToast("Thành công", "Active thể loại thành công", "success");

        this.theLoaiService.getList().subscribe(theLoais => {
          this.theLoais = theLoais;
          if (this.searchValue != "")
            this.filter(this.searchValue);
        })
      }
    })
  }
  
  getTheLoaiName(theLoaiID: number): string {
    if (theLoaiID) {
      return this.theLoais.find(tacGia => {
        return tacGia.theLoaiID === theLoaiID
      }).tenTheLoai;
    }
    else return "";
  }

  
  updateTheLoai = (addFormValues) => {
    this.btnSubmitLocked = true;

    const formValues = { ...addFormValues };

    if (formValues.tenTheLoai == "") {
      this.btnSubmitLocked = false;
      this.toast.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const theLoai: TheLoai = {
      tenTheLoai: formValues.tenTheLoai
    }

    this.theLoaiService.updateWithID(this.currentTheLoaiID.toString(), theLoai)
      .subscribe(res => {
        this.btnSubmitLocked = false;
        if (!res?.error) {
          this.toast.showToast("Thành công", "Cập nhật thể loại thành công", "success");

          this.closeModel('modal-theloai-edit');

          this.theLoaiService.getList().subscribe(theLoais => {
            this.theLoais = theLoais;
          })
        }
      });
  }
  
  openModelWithID(theLoaiID: number, id: string) {
    this.currentTheLoaiID = theLoaiID;
    this.openModel(id);
  }

  openModel(id: string) {
    const modal = document.getElementById(`${id}`);
    modal.style.display = "block";
  }

  closeModel(id: string) {
    console.log(id)
    const modal = document.getElementById(`${id}`);
    modal.style.display = "none";
  }
}
