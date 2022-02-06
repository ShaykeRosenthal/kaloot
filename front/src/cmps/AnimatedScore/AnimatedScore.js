import React, { useContext, useEffect, useState, useRef } from 'react';
import { useSpring, animated } from 'react-spring'
function AnimatedScore(props) {
    const [flip, set] = useState(false)
    const { number } = useSpring({
        reset: true,
        reverse: flip,
        from: { number: 0 },
        number: props.score,
        delay: 50,
        config: "molasses",
    })
    let customStyle = {
        color: "white",
        fontSize: "x-large",
        padding: "15px",
        userSelect: "none"
    }
    return <animated.span style={customStyle}>{number.to(n => Math.floor(n))}</animated.span>
}
export default AnimatedScore