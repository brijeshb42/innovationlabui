import CurrencyPair from './CurrencyPair'

export default class TableView {
  constructor(client, channel) {
    this.client = client
    this.channel = channel

    this.currencyPairs = []
    this.presentPairs = {}

    this.onNewData = this.onNewData.bind(this)
    this.updateData = this.updateData.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
  }

  /*
  * Event listener for subscription
  */
  onNewData(e) {
    const data = JSON.parse(e.body)
    this.updateData(data)
  }

  /* Sort array based on `lastChangeBid` in increasing order */
  sorter(pair1, pair2) {
    return pair1.lastChangeBid - pair2.lastChangeBid
  }

  /*
  * If the received currency is already present, only update
  * its data, otherwise, create new CurrencyPair and add it to
  * sortable array. This array will be used to render the rows
  * of the table on every new data update.
  */
  updateData(data) {
    if (this.presentPairs.hasOwnProperty(data.name)) {
      this.presentPairs[data.name].resetData(data)
    } else {
      this.presentPairs[data.name] = new CurrencyPair(data)
      this.currencyPairs.push(this.presentPairs[data.name])
    }
    this.currencyPairs.sort(this.sorter)
  }

  /* Subscribe to the prices channel */
  subscribe() {
    this.subscriptionID = this.client.subscribe(this.channel, this.onNewData)
  }

  unsubscribe() {
    this.client.unsubscribe(this.subscriptionID)
  }
}
