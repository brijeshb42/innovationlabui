import CurrencyPair from '../model/CurrencyPair'

/*
* A view to render CurrencyPair model.
* A single view represents a single row in the table.
*/
export default class CurrencyPairView {
  constructor(data) {
    this.currencyPair = new CurrencyPair(data);

    this._node = null
    this._sparkLine = null
    this.initialSparklineRendered = false
  }

  resetData(data) {
    this.currencyPair.resetData(data)
  }

  /*
  * Create and cache the DOM nodes. Update its data too.
  */
  getNode() {
    if (this._node) {
      this._tdName.textContent = this.currencyPair.name
      this._tdBestBid.textContent = this.currencyPair.bestBid
      this._tdBestAsk.textContent = this.currencyPair.bestAsk
      this._tdLastChangeBestBid.textContent = this.currencyPair.lastChangeBid
      this._tdLastChangeBestAsk.textContent = this.currencyPair.lastChangeAsk
      return this._node
    }
    const tr = document.createElement('tr')
    const tdName = document.createElement('td')
    tdName.textContent = this.currencyPair.name
    tdName.setAttribute('class', 'currency-pair-name')
    const tdBestBid = document.createElement('td')
    tdBestBid.textContent = this.currencyPair.bestBid
    const tdBestAsk = document.createElement('td')
    tdBestAsk.textContent = this.currencyPair.bestAsk
    const tdLastChangeBestBid = document.createElement('td')
    tdLastChangeBestBid.textContent = this.currencyPair.lastChangeBid
    const tdLastChangeBestAsk = document.createElement('td')
    tdLastChangeBestAsk.textContent = this.currencyPair.lastChangeAsk
    const tdSparkline = document.createElement('td')
    tdSparkline.setAttribute('class', 'currency-sparkline');
    const sparks = document.createElement('span')
    tdSparkline.appendChild(sparks)
    tr.appendChild(tdName)
    tr.appendChild(tdBestBid)
    tr.appendChild(tdBestAsk)
    tr.appendChild(tdLastChangeBestBid)
    tr.appendChild(tdLastChangeBestAsk)
    tr.appendChild(tdSparkline)

    this._node = tr
    this._tdName = tdName
    this._tdBestBid = tdBestBid
    this._tdBestAsk = tdBestAsk
    this._tdLastChangeBestBid = tdLastChangeBestBid
    this._tdLastChangeBestAsk = tdLastChangeBestAsk
    this._sparks = sparks
    return this._node
  }

  /*
  Draw sparkline from the change history maintained
  */
  drawSparkLine() {
    const data = this.currencyPair.getSparkLineData()
    this.currencyPair._history = []
    if (!this._sparkLine) {
      this._sparkLine = new Sparkline(this._sparks)
    }
    this._sparkLine.draw(data)
    this.currencyPair.resetHistory()
  }

  drawInitialSparkLine() {
    if (this.initialSparklineRendered) {
      return
    }
    this.initialSparklineRendered = true
    const data = this.currencyPair.getSparkLineData()
    if (!this._sparkLine) {
      this._sparkLine = new Sparkline(this._sparks)
    }
    this._sparkLine.draw(data)
  }
}
