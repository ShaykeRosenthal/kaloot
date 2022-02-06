import { useState, useEffect, useContext, useRef } from 'react'
import Triangle from '../AnswerCardList/AnswerCardTriangle/AnswerCardTriangle.js'
import Square from '../AnswerCardList/AnswerCardSquare/AnswerCardSquare.js'
import Circle from '../AnswerCardList/AnswerCardCircle/AnswerCardCircle.js'
import Diamond from '../AnswerCardList/AnswerCardDiamond/AnswerCardDiamond.js'
import classes from './PlayerCardList.module.css'
function PlayerCardList(props) {
    const [hide, setHide] = useState(false)
    // console.log('this is PlayerCardList, answers are: ', props.answers)
    // console.log('hide is:', hide)
    useEffect(() => {
        setHide(false)
    }, [props.answers])
    var Shapes = [Triangle, Diamond, Circle, Square] // get all the shapes in one array
    const { answers, submitAnswer, setSubmit } = props;
    var list = Shapes.map((shape, index) => { //for every shape render an answer card with that shape, all the cards combined make up the card list.
        const CurrShape = Shapes[index]
        return (
            <div className={classes['container-' + ('painted' + (index + 1))]} key={index} > {/*if the answer card is filled ,paint it with the matching color by switching class*/}
                <CurrShape /> {/*adds a shape to the card */}
                <div className={classes[('answer-container-painted' + (index + 1))]} onClick={() => {
                    if (!props.host) {

                        submitAnswer(answers[index]);
                        setHide(true);
                        setSubmit(true)

                    }
                }}>
                    <span className={classes['answer']}>{answers[index]}</span>
                </div>
            </div>
        )
    })


    return (<div className={classes['list-container']}>{!hide && list}</div>)
}
export default PlayerCardList