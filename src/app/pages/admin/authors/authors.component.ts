import { Component, OnInit } from '@angular/core';
import { TacGiaService } from '../../../services/model-service/tacGiaService.service';
import { TacGia } from '../../../model/tacGia/TacGia.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';

declare function setUpAdmin(): void;

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  tacGias: TacGia[];
  addForm: FormGroup;
  searchResult: TacGia[];
  searchValue: string = "";
  currentTacGiaID: number;
  btnSubmitLocked: boolean = false;

  constructor(private tacGiaService: TacGiaService, private toast: ToastAlertService) {
  }

  ngOnInit(): void {
    setUpAdmin();

    this.tacGiaService.getList().subscribe(tacGias => {
      this.tacGias = tacGias;
      console.log(tacGias)
    })

    this.addForm = new FormGroup({
      tenTacGia: new FormControl('', [Validators.required]),
    });
  }

  filter(value: string) {
    this.searchValue = value;
    this.searchResult = this.tacGias.filter((tacGia) => {
      return tacGia.tenTacGia.toLowerCase().includes(value);
    });
  }

  addTacGia = (addFormValues) => {
    this.btnSubmitLocked = true;
    const formValues = { ...addFormValues };

    if (formValues.tenTacGia == "") {
      this.btnSubmitLocked = false;
      this.toast.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const tacGia: TacGia[] = [{
      tenTacGia: formValues.tenTacGia
    }]

    this.tacGiaService.post(tacGia)
      .subscribe(res => {
        if (!res?.error) {
          this.btnSubmitLocked = false;
          this.toast.showToast("Thành công", "Thêm tác giả thành công", "success");

          this.tacGiaService.getList().subscribe(tacGias => {
            this.tacGias = tacGias;
          })
        }
      });
  }

  deleteTacGia(tacGia: TacGia) {
    this.btnSubmitLocked = true;
    this.tacGiaService.delete("", tacGia.tacGiaID).subscribe(res => {
      this.btnSubmitLocked = false;//thành công/không thành công thì mở lại button
      if (!res?.error) {
        this.toast.showToast("Thành công", "Ẩn tác giả thành công", "success");

        this.tacGiaService.getList().subscribe(tacGias => {
          this.tacGias = tacGias;
          if (this.searchValue != "")
            this.filter(this.searchValue);
        })
      }
    })
  }

  getTacGiaName(tacGiaID: number): string {
    if (tacGiaID) {
      return this.tacGias.find(tacGia => {
        return tacGia.tacGiaID === tacGiaID
      }).tenTacGia;
    }
    else return "";
  }

  updateTacGia = (addFormValues) => {
    this.btnSubmitLocked = true;
    const formValues = { ...addFormValues };

    if (formValues.tenTacGia == "") {
      this.btnSubmitLocked = false;
      this.toast.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const tacGia: TacGia = {
      tenTacGia: formValues.tenTacGia
    }

    this.tacGiaService.updateWithID(this.currentTacGiaID.toString(), tacGia)
      .subscribe(res => {
        this.btnSubmitLocked = false;
        if (!res?.error) {
          this.toast.showToast("Thành công", "Cập nhật tác giả thành công", "success");

          this.closeModel('modal-tacGia-edit');

          this.tacGiaService.getList().subscribe(tacGias => {
            this.tacGias = tacGias;
          })
        }
      });
  }

  activeTacGia(tacGia: TacGia) {
    this.btnSubmitLocked = true;
    tacGia.tinhTrang = false;
    this.tacGiaService.updateWithID(tacGia.tacGiaID.toString(), tacGia).subscribe(res => {
      this.btnSubmitLocked = false;//thành công/không thành công thì mở lại button
      if (!res?.error) {
        this.toast.showToast("Thành công", "Active tác giả thành công", "success");

        this.tacGiaService.getList().subscribe(tacGias => {
          this.tacGias = tacGias;
          if (this.searchValue != "")
            this.filter(this.searchValue);
        })
      }
    })
  }

  openModelWithID(tacGiaID: number, id: string) {
    this.currentTacGiaID = tacGiaID;
    this.openModel(id);
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
