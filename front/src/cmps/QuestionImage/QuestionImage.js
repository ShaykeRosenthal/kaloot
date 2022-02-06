import { useState, useEffect, useContext } from 'react'
import NewQuestionContext from '../ministore/NewQuestionContext'
import classes from './QuestionImage.module.css'
function QuestionImage(props){
const currContext=useContext(NewQuestionContext)
    return(<div className={classes.container}>
        <img src={currContext.imgUrl} alt="image for the current question" className={classes.image} />
    </div>)
}export default QuestionImage