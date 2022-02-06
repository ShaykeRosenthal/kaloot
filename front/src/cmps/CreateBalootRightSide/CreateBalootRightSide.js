import React, { useContext, useEffect, useState, useRef } from 'react';
import classes from './CreateBalootRightSide.module.css'
import resizeImage from '../ImgUploader/resizeImage.js';
import NewBalootContext from '../ministore/NewBalootContext';
function CreateBalootRightSide(props) {
    const [tabChosen, setTabChosen] = useState(1);
    const ref1 = useRef();
    const ref2 = useRef();
    const ref3 = useRef();
    const ref4 = useRef();
    const ref5 = useRef();
    const imgURLref = useRef();
    const IMAGE_WIDTH = 350;
    const IMAGE_HEIGHT = 350;
    const refs = [ref1, ref2, ref3, ref4, ref5]
    const currBalootContext = useContext(NewBalootContext)
    const { balootName, setBalootName, keywords, setKeywords, imgURL, setImgURL, isPublic, setIsPublic } = currBalootContext
    const [isUserApproved, setIsUserApproved] = useState([false, false, false, true])
    function fileChangedHandler(ev) {
        console.log('file change!')
        const file = ev.target.files[0];
        if (file && file.type && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                resizeImage(event.target.result, IMAGE_WIDTH, IMAGE_HEIGHT).then(resizedImg => {
                    setImgURL(resizedImg)
                    imgURLref.current.value = '';
                })
            });
            reader.readAsDataURL(file);
        } else {
            alert('the file is not an image')
            return;
        }
    }
    useEffect(() => {
        console.log('tabChosen:', tabChosen)
        refs.forEach((ref, index) => {
            if (parseInt(ref.current.id) === tabChosen) {
                ref.current.className = classes['tab-chosen']
            }
            else {

                ref.current.className = ((isUserApproved[index]) ? classes['tab-checked'] : classes['tab'])
            }

        })
        switch (tabChosen) {
            case 1:
                console.log('name:', balootName)
                return;
            case 2:
                console.log('keywords:', keywords)
                return;
            case 3:
                console.log('isPublic:', isPublic)
                return;
            case 4:
                console.log('coverImage:', imgURL.slice(0, 10), '...')
                return;
            case 5:
                console.log('sum tab')
                return;
            default:
                return '';
        }

    }, [tabChosen])
    function switchInputField() {
        switch (tabChosen) {
            case 1:
                return (<input className={classes['baloot-name-input']} value={balootName} placeholder="Name" onChange={(ev) => {
                    handleState(ev.target.value)
                }} />);
            case 2:
                return (<input className={classes['baloot-name-input']} value={keywords} placeholder="keywords" onChange={(ev) => {
                    handleState(ev.target.value)
                }} />);
            case 3:
                return (
                    <select value={isPublic} onChange={(ev) => {
                        handleState(ev.target.value)
                    }}>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </select>)
            case 4:
                return (<div className={classes['main-container-image-upload']}>
                    <input type="file" className={classes['file-upload']} onChange={fileChangedHandler} />
                    <input type="text" ref={imgURLref} className={classes['image-url-input']} placeholder="image URL" onChange={(ev) => { handleState(ev.target.value) }} />
                    <img src={imgURL} alt="no image was chosen" className={classes['image-preview']} />
                    <div className={classes['baloot-btn-image-upload-tab']} onClick={onOkClick}><span>OK</span></div>
                </div>)
            case 5:
                if (isUserApproved.filter((approvedInput) => { return (approvedInput === true) }).length < 3) {
                    return <div className={classes['summary-container-missing-items']}><pre className={classes['missing-inputs']}>
                        you havn't filled all the required inputs.
                    </pre></div>
                } else {
                    return (<div className={classes['summary-container']}>
                        <ul className={classes['summary']}>
                            <li className={classes['sum-item']}><span className={classes['sum-title']}>Name: </span>{balootName}<span className={classes['sum-item-v']}>✓</span></li>
                            <li className={classes['sum-item']}><span className={classes['sum-title']}>Keywords: </span><span className={classes['sum-item-v']}>✓</span><ul>{keywords.map((keyW) => (<li>{keyW}</li>))}</ul></li>
                            <li className={classes['sum-item']}><span className={classes['sum-title']}>Publish: </span>{isPublic ? 'yes' : 'no'}<span className={classes['sum-item-v']}>✓</span></li>
                            <li className={classes['sum-item']}>  <img src={imgURL} alt="no image was chosen" className={classes['image-preview']} /></li>
                        </ul>
                    </div>)
                }
            default:
                return '';
        }


    }
    useEffect(() => { console.log('name:', balootName) }, [balootName])
    useEffect(() => { console.log('keywords:', keywords) }, [keywords])
    useEffect(() => { console.log('isPublic:', isPublic) }, [isPublic])
    useEffect(() => { console.log('isUserApproved:', isUserApproved) }, [isUserApproved])
    function createKeywordsPanel() {
        if (keywords.length === 0 || tabChosen !== 2) return;
        let res = '';
        res = keywords.map((kw) => (<div className={classes['keyword']}><span className={classes['keyword-title']}>{kw}</span></div>))
        return <div className={classes['keyword-panel']}>{res}</div>
    }
    function handleState(inputValue) {

        switch (tabChosen) {
            case 1:
                setBalootName(inputValue)
                return;
            case 2:
                let inputAsArray = inputValue.split(',')
                setKeywords(inputAsArray)
                return;
            case 3:
                setIsPublic(!isPublic)
                return;
            case 4:
                setImgURL(inputValue)
                return;
            default:
                return '';
        }
    }
    function switchTab(chosen) {
        setTabChosen(chosen);
    }
    function onOkClick() {
        if ((tabChosen === 1 && balootName === '') || (tabChosen === 2 && (keywords.length > 0 && keywords.filter((kw) => { return kw.length === 0 }).length || keywords.length === 0))) {
            alert('cannot accept empty field')
            return;
        }
        else {
            setIsUserApproved(prevState => {
                var newState = [...prevState]
                newState[tabChosen - 1] = true;
                if (tabChosen < 5) setTabChosen(tabChosen + 1)
                // console.log('tabChosen right now is:', tabChosen)
                return newState;
            }

            )
        }

    }
    async function saveBaloot(update) {

        var prm = new Promise((resolve, reject) => (resolve(currBalootContext.saveNewBaloot(update))))
        prm.then((res) => {
            console.log('baloot saved', res);
            alert('new kaloot saved!')
        }).catch((err) => console.log('there was en error saving the baloot', err))
        // currBalootContext.prepareBalootBeforeSubmit()
    }
    return (<div className={classes.container} >
        <div className={classes['tab-container']}>
            <div className={(isUserApproved[0]) ? classes['tab-checked'] : classes.tab} ref={ref1} onClick={(e) => { switchTab(1) }} id="1">
                <span className={classes['tab-title']} onClick={(e) => { switchTab(1) }}>Name</span></div>
            <div className={(isUserApproved[1]) ? classes['tab-checked'] : classes.tab} ref={ref2} onClick={(e) => { switchTab(2) }} id="2">
                <span className={classes['tab-title']} onClick={(e) => { switchTab(2) }}>Keywords</span></div>
            <div className={(isUserApproved[2]) ? classes['tab-checked'] : classes.tab} ref={ref3} onClick={(e) => { switchTab(3) }} id="3">
                <span className={classes['tab-title']} onClick={(e) => { switchTab(3) }}>Publish</span></div>
            <div className={(isUserApproved[3]) ? classes['tab-checked'] : classes.tab} ref={ref4} onClick={(e) => { switchTab(4) }} id="4">
                <span className={classes['tab-title']} onClick={(e) => { switchTab(4) }}>Cover Image</span></div>
            <div className={classes.tab} onClick={(e) => { switchTab(5) }} ref={ref5} id="5">
                <span className={classes['tab-title']} onClick={(e) => { switchTab(5) }}>Sum</span>
            </div>
        </div>
        <div className={tabChosen === 1 || tabChosen === 2 || tabChosen === 3 ? classes['baloot-field-container'] : classes['baloot-field-container-sum']}>
            {switchInputField()}
            {tabChosen === 1 || tabChosen === 2 || tabChosen === 3 ? <div className={classes['baloot-btn']} onClick={onOkClick}><span>OK</span></div> : ''}
            {tabChosen === 2 && <span style={{ color: "black", fontWeight: 800 }}>KEYWORDS:</span>}
        </div>
        {createKeywordsPanel()}
        {(tabChosen === 5 && (isUserApproved.filter((approvedInput) => { return (approvedInput === true) }).length >= 3)) ? <div className={classes['baloot-save-btn']} onClick={() => { if (props.editMode) return saveBaloot(true); else return saveBaloot(false); }}><span>SAVE BALOOT</span></div> : ''}
    </div>
    )

} export default CreateBalootRightSide