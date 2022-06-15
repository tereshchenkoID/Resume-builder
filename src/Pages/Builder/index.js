import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";

import classNames from "classnames";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import { useDebouncedCallback } from 'use-debounce';

import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Dropped from "../../Components/Dropped";

import getConstant from "../../helpers/getConstant";

import styles from './index.module.scss';


const Dublin = React.lazy(() => import('../Templates/Dublin'))
const Sydney = React.lazy(() => import('../Templates/Sydney'))

const initData = (data) => {
    let result = {
        title: 'Title'
    }

    data.fieldset.map((item, index) => {
        item.fields.map((subitem, subindex) => {
            if (subitem.options) {
                const find = subitem.options.find(function(e){ return e.selected })

                result[subitem.name] = {
                    value: find.value,
                    label: find.name
                }
            }
            else {
                result[subitem.name] = subitem.value
            }

            return true
        })

        return true
    })

    return result
}

const Main = () => {
    const ref = useRef(null);
    const refCanvas = useRef(null);
    const refTemplate = useRef(null);

    const { config } = useSelector(state => state.configReducer)

    const a4 = getConstant().a4

    const template = JSON.parse(localStorage.getItem('template')) || 'Dublin'

    const [modal, setModal] = useState(false)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    const [scale, setScale] = useState(0)
    const [remove, setRemove] = useState(false)

    const [photo, setPhoto] = useState(JSON.parse(localStorage.getItem('photo')) || '')
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || initData(config))

    let [current, setCurrent] = useState(parseInt(localStorage.getItem('current'), 10) || 0)

    const [init, setInit] = useState(false)
    const [pages, setPages] = useState(0)

    const handleChange = useDebouncedCallback((e) => {
        const {name, value} = e.target;

        if (e.target.type === 'select-one') {
            setUser(prevState => ({
                ...prevState,
                [name]: {
                    value: value,
                    label: e.target.options[e.target.selectedIndex].text
                }
            }));
        }
        else {
            setUser(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

        updateCanvas()
    }, 1000);

    const handleEditorChange = useDebouncedCallback((state, name) => {
        const {value} = state.target;

        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));

        localStorage.setItem('user', JSON.stringify(user))

        updateCanvas()

        // convertContentToHTML(state, name);
    }, 1000);

    const convertContentToHTML = (state, name) => {
        let currentContentAsHTML = convertToHTML(state.getCurrentContent());

        setUser(prevState => ({
            ...prevState,
            [name]: currentContentAsHTML
        }));

        localStorage.setItem('user', JSON.stringify(user))

        updateCanvas()
    }

    const convertToEditor = (html) => {
        const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        return EditorState.createWithContent(contentState);
    }

    const sendData = () => {
        const data = {
            ...user,
            photo
        }

        console.log(data)
    }

    const saveToPdf = () => {
        const HTML_Width = refTemplate.current.offsetWidth;
        const HTML_Height = refTemplate.current.offsetHeight;
        const PDF_Width = HTML_Width;
        const PDF_Height = PDF_Width * a4.diff;

        html2canvas(
            refTemplate.current,
            {
                scale: 2,
                imageTimeout: 0
            }
        ).then(
            (canvas) => {
                canvas.getContext('2d');
                const imgData = canvas.toDataURL("image/jpeg", 1.0);
                const pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);

                pdf.addImage(
                    imgData,
                    'JPG',
                    0,
                    0,
                    HTML_Width,
                    HTML_Height
                );

                for (let i = 1; i <= pages; i++) {
                    pdf.addPage();
                    pdf.addImage(
                        imgData,
                        'JPG',
                        0,
                        -(PDF_Height * i),
                        HTML_Width,
                        HTML_Height
                    );
                }

                pdf.save('content.pdf');
            }
        )
    }

    const initPages = () => {
        if (!init) {
            const HTML_Width = refTemplate.current.offsetWidth;
            const HTML_Height = refTemplate.current.offsetHeight;
            const PDF_Width = HTML_Width;
            const PDF_Height = PDF_Width * a4.diff;

            const total = Math.ceil(HTML_Height / PDF_Height) - 1

            setPages(total)

            if (current > total) {
                setCurrent(total)

                localStorage.setItem('current', total)
            }

            refCanvas.current.innerHTML = '';

            html2canvas(
                refTemplate.current,
                {
                    scale: 2,
                    imageTimeout: 0,
                    backgroundColor:	'#fff',
                    height: PDF_Height * (Math.ceil(HTML_Height / PDF_Height) + 1)
                }
            ).then(
                (canvas) => {
                    canvas.getContext('2d');
                    canvas.style = `width: ${PDF_Width}px; transform: translateY(-${localStorage.getItem('current') * PDF_Height}px);`

                    setInit(true)

                    refCanvas.current.appendChild(canvas)
                }
            )
        }
    }

    const prevPages = () => {
        if (current > 0) {
            setCurrent(--current)
            localStorage.setItem('current', current)

            const HTML_Width = refTemplate.current.offsetWidth;
            const PDF_Width = HTML_Width;
            const PDF_Height = PDF_Width * a4.diff;

            refCanvas.current.innerHTML = '';

            html2canvas(
                refTemplate.current,
                {
                    scale: 2,
                    imageTimeout: 0,
                    backgroundColor:	'#fff',
                    height: a4.height * (pages + 1)
                }
            ).then(
                (canvas) => {
                    canvas.getContext('2d');
                    canvas.style = `width: ${PDF_Width}px; transform: translateY(-${current * PDF_Height}px)`

                    refCanvas.current.appendChild(canvas)
                }
            )
        }
    }

    const nextPages = () => {
        if (current < pages) {
            setCurrent(++current)
            localStorage.setItem('current', current)

            const HTML_Width = refTemplate.current.offsetWidth;
            const PDF_Width = HTML_Width;
            const PDF_Height = PDF_Width * 1.41428;

            refCanvas.current.innerHTML = '';

            html2canvas(
                refTemplate.current,
                {
                    scale: 2,
                    imageTimeout: 0,
                    backgroundColor:	'#fff',
                    height: a4.height * (pages + 1)
                }
            ).then(
                (canvas) => {
                    canvas.getContext('2d');
                    canvas.style = `width: ${PDF_Width}px; transform: translateY(-${current * PDF_Height}px)`

                    refCanvas.current.appendChild(canvas)
                }
            )

        }
    }

    const updateCanvas = () => {
        setInit(false)
        initPages()
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver((event) => {
            const width = event[0].contentBoxSize[0].inlineSize
            const height = event[0].contentBoxSize[0].blockSize

            if (height < width * a4.diff) {
                setHeight(height)
                setWidth(height / a4.diff)
                setScale(height / a4.height)
            }
            else {
                setHeight(width * a4.diff)
                setWidth(width)
                setScale(width / a4.width)
            }
        });

        if (ref) {
            resizeObserver.observe(ref.current);
        }

        localStorage.setItem('user', JSON.stringify(user))

        if (refTemplate) {
            refTemplate.current && initPages()
        }
    }, [user, scale, init]);

    return (
        <div className={styles.block}>
            <div className={classNames(styles.modal, modal && styles.active)}>
                <Dropped
                    remove={remove}
                    action={setPhoto}
                    close={setModal}
                    updateCanvas={updateCanvas}
                />
            </div>
            <div className={styles.left}>
                <div className={styles.head}>
                    <button
                        className={styles.save}
                        onClick={() => {
                            sendData()
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M6 18.98A5.5 5.5 0 016.5 8a6.5 6.5 0 0112.48 2.03 4.5 4.5 0 01.02 8.94V19H6v-.02z" fill="#0F141F"/>
                            <path stroke="#FFF" strokeWidth="2" strokeLinejoin="round" d="M9 11.5l2.5 2.5 3.5-4"/>
                        </svg>
                        Saved
                    </button>
                    <input
                        type={"text"}
                        className={styles.title}
                        defaultValue={user.title}
                        name={'title'}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                {
                    config.fieldset.map((item, index) =>
                        <div
                            className={styles.section}
                            key={index}
                        >
                            <h4>{item.name}</h4>
                            <div className={styles.grid}>
                                {
                                    index === 0 &&
                                    <div className={styles.wrapper}>
                                        <div className={styles.dropped}>
                                            <div className={styles.photo}>
                                                {
                                                    photo
                                                        ?
                                                        <img
                                                            src={photo}
                                                            alt=""
                                                        />
                                                        :
                                                        <svg width="40px" height="40px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M7,35 L33,35 L33,30 L24.9627594,26.8044586 C24.5698041,26.6156354 24.3340309,26.2379889 24.3340309,25.8225778 L24.3340309,24.6518737 C24.3340309,24.3875212 24.412622,24.1231687 24.6090996,23.9343454 C25.9058522,22.5370535 26.770354,20.4599979 27.0061272,19.8557636 C27.0454227,19.7424697 27.1240138,19.6291757 27.2026048,19.5536464 C27.438378,19.3648232 27.8313333,18.8738828 28.1064021,17.7031787 C28.3421753,16.5702393 27.9099244,15.9282403 27.6348557,15.6261232 C27.4776736,15.4750646 27.3990825,15.2862413 27.3990825,15.0974181 L27.3990825,10.2257787 C26.8882406,7.43119483 25.1592371,6.1094322 23.4302337,5.50519785 C21.5833436,4.82543421 18.2825188,4.82543421 16.3963333,5.5429625 C14.7459209,6.18496149 13.056213,7.46895948 12.5846666,10.2257787 L12.5846666,15.0974181 C12.5846666,15.2862413 12.5060755,15.4750646 12.3488934,15.6261232 C12.0738246,15.9282403 11.6415738,16.5702393 11.877347,17.7031787 C12.1131202,18.8738828 12.545371,19.3648232 12.7811442,19.5536464 C12.8597353,19.6291757 12.9383264,19.7424697 12.9776219,19.8557636 C13.2133951,20.4977626 14.0778968,22.4992889 15.3353539,23.8965808 C15.5318315,24.1231687 15.6497181,24.4252858 15.6497181,24.727403 L15.6497181,25.7470485 C15.6497181,26.2379889 15.3746494,26.6534 14.903103,26.8799879 L7,30 L7,35 Z" />
                                                        </svg>
                                                }
                                            </div>
                                            <div>
                                                <div
                                                    className={classNames(styles.link, styles.primary)}
                                                    onClick={() => {
                                                        setModal(true)
                                                        setRemove(false)
                                                    }}
                                                >
                                                    {
                                                        photo ? 'Edit photo' : 'Upload photo'
                                                    }
                                                </div>
                                                {
                                                    photo &&
                                                    <div
                                                        className={classNames(styles.link, styles.default)}
                                                        onClick={() => {
                                                            setPhoto('')
                                                            setRemove(true)
                                                            updateCanvas()
                                                            localStorage.removeItem('photo')
                                                        }}
                                                    >
                                                        Delete photo
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    item.fields.map((item, index) => {
                                        if (item.type === "text" || item.type === "email") {
                                            return <div className={styles.wrapper} key={index}>
                                                        <p className={styles.label}>{item.label}</p>
                                                        <input
                                                            type={item.type}
                                                            className={styles.field}
                                                            pattern={item.validation}
                                                            required={item.required}
                                                            name={item.name}
                                                            defaultValue={user[item.name] || item.value}
                                                            onChange={(e) => handleChange(e)}
                                                            autoComplete={'true'}
                                                        />
                                                    </div>
                                        } else if (item.type === "textarea") {
                                            return <div className={styles.wrapper} key={index}>
                                                        <p className={styles.label}>{item.label}</p>
                                                        <textarea
                                                            className={styles.textarea}
                                                            name={item.name}
                                                            onChange={(e) => {handleEditorChange(e, item.name)}}
                                                            defaultValue={user[item.name] || item.value}
                                                            autoComplete={'true'}
                                                        />
                                                        {/*<Editor*/}
                                                        {/*    onEditorStateChange={(state) => {*/}
                                                        {/*        handleEditorChange(state, item.name)*/}
                                                        {/*    }}*/}
                                                        {/*    defaultEditorState={convertToEditor(user[item.name] || `<p>${item.value}</p>`)}*/}
                                                        {/*    toolbarClassName={styles.toolbarClassName}*/}
                                                        {/*    wrapperClassName={styles.wrapperClassName}*/}
                                                        {/*    editorClassName={styles.editorClassName}*/}
                                                        {/*    toolbar={{*/}
                                                        {/*        options: ['inline', 'list', 'textAlign', 'link'],*/}
                                                        {/*    }}*/}
                                                        {/*/>*/}
                                                    </div>
                                        } else if (item.type === "select") {
                                            return <div className={styles.wrapper} key={index}>
                                                        <p className={styles.label}>{item.label}</p>
                                                        <select
                                                            className={styles.select}
                                                            required={item.required}
                                                            name={item.name}
                                                            onChange={(e) => handleChange(e)}
                                                        >
                                                            {
                                                                item.options.map((option, index) =>
                                                                    <option
                                                                        value={option.value}
                                                                        selected={user[item.name] ? option.value === user[item.name].value : option.selected}
                                                                        defaultValue={user[item.name]}
                                                                        key={index}
                                                                        disabled={index === 0}
                                                                    >
                                                                        {option.name}
                                                                    </option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                        }

                                        return true
                                    })
                                }
                            </div>
                        </div>
                    )
                }
            </div>
            <div
                className={styles.right}
                ref={ref}
            >
                <div className={styles.count}>
                    <button
                        className={styles.arrow}
                        onClick={() => {
                            prevPages()
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.32427537,7.23715414 L10.6757246,5.76284586 L16.6757246,11.2628459 C17.1080918,11.6591824 17.1080918,12.3408176 16.6757246,12.7371541 L10.6757246,18.2371541 L9.32427537,16.7628459 L14.5201072,12 L9.32427537,7.23715414 Z" />
                        </svg>
                    </button>
                    <p>
                        <strong>{current}</strong>
                        <span>/</span>
                        <strong>{pages}</strong>
                    </p>
                    <button
                        className={styles.arrow}
                        onClick={() => {
                            nextPages()
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.32427537,7.23715414 L10.6757246,5.76284586 L16.6757246,11.2628459 C17.1080918,11.6591824 17.1080918,12.3408176 16.6757246,12.7371541 L10.6757246,18.2371541 L9.32427537,16.7628459 L14.5201072,12 L9.32427537,7.23715414 Z" />
                        </svg>
                    </button>
                </div>
                <div
                    className={styles.resume}
                    style={{
                        height: height,
                        width: width
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            opacity: 0,
                            zIndex: -1,
                            height: a4.height,
                            width: a4.width,
                        }}
                    >
                        {
                            template === 'Dublin' && <Dublin config={config} user={user} photo={photo} refTemplate={refTemplate}/>
                        }
                        {
                            template === 'Sydney' && <Sydney config={config} user={user} photo={photo} refTemplate={refTemplate}/>
                        }
                    </div>
                    <div
                        className={styles.canvas}
                        ref={refCanvas}
                        style={{
                            height: a4.height,
                            width: a4.width,
                            transform: `scale(${scale})`
                        }}
                    />
                </div>
                <NavLink
                    to="/edit"
                    className={classNames(styles.button, styles.template)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.5 5.5v4h4v-4h-4zM11 4v7H4V4h7zm3.5 1.5v4h4v-4h-4zM20 4v7h-7V4h7zM5.5 14.5v4h4v-4h-4zM11 13v7H4v-7h7zm3.5 1.5v4h4v-4h-4zM20 13v7h-7v-7h7z" />
                    </svg>
                    Select Template
                </NavLink>
                <button
                    className={classNames(styles.button, styles.download)}
                    onClick={() => {
                        saveToPdf()
                    }}
                >
                    Download PDF
                </button>
            </div>
        </div>
    );
}

export default Main;
