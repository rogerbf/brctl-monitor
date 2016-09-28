const parseBytes = str => {
  if (/\(\d*\)/.test(str)) {
    // "↑ 793 K (793150) 95.0%"
    return str.slice(
      str.indexOf(`(`) + 1,
      str.indexOf(`)`)
    )
  } else {
    // "↑ 18 byte 95.0%"
    return str.split(/\s/)[1]
  }
}

const parseProgress = str => {
  // "↑ 793 K (793150) 95.0%"
  return str.slice(str.lastIndexOf(` `)).trim()
}

const separateFiles = str => {
  const parsed = str
    // TODO if filestring is empty or null?
    .split(/\n\so\s/) // file listing starts with: '\n o '
    .slice(1) // first element is empty
    .map(file => {
      const filenameStop = (
        file.match(/☁/) ||
        file.match(/↑/) ||
        file.match(/(Waiting for upload)/)
      )
      return {
        path: file.slice(0, filenameStop.index - 1).trim(),
        status: file.slice(filenameStop.index - 1).trim()
      }
    })
    .map(file => {
      // {
      //   "path": "/com~apple~CloudDocs/file",
      //   "status": {
      //     "state": "synchronized",
      //     "raw": "☁ ↓ 0 K 0.0%  server edit to download"
      //   }
      // }
      //
      // {
      //   "path": "/com~apple~CloudDocs/file",
      //   "status": {
      //     "state": "uploading",
      //     "bytes": "6",
      //     "progress": "download",
      //     "raw": "↑ 6 byte 95.0%  ↓ 0 K 0.0%  server edit to download"
      //   }
      // }
      // TODO: consider renaming ☁ -> in cloud
      // TODO: missing state - downloading
      // TODO: consider replacing state: uploading with synchronizing
      if (/☁/.test(file.status)) {
        return Object.assign(
          {}, file, { status: { state: `synchronized`, raw: file.status } }
        )
      }
      if (/↑/.test(file.status)) {
        return Object.assign(
          {},
          file,
          { status: {
              state: `uploading`,
              bytes: parseBytes(file.status),
              progress: parseProgress(file.status),
              raw: file.status
            }
          }
        )
      }
      if (/(Waiting for upload)/.test(file.status)) {
        return Object.assign(
          {},
          file,
          { status: {
              state: `waiting`,
              raw: file.status,
              message: file.status.slice(file.status.indexOf(`\n`) + 1).trim()
            }
          }
        )
      } else {
        return Object.assign(
          {}, file, { status: { state: `unknown`, raw: file.status } }
        )
      }
    })
  return {
    files: parsed
  }
}

module.exports = separateFiles
