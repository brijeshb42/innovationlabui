import CurrencyPair from './CurrencyPair'

export default class CurrencyCollection {
  constructor(interval) {
    this.list = []
    this.presentPairs = {}

    this.handlers = []
    this.sparkLineHandlers = []

    this.updateData = this.updateData.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
    this.fire = this.fire.bind(this)
    this.fireSparkLine = this.fireSparkLine.bind(this)

    this._sparkLineIntervalID = setInterval(this.fireSparkLine, interval)
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
      this.list.push(this.presentPairs[data.name])
    }
    this.list.sort(this.sorter)
    this.fire()
  }

  /* Subscribe to data changes */
  subscribe(listener) {
    this.handlers.push(listener)
  }

  unsubscribe(fn) {
    this.handlers = this.handlers.filter(item => item !== fn)
  }

  subscribeToSparkLineEvent(handler) {
    this.sparkLineHandlers.push(handler);
  }

  unsubscribeFromSparkLineEvent(fn) {
    this.sparkLineHandlers = this.sparkLineHandlers.filter(item => item !== fn)
  }

  fireSparkLine() {
    this.sparkLineHandlers.forEach(fn => {
      fn(this.list)
    })
  }

  fire() {
    this.handlers.forEach(fn => {
      fn(this.list)
    })
  }
}