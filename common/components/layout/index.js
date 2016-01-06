if (process.env.NODE_ENV === 'production' || process.env.UNIVERSAL_ENV === 'server') {
  module.exports = require('./Layout.prod');
} else {
  module.exports = require('./Layout.dev');
}
