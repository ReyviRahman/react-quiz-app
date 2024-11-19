import React, { useEffect, useReducer } from 'react'
import Header from './Header'
import Main from './Main'
import axios from 'axios'
import Loader from './Loader'
import Error from './Error'
import StartScreen from './StartScreen'
import Question from './Question'
import NextButton from './NextButton'
import Progress from './Progress'
import FinishScreen from './FinishScreen'
import Footer from './Footer'
import Timer from './Timer'

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0
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
    case 'newAnswer':
      const question = state.questions.at(state.index)
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption ? state.points + question.points : state.points
      }
    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null
      }
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore: 
          state.points > state.highscore ? state.points : state.highscore 
      }
    case 'restart': 
      return {
        ...initialState,
        questions: state.questions,
        status: 'ready'
      }
    default:
      throw new Error('Action Unknown');
  }
}

const App = () => {
  const [{questions, status, index, answer, points, highscore}, dispatch] = useReducer(reducer, initialState)

  const numQuestions = questions.length
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)

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
        {status === 'active' && (
          <>
            <Progress index={index} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer} />
            <Question 
            question = {questions[index]} 
            dispatch={dispatch} 
            answer={answer} 
            />
            <Footer>
              <Timer />
              <NextButton dispatch={dispatch} answer={answer} numQuestions={numQuestions} index={index} />
            </Footer>
          </>
        )}
        {status === 'finished' && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch} /> }
      </Main>
    </div>
  )
}

export default App