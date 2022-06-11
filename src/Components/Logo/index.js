import React from "react";

import {NavLink} from "react-router-dom";

import styles from './index.module.scss';

const Logo = () => {

    return (
        <div className={styles.block}>
            <NavLink
                to="/"
            >
                <picture></picture>
            </NavLink>
        </div>
    );
}

export default Logo;
