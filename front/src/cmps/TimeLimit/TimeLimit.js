import React, { useContext, useEffect, useState, useRef } from 'react';
import NewQuestionContext from '../ministore/NewQuestionContext';
import classes from './TimeLimit.module.css'
function TimeLimit(props) {
    const currQuestionContext = useContext(NewQuestionContext)
    const { timeToAnswer, setTimeToAnswer } = currQuestionContext
    return (
        <div className={classes['time-limit-container']}>
            <input type="range" min={30} max={90} step={5} value={timeToAnswer} className={classes['baloot-name-input']} onChange={(ev) => {
                setTimeToAnswer(parseInt(ev.target.value))
            }} />
            <span className={classes['time-limit-label']}>{timeToAnswer + " seconds"}</span>
        </div>
    )
}
export default TimeLimit