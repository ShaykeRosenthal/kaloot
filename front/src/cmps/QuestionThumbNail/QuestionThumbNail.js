import React, { useContext, useEffect, useRef } from 'react';
import NewQuestionContext from '../ministore/NewQuestionContext';
import NewBalootContext from '../ministore/NewBalootContext';
// import FocusedQuestionContext from '../ministore/FocusedQuestionContext';
import classes from './QuestionThumbNail.module.css'
function QuestionThumbNail(props) {
    const balootContext = useContext(NewBalootContext);
    // const { focusedQuestionId, setFocusedQuestionId } = useContext(FocusedQuestionContext);
    const questionOBJ = balootContext.getQuestionById(props.id);
    const question = questionOBJ ? questionOBJ.question : '';
    return (<div className={ classes.container}>
        <div className={classes['btn-container']}>
        <span className={classes['edit-btn']} onClick={() => { props.editQuestion(props.id) }}>✍️</span>
        <span className={classes.trash} onClick={() => { props.removeFromList(props.id) }}>🗑️</span>
        </div>
        <span className={classes.title}> {question}</span>
        <img src={props.pic} className={classes['question-image']} />
    </div >)
}
export default QuestionThumbNail