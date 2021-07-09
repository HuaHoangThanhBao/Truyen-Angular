import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

import { UserForAuthenticationDto } from './../../../model/userForAuthenticationDto.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './../../../shared/services/authentication.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';

declare function setUpDarkMode(): void;
declare function loginFormSetUp(): void;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  jsonTheLoaiArr: any;
  invalidLogin: boolean;
  
  public loginForm: FormGroup;
  public errorMessage: string = '';
  public showError: boolean;
  private _returnUrl: string;

  constructor(private http: HttpClient, private _authService: AuthenticationService, private _router: Router, private _route: ActivatedRoute) { 
    // this.http.get(environment.apiURL + `/theloai`, {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //     "Api-Key": environment.apiKey
    //   })
    // })
    //   .toPromise()
    //   .then(theLoaiData => {
    //     this.jsonTheLoaiArr = theLoaiData;
    //     console.log(this.jsonTheLoaiArr);
    //   })
    }

  ngOnInit(): void {
    this.categoryDropdownInit();
    //loginFormSetUp();
    setUpDarkMode();

    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })

    this._returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  login(form: NgForm) {
    const credentials = JSON.stringify(form.value);
    this.http.post(environment.apiURL + `/auth/login`, credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    }).subscribe(response => {
      const token = (<any>response).token;
      console.log(token);
      localStorage.setItem("username", form.value["tenuser"]);
      localStorage.setItem("jwt", token);
      this.invalidLogin = false;
      window.location.href = '/index';
      //this.router.navigate(["/"]);
    }, err => {
      this.invalidLogin = true;
    });
  }

  logOut() {
    localStorage.removeItem("jwt");
  }

  categoryDropdownInit() {
    const catBut = document.getElementById('catagory-dropdown');
    catBut.addEventListener('click', function () {
      showMenuOnTablet();
    });

    function showMenuOnTablet() {
      var x = document.getElementById("top__nav");
      if (x.className === "nav__list") {
        x.className += " responsive";
      } else {
        x.className = "nav__list";
      }
    }
  }

  ////////
  public validateControl = (controlName: string) => {
    return this.loginForm.controls[controlName].invalid && this.loginForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName)
  }

  public loginUser = (loginFormValue) => {
    this.showError = false;
    const login = {... loginFormValue };
    const userForAuth: UserForAuthenticationDto = {
      email: login.username,
      password: login.password,
      clientURI: environment.apiURL + 'auth/forgotpassword'
    }

    this._authService.loginUser('auth/login', userForAuth)
    .subscribe(res => {
      if(res.is2StepVerificationRequired) {
        console.log('two step');
        this._router.navigate(['/two-step-veri'], 
          { queryParams: { returnUrl: this._returnUrl, provider: res.provider, email: userForAuth.email }});
      }
      else {
        console.log('two wrong');
        localStorage.setItem("token", res.token);
        this._authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
        //this._router.navigate([this._returnUrl]);
      }
    },
    (error) => {
      this.errorMessage = error;
      this.showError = true;
    })
  }
}
