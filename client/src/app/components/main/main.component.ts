import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  private selectedCurrency: string;
  currencies: Array<string>;

  constructor() {
    this.currencies = ['EUR', 'USD', 'GBP', 'AUD', 'CAD', 'JPY']; //TODO import from external service if necessary
  }

  ngOnInit() {

  }

}
