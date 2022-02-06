import { useState, useEffect, useContext, useRef } from 'react'
import classes from './QuestionInput.module.css'
import NewQuestionContext from '../ministore/NewQuestionContext.js'
const CHAR_COUNT = 120;
function QuestionInput(props) {
    const currQuestionContext = useContext(NewQuestionContext);
    return (<div className={classes.container}>
        <textarea type="text" maxLength={CHAR_COUNT} value={currQuestionContext.question} wrap="soft" style={{ overflow: 'hidden', resize: 'none', height: '95%', width: '90%', margin:0}} className={classes["answer-placeholder"]} onChange={(e) => {
            currQuestionContext.setQuestion(e.target.value)
        }}></textarea>
    </div>)
}
export default QuestionInput