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

  private desiredCurrencies: Array<string>;
  private baseCurrency: string;
  public date;
  private pipe;
  currencies: Array<Currency>;

  constructor(private exchangeService: ExchangeService) {

    this.desiredCurrencies = ['EUR', 'USD', 'GBP', 'AUD', 'CAD', 'JPY'];
    this.baseCurrency = 'EUR';
    this.pipe = new DatePipe('en-US');
    this.date = this.pipe.transform(new Date(), 'yyyy-MM-dd');

  }

  ngOnInit() {
    this.getExchangeRates();
  }


  getExchangeRates() {
    console.log(this.baseCurrency);
    this.currencies = [];
    this.exchangeService.getExchangeRates(this.baseCurrency, this.date).subscribe((data: Rates) => {

      this.handleResponse(data)
    });
  }

  handleResponse(data) {

    const filtered = Object.keys(data.rates)
      .filter(key => this.desiredCurrencies.includes(key))
      .reduce((obj, key) => {
        obj[key] = data.rates[key];
        return obj;
      }, {});

    for (const currency in filtered) {
      let buyPrice = this.calculateBuy(filtered[currency]);
      let sellPrice = this.calculateSell(filtered[currency]);
      this.currencies.push(
        {
          name: currency,
          mid: filtered[currency],
          buy: buyPrice,
          sell: sellPrice
        }
      );
    }

    console.warn(this.currencies);
  }

  calculateBuy(mid) {
    return  mid - (mid * 0.05);
  }

  calculateSell(mid) {
    return mid + (mid * 0.05);
  }

}
