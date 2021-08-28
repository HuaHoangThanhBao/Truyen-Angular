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

  constructor(private tacGiaService: TacGiaService, private toast: ToastAlertService) {
   }

  ngOnInit(): void {
    setUpAdmin();

    this.tacGiaService.getList().subscribe(tacGias => {
      this.tacGias = tacGias
    })
    
    this.addForm = new FormGroup({
      tenTacGia: new FormControl('', [Validators.required]),
    });
  }
  
  filter(value: string){
    this.searchResult = [];
    for(let i = 0; i < this.tacGias.length; i++){
      if(this.tacGias[i].tenTacGia.toLowerCase().includes(value)){
        this.searchResult.push(this.tacGias[i])
      }
    }
  }

  addTacGia = (addFormValues) => {
    const formValues = { ...addFormValues };

    if (formValues.tenTacGia == "") {
      this.toast.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const tacGia: TacGia[] = [{
      tenTacGia: formValues.tenTacGia
    }]

    this.tacGiaService.post(tacGia)
      .subscribe(res => {
        if (!res?.error) {
        this.toast.showToast("Thành công", "Thêm tác giả thành công", "success");
        }
      });
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
