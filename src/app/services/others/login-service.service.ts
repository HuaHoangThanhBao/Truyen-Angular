import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoginService {
  
  private userLoginID = new BehaviorSubject<string>("");
  currentUser = this.userLoginID.asObservable();

  constructor() { }

  setNewID(newID: string) {
    //console.log(newID);
    this.userLoginID.next(newID);
    return newID;
  }

}