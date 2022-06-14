import React, {useEffect, useState} from "react";
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'

import styles from './index.module.scss';

const Dropped = ({remove, action, close, updateCanvas}) => {
    let editor
    const setEditorRef = (file) => (editor = file)
    const [dropped, setDropped] = useState('')

    useEffect(() => {
        remove && setDropped('')
    }, [remove]);

    return (
        <div className={styles.block}>
            <div className={styles.header}>
                <div
                    className={styles.close}
                    onClick={() => {
                        close(false)
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5857864,12 L3.79289322,5.20710678 L5.20710678,3.79289322 L12,10.5857864 L18.7928932,3.79289322 L20.2071068,5.20710678 L13.4142136,12 L20.2071068,18.7928932 L18.7928932,20.2071068 L12,13.4142136 L5.20710678,20.2071068 L3.79289322,18.7928932 L10.5857864,12 Z" />
                    </svg>
                </div>
            </div>
            <div className={styles.body}>
                {
                    !dropped &&
                    <div className={styles.content}>
                        <div className={styles.icon}>
                            <svg width="48" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="46" height="38" rx="3" stroke="#7A8599" strokeWidth="2"/>
                                <circle cx="35" cy="13" r="4" stroke="#7A8599" strokeWidth="2"/>
                                <path d="M1 30l12-12.9a4 4 0 016 0l9.2 9.9a4 4 0 005.7 0l2.3-2.2a4 4 0 015.6 0L47 30" stroke="#7A8599" strokeWidth="2"/>
                            </svg>
                        </div>
                        <p className={styles.text}>Drag & drop or select a photo from your computer.</p>
                    </div>
                }
                <Dropzone
                    onDrop={(dropped) => setDropped(dropped[0])}
                    noClick={!!dropped}
                    noKeyboard
                    multiple={false}
                >
                    {({getRootProps, getInputProps}) => (
                        <div
                            className={styles.box}
                            {...getRootProps()}
                        >
                            <AvatarEditor
                                ref={setEditorRef}
                                width={300}
                                height={300}
                                border={0}
                                scale={1}
                                image={dropped}
                            />
                            <input {...getInputProps()} />
                        </div>
                    )}
                </Dropzone>
            </div>
            <div className={styles.footer}>
                {
                    dropped &&
                    <button
                        className={styles.button}
                        onClick={() => {
                            if (editor) {
                                action(editor.getImage().toDataURL())
                                localStorage.setItem('photo', JSON.stringify(editor.getImage().toDataURL()));
                                close(false)
                                updateCanvas()
                            }
                        }}
                    >
                        Save Changes
                    </button>
                }
            </div>
        </div>
    );
}

export default Dropped;
