import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../../store/MainContext'
import AnswerCardList from '../../cmps/AnswerCardList/AnswerCardList'
import QuestionInput from '../../cmps/QuestionInput/QuestionInput.js'
import { NewQuestionContextProvider } from '../../cmps/ministore/NewQuestionContext'
import NewQuestionContex from '../../cmps/ministore/NewQuestionContext'
import QuestionImage from '../../cmps/QuestionImage/QuestionImage';
// import PlaceHolder from '../cmps/PlaceHolder/PlaceHolder';
import classes from './EditBalootPage.module.css'
import CreateBalootLeftSide from '../../cmps/CreateBalootLeftSide/CreateBalootLeftSide';
import CreateBalootRightSide from '../../cmps/CreateBalootRightSide/CreateBalootRightSide';
import NewBalootContext, { NewBalootContextProvider } from '../../cmps/ministore/NewBalootContext';
import TimeLimit from '../../cmps/TimeLimit/TimeLimit';
import ImgUploader from '../../cmps/ImgUploader/ImgUploader';
// import MainContext from '../store/MainContext';
import history from '../../history';
function EditBalootPage(props) {
  const mainCTX = useContext(MainContext)
  const balootCTX = useContext(NewBalootContext)
  let balootId = props.match.params.id
  useEffect(() => {
    // if (!mainCTX.currUser.email) {
    //   alert('login first')
    //   history.push('/login')
    // }
    mainCTX.getBalootById(balootId,true,false)
    document.querySelector('body').style.backgroundColor = 'white'
    if (document.querySelector('div#qr-cont')) document.querySelector('div#qr-cont').remove()
  }, [])
  return (
    <NewBalootContextProvider>
      <NewQuestionContextProvider>
        <div className={classes['page-container']}>
          <CreateBalootLeftSide editMode />
          <div className={classes.main}>
            <QuestionInput editMode />
            <ImgUploader editMode />
            <AnswerCardList editMode />
            <TimeLimit editMode />
          </div>
          <CreateBalootRightSide />
        </div>
      </NewQuestionContextProvider>
    </NewBalootContextProvider>

  );

}

export default EditBalootPage