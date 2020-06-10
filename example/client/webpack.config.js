module.exports = {
  mode: 'development', // change to 'production' for minified bundle.js
  entry: './js/example/client/ts/app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
}