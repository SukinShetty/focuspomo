'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Coffee, Brain, Plus, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const TIMER_TYPES = {
  FOCUS: 'focus',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak'
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function SimpleFocusTimer() {
  const [time, setTime] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [timerType, setTimerType] = useState(TIMER_TYPES.FOCUS)
  const [sessionCount, setSessionCount] = useState(0)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [showVisualAlert, setShowVisualAlert] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsActive(false)
      triggerVisualAlert()
      if (timerType === TIMER_TYPES.FOCUS) {
        setSessionCount((prevCount) => prevCount + 1)
        if (currentTask) {
          completeTask(currentTask.id)
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time, timerType, currentTask])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTime(getTimerDuration(timerType))
  }

  const changeTimerType = (type: string) => {
    setIsActive(false)
    setTimerType(type)
    setTime(getTimerDuration(type))
  }

  const getTimerDuration = (type: string) => {
    switch (type) {
      case TIMER_TYPES.SHORT_BREAK:
        return 5 * 60
      case TIMER_TYPES.LONG_BREAK:
        return 15 * 60
      default:
        return 25 * 60
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const triggerVisualAlert = () => {
    setShowVisualAlert(true)
    setTimeout(() => setShowVisualAlert(false), 3000)
  }

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText.trim(),
        completed: false
      }
      setTasks([...tasks, newTask])
      setNewTaskText('')
    }
  }

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
    if (currentTask && currentTask.id === id) {
      setCurrentTask(null)
    }
  }

  const completeTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: true } : task
    ))
    if (currentTask && currentTask.id === id) {
      setCurrentTask(null)
    }
  }

  const selectTask = (task: Task) => {
    setCurrentTask(task)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-md mx-auto bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center">Simple Focus Timer</h2>
          <div className="flex flex-col items-center space-y-4">
            <motion.div 
              key={time}
              initial={{ scale: 1 }}
              animate={{ scale: showVisualAlert ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3, repeat: showVisualAlert ? 5 : 0 }}
              className={`text-6xl font-bold tabular-nums ${showVisualAlert ? 'text-error' : ''}`}
            >
              {formatTime(time)}
            </motion.div>
            <div className="flex space-x-2">
              <button onClick={() => changeTimerType(TIMER_TYPES.FOCUS)} className={`btn btn-sm ${timerType === TIMER_TYPES.FOCUS ? "btn-primary" : "btn-outline"}`}>
                <Brain className="h-4 w-4 mr-2" />
                Focus
              </button>
              <button onClick={() => changeTimerType(TIMER_TYPES.SHORT_BREAK)} className={`btn btn-sm ${timerType === TIMER_TYPES.SHORT_BREAK ? "btn-primary" : "btn-outline"}`}>
                <Coffee className="h-4 w-4 mr-2" />
                Short Break
              </button>
              <button onClick={() => changeTimerType(TIMER_TYPES.LONG_BREAK)} className={`btn btn-sm ${timerType === TIMER_TYPES.LONG_BREAK ? "btn-primary" : "btn-outline"}`}>
                <Coffee className="h-4 w-4 mr-2" />
                Long Break
              </button>
            </div>
            <select 
              className="select select-bordered w-full max-w-xs" 
              onChange={(e) => setTime(parseInt(e.target.value) * 60)}
              value={time / 60}
            >
              <option value={15}>15 minutes</option>
              <option value={25}>25 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
            <div className="w-full">
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Add a new task"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="input input-bordered flex-grow"
                />
                <button onClick={addTask} className="btn btn-square btn-outline">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <AnimatePresence>
                {tasks.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2 bg-base-200 p-2 rounded mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => completeTask(task.id)}
                      className="checkbox"
                    />
                    <label
                      className={`flex-grow ${task.completed ? 'line-through text-base-content/50' : ''}`}
                    >
                      {task.text}
                    </label>
                    <button
                      onClick={() => selectTask(task)}
                      className={`btn btn-xs ${currentTask?.id === task.id ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      Select
                    </button>
                    <button onClick={() => removeTask(task.id)} className="btn btn-ghost btn-xs">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex space-x-4">
              <button onClick={toggleTimer} className="btn btn-outline btn-circle">
                {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button onClick={resetTimer} className="btn btn-outline btn-circle">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm">Sessions completed: {sessionCount}</div>
            {currentTask && (
              <div className="text-sm font-medium">
                Current task: {currentTask.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}