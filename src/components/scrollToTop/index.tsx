// ScrollToTop.jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router'

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [location])

  return <>{children}</>
}

export default ScrollToTop
