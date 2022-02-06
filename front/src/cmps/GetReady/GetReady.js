import React, { useContext, useEffect, useState, useRef } from 'react';
import classes from './GetReady.module.css'
import LOADER from '../../assets/Loading.gif'
import AudioBox from '../AudioBox/AudioBox';
import COUNTDOWN from '../../assets/soundtracks/sfx/ES_Kids Countdown - SFX Producer.mp3'
import WHISTLE from '../../assets/soundtracks/sfx/whistle.mp3'
import BG_TRACK from '../../assets/soundtracks/misc/bensound-ukulele.mp3'
function GetReady(props) {
    const [track, setTrack] = useState('')
    const [bgTrack, setBgTrack] = useState('')
    const [visible, setVisible] = useState(true)
    const [timeDisplay, setTimeDisplay] = useState(10)
    var timer
    var timer2
    useEffect(() => {
        setTrack(COUNTDOWN)
        setBgTrack(BG_TRACK)
        timer = setTimeout(() => {
            setTrack(WHISTLE)
        }, 9500)
        timer2 = setInterval(() => {
            setTimeDisplay(prevState => {
                if (prevState > 0)
                    return (prevState - 1)
            });
        }, 1000)
    }, [])
    useEffect(() => {
        if (track === WHISTLE) {
            var timer3 = setTimeout(() => {
                setVisible(false)
                clearTimeout(timer)
                clearTimeout(timer2)
                clearTimeout(timer3)
            }, 1000)
        }
        return () => {
            // clearTimeout(timer)
            // clearTimeout(timer2)
            // clearTimeout(timer3)
            // setTrack('')
            // setBgTrack('')
            // setVisible(true)
            // setTimeDisplay(10)
        }
    }, [track])
    return ((props.alawaysVisible||visible) && <div className={classes['main']}>
        <div className={classes['countdown-container']}><span className={classes['countdown']}>{timeDisplay > 0 ? timeDisplay : ''}</span></div>
        <img src={LOADER} className={classes['loader-image']} />
        {props.host && (track === COUNTDOWN) && <AudioBox track={track} autoPlay />}
        {props.host && (track === WHISTLE) && <AudioBox track={track} autoPlay />}
        {props.host && (bgTrack === BG_TRACK) && <AudioBox track={bgTrack} autoPlay />}
    </div>)

}
export default GetReady