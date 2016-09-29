import tape from 'tape'

import consolidateChunks from './lib/consolidateChunks.test.js'
import isolateSections from './lib/isolateSections.test.js'
import decomposeHead from './lib/decomposeHead.test.js'

consolidateChunks(tape)
isolateSections(tape)
decomposeHead(tape)