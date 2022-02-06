import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../../store/MainContext'
import Logo from '../../assets/kahoot.png'
import BalootThumb from '../../cmps/BalootThumbnail/BalootThumbnail'
import classes from './SearchPage.module.css'
import history from '../../history.js';
import bringMeStuff from '../../services/httpService'
import KALOOT_LOGO from '../../assets/kaloot.png'

function SearchPage(props) {
    const [filterBy, setFilterBy] = useState('balootName')
    const [searchSTR, setSearchSTR] = useState('')
    const [results, setResults] = useState([])
    var mainCTX = useContext(MainContext)
    useEffect(() => {
        // mainCTX.getTopRated();
        document.querySelector('body').style.backgroundColor = "white";
        if (document.querySelector('div#qr-cont')) document.querySelector('div#qr-cont').remove()
        console.log('filterBy is:', filterBy)
        console.log('searchSTR is:', searchSTR)
    }, [])
    useEffect(() => {
        console.log('filterBy is:', filterBy)
        console.log('searchSTR is:', searchSTR)
    }, [filterBy, searchSTR])
    async function getSearchResults(criteria) {
        try {
            console.log('criteria recieved :', criteria)
            let querySTR = ''
            switch (Object.keys(criteria)[0]) {
                case 'balootName':
                    querySTR = `baloot?balootName=${criteria['balootName']}`
                    break;
                case 'keywords':
                    querySTR = `baloot?keywords=${JSON.stringify(criteria['keywords'].split(','))}`
                    break;
                case 'creator':
                    querySTR = `baloot?creator=${criteria['creator']}`
                    break;

                default:
                    break;
            }
            console.log('querySTR', querySTR)
            let res = await bringMeStuff(querySTR, 'GET')
            console.log('search results are:\n', res)
            setResults(res)
        } catch (err) {
            console.log(err)
        }
    }
    return (<div className={classes['search-page-container']}>
       <div className={classes['header']}>
       <h1>Explore</h1>
       <img src={KALOOT_LOGO} className={classes['header-logo']}></img>
           </div> 
        <div className={classes['search-panel-container']}>
            <select className={classes['filter-criteria']} value={filterBy} onChange={(ev) => {

                setFilterBy(ev.target.value)
            }}>
                <option value={'balootName'}>Name</option>
                <option value={'keywords'}>Keywords</option>
                <option value={'creator'}>Creator</option>
            </select>
            <input type="text" className={classes['search-input']} value={searchSTR} onChange={(ev) => {
                setSearchSTR(ev.target.value)
            }}></input>
            <button onClick={() => {
                let criteria = {}
                criteria[filterBy] = searchSTR
                console.log('criteria is: ', criteria)
                getSearchResults(criteria)
            }}>SEARCH</button>
        </div>
        <div className={classes['display-results-panel']}>
            {results.length !== 0 ? <ul className={classes['results-list']}>{results.map((baloot, index) => (<li key={index} className={classes['top-rated-list-item']}><BalootThumb balootName={baloot.balootName} imgURL={baloot.imgURL} balootId={baloot._id} favoriteButton={true} isFavoriteDefault={false}/></li>))}</ul> : ''}

        </div>
    </div>)

} export default SearchPage