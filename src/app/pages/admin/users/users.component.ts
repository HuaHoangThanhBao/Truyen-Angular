import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/model-service/userService.service';
import { User } from '../../../model/user/User.model';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';

declare function setUpAdmin(): void;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];
  searchResult: User[];
  btnSubmitLocked: boolean = false;

  constructor(private userService: UserService, private toast: ToastAlertService) {
   }

  ngOnInit(): void {
    setUpAdmin();

    this.userService.getList().subscribe(users => {
      this.users = users;
      //console.log(users)
    })
  }

  filter(value: string){
    this.searchResult = [];
    for(let i = 0; i < this.users.length; i++){
      if(this.users[i].userName.toLowerCase().includes(value)){
        this.searchResult.push(this.users[i])
      }
    }
  }

  deleteUser(user: User){
    this.btnSubmitLocked = true;
    this.userService.delete("", user.userID.toString()).subscribe(res => {
      this.btnSubmitLocked = false;
      if(!res?.error){
        this.toast.showToast("Thành công", "Ẩn user thành công!", "success");
        this.userService.getList().subscribe(users => {
          this.users = users;
        })
      }
    })
  }
  
  activeUser(user: User){
    this.btnSubmitLocked = true;
    user.tinhTrang = false;
    this.userService.updateWithID(user.userID.toString(), user).subscribe(res => {
      this.btnSubmitLocked = false;
      if(!res?.error){
        this.toast.showToast("Thành công", "Active user thành công!", "success");
        this.userService.getList().subscribe(users => {
          this.users = users;
        })
      }
    })
  }

  pheDuyetUser(user: User){
    this.btnSubmitLocked = true;
    this.userService.postExtend(`pheduyetuser`, user).subscribe(res => {
      this.btnSubmitLocked = false;
      if(!res?.error){
        this.toast.showToast("Thành công", "Phê duyệt user thành công!", "success");
        this.userService.getList().subscribe(users => {
          this.users = users;
        })
      }
    })
  }
}
