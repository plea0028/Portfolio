import { useEffect } from 'react'
import PropTypes from 'prop-types'
import DesignPortfolio from './DesignPortfolio'
import { Route, Routes } from 'react-router-dom'
import CaseStudyPage from './CaseStudyPage'
import ResumePreview from './ResumePreview'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'

function PageTransition({ children }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return children
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
}

function App() {
  const location = useLocation()

  useEffect(() => {
    let animationFrameId = 0

    if (location.hash) {
      const targetId = location.hash.slice(1)
      let attempts = 0

      const scrollToHashTarget = () => {
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          targetElement.scrollIntoView({ block: 'start' })
          return
        }

        attempts += 1

        if (attempts < 60) {
          animationFrameId = window.requestAnimationFrame(scrollToHashTarget)
        }
      }

      animationFrameId = window.requestAnimationFrame(scrollToHashTarget)
      return () => window.cancelAnimationFrame(animationFrameId)
    }

    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
      <Analytics />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><DesignPortfolio /></PageTransition>} />
          <Route path="/case-study/:slug" element={<PageTransition><CaseStudyPage /></PageTransition>} />
          <Route path="/resume" element={<PageTransition><ResumePreview /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
