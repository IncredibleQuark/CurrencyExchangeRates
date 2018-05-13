import {Component, OnInit} from '@angular/core';
import {ExchangeService} from "../../services/exchange/exchange.service";
import {Currency} from "../../interfaces/currency.interface";
import {DatePipe} from "@angular/common";
import {Rates} from "../../interfaces/rates.interface";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {

  private baseCurrency: string;
  public date: string;
  private pipe: DatePipe;
  private minDate: Date;
  private maxDate: Date;
  private failed: boolean;
  private sortingAsc: boolean;
  availableCurrencies: Array<string>;
  currencies: Array<Currency>;

  constructor(private exchangeService: ExchangeService) {

    this.availableCurrencies = ['EUR', 'USD', 'GBP', 'AUD', 'CAD', 'JPY'];
    this.baseCurrency = 'EUR';
    this.minDate = new Date('1999-01-04'); //min value tested on ECB API
    this.maxDate = new Date();
    this.pipe = new DatePipe('en-US');
    this.date = this.pipe.transform(new Date(), 'yyyy-MM-dd');

  }


  ngOnInit() {
    this.failed = false;
    this.sortingAsc = true;
    this.getExchangeRates();
  }


  getExchangeRates() {

    this.currencies = [];
    this.exchangeService.getExchangeRates(this.baseCurrency, this.date).subscribe((data: Rates) => {

      this.handleResponse(data);

    }, (err) => {
      console.warn(err);
      this.failed = true;
    });
  }


  handleResponse(data) {

    const filtered = data.rates;

    // DISABLED filter only to availableCurrencies
      // Object.keys(data.rates)
      // .filter(key => this.availableCurrencies.includes(key))
      // .reduce((obj, key) => {
      //   obj[key] = data.rates[key];
      //   return obj;
      // }, {});

    for (const currency in filtered) {
      let buyPrice = MainComponent.calculateBuy(filtered[currency]);
      let sellPrice = MainComponent.calculateSell(filtered[currency]);
      this.currencies.push(
        {
          name: currency,
          mid: filtered[currency],
          buy: buyPrice,
          sell: sellPrice
        }
      );
    }

  }


  sort() {
    this.sortingAsc = !this.sortingAsc;

    if (this.sortingAsc) {
      this.currencies.sort(MainComponent.sortAsc);
    } else {
      this.currencies.sort(MainComponent.sortDesc);
    }

  }


  isAvailable(curr) {
    return this.availableCurrencies.indexOf(curr) !== -1
  }


  private static sortDesc(a,b) {
    if (a.name > b.name)
      return -1;
    if (a.name < b.name)
      return 1;
    return 0;
  }


  private static sortAsc(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }


  private static calculateBuy(mid) {
    return  mid - (mid * 0.05);
  }


  private static calculateSell(mid) {
    return mid + (mid * 0.05);
  }

}
