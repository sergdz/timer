import './App.css';

import { useState, useEffect } from 'react';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [breakMinutes, setBreakMinutes] = useState(breakLength);
  const [breakSeconds, setBreakSeconds] = useState(59);
  const [sessionLength, setSessionLength] = useState(25);
  const [minutes, setMinutes] = useState(sessionLength);
  const [seconds, setSeconds] = useState(0);
  const [timerPlay, setTimerPlay] = useState(false);
  const [timerFinish, setTimerFinish] = useState(false);
  const [audio, setAudio] = useState(new Audio('https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'));
  const [sessionTimer, setSessionTimer] = useState(true);
  const [breakTimer, setBreakTimer] = useState(false);

  const eventListenerFunction = (e) => {
    switch (e.target.parentElement.className.baseVal) {
      case 'svg-inline--fa fa-pause fa-2x':
        setTimerPlay((state) => !state);
        break;
      case 'svg-inline--fa fa-play fa-2x':
        setTimerPlay((state) => !state);
        break;
      default:
        break;
    }

    if (!timerPlay) {

      if (
        e.target.parentElement.parentElement.className === 'length-control' ||
        e.target.parentElement.parentElement.className === 'btn-level'
      ) {
        switch (e.target.parentElement.parentElement.id) {
          case 'break-increment':
            setBreakLength((state) => breakMinutes + 1);
            break;
          case 'break-decrement':
            setBreakLength((state) => Math.max(1, state - 1)); // Ensure breakLength is not less than 1
            setBreakMinutes((state) => Math.max(1, state - 1)); // Use the updated breakLength directly
            break;
          case 'session-increment':
            setSessionLength((state) => sessionLength + 1);
            setMinutes(sessionLength + 1); // Use the updated sessionLength directly
            setSeconds(0); // Reset seconds to 0 when session length is updated
            break;
          case 'session-decrement':
            setSessionLength((state) => Math.max(1, sessionLength - 1)); // Ensure sessionLength is not less than 1
            setMinutes( Math.max(1, sessionLength - 1)); // Use the updated sessionLength directly
            setSeconds(0); // Reset seconds to 0 when session length is updated
            break;
          default:
            break;
        }
      }

    }


  };

  useEffect(() => {
    let interval;

    if (timerPlay) {
      interval = setInterval(() => {
        if (minutes === 0 && seconds === 0) {
          if (breakTimer) {
            // Break time is up, switch to sessionTimer
            setBreakTimer(false);
            setMinutes(sessionLength - 1);
            setSeconds(59);
          } else {
            // Session time is up, switch to breakTimer
            setBreakTimer(true);
            setMinutes(breakLength - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prevSeconds) => (prevSeconds === 0 ? 59 : prevSeconds - 1));
          if (seconds === 0) {
            setMinutes((prevMinutes) => prevMinutes - 1);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerPlay, minutes, seconds, breakTimer, breakLength, sessionLength]);



  const MIN_SESSION_LENGTH = 1;
  const MAX_SESSION_LENGTH = 60;
  const MIN_BREAK_LENGTH = 1;
  const MAX_BREAK_LENGTH = 60;
  useEffect(() => {
    if (breakLength < MIN_BREAK_LENGTH) {
      setBreakLength(MIN_BREAK_LENGTH);
      setBreakMinutes(MIN_BREAK_LENGTH)
    } else if (breakLength > MAX_BREAK_LENGTH) {
      setBreakLength(MAX_BREAK_LENGTH);
      setBreakMinutes(MIN_BREAK_LENGTH)
    }

    if (sessionLength < MIN_SESSION_LENGTH) {
      setSessionLength(MIN_SESSION_LENGTH);
      setMinutes(MAX_SESSION_LENGTH);
    } else if (sessionLength > MAX_SESSION_LENGTH) {
      setSessionLength(MAX_SESSION_LENGTH);
      setMinutes(MAX_SESSION_LENGTH);
    }
  }, [breakLength, sessionLength]);


  useEffect(() => {
    if (timerFinish) {
      audio.play();
    }
  }, [timerFinish]);

  const formatTime = (minutes, seconds) => {
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return formattedMinutes + ':' + formattedSeconds;
  };



  return (
    <div className="app" onClick={eventListenerFunction}>
      <div className="main-title">
        25 + 5 Clock
      </div>
      <div className="length-control">
        <div id="break-label">
          Break Length
        </div>
        <button className="btn-level" id="break-increment" value="-">
          <i className="fas fa-arrow-up fa-2x"></i>
        </button>
        <div className="btn-level" id="break-length">
          {breakLength}
        </div>
        <button className="btn-level" id="break-decrement" value="+">
          <i className="fas fa-arrow-down fa-2x"></i>
        </button>
      </div>
      <div className="length-control">
        <div id="session-label">
          Session Length
        </div>
        <button className="btn-level" id="session-increment" value="-">
          <i className="fas fa-arrow-up fa-2x"></i>
        </button>
        <div className="btn-level" id="session-length">
          {sessionLength}
        </div>
        <button className="btn-level" id="session-decrement" value="+">
          <i className="fas fa-arrow-down fa-2x"></i>
        </button>
      </div>
      <div className="timer" style={minutes <= 0 ? { color: 'rgb(165, 13, 13)' } : { color: 'white' }}>
        <div className="timer-wrapper">
          <div id="timer-label">
            {breakTimer ? 'Break' : 'Session'}
          </div>
          <div id="time-left">
            {sessionTimer ? formatTime(minutes, seconds) : formatTime(breakMinutes, breakSeconds)}
          </div>
        </div>
      </div>
      <div className="timer-control">
        <button id="start_stop">
          <i className="fas fa-play fa-2x"></i>
          <i className="fas fa-pause fa-2x"></i>
        </button>
        <button id="reset">
          <i className="fas fa-refresh fa-2x"></i>
        </button>
      </div>

      <audio id="beep" preload="auto" onPlay={true} src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav">
      </audio>
    </div>
  );
}

export default App;