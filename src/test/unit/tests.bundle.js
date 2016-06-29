var context = require.context('.', true, /.+\.spec\.js(x?)?$/)
context.keys().forEach(context)
window.Promise = require('es6-promise').Promise
module.exports = context
