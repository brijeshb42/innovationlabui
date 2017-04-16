// tests.webpack.js
var context = require.context('./site/lib', true,  /.spec.js$/);
console.log(context.keys())
context.keys().forEach(context);
