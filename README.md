# brctl-monitor

Monitor the CloudDocs deamon. _brctl-monitor_ spawns `brctl` in monitor mode. Which in turn uses NSMetadataQuery to monitor the chosen container

## usage

``` javascript
const Brctl = require(`brctl-monitor`)

Brctl()
  .then(brctl => {
    brctl.state.on(`data`, state => {
      console.log(JSON.stringify(state, null, 2))
      // {
      //   "timestamp": "2016-10-07 12:11:27 +0000",
      //   "stats": {
      //     "total": 1,
      //     "updated": 1
      //   },
      //   "files": [
      //     {
      //       "filename": "/test",
      //       "status": {
      //         "availability": {
      //           "local": true,
      //           "remote": true
      //         },
      //         "transfers": {
      //           "up": null,
      //           "down": null
      //         },
      //         "waiting": false,
      //         "error": false,
      //         "raw": " ☁"
      //       }
      //     }
      //   ]
      // }
    })
  })
  .catch(e => console.error(e))
```

## **brctl-monitor** takes an optional options-object:

### to restrict the NSMetadataQuery scope:
``` javascript
Brctl({ scope: `both` || `docs` || `data` })
```

### monitoring a specific container:
``` javascript
Brctl({ container: Brctl.ICLOUD_DRIVE })
```
