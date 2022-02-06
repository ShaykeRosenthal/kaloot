import { useState, useEffect, useContext, useRef } from 'react'
import Triangle from './AnswerCardTriangle/AnswerCardTriangle.js'
import Square from './AnswerCardSquare/AnswerCardSquare.js'
import Circle from './AnswerCardCircle/AnswerCardCircle.js'
import Diamond from './AnswerCardDiamond/AnswerCardDiamond.js'
import classes from './AnswerCardList.module.css'
import NewQuestionContext from '../ministore/NewQuestionContext.js'
const CHAR_COUNT = 75;
function AnswerCardList(props) {

    var currQuestionContext = useContext(NewQuestionContext);

    var Shapes = [Triangle, Diamond, Circle, Square] // get all the shapes in one array
    const { answers, setAnswers, markAns, getCorrectAnsIndex } = currQuestionContext
    var list = Shapes.map((shape, index) => { //for every shape render an answer card with that shape, all the cards combined make up the card list.
        const CurrShape = Shapes[index]
        return (
            <div className={(Boolean(answers[index].answer)) ? classes['container-' + ('painted' + (index + 1))] : classes.container} key={index} > {/*if the answer card is filled ,paint it with the matching color by switching class*/}
                <CurrShape /> {/*adds a shape to the card */}
                <div className={classes[(Boolean(answers[index].answer)) ? ('answer-container-painted' + (index + 1)) : 'answer-container']} >
                    <div className={(Boolean(answers[index].answer)) ? classes['char-count-painted' + (index + 1)] : classes['char-count']}>{/*if the answer card was filled show an appropriate charcount at the top of the card */}
                        <span>{CHAR_COUNT - answers[index].answer.split("").length}</span>{/*=char count - current answer length */}
                    </div>
                    <textarea value={answers[index].answer} type="text" maxLength={CHAR_COUNT} wrap="soft" className={classes[(Boolean(answers[index].answer)) ? ('answer-placeholder-painted' + (index + 1)) : 'answer-placeholder']} id={(index + 1)} placeholder={'Add answer ' + (index + 1)} onChange={(e) => {
                        setAnswers((prevState) => {
                            const newAnswers = [...prevState]
                            newAnswers[parseInt(e.target.id) - 1] = { answer: e.target.value, isCorrect: false, imgURL: '' };
                            return newAnswers;
                        })
                    }}></textarea>
                    {/*if the answer card was filled show an "answer checkbox" to mark the right answer and then pass it to the context object, otherwise render '' :*/}
                    {(Boolean(answers[index].answer)) ?
                        <div className={(getCorrectAnsIndex() === (index + 1)) ? classes['turlak-correct'] : classes.turlak} id={(index + 1)} onClick={(e) => {
                            if ((getCorrectAnsIndex() === (index + 1))) {

                                markAns(NaN)
                            } else {

                                markAns(parseInt(e.target.id) - 1)
                            }
                        }}></div> : ''
                    }

                </div>
            </div>
        )
    })
    return (<div className={classes['list-container']}>{list}</div>)
}
export default AnswerCardList