export default class CurrencyPair {
  constructor(data) {

    this._node = null
    this._sparkLine = null
    this._history = []

    this.resetData = this.resetData.bind(this)
    this.getNode = this.getNode.bind(this)

    this.resetData(data)
  }

  resetData(data) {
    this.name = data.name
    this.bestBid = data.bestBid
    this.bestAsk = data.bestAsk
    this.lastChangeBid = data.lastChangeBid
    this.lastChangeAsk = data.lastChangeAsk
    this._history.push([data.bestBid, data.bestAsk])
  }

  /*
  * Create and cache the DOM nodes. Update its data too.
  */
  getNode() {
    if (this._node) {
      this._tdBestBid.textContent = this.bestBid
      this._tdBestAsk.textContent = this.bestAsk
      this._tdLastChangeBestBid.textContent = this.lastChangeBid
      this._tdLastChangeBestAsk.textContent = this.lastChangeAsk
      return this._node
    }
    const tr = document.createElement('tr')
    const tdName = document.createElement('td')
    tdName.textContent = this.name
    tdName.setAttribute('class', 'currency-pair-name')
    const tdBestBid = document.createElement('td')
    tdBestBid.textContent = this.bestBid
    const tdBestAsk = document.createElement('td')
    tdBestAsk.textContent = this.bestAsk
    const tdLastChangeBestBid = document.createElement('td')
    tdLastChangeBestBid.textContent = this.lastChangeBid
    const tdLastChangeBestAsk = document.createElement('td')
    tdLastChangeBestAsk.textContent = this.lastChangeAsk
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
    const data = this._history.map(item => {
      return (item[0] + item[1]) / 2
    })
    this._history = []
    if (!this._sparkLine) {
      this._sparkLine = new Sparkline(this._sparks)
    }
    this._sparkLine.draw(data)
  }
}
