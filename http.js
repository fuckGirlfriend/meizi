const floor = `http://floor.huluxia.com`,
      tools = `http://tools.huluxia.com`,
      request = require('request')
function get(arg) {
  let d = '?',b =  (arg.data || {})
  for (let i in b) {
    d+= `${i}=${b[i]}`
  }
  request.get(`${arg.url || floor}${d}`,(err,req,body)=> {
    if (!err && req.statusCode == 200) {
      arg.success(JSON.parse(body))
    }
  })
}
module.exports = {
  get,
  floor,
  tools
}