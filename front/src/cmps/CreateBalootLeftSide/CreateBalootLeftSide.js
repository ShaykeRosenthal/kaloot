import React, { useState, useContext, useEffect, useRef } from 'react';
import NewBalootContext from '../ministore/NewBalootContext';
import NewQuestionContext from '../ministore/NewQuestionContext';
import QuestionThumbNail from '../QuestionThumbNail/QuestionThumbNail';
import classes from './CreateBalootLeftSide.module.css'
import imagePlaceHolder from '../ministore/assets/imagePlaceHolder.png'
import MainContext from '../../store/MainContext';
function CreateBalootLeftSide(props) {
    const currBalootContext = useContext(NewBalootContext)
    const questionContext = useContext(NewQuestionContext)
    const mainCTX = useContext(MainContext)
    const { tempId, answers, question, imgURL, timeToAnswer } = questionContext
    useEffect(() => {
        currBalootContext.setQuestions({ tempId, answers, question, imgURL, timeToAnswer }, 'ADD')

    }, [])
    useEffect(() => { console.log("currBalootContext: ", currBalootContext) }, [currBalootContext])
    useEffect(() => {
        console.log("questionContext: ", questionContext)

    }, [questionContext])
    useEffect(() => {
        console.log('mainCTX.currBaloot:', mainCTX.currBaloot)

        if (props.editMode && Object.keys(mainCTX.currBaloot).length > 0) currBalootContext.loadExistingBaloot()
    }, [mainCTX.currBaloot])
    useEffect(() => {
        showThumbs()

    }, [questionContext.tempId])
    function removeFromList(questionId) {
        let question = currBalootContext.getQuestionById(questionId)
        currBalootContext.setQuestions(question, 'DELETE')
    }
    function editQuestion(questionId) {
        let questionInBaloot = currBalootContext.getQuestionById(questionId)
        if (Boolean(questionInBaloot.question)) {
            questionInBaloot.editMode = true
            questionContext.editQuestion(questionInBaloot)
        }
    }
    function showThumbs() {
        var ThumbList = currBalootContext.questions.map((thisQuestion, index) => {
            let imgURL=thisQuestion.imgURL||thisQuestion.imgURL
            console.log('showThumbs,imgURL:',imgURL)
            return (<QuestionThumbNail pic={Boolean(imgURL) ? imgURL : imagePlaceHolder} key={index + 1} id={thisQuestion.tempId} removeFromList={removeFromList} editQuestion={editQuestion} />)
        })
        return ThumbList;
    }
    return (
        <div className={classes.container}>
            <div className={classes.slides}>
                {
                    showThumbs()
                }
            </div>
            <div className={classes['add-question-btn']} onClick={() => {
                if (!Boolean(questionContext.question)) {
                    alert('you did not insert a question to ask')
                    return;
                }
                var blankAnswers = questionContext.answers.filter((ans) => (!Boolean(ans.answer))).length
                if (blankAnswers !== 0) {
                    alert(`you forgot to fill ${blankAnswers} answers`)
                    return;
                }
                var numberOfCorrectAnswers = questionContext.answers.filter((ans) => (ans.isCorrect)).length
                if (numberOfCorrectAnswers !== 1) {
                    alert('check a correct answer to continue!')
                    return;
                }
                if (!currBalootContext.getQuestionById(questionContext.tempId)) {
                    currBalootContext.setQuestions({ tempId, answers, question, imgURL, timeToAnswer }, 'ADD')
                } else {
                    currBalootContext.setQuestions({ tempId, answers, question, imgURL, timeToAnswer }, 'UPDATE')
                }
                questionContext.initContext();

            }}><span>{questionContext.editMode ? 'UPDATE' : 'ADD'}</span></div>
        </div>
    )

} export default CreateBalootLeftSide