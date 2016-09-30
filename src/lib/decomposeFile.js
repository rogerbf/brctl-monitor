const decomposeTransferData = require(`./decomposeTransferData.js`)

module.exports = str =>  {

  const filename = str.split(/☁|↓|↑|(Waiting for upload)/)[0].trim()

  const statusStr = str.slice(filename.length)

  const status = {
    availability: {
      local: statusStr.match(/not downloaded/) ? false : true,
      remote: statusStr.match(/☁/) ? true : false
    },
    transfers: decomposeTransferData(statusStr),
    waiting: statusStr.match(/waiting/i) ? true : false,
    error: statusStr.match(/error/i) ? true : false,
    raw: statusStr
  }

  return {
    filename,
    status
  }
}
