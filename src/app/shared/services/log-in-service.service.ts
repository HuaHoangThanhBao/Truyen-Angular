import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
@Injectable()
export class LogInService {
  private loginStatus = new Subject<boolean>();
  private userID: string = "";

  constructor() { }

  public setUserID(id){
    this.userID = id;
  }

  public getUserID(){
    return this.userID;
  }
  /*
   * @return {Observable<string>} : siblingMsg
   */
  public getLoginStatus(): Observable<boolean> {
    return this.loginStatus.asObservable();
  }
  /*
   * @param {string} message : siblingMsg
   */
  public updateLoginStatus(status: boolean): void {
    this.loginStatus.next(status);
  }
}