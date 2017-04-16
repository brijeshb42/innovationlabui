import CurrencyCollection from './CurrencyCollection'

export default class TableView {
  constructor(client, channel, containerNode) {
    this.client = client
    this.channel = channel
    this.containerNode = containerNode

    this.currencyCollection = new CurrencyCollection(30 * 1000)

    this.onNewData = this.onNewData.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
    this.render = this.render.bind(this)
    this.init = this.init.bind(this)
  }

  /*
  * Event listener for subscription
  */
  onNewData(e) {
    const data = JSON.parse(e.body)
    this.currencyCollection.updateData(data)
  }

  /* Subscribe to the prices channel */
  subscribe() {
    this.subscriptionID = this.client.subscribe(this.channel, this.onNewData)
    this.currencyCollection.subscribe(this.render)
    this.currencyCollection.subscribeToSparkLineEvent(this.drawSparkLine)
  }

  /*
  * Unsubscribe from stomp and currency collection
  */
  unsubscribe() {
    this.client.unsubscribe(this.subscriptionID)
    this.currencyCollection.unsubscribe(this.render)
    this.currencyCollection.unsubscribeFromSparkLineEvent(this.drawSparkLine)
  }

  /*
  * Render the CurrencyPair model list to table rows view
  */
  render(currencyList) {
    const node = this.containerNode
    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }
    currencyList.forEach(pair => {
      node.appendChild(pair.getNode())
    })
  }

  /*
  * Trigger sparkline draw for each currency pair in array.
  */
  drawSparkLine(currencyList) {
    currencyList.forEach(pair => {
      pair.drawSparkLine()
    })
  }

  init() {
    this.subscribe()
  }
}
