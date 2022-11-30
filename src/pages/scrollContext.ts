import Emitter from 'eventemitter3'
import React from 'react'

const ScrollContext = React.createContext(new Emitter())
export default ScrollContext
