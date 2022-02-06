import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../../store/MainContext.js'
import classes from './MyBalootsPage.module.css'
import history from '../../history.js';
function MyBalootsPage(props) {
    const mainCTX = useContext(MainContext)
    const [baloots, setBaloots] = useState([])
    const [list, setList] = useState('')
    useEffect(() => {
        setBaloots(mainCTX.currUser.baloot)
        document.querySelector('body').style.backgroundColor = 'white'
        if (document.querySelector('div#qr-cont')) document.querySelector('div#qr-cont').remove()
    }, [])
    useEffect(() => {
        console.log('baloots are:', baloots)
        if (baloots && baloots.length > 0) {
            setList(
                <ul className={classes['baloot-list']}>{baloots.map((baloot, index) => (<li key={index} className={classes['baloot-item']}>
                    <div className={classes['baloot-card']}>{baloot.imgURL && <div style={{ backgroundColor: 'black', backgroundImage: `url(${baloot.imgURL})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%' }} ></div>}<span className={classes['baloot-name']}>{baloot.balootName || 'Error'}</span></div>
                    <div className={classes['control-panel-cont']}>
                        <span className={classes['control-panel-btn1']} onClick={() => { mainCTX.handleCurrBaloot(baloot); history.push(`play/${baloot._id}`) }}>PLAY</span>
                        <span className={classes['control-panel-btn2']} onClick={() => { mainCTX.handleCurrBaloot(baloot); history.push(`edit/${baloot._id}`) }}>EDIT</span>
                    </div>

                </li>))}</ul>
            )
        }
    }, [baloots])

    return (<div>
        <h1 style={{ color: "black" }}>My Kaloots</h1>
        <div className={classes['baloot-list-container']}>{Boolean(list) ? list : <span style={{ color: "black" }}>No Kaloots to show</span>}</div>

    </div>);
}

export default MyBalootsPage