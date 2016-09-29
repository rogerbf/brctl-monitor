import tape from 'tape'

import consolidateChunks from './lib/consolidateChunks.test.js'
import isolateSections from './lib/isolateSections.test.js'

consolidateChunks(tape)
isolateSections(tape)
