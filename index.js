/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

const TableView = require('./site/lib/view/TableView').default

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}
const tableView = new TableView(client, '/fx/prices', document.getElementsByTagName('tbody')[0])

const statusNode = document.getElementById('stomp-status')

function connectCallback() {
  statusNode.innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs."
  tableView.init()
}

client.connect({}, connectCallback, function(error) {
  statusNode.innerHTML = 'Connection terminated.'
  tableView.unsubscribe()
})

