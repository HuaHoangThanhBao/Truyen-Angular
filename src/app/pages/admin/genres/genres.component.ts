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
  
  filter(value: string){
    this.searchResult = [];
    for(let i = 0; i < this.theLoais.length; i++){
      if(this.theLoais[i].tenTheLoai.toLowerCase().includes(value)){
        this.searchResult.push(this.theLoais[i])
      }
    }
  }

  addTheLoai = (addFormValues) => {
    const formValues = { ...addFormValues };

    if (formValues.tenTheLoai == "") {
      this.toast.showToast("Lỗi", "Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    const theLoai: TheLoai[] = [{
      tenTheLoai: formValues.tenTheLoai
    }]

    this.theLoaiService.post(theLoai)
      .subscribe(res => {
        if (!res?.error) {
        this.toast.showToast("Thành công", "Thêm thể loại thành công", "success");
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
