'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, RotateCcw, Coffee, Brain, Plus, Trash2, VolumeX, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const TIMER_TYPES = {
  FOCUS: 'focus',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
};

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const SimpleFocusTimer: React.FC = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [timerType, setTimerType] = useState(TIMER_TYPES.FOCUS);
  const [sessionCount, setSessionCount] = useState(0);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [showVisualAlert, setShowVisualAlert] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const toggleMute = useCallback(() => {
    setIsMuted(prevMuted => !prevMuted);
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0.5 : 0,
        audioContextRef.current.currentTime
      );
    }
  }, [isMuted]);

  const startRingingSound = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    oscillatorRef.current = audioContext.createOscillator();
    gainNodeRef.current = audioContext.createGain();

    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContext.destination);

    oscillatorRef.current.type = 'sine';
    oscillatorRef.current.frequency.setValueAtTime(440, audioContext.currentTime);

    gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : 0.5, audioContext.currentTime);

    oscillatorRef.current.start();
    setIsRinging(true);
  }, [isMuted]);

  const stopRingingSound = useCallback(() => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      gainNodeRef.current.disconnect();
      oscillatorRef.current = null;
      gainNodeRef.current = null;
      setIsRinging(false);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      triggerVisualAlert();
      startRingingSound(); // Start the continuous ringing sound
      if (timerType === TIMER_TYPES.FOCUS) {
        setSessionCount((prevCount) => prevCount + 1);
        if (currentTask) {
          completeTask(currentTask.id);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      // Cleanup function to stop and disconnect audio when component unmounts
      stopRingingSound();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isActive, time, timerType, currentTask, startRingingSound, stopRingingSound]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(getTimerDuration(timerType));
  };

  const changeTimerType = (type: string) => {
    setIsActive(false);
    setTimerType(type);
    setTime(getTimerDuration(type));
  };

  const getTimerDuration = (type: string) => {
    switch (type) {
      case TIMER_TYPES.SHORT_BREAK:
        return 5 * 60;
      case TIMER_TYPES.LONG_BREAK:
        return 15 * 60;
      default:
        return 25 * 60;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerVisualAlert = () => {
    setShowVisualAlert(true);
    setTimeout(() => setShowVisualAlert(false), 3000);
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now(),
        text: newTaskText.trim(),
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (currentTask && currentTask.id === id) {
      setCurrentTask(null);
    }
  };

  const completeTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: true } : task
    ));
    if (currentTask && currentTask.id === id) {
      setCurrentTask(null);
    }
  };

  const selectTask = (task: Task) => {
    setCurrentTask(task);
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 flex">
      <div className="w-full flex flex-col sm:flex-row gap-4">
        <div className="bg-base-100 shadow-xl rounded-lg p-4 sm:p-6 sm:w-1/3 self-start">
          <h2 className="text-lg sm:text-xl font-bold text-center mb-4">How to use Pomodoro timer:</h2>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm">
            <li><strong>Choose a task:</strong> Pick a task to complete.</li>
            <li><strong>Set a timer:</strong> Set a timer for 25 minutes.</li>
            <li><strong>Work:</strong> Focus on the task until the timer rings (Switch off all your notifications).</li>
            <li><strong>Take a break:</strong> After the timer rings, take a short break of 5 minutes.</li>
            <li><strong>Repeat:</strong> Return to step 2 and repeat the cycle until you've completed four pomodoros.</li>
            <li><strong>Take a longer break:</strong> After four pomodoros, take a longer break of 15 minutes.</li>
            <li><strong>Repeat:</strong> Once the break is over, return to step 2 and repeat the cycle.</li>
          </ol>
        </div>
        <div className="bg-base-100 shadow-xl rounded-lg p-4 sm:p-6 sm:w-2/3">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Simple Focus Timer</h2>
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <motion.div 
              key={time}
              initial={{ scale: 1 }}
              animate={{ scale: showVisualAlert ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3, repeat: showVisualAlert ? 5 : 0 }}
              className={`text-4xl sm:text-5xl font-bold tabular-nums ${showVisualAlert ? 'text-error' : ''}`}
            >
              {formatTime(time)}
            </motion.div>
            <div className="flex justify-center gap-1 sm:gap-2 w-full">
              <button onClick={() => changeTimerType(TIMER_TYPES.FOCUS)} className={`btn btn-xs sm:btn-sm md:btn-md flex-1 ${timerType === TIMER_TYPES.FOCUS ? "btn-primary" : "btn-outline"}`}>
                <Brain className="hidden sm:inline-block h-4 w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                <span className="text-[9px] sm:text-xs md:text-sm">Focus</span>
              </button>
              <button onClick={() => changeTimerType(TIMER_TYPES.SHORT_BREAK)} className={`btn btn-xs sm:btn-sm md:btn-md flex-1 ${timerType === TIMER_TYPES.SHORT_BREAK ? "btn-primary" : "btn-outline"}`}>
                <Coffee className="hidden sm:inline-block h-4 w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                <span className="text-[9px] sm:text-xs md:text-sm">Short Break</span>
              </button>
              <button onClick={() => changeTimerType(TIMER_TYPES.LONG_BREAK)} className={`btn btn-xs sm:btn-sm md:btn-md flex-1 ${timerType === TIMER_TYPES.LONG_BREAK ? "btn-primary" : "btn-outline"}`}>
                <Coffee className="hidden sm:inline-block h-4 w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                <span className="text-[9px] sm:text-xs md:text-sm">Long Break</span>
              </button>
            </div>
            <select 
              className="select select-bordered select-sm sm:select-md w-full max-w-[220px] sm:max-w-xs text-sm" 
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
                  className="input input-sm sm:input-md input-bordered flex-grow text-sm"
                />
                <button onClick={addTask} className="btn btn-sm sm:btn-md btn-square btn-outline">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              <div className="max-h-[25vh] sm:max-h-[30vh] overflow-y-auto">
                <AnimatePresence>
                  {tasks.map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-2 bg-base-200 p-2 rounded mb-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => completeTask(task.id)}
                        className="checkbox checkbox-sm"
                      />
                      <label className={`flex-grow ${task.completed ? 'line-through text-base-content/50' : ''}`}>
                        {task.text}
                      </label>
                      <button
                        onClick={() => selectTask(task)}
                        className={`btn btn-xs sm:btn-sm ${currentTask?.id === task.id ? 'btn-primary' : 'btn-ghost'}`}
                      >
                        Select
                      </button>
                      <button onClick={() => removeTask(task.id)} className="btn btn-ghost btn-xs sm:btn-sm">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex space-x-4 mt-2 sm:mt-4">
              <button onClick={toggleTimer} className="btn btn-sm sm:btn-md btn-outline btn-circle">
                {isActive ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
              <button onClick={resetTimer} className="btn btn-sm sm:btn-md btn-outline btn-circle">
                <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button onClick={toggleMute} className="btn btn-sm sm:btn-md btn-outline btn-circle">
                {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
              {isRinging && (
                <button onClick={stopRingingSound} className="btn btn-sm sm:btn-md btn-outline btn-circle btn-error">
                  <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
            </div>
            <div className="text-xs sm:text-sm">Sessions completed: {sessionCount}</div>
            {currentTask && (
              <div className="text-xs sm:text-sm font-medium">
                Current task: {currentTask.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFocusTimer;