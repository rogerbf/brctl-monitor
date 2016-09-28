module.exports = str => {
  return str
    .split(/\n\so\s/)
    .slice(1)
    .map(s => s.trim())
}
