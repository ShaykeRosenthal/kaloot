import React, { useContext, useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring'
import GOLD_MEDAL from '../assets/gold_medal.png'
import SILVER_MEDAL from '../assets/silver_medal.png'
import BRONZE_MEDAL from '../assets/bronze_medal.png'
import GOLD_TROPHY from '../assets/trophy.png'
import AudioBox from '../cmps/AudioBox/AudioBox';
import PODIUM_TRACK from '../assets/soundtracks/final-scoreboard/bensound-energy.mp3'
import CHEERS from '../assets/soundtracks/final-scoreboard/crowd-small-at-end-of-pub-gig-3-sound-effect-99417115.mp3'
function WinnersAre(props) {
    let { first, second, third } = props.winners
    let [cheers, setCheers] = useState(false)
    const WIDTH = Math.floor(window.innerWidth / 9);
    const BORDER = 5;
    const DELAY = 9000;
    const WINNER_HEIGHT = 200;
    const COLOR = "#800080"
    const BORDER_COLOR = "#054ada"
    function createSpringObj(place) { //place= 1 || 2 || 3
        let PLACE
        switch (place) {
            case 1:
                PLACE = { height: WINNER_HEIGHT, delay: DELAY, left: `calc(((100% - ${3 * (WIDTH + 2 * BORDER) + 'px'}) / 2) + ${(WIDTH + 2 * BORDER) + 'px'})` }
                break;
            case 2:
                PLACE = { height: 0.75 * WINNER_HEIGHT, delay: DELAY + 750, left: `calc(((100% - ${3 * (WIDTH + 2 * BORDER) + 'px'}) / 2) + ${2 * (WIDTH + 2 * BORDER) + 'px'})` }
                break;
            case 3:
                PLACE = { height: 0.45 * WINNER_HEIGHT, delay: DELAY + 1000, left: `calc(((100% - ${3 * (WIDTH + 2 * BORDER) + 'px'}) / 2) )` }
                break;
            default:
                break;
        }
        return (
            {
                loop: false,
                to:
                {
                    height: `${PLACE.height + 'px'}`
                },
                from: { width: WIDTH + "px", backgroundColor: COLOR, height: "0px", position: "absolute", left: PLACE.left, bottom: "0px", border: `${BORDER}px solid ${BORDER_COLOR}`, config: { config: "slow" } },
                delay: PLACE.delay

            }
        )

    }
    const spring1 = useSpring(createSpringObj(1))
    const spring2 = useSpring(createSpringObj(2))
    const spring3 = useSpring(createSpringObj(3))

    const playerNameLabel = useSpring({
        to: {
            opacity: 1, fontSize: "1rem"
        },
        from: {
            opacity: 0,
            color: "white",
            fontSize: "0.25rem",
            position: "absolute",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: WIDTH + 2 * BORDER + 'px',
            config: "wobbly",
            userSelect: "none"
        },
        delay: DELAY + 1500
    })
    const medalSpring = useSpring({
        from: { width: Math.floor(window.innerWidth / 24) + 'px', height: "auto", opacity: 0, position: "relative" },
        to: { opacity: 1 },
        delay: DELAY + 1000

    })
    const goldTrophySpring = useSpring({
        from: { position: "absolute", width: Math.floor(window.innerWidth / 9) + 'px', bottom: WINNER_HEIGHT + 5 + 'px', opacity: 0, left: `calc(((100% - ${3 * (WIDTH + 2 * BORDER) + 'px'}) / 2) + ${(WIDTH + 2 * BORDER) + BORDER + 'px'})` },
        to: { opacity: 1 },
        delay: DELAY + 1500
    })
    const stage = useSpring({
        from: { width: "0px", height: "10px", backgroundColor: COLOR, bottom: "0px", position: "absolute", left: Math.floor(window.innerWidth / 3) - 10 * BORDER + 'px' },
        to: { width: Math.floor(window.innerWidth / 3) + 20 * BORDER + 'px' },
        delay: 0.95 * DELAY
    })
    const [flip, set] = useState(false)
    let [idx, setIdx] = useState(0);
    let message = ["Good Job Everyone", "And...", "The Winners...", "Are..."]
    const [text, setText] = useState("")
    const winnersAre = useSpring({
        to: [{ opacity: 1, fontSize: "3rem", bottom: "75%", left: "10%", rotateZ: 0 }, { opacity: 0, fontSize: "1rem", bottom: "80%", left: "10%", rotateZ: 180 }],
        from: { opacity: 0, fontSize: "1rem", position: "absolute", left: "10%", bottom: "10%" },
        reset: true,
        // reverse: flip,
        delay: 25,
        config: "gentle",
        onRest: () => {
            if (idx <= 3) {
                setText(message[idx])
                setIdx(idx + 1)
                // set(!flip)
            } else {
                if (idx === 4) {

                    setCheers(CHEERS)
                }
                setIdx(idx + 1)
                setText("")
            }

        },
    })
    return (
        <div style={{ width: "100vw", height: "500px", backgroundColor: "#054ada", position: "relative", display: "flex", flexDirection: "column" }}>
            <animated.h1 style={winnersAre}>{text}</animated.h1>
            <animated.span style={{ ...playerNameLabel, position: "absolute", width: Math.floor(window.innerWidth / 9) + 'px', bottom: WINNER_HEIGHT + 1.5 * WIDTH + 10 + 'px', left: `calc(((100% - ${3 * (WIDTH + 2 * BORDER) + 'px'}) / 2) + ${(WIDTH + 2 * BORDER) + BORDER + 'px'})` }}>{first}</animated.span>
            <animated.span style={{ ...playerNameLabel, position: "absolute", width: Math.floor(window.innerWidth / 9) + 'px', bottom: 0.75 * WINNER_HEIGHT + 10 + 'px', left: `calc(((100% - ${3 * (WIDTH + 2 * BORDER) + 'px'}) / 2) + ${2 * (WIDTH + 2 * BORDER) + BORDER + 'px'})` }}>{second}</animated.span>
            <animated.span style={{ ...playerNameLabel, position: "absolute", width: Math.floor(window.innerWidth / 9) + 'px', bottom: 0.45 * WINNER_HEIGHT + 10 + 'px', left: `calc(((100% - ${3 * (WIDTH + 2 * BORDER) + 'px'}) / 2) + ${BORDER + 'px'} )` }}>{third}</animated.span>
            <animated.img src={GOLD_TROPHY} style={goldTrophySpring} ></animated.img>
            <animated.div style={spring1}><animated.img src={GOLD_MEDAL} style={medalSpring} ></animated.img></animated.div>
            <animated.div style={spring2}><animated.img src={SILVER_MEDAL} style={medalSpring} ></animated.img></animated.div>
            <animated.div style={spring3}><animated.img src={BRONZE_MEDAL} style={medalSpring} ></animated.img></animated.div>
            <animated.div style={stage}></animated.div>
            {props.host && <AudioBox track={cheers} autoPlay />}
            {props.host && <AudioBox track={PODIUM_TRACK} autoPlay loop controls customStyle={{ alignSelf: "flex-end" }} />}
        </div>)

}
export default WinnersAre