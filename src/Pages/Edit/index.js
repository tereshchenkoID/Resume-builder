import React, {useState, useEffect, useRef} from "react";
import {useSelector} from "react-redux";
import {NavLink} from "react-router-dom";

// import classNames from "classnames";

import getConstant from "../../helpers/getConstant";

// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Card from "./Card";

import styles from './index.module.scss';

const Dublin = React.lazy(() => import('../Templates/Dublin'))
const Sydney = React.lazy(() => import('../Templates/Sydney'))

const Edit = () => {
    const ref = useRef(null);
    const refResume = useRef(null);

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

    // const saveToPdf = () => {
    //     html2canvas(
    //         refResume.current,
    //     {
    //         scale: 2,
    //         imageTimeout: 0,
    //         backgroundColor:	'#fff'
    //     }
    //     ).then(
    //         (canvas) => {
    //             const contentWidth = canvas.width;
    //             const contentHeight = canvas.height;
    //
    //             const imgWidth = 596;
    //             const imgHeight = 596 / contentWidth * contentHeight;
    //
    //             canvas.getContext('2d');
    //
    //             const pageData = canvas.toDataURL('image/jpeg', 1.0);
    //             const pdf = new jsPDF('p', 'pt', 'a4');
    //
    //             pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    //             pdf.save('content.pdf');
    //         }
    //     )
    // }

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
    }, []);

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
                {/*<button*/}
                {/*    className={classNames(styles.button, styles.download)}*/}
                {/*    onClick={() => {*/}
                {/*        saveToPdf()*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Download PDF*/}
                {/*</button>*/}
            </div>

            <div className={styles.left}>
                <div className={styles.list}>
                    {
                        templates.map((item, index) =>
                           <Card
                               key={index}
                               data={template}
                               action={setTemplate}
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
                <div
                    className={styles.resume}
                    ref={refResume}
                    style={{
                        height: height,
                        width: width
                    }}
                >
                    <div
                        style={{
                            height: a4.height,
                            width: a4.width,
                            transform: `scale(${scale})`
                        }}
                    >
                        {
                            template === 'Dublin' && <Dublin config={config} user={user} photo={photo}/>
                        }
                        {
                            template === 'Sydney' && <Sydney config={config} user={user} photo={photo}/>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Edit;
