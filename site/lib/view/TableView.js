import CurrencyCollection from '../observer/CurrencyCollection'

/** Class representing the table data view. */
export default class TableView {
  /**
   * Create a point.
   * @param {StompClient} client - The stomp client connected to stomp server.
   * @param {string} channel - The channel to subscribe to for receiving realtime price updates.
   * @param {Node} containerNode - The DOM Node to which the table data will be rendered on every update.
   */
  constructor(client, channel, containerNode) {
    this.client = client
    this.channel = channel
    this.containerNode = containerNode
    this._firstSparklineRendered = false

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
    this.currencyCollection.subscribe(this.drawInitialSparkLine)
    this.currencyCollection.subscribeToSparkLineEvent(this.drawSparkLine)
  }

  /*
  * Unsubscribe from stomp and currency collection
  */
  unsubscribe() {
    this.client.unsubscribe(this.subscriptionID)
    this.currencyCollection.unsubscribe(this.render)
    this.currencyCollection.unsubscribe(this.drawInitialSparkLine)
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
    if (!this._firstSparklineRendered) {
      this._firstSparklineRendered = true
    }
  }

  /*
  * Trigger sparkline draw for each currency pair in array.
  */
  drawSparkLine(currencyList) {
    currencyList.forEach(pair => {
      pair.drawSparkLine()
    })
  }

  /*
  * Draw initial sparkline when first set of data comes
  */
  drawInitialSparkLine(currencyList) {
    currencyList.forEach(pair => {
      pair.drawInitialSparkLine()
    })
  }

  init() {
    this.subscribe()
  }
}
