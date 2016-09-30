module.exports = str => {

  const filename = str.split(/☁|↓|↑|(Waiting for upload)/)[0].trim()

  return {
    filename
  }
}
