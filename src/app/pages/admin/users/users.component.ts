import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/model-service/userService.service';
import { User } from '../../../model/user/User.model';

declare function setUpAdmin(): void;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[];

  constructor(private userService: UserService) {
   }

  ngOnInit(): void {
    setUpAdmin();

    this.userService.getList().subscribe(users => {
      this.users = users;
    })
  }

}
