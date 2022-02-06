function AudioBox(props) {
    let hidden = (props.hidden) ? true : false;
    let ctrl = (props.controls) ? true : false;
    let loop = (props.loop) ? true : false;
    let autoPlay = (props.autoPlay) ? true : false
    let customStyle = (props.customStyle) ? props.customStyle : {}
    return (props.track &&

        <audio controls={ctrl} loop={loop} autoPlay={autoPlay} hidden={hidden} style={customStyle} >
            <source src={props.track} />
        </audio>

    )
}
export default AudioBox