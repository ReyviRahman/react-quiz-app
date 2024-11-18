import React, { useEffect, useReducer } from 'react'
import Header from './Header'
import Main from './Main'
import axios from 'axios'
import Loader from './Loader'
import Error from './Error'
import StartScreen from './StartScreen'
import Question from './Question'

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
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
    case 'start':
      return {
        ...state,
        status: 'active'
      }
    default:
      throw new Error('Action Unknown');
  }
}

const App = () => {
  const [{questions, status, index}, dispatch] = useReducer(reducer, initialState)

  const numQuestions = questions.length

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/questions')
        dispatch({type: 'dataReceived', payload: response.data})
      } catch (error) {
        dispatch({type: 'dataFailed'})
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
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' && <Question question = {questions[index]}/>}
      </Main>
    </div>
  )
}

export default App