import { createContext, useState, useContext, useEffect, useRef } from 'react'
import NewBalootContext from '../../cmps/ministore/NewBalootContext';
import PlayerCardList from '../../cmps/PlayerCardList/PlayerCardList';
import MainContext from '../../store/MainContext';
import classes from './JoinBalootPage.module.css'
import LOADER from '../../assets/loading2.gif'
import ScoreBoard from '../../cmps/ScoreBoard/ScoreBoard';
import WinnersAre from '../../cmps/WinnersAre';
import GetReady from '../../cmps/GetReady/GetReady';
import history from '../../history.js'
function JoinBalootPage(props) {
    const [roomId, setRoomId] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [ans, setAns] = useState('')
    const [submit, setSubmit] = useState(false)
    const [hideInit, setHide] = useState(false)
    const currBalootConext = useContext(NewBalootContext)
    const mainCTX = useContext(MainContext)
    const pinRef = useRef();
    let init = (<div className={classes['init-screen']}>
        <h1>Let's Play!</h1>
        <p><span style={{ fontWeight: "bolder" }}>Joining room: </span>{roomId ? roomId + "\n" : ''}</p>
        <p><span style={{ fontWeight: "bolder" }}>Nick Name: </span>{playerName ? playerName : ''}</p>
        <div className={classes['join-form']}>
            <input type="text" placeholder={"PIN NUMBER"} ref={pinRef} onChange={ev => setRoomId(ev.target.value + '')} className={classes['join-input-field']}></input>
            <input type="text" placeholder={"NAME"} onChange={ev => setPlayerName(ev.target.value + '')} className={classes['join-input-field']}></input>
            <button width={150 + 'px'} height={50 + 'px'} onClick={() => {
                if (!Boolean(playerName) || !Boolean(roomId)) {
                    alert('both fields are mandatory')
                    return
                } else {
                    console.log('the id of the room to connect to is:', roomId, '\nplayer name: ', playerName)
                    mainCTX.joinRoomId({ roomId: roomId, name: playerName })
                    setHide(true);
                }
            }}>JOIN</button>

        </div>
    </div>)
    let waitForStart = (<div className={classes['wait']}>
        <h1>wait for it...</h1>
    </div>)
    let cards = useRef('')
    useEffect(() => {
        console.log('this is JoinBaloot, answers are: ', mainCTX.currGameData.answers)
        setSubmit(false)
        cards.current = (mainCTX.currGameData.answers.length > 0) ? <PlayerCardList answers={mainCTX.currGameData.answers} submitAnswer={mainCTX.submitAnswer} setSubmit={setSubmit} /> : ''

    }, [mainCTX.currGameData.answers])
    useEffect(() => {
        mainCTX.gameInit();
        changeBackgroundColor('white')
        console.log('params~~', props.match.params.id)
        if (document.querySelector('div#qr-cont')) document.querySelector('div#qr-cont').remove()
        if (Boolean(props.match.params.id)) {
            setRoomId(props.match.params.id)
            pinRef.current.value = props.match.params.id
            console.log('pinRef.current:', pinRef.current)
        }
        window.addEventListener('beforeunload', alertUser)
        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])
    useEffect(() => {
        console.log('join baloot game flag is:', mainCTX.gameFlag)
    }, [mainCTX.gameFlag])
    useEffect(() => {
        console.log('players are:', mainCTX.players)
    }, [mainCTX.players])
    const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''
    }
    function changeBackgroundColor(color) {
        document.querySelector("body").style.backgroundColor = color
        return true
    }
    return (<div className={classes['main-container']}>
        <div className={classes['content-container']}>
            {!hideInit && changeBackgroundColor("white") && init}
            {hideInit && (mainCTX.gameFlag !== 'GetReady') && !Boolean(cards.current) && waitForStart}

            {mainCTX.gameFlag === 'GetReady' && hideInit && !Boolean(cards.current) && <div className={classes['get-ready-cont']}><GetReady /></div>}
            {(mainCTX.gameFlag === 'GameOn') && changeBackgroundColor("white") && <div className={classes['question-cont']}><span style={(parseInt(mainCTX.currTimeLeft) > 10) ? ({ color: "black", alignSelf: "flex-end", margin: "20px" }) : ({ color: "red", alignSelf: "flex-end", margin: "20px" })}>TIME:{mainCTX.currTimeLeft}</span>
                <p>{mainCTX.currGameData.question}</p>
                {mainCTX.currGameData.imgURL && <img src={mainCTX.currGameData.imgURL} alt={'question-image'} style={{ width: '50%' }} />}
                {cards.current}</div>}
            {submit && (mainCTX.gameFlag === 'GameOn') && changeBackgroundColor("#054ada") && <div className={classes['wait-players-cont']}>
                <span>Alllright!</span>
                <img src={LOADER} className={classes['loader-img']} />
            </div>
            }
            {(mainCTX.gameFlag === 'ScoreBoard') && changeBackgroundColor("#054ada") && <div className={classes['score-board-cont']}><span>SCORE BOARD</span><ScoreBoard players={mainCTX.players} /></div>}
            {(mainCTX.gameFlag === 'GameOver') && changeBackgroundColor("#054ada") && <div className={classes['game-over-cont']}><WinnersAre winners={mainCTX.currGameData.winners} />
                <button style={{ width: "150px", height: "50px", marginTop: "10px" }} onClick={() => history.push('/')}>GO HOME</button>
            </div>}
        </div>
    </div>);
}

export default JoinBalootPage