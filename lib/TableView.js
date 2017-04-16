// import CurrencyPair from './CurrencyPair'

export default class TableView {
  constructor(client) {
    this.client = client;

    this.currencyPairs = []
    this.presentPairs = {}
    this.dataHasChanged = true

    this.subscribe = this.subscribe.bind(this);
  }

  onNewData(e) {
    console.log(e);
  }

  subscribe() {
    this.subscriptionID = this.client.subscribe('/fx/prices', this.onNewData)
  }
}
