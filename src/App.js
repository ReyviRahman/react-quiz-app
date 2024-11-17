import React, { useEffect, useReducer } from 'react'
import Header from './Header'
import Main from './Main'
import axios from 'axios'
import Loader from './Loader'

const initialState = {
  questions: [],
  status: 'loading'
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'dataReceived': 
      return {
        ...state,
        questions: action.payload,
        status: 'ready'
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error'
      };
    default:
      throw new Error('Action Unknown');
  }
}

const App = () => {
  const [{question, status}, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/questions')
        dispatch({type: 'dataReceived', payload: response.data})
      } catch (error) {
        dispatch({type: 'dateFailed'})
      }
    }

    fetchData()
  }, [])

  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
      </Main>
    </div>
  )
}

export default App