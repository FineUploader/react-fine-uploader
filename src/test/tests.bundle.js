var context = require.context('.', true, /.+\.spec\.js(x?)?$/)
context.keys().forEach(context)
module.exports = context
