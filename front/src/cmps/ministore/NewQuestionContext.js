import { createContext, useState, useEffect } from 'react'

const NewQuestionContext = createContext({
    tempId: '',
    question: '',
    imgURL: '',
    timeToAnswer: 30,
    answers: new Array(4).fill({ answer: '', isCorrect: false, imgURL: '' }),
    editMode: false,
    setQuestion: () => { },
    setImgURL: () => { },
    setTimeToAnswer: () => { },
    setAnswers: () => { },
    markAns: () => { },
    getCorrectAnsIndex: () => { },
    initContext: () => { },
    editQuestion: () => { },
    setEditMode: () => { },
    genTempId: () => { }
});

function genTempId(newId = '', len = 20) {
    const string = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0~1!2@3#4$5%6^7&8*9αβγδεζηθΧΨΩπω'
    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    while (newId.length < len) {
        newId += string.split("")[getRandomArbitrary(0, string.length)]
    }
    return newId;
}
export function NewQuestionContextProvider(props) {
    const [question, setQuestion] = useState('')
    const [imgURL, setImgURL] = useState('')
    const [timeToAnswer, setTimeToAnswer] = useState(30)
    const [answers, setAnswers] = useState(new Array(4).fill({ answer: '', isCorrect: false, imgURL: '' }))
    const [tempId, setTempId] = useState(genTempId())
    const [editMode, setEditMode] = useState(false)
    useEffect(() => { console.log('newquestion with tempId:', tempId) }, [tempId])
    const context = {
        tempId: tempId,
        question: question,
        imgURL: imgURL,
        timeToAnswer: timeToAnswer,
        answers: answers,
        editMode: editMode,
        setQuestion: setQuestion,
        setImgURL: setImgURL,
        setTimeToAnswer: setTimeToAnswer,
        setAnswers: setAnswers,
        markAns: markAns,
        getCorrectAnsIndex: getCorrectAnsIndex,
        initContext: initContext,
        editQuestion: editQuestion,
        setEditMode: setEditMode,
        genTempId: genTempId
    }
    function editQuestion(questionObj) {
        console.log('editting question: ', questionObj)
        setTempId(questionObj.tempId)
        setQuestion(questionObj.question)
        let imgURL = questionObj.imgURL || questionObj.imgURL
        console.log('imgURL:', imgURL)
        setImgURL(imgURL)
        setTimeToAnswer(questionObj.timeToAnswer)
        setAnswers(questionObj.answers)
        setEditMode(true)
        console.log('context changed and tempId is: ', context.tempId)
    }
    function initContext() {
        var newId = genTempId()
        setTempId(newId)
        setQuestion('')
        setImgURL('')
        setTimeToAnswer(30)
        setAnswers(new Array(4).fill({ answer: '', isCorrect: false, imgURL: '' }))
        setEditMode(false)
    }

    function markAns(answerNumber = NaN) { //if no answerNumber is passed, sets all answers' isCorrect value  to false
        const newAnswers = [...answers]
        if (!isNaN(answerNumber)) {
            newAnswers.forEach((answer) => { answer.isCorrect = false })
            newAnswers[answerNumber].isCorrect = true;
            setAnswers(newAnswers)
        } else {
            newAnswers.forEach((answer) => { answer.isCorrect = false })
            setAnswers(newAnswers)
        }
    }
    function getCorrectAnsIndex() {
        var index = answers.findIndex((answer) => (answer.isCorrect === true))
        index = (index > -1) ? (index + 1) : -1;
        return index;
    }
    return (
        <NewQuestionContext.Provider value={context}>
            {props.children}
        </NewQuestionContext.Provider>

    )
}
export default NewQuestionContext
