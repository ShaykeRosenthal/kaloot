import React, { useContext, useEffect, useState, useRef } from 'react';
import MainContext from '../../store/MainContext'
import classes from './PlayBalootPage.module.css'
import imagePlaceHolder from '../../assets/imagePlaceHolder.png'
// import QRCode from "react-qr-code";
import ReactDOM from "react-dom";
import LobbyPlayerList from '../../cmps/LobbyPlayerList/LobbyPlayerList';
import COPY_CLIPBOARD from '../../assets/copy_clipboard.png'
import AudioBox from '../../cmps/AudioBox/AudioBox';
import LobbyMusic1 from '../../assets/soundtracks/lobby/bensound-jazzcomedy.mp3'
import LobbyMusic2 from '../../assets/soundtracks/lobby/bensound-jazzyfrenchy.mp3'
import LobbyMusic3 from '../../assets/soundtracks/lobby/bensound-thejazzpiano.mp3'
import LobbyMusic4 from '../../assets/soundtracks/lobby/bensound-erf.mp3'
import MID_GAME_SCORE_TRACK from '../../assets/soundtracks/midgame scoreboard/sfx-magic2.mp3'
import POPSOUND from '../../assets/soundtracks/sfx/pop.mp3'
import THEME2 from '../../assets/funny1.gif'
import THEME1 from '../../assets/funny2.gif'
import THEME3 from '../../assets/shapes_jump.gif'
import GetReady from '../../cmps/GetReady/GetReady';
import PlayerCardList from '../../cmps/PlayerCardList/PlayerCardList';
import ScoreBoard from '../../cmps/ScoreBoard/ScoreBoard';
import WinnersAre from '../../cmps/WinnersAre';
import QUESTION_MUSIC1 from '../../assets/soundtracks/question/question1.mp3'
import QUESTION_MUSIC2 from '../../assets/soundtracks/question/question2.mp3'
import QUESTION_MUSIC3 from '../../assets/soundtracks/question/question3.mp3'
import QUESTION_MUSIC4 from '../../assets/soundtracks/question/question4.mp3'
import QUESTION_MUSIC5 from '../../assets/soundtracks/question/question5.mp3'
import QUESTION_MUSIC6 from '../../assets/soundtracks/question/question6.mp3'
import QUESTION_MUSIC7 from '../../assets/soundtracks/question/question7.mp3'
import QUESTION_MUSIC8 from '../../assets/soundtracks/question/question8.mp3'
import QUESTION_MUSIC9 from '../../assets/soundtracks/question/question9.mp3'
import QUESTION_MUSIC10 from '../../assets/soundtracks/question/question10.mp3'
import history from '../../history';
function PlayBalootPage(props) {
    var QRCode = require('qrcode.react');
    let mainCTX = useContext(MainContext)
    let balootId = props.match.params.id;
    const questionMusic = [QUESTION_MUSIC1, QUESTION_MUSIC2, QUESTION_MUSIC3, QUESTION_MUSIC4, QUESTION_MUSIC5, QUESTION_MUSIC6, QUESTION_MUSIC7, QUESTION_MUSIC8, QUESTION_MUSIC9, QUESTION_MUSIC10]
    const [lobbyMusic, setLobbyMusic] = useState('')
    const [pop, setPop] = useState('')
    const [blockPlayers, setBlockPlayers] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [theme, setTheme] = useState(THEME1)
    const [questionImgURL, setQuestionImgURL] = useState('')
    const [mode, setMode] = useState('lobby')
    const [players, setPlayers] = useState(mainCTX.players)
    let MusicRef = useRef()
    let ThemeRef = useRef()
    let qrImgRef = useRef()
    function createQrDataURL() {
        var node = document.createElement("div")
        node.setAttribute('id', 'qrcode')
        if (document.getElementById("qr-cont")) document.getElementById("qr-cont").appendChild(node)
        console.log('jibberish!!!')
        ReactDOM.render(<QRCode value={`https://kaloot.herokuapp.com/join/${mainCTX.currRoomId}`} level={'H'} size={128} />, node);
    }
    useEffect(() => {
        mainCTX.getBalootById(balootId, true, false)
        mainCTX.gameInit()
        if (Object.keys(mainCTX.currUser).length === 0) {
            alert('login first')
            history.push('/login')
        }
    }, [])
    useEffect(() => {
        mainCTX.updateRoomDataWithBalootData()
        setLobbyMusic(LobbyMusic2)
    }, [mainCTX.currBaloot])
    useEffect(() => {
        let qImgUrl = mainCTX.currGameData.imgURL;
        if ((Boolean(qImgUrl))) {
            setQuestionImgURL(qImgUrl)
            sessionStorage.setItem('answers', JSON.stringify(mainCTX.currGameData.answers))
            sessionStorage.setItem('imgURL', JSON.stringify(mainCTX.currGameData.imgURL))
            sessionStorage.setItem('score', JSON.stringify(mainCTX.currGameData.score))
        }
    }, [mainCTX.currGameData])
    useEffect(() => {
        setPlayers(mainCTX.players)
        if (mainCTX.players.length > 0) {

            setPop(POPSOUND)
            let popTimer = setTimeout(() => {
                setPop('')
                clearTimeout(popTimer)
            }, 100);

        }
    }, [mainCTX.players])


    useEffect(() => {
        console.log('this is the new flag: ', mainCTX.gameFlag)
        switch (mainCTX.gameFlag) {
            case 'init':
                setMode('init')
                return;
            case 'GetReady':
                setMode('readySetGo')
                return;
            case 'GameOn':
                setMode('play')
                return;
            case 'ScoreBoard':
                setMode('ScoreBoard')
                return;
            case 'GameOver':
                setMode('podium')
                return;

            default:
                return;
        }

    }, [mainCTX.gameFlag])
    useEffect(() => {
        console.log('PlayBaloot mode is: ', mode)
        if (!blockPlayers && (mode === 'play' || mode === 'readySetGo' || mode === 'ScoreBoard' || mode === 'podium')) {
            mainCTX.blockNewPlayers()
            setBlockPlayers(true)
        }
    }, [mode])
    function changeBackgroundColor(color) {
        document.querySelector("body").style.backgroundColor = color
        return true;
    }
    return ((mode === 'init') &&

        (<div className={classes['main-container']}>
            {changeBackgroundColor("white")}
            {(pop === POPSOUND) && <AudioBox track={pop} autoPlay hidden />}
            <div className={classes['bg-img-container']}>
                <img src={theme} className={classes['bg-img']} />
            </div>
            <div className={classes['music-box-container']}>
                {(lobbyMusic === LobbyMusic1) && <AudioBox track={lobbyMusic} autoPlay controls loop />}
                {(lobbyMusic === LobbyMusic2) && <AudioBox track={lobbyMusic} autoPlay controls loop />}
                {(lobbyMusic === LobbyMusic3) && <AudioBox track={lobbyMusic} autoPlay controls loop />}
                {(lobbyMusic === LobbyMusic4) && <AudioBox track={lobbyMusic} autoPlay controls loop />}
                <button style style={{ height: "25px" }} onClick={() => {
                    let LobbyMusicArr = [LobbyMusic1, LobbyMusic2, LobbyMusic3, LobbyMusic4]
                    let ThemeArr = [THEME1, THEME2, THEME3]
                    setTheme(ThemeArr[Math.floor(Math.random() * ThemeArr.length)])
                    setLobbyMusic(LobbyMusicArr[Math.floor(Math.random() * LobbyMusicArr.length)])
                }}>SHUFFLE</button>
                <select className={classes['track-list']} ref={MusicRef} onChange={(ev) => {
                    setLobbyMusic(ev.target.value)

                }}>
                    <option value={LobbyMusic2}>Playful</option>
                    <option value={LobbyMusic1}>Calm 1</option>
                    <option value={LobbyMusic3}>Calm 2</option>
                    <option value={LobbyMusic4}>Groovy</option>
                </select>
                <select className={classes['track-list']} ref={ThemeRef} onChange={(ev) => {
                    setTheme(ev.target.value)

                }}>
                    <option value={THEME1}>Theme1</option>
                    <option value={THEME2}>Theme2</option>
                    <option value={THEME3}>Theme3</option>
                </select>
            </div>
            <div className={classes['pincode-container']} id="turlak">
                <h1>PINCODE</h1>
                <div className={classes['pincode-cont-part1']}>
                    <textarea disabled className={classes['pincode']} value={mainCTX.currRoomId}></textarea>
                    <div className={classes['copy-clipboard-btn']} onClick={() => {

                        var promise = navigator.clipboard.writeText(mainCTX.currRoomId).then(() => { console.log('copied successfully'); })
                    }}>
                        <img src={COPY_CLIPBOARD} style={{ width: '50px', height: 'auto' }} />
                    </div>
                </div>
                <div id="qr-cont" style={{ marginTop: "15px" }} />
                {mainCTX.currRoomId && document.getElementById('qr-cont') && document.getElementById('qr-cont').firstChild === null && createQrDataURL()}
            </div>
            <h2>players:</h2>
            <LobbyPlayerList players={players} removePlayer={mainCTX.removePlayer} />
            {Boolean(questionImgURL) && <img src={questionImgURL} className={classes['question-image']} />}
            <button style={{ width: "150px", height: "50px" }} onClick={() => mainCTX.handleGameFlag('GetReady')}>GAME ON!</button>

        </div>) ||

        ((mode === 'readySetGo') && changeBackgroundColor("white") && (<div>
            <GetReady host />
            {setTimeout(() => {

                if (!gameStarted) {
                    mainCTX.startTimer()
                    setGameStarted(true)

                }
            }, 10500)}

        </div>)) ||
        ((mode === 'play') && (<div className={classes['game-container']}>
            {changeBackgroundColor("white")}
            <AudioBox track={questionMusic[Math.floor(Math.random() * questionMusic.length)]} customStyle={{ alignSelf: "flex-end" }} controls autoPlay />
            <h2 style={(parseInt(mainCTX.currTimeLeft) > 10) ? ({ color: "black", alignSelf: "flex-end", margin: "20px" }) : ({ color: "red", alignSelf: "flex-end", margin: "20px" })}>TIME: {mainCTX.currTimeLeft}</h2>
            <h1>{mainCTX.currGameData.question}</h1>
            {Boolean(questionImgURL) && <img src={questionImgURL} className={classes['question-image']} />}
            <PlayerCardList host answers={mainCTX.currGameData.answers} />
        </div>)) ||
        ((mode === 'ScoreBoard') && (<div>
            {changeBackgroundColor("#054ada")}
            <h1>SCORE BOARD</h1>
            <AudioBox track={MID_GAME_SCORE_TRACK} autoPlay hidden />
            <ScoreBoard players={mainCTX.players} />
            <button style={{ width: "150px", height: "50px" }} onClick={() => {
                setMode('play')
                mainCTX.advanceQuestion()
            }}>NEXT QUESTION</button>
        </div>)) ||
        ((mode === 'podium') && (<div>
            {changeBackgroundColor("#054ada")}
            <WinnersAre winners={mainCTX.currGameData.winners} host />
            <button style={{ width: "150px", height: "50px", marginTop: "10px" }} onClick={() => history.push('/')}>GO HOME</button>
        </div>))

    );
}

export default PlayBalootPage