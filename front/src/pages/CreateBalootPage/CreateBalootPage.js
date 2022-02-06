import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../../store/MainContext'
import AnswerCardList from '../../cmps/AnswerCardList/AnswerCardList'
import QuestionInput from '../../cmps/QuestionInput/QuestionInput.js'
import { NewQuestionContextProvider } from '../../cmps/ministore/NewQuestionContext'
import NewQuestionContex from '../../cmps/ministore/NewQuestionContext'
import QuestionImage from '../../cmps/QuestionImage/QuestionImage';
// import PlaceHolder from '../cmps/PlaceHolder/PlaceHolder';
import classes from './CreateBalootPage.module.css'
import CreateBalootLeftSide from '../../cmps/CreateBalootLeftSide/CreateBalootLeftSide';
import CreateBalootRightSide from '../../cmps/CreateBalootRightSide/CreateBalootRightSide';
import { NewBalootContextProvider } from '../../cmps/ministore/NewBalootContext';
import TimeLimit from '../../cmps/TimeLimit/TimeLimit';
import ImgUploader from '../../cmps/ImgUploader/ImgUploader';
// import MainContext from '../store/MainContext';
import history from '../../history';
function CreateBalootPage(props) {
    const mainCTX = useContext(MainContext)
    useEffect(() => {
        document.querySelector('body').style.backgroundColor = 'white'
        if (document.querySelector('div#qr-cont')) document.querySelector('div#qr-cont').remove()
        if (!mainCTX.currUser.email) {
            alert('login first')
            history.push('/login')
        }
    }, [])
    return (
        <NewBalootContextProvider>
            <NewQuestionContextProvider>
                <div className={classes['page-container']}>
                    <CreateBalootLeftSide />
                    <div className={classes.main}>
                        <QuestionInput />
                        <ImgUploader />
                        <AnswerCardList />
                        <TimeLimit />
                    </div>
                    <CreateBalootRightSide />
                </div>
            </NewQuestionContextProvider>
        </NewBalootContextProvider>

    );

}

export default CreateBalootPage