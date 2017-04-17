import CurrencyPairView from '../view/CurrencyPairView'

/*
* Represents a sorted list of CurrencyPair collection
* which can be subscribed for getting updates when data changes
*/
export default class CurrencyCollection {
  /*
  * @param {number} interval - The number of milliseconds at which sparkline listeners will be fired.
  */
  constructor(interval = null) {
    this.list = []
    this.presentPairs = {}

    this.handlers = []
    this.sparkLineHandlers = []

    this.updateData = this.updateData.bind(this)
    this.subscribe = this.subscribe.bind(this)
    this.unsubscribe = this.unsubscribe.bind(this)
    this.fire = this.fire.bind(this)
    this.fireSparkLine = this.fireSparkLine.bind(this)

    if (interval !== null) {
      this._sparkLineIntervalID = setInterval(this.fireSparkLine, interval)
    } else {
      this._sparkLineIntervalID = null
    }
  }

  /* Sort array based on `lastChangeBid` in increasing order */
  sorter(pair1, pair2) {
    return pair1.currencyPair.lastChangeBid - pair2.currencyPair.lastChangeBid
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
      this.presentPairs[data.name] = new CurrencyPairView(data)
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
