import * as React from 'react'
import {client} from '../utils/api-client';

let queue = []

setInterval(sendProfileQueue, 5000)

function sendProfileQueue() {
  if (!queue.length) {
    return Promise.resolve({success: true})
  }
  const queueToSend = [...queue]
  queue = []
  return client('profile', {data: {queueToSend}})
}

function Profiler({phases, ...props}) {
  function reportProfile(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  ) {
    console.log(phase)
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      })
    }
  }
  return <React.Profiler onRender={reportProfile} {...props} />
}

export {Profiler}
