import React, { useState, useEffect } from 'react'
import { useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  task: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        task: [...state.task, { id: uuidv4(), name: action.payload }],
      }
    case 'DELETE_TASK':
      return {
        ...state,
        task: state.task.filter((task) => task.id !== action.payload),
      }
    case 'MARK_COMPLETE':
      return {
        ...state,
        task: state.task.map((task) => {
          if (task.id === action.payload) {
            return { ...task, completed: !task.completed }
          }
          return task
        }),
      }
    case 'LOAD_TASKS':
      return {
        ...state,
        task: action.payload,
      }
    default:
      return state
  }
}

const App = () => {
  const [task, setTask] = useState('')
  const [tasks, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'))
    if (storedTasks) {
      dispatch({ type: 'LOAD_TASKS', payload: storedTasks })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks.task))
  }, [tasks.task])

  return (
    <>
      <input
        type='text'
        placeholder='add new task...'
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (task === '') return alert('Please enter a task')
            dispatch({ type: 'ADD_TASK', payload: task })
            setTask('')
          }
        }}
      />
      <button
        onClick={() => {
          if (task === '') return alert('Please enter a task')
          dispatch({ type: 'ADD_TASK', payload: task })
          setTask('')
        }}
      >
        Add
      </button>
      {tasks.task.map((task) => (
        <div key={task.id}>
          <li
            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
          >
            {task.name}
          </li>
          <button
            onClick={() => {
              dispatch({ type: 'DELETE_TASK', payload: task.id })
            }}
          >
            Delete
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'MARK_COMPLETE', payload: task.id })
            }}
          >
            Done
          </button>
        </div>
      ))}
    </>
  )
}

export default App
