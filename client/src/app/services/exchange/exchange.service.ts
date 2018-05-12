import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable()

export class ExchangeService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getExchangeRates (base, date) {
    const headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.get(`${this.apiUrl}${date}?base=${base}`,{headers: headers});
  }

}
