import React, { useEffect } from 'react'
import Header from './Header'
import Main from './Main'
import axios from 'axios'

const App = () => {

  useEffect(() => {
    const fetchDate = async () => {
      try {
        const response = await axios.get('')
        
      } catch (error) {
        
      }
    }
  }, [])

  return (
    <div className='app'>
      <Header />
      <Main>
        <p>1/15</p>
        <p>Question?</p>
      </Main>
    </div>
  )
}

export default App