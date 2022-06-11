import React from "react";
import classNames from "classnames";

import styles from './index.module.scss';

const Card = ({data, action, item}) => {

    return (
        <div
            className={classNames(styles.block, item.name === data && styles.active)}
            onClick={() => {
                action(item.name)
                localStorage.setItem('template', JSON.stringify(item.name));
            }}
        >
            <p className={styles.text}>{item.name}</p>
            <div className={styles.preview}>
                <div className={styles.icon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6917162,8.75389189 L18.3082838,10.2461081 L12.3082838,16.7461081 C11.8845221,17.2051833 11.1639539,17.2195889 10.7221825,16.7778175 L6.22218254,12.2778175 L7.77781746,10.7221825 L11.4682653,14.4126304 L16.6917162,8.75389189 Z" />
                    </svg>
                </div>

                <div
                    className={styles.image}
                    style={{
                        backgroundImage: `url(${item.preview})`
                    }}
                >
                </div>
            </div>
        </div>
    );
}

export default Card;
