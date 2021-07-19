import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
@Injectable()
export class LogInService {
  private userID = new Subject<string>();

  constructor() { }

  public getUserID(): Observable<string>{
    return this.userID.asObservable();
  }

  public updateUserID(id: string): void {
    this.userID.next(id);
  }
}