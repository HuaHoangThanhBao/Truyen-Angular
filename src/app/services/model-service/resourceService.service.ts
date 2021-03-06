import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequestParam } from '../../model/param/RequestParam.model';
import { ToastAlertService } from '../others/toast-alert-service.service';

@Injectable({
    providedIn: 'root'
})
export abstract class ResourceService<T> {
    private readonly APIUrl = `${environment.apiURL}/${this.getResourceUrl()}`;

    private readonly httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
            'Api-Key': environment.apiKey
        }),
    };

    constructor(protected httpClient: HttpClient, protected toastService: ToastAlertService) {
    }

    abstract getResourceUrl(): string;

    getList(): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.APIUrl}`, this.httpOptions)
            .pipe(
                catchError(this.handleError<T[]>())
            );
    }
    
    getListWithID(id: string): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.APIUrl}/${id}`, this.httpOptions)
            .pipe(
                catchError(this.handleError<T[]>())
            );
    }
    
    getListExtend(extendRoute: string): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.APIUrl}/${extendRoute}`, this.httpOptions)
            .pipe(
                catchError(this.handleError<T[]>())
            );
    }

    getListWithParams(params: RequestParam): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.APIUrl}/pagination?${this.convertParams(params)}`, this.httpOptions)
            .pipe(
                catchError(this.handleError<T[]>())
            );
    }

    getListHeaders = async (params: RequestParam, headerName: string): Promise<string> => {
        const request = await fetch(`${this.APIUrl}/pagination?${this.convertParams(params)}`, {
            headers: {
                "Content-Type": "application/json",
                'Api-Key': environment.apiKey
            }
        });
        return request.headers.get(headerName);
    };

    get(id: string | number): Observable<T> {
        return this.httpClient.get<T>(`${this.APIUrl}/${id}`, this.httpOptions)
            .pipe(
                catchError(this.handleError<T>())
            );
    }

    customGetWithparams(_params: HttpParams): Observable<T> {
        return this.httpClient.get<T>(`${this.APIUrl}`, {
            headers: {
                "Content-Type": "application/json",
                'Api-Key': environment.apiKey
            }, 
            params: _params
        })
        .pipe(
            catchError(this.handleError<T>())
        );
    }

    getDetail(id: string | number): Observable<T> {
        return this.httpClient.get<T>(`${this.APIUrl}/${id}/details`, this.httpOptions)
            .pipe(
                catchError(this.handleError<T>())
            );
    }

    post(body: T | T[]): Observable<any> {
        return this.httpClient.post(`${this.APIUrl}`, body, this.httpOptions)
            .pipe(
                catchError(this.handleError<T>())
            );
    }
    
    postExtend(extendRoute, body: T | T[]): Observable<any> {
        return this.httpClient.post(`${this.APIUrl}/${extendRoute}`, body, this.httpOptions)
            .pipe(
                catchError(this.handleError<T>())
            );
    }
    
    postExtendNonCatchError(extendRoute, body: T | T[]): Observable<any> {
        return this.httpClient.post(`${this.APIUrl}/${extendRoute}`, body, this.httpOptions)
            .pipe(
                catchError(this.handleErrorNonAlert<T>())
            );
    }

    delete(extendRoute: string, id: string | number): Observable<any> {
        if (extendRoute != "") {
            return this.httpClient.delete(`${this.APIUrl}/${extendRoute}/${id}`, this.httpOptions)
                .pipe(
                    catchError(this.handleError<T>())
                );
        }
        else {
            return this.httpClient.delete(`${this.APIUrl}/${id}`, this.httpOptions)
                .pipe(
                    catchError(this.handleError<T>())
                );
        }
    }

    deleteWithParams(extendRoute: string, params: RequestParam): Observable<any> {
        if (extendRoute != "") {
            return this.httpClient.delete(`${this.APIUrl}/${extendRoute}?${this.convertParams(params)}`, this.httpOptions)
                .pipe(
                    catchError(this.handleError<T>())
                );
        }
        else {
            return this.httpClient.delete(`${this.APIUrl}?${this.convertParams(params)}`, this.httpOptions)
                .pipe(
                    catchError(this.handleError<T>())
                );
        }
    }

    update(body: T | T[]): Observable<any> {
        return this.httpClient.put(`${this.APIUrl}`, body, this.httpOptions)
            .pipe(
                catchError(this.handleError<T>())
            );
    }
    
    updateWithID(id: string, body: T | T[]): Observable<any> {
        return this.httpClient.put(`${this.APIUrl}/${id}`, body, this.httpOptions)
            .pipe(
                catchError(this.handleError<T>())
            );
    }
    
    updateExtendRoute(extendRoute: string , body: T | T[]): Observable<any> {
        return this.httpClient.put(`${this.APIUrl}/${extendRoute}`, body, this.httpOptions)
            .pipe(
                catchError(this.handleError<T>())
            );
    }

    convertParams(param: RequestParam): HttpParams {
        let httpParams = new HttpParams();
        Object.keys(param).forEach(function (key) {
            httpParams = httpParams.append(key, param[key]);
        });
        return httpParams;
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            //console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            //console.log(`${operation} failed: ${error.message}`);

            if (error.status != 200)
                this.toastService.showToast("L???i", error.error.message, "error");

            //Tr??? v??? error (n???u c??)
            result = error;

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
    
    private handleErrorNonAlert<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            //Tr??? v??? error (n???u c??)
            result = error;

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}