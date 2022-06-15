import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";

import classNames from "classnames";

import getConstant from "../../helpers/getConstant";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Card from "./Card";

import styles from './index.module.scss';

const Dublin = React.lazy(() => import('../Templates/Dublin'))
const Sydney = React.lazy(() => import('../Templates/Sydney'))

const Edit = () => {
    const ref = useRef(null);
    const refCanvas = useRef(null);
    const refTemplate = useRef(null);

    const templates = [
        {
            name: 'Dublin',
            preview: 'https://s3.resume.io/uploads/local_template_image/image/488/persistent-resource/dublin-resume-templates.jpg'
        },
        {
            name: 'Sydney',
            preview: 'https://s3.resume.io/uploads/local_template_image/image/441/persistent-resource/sydney-resume-templates.jpg'
        }
    ]

    const { config } = useSelector(state => state.configReducer)

    const a4 = getConstant().a4
    const user = JSON.parse(localStorage.getItem('user'))
    const photo = JSON.parse(localStorage.getItem('photo'))

    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    const [scale, setScale] = useState(0)
    const [template, setTemplate] = useState(JSON.parse(localStorage.getItem('template')) || templates[0].name)

    let [current, setCurrent] = useState(parseInt(localStorage.getItem('current'), 10) || 0)

    const [init, setInit] = useState(false)
    const [pages, setPages] = useState(0)

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

    const handleTemplate = (template) => {
        setTemplate(template)
        setInit(false)
        initPages()
    }

    const initPages = () => {
        if (!init) {
            const HTML_Width = refTemplate.current.offsetWidth;
            const HTML_Height = refTemplate.current.offsetHeight;
            const PDF_Width = HTML_Width;
            const PDF_Height = PDF_Width * a4.diff;

            setPages(Math.ceil(HTML_Height / PDF_Height) - 1)

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
                    canvas.style = `width: ${PDF_Width}px; transform: translateY(-${current * PDF_Height}px);`

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

        if (refTemplate) {
            refTemplate.current && initPages()
        }
    }, [scale, init]);

    return (
        <div className={styles.block}>
            <div className={styles.navigation}>
                <NavLink
                    to="/"
                    className={styles.link}
                >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.32427537,7.23715414 L10.6757246,5.76284586 L16.6757246,11.2628459 C17.1080918,11.6591824 17.1080918,12.3408176 16.6757246,12.7371541 L10.6757246,18.2371541 L9.32427537,16.7628459 L14.5201072,12 L9.32427537,7.23715414 Z" />
                    </svg>
                    Back to Editor
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

            <div className={styles.left}>
                <div className={styles.list}>
                    {
                        templates.map((item, index) =>
                           <Card
                               key={index}
                               data={template}
                               action={handleTemplate}
                               item={item}
                           />
                        )
                    }
                </div>
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
            </div>
        </div>
    );
}

export default Edit;
