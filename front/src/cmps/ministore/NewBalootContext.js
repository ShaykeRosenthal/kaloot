import { createContext, useState, useContext, useEffect } from 'react'
import uploadToHost from './uploadToHost.js'
import bringMeStuff from '../../services/httpService.js'
import MainContext from '../../store/MainContext.js'
import NewQuestionContext from './NewQuestionContext.js'
const DEAFULT_COVER_IMAGE_URL = 'https://res.cloudinary.com/dw7o5fmcj/image/upload/v1636631154/baloot%20assets/imagePlaceHolder_tmpbdq.png'
const NewBalootContext = createContext({
    balootName: '',
    keywords: [],
    imgURL: DEAFULT_COVER_IMAGE_URL,
    questions: [],
    isPublic: '',
    setBalootName: () => { },
    setKeywords: () => { },
    setImgURL: () => { },
    setQuestions: () => { },
    setIsPublic: () => { },
    getQuestionById: () => { },
    getPrevQuestionId: () => { },
    saveNewBaloot: () => { },
    loadExistingBaloot: () => { }

});
export function NewBalootContextProvider(props) {
    const [balootName, setBalootName] = useState('')
    const [keywords, setKeywords] = useState([])
    const [imgURL, setImgURL] = useState(DEAFULT_COVER_IMAGE_URL)
    const [questions, setQuestions] = useState([])
    const [isPublic, setIsPublic] = useState(false)
    const mainCTX = useContext(MainContext)
    const questionCTX = useContext(NewQuestionContext)
    const currUser = mainCTX.currUser
    const context = {
        balootName: balootName,
        keywords: keywords,
        imgURL: imgURL,
        questions: questions,
        isPublic: isPublic,
        setBalootName: setBalootName,
        setKeywords: setKeywords,
        setImgURL: setImgURL,
        setQuestions: updateQuestions,
        setIsPublic: setIsPublic,
        getQuestionById: searchQuestionById,
        getPrevQuestionId: getPreviousQuestionId,
        saveNewBaloot: saveNewBaloot,
        loadExistingBaloot: loadExistingBaloot
    }
    useEffect(() => {
        const imageHostURL = async () => {
            if (imgURL !== DEAFULT_COVER_IMAGE_URL && imgURL.includes("data:image/")) {
                let res = await uploadToHost(imgURL);
                console.log('*********yayyy got url for cover image from cloudinary********')
                setImgURL(res.url);
            }
        }
        imageHostURL(); // if user changed the cover image from the DEAFULT_COVER_IMAGE_URL replace it with an appropriate cloudinary URL
    }, [imgURL])
    useEffect(() => {
        console.log('USER is: ', mainCTX.currUser)

    }, [mainCTX.currUser])
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
    function loadExistingBaloot() {
        let baloot = mainCTX.currBaloot
        if (Object.keys(baloot).length > 0) {
            // let newQuestions=[...baloot.questions]
            // console.log('[...baloot.questions]:',[...baloot.questions], '\n')
            let newQuestions = [...baloot.questions].map((q) => {
                let newTempId = genTempId()
                q.tempId = newTempId
                return q
            })
            baloot.questions = newQuestions;
            setBalootName(baloot.balootName)
            setKeywords(baloot.keywords)
            setQuestions(baloot.questions)
            setIsPublic(baloot.isPublic)
            let imgURL = baloot.imgURL || baloot.imgURL
            console.log('imgURL:', imgURL)
            setImgURL(imgURL)
            console.log('done loading baloot from mainCTX to NewBalootContext')
        } else {
            console.log('no baloot was loaded to mainCTX')
        }
    }
    function getPreviousQuestionId(questionId) {
        let index = questions.findIndex((question) => (question.tempId === questionId))
        if (index < 0) return false;
        else if (index > 0) return index - 1;
        else return 0;
    }
    function searchQuestionById(questionId) {
        let res = questions.filter((q) => (q.tempId === questionId))
        return ((res.length === 0) ? false : res[0])
    }

    function updateQuestions(question, action = 'ADD') {
        if (!question || !action) {
            console.log('cannot add/delete new question')
            return;
        }
        let index;
        switch (action) {
            case 'ADD':
                let newQuestions = [...questions, question]
                setQuestions(newQuestions)
                break;
            case 'UPDATE':
                index = questions.findIndex((q) => (q.tempId === question.tempId))
                if (index > -1) {
                    let newQuestions = [...questions]
                    newQuestions.splice(index, 1)
                    newQuestions.splice(index, 0, question)
                    setQuestions(newQuestions)
                }
                break;
            case 'DELETE':
                index = questions.findIndex((q) => (q.tempId === question.tempId))
                if (index > -1) {
                    let newQuestions = [...questions]
                    newQuestions.splice(index, 1)
                    setQuestions(newQuestions)
                }
                break;
            default:
                break;
        }

    }

    async function saveNewBaloot(update = false) {
        /*
        1.replace every image link in each question with an appropriate cloundinary link
        2.delete temporary id (tempId) from each question object
        3. send the new baloot to DB
        */
        try {
            var remoteImageURLs
            var localImageURLs = questions.map(q => (q.imgURL));
            var baloot

            var promises = localImageURLs.map((img) => {
                console.log('img: ', img)
                if (img && !img.includes('data:image/')) {
                    return Promise.resolve(img)
                }
                else if (img) {

                    return uploadToHost(img)
                }
            })
            remoteImageURLs = await Promise.all(promises)
            var questions_with_remote_img_urls = questions.map((q, index) => {
                switch (typeof (remoteImageURLs[index])) {
                    case "undefined":
                        q.imgURl = ''
                        break;
                    case "string":
                        q.imgURL = remoteImageURLs[index]
                        break;
                    case "object":
                        q.imgURL = remoteImageURLs[index].url
                        break;
                    default:
                        break;
                }
                // console.log('remoteImageURLs[index]:', remoteImageURLs[index])
                // console.log('q.imgURL:', q.imgURL)
                return q;
            })
            console.log('questions_with_remote_img_urls: ', questions_with_remote_img_urls)
            var newQuestions = questions_with_remote_img_urls.map((questionOBJ) => {
                var question_without_tempId = { ...questionOBJ };
                if (question_without_tempId.question !== '') {
                    delete question_without_tempId.tempId;

                }
                if (question_without_tempId.hasOwnProperty('editMode')) {
                    delete question_without_tempId.editMode
                }

                return question_without_tempId;
            })
            setQuestions(newQuestions);

            console.log('baloot before upload is: ', { balootName, keywords, imgURL, questions: newQuestions, isPublic, creator: currUser.username })
            console.log('~~~update is:~~~', update)
            if (update) {
                baloot = await bringMeStuff(`baloot/${mainCTX.currBaloot._id}`, 'PUT', { balootName, keywords, imgURL, questions: newQuestions, isPublic, creator: currUser.username })


            } else {

                baloot = await bringMeStuff('baloot', 'POST', { balootName, keywords, imgURL, questions: newQuestions, isPublic, creator: currUser.username })

            }
            mainCTX.getBalootById(baloot._id, true,true)
            return 'baloot was sent'
        } catch (err) {
            console.log(err)
        }


    }



    return (
        <NewBalootContext.Provider value={context}>
            {props.children}
        </NewBalootContext.Provider>

    )
}
export default NewBalootContext
