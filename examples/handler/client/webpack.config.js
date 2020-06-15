module.exports = {
  mode: 'development', // change to 'production' for minified bundle.js
  entry: './js/examples/handler/client/ts/app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
}