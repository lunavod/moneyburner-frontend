import React from 'react'

export const getContextValue = () => ({
  code: 200,
  redirectTo: null,
})

const StatusCodeContext = React.createContext<{
  code: number
  redirectTo: string | null
}>(getContextValue())
export default StatusCodeContext
