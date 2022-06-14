import React from "react";

import styles from './index.module.scss';

const Dublin = ({config, user, photo, refTemplate}) => {
    const check = (data) => {
        return user && user.hasOwnProperty(data) ? user[data] : ''
    }

    // useEffect(() => {
    //     if (ref) {
    //         const count = Math.ceil(ref.current.offsetHeight / 1122.52)
    //
    //         ref.current.style = `height: ${count * 1122}px`
    //
    //     }
    // }, [ref]);

    return (
        <div className={styles.block} id={"dublin"} ref={refTemplate}>
            <div className={styles.left}>
                <div className={styles.wrapper}>
                    {
                        photo &&
                        <div className={styles.photo}>
                            <img src={photo} alt={photo} />
                        </div>
                    }
                    <h2>
                        <div>{check('first_name')}</div>
                        <div>{check('last_name')}</div>
                    </h2>
                    {
                        check('work_type') &&
                        <>
                            <hr className={styles.hr}/>
                            <h6
                                style={{
                                    letterSpacing: '3px'
                                }}
                            >
                                {check('work_type').label}
                            </h6>
                        </>
                    }
                </div>

                <div className={styles.wrapper}>
                    {
                        (
                            check('email') ||
                            check('phone') ||
                            check('address') ||
                            check('postal_code') ||
                            check('city') ||
                            check('country') ||
                            check('driving_license') ||
                            check('nationality') ||
                            check('place_birth') ||
                            check('date_birth')
                        ) &&
                        <h6>{config.fieldset[0].name}:</h6>
                    }


                    <div className={styles.item}><a href="/">{check('email')}</a></div>
                    <div className={styles.item}>{check('phone')}</div>
                    <div className={styles.item}>{check('address')}</div>
                    <div className={styles.item}>{check('postal_code')}</div>
                    <div className={styles.item}>{check('city')}</div>
                    <div className={styles.item}>{check('country')}</div>
                </div>

                {
                    check('driving_license') &&
                    <div className={styles.wrapper}>
                        <div className={styles.item}>
                            <h6>Driving License:</h6>
                        </div>
                        <div className={styles.item}>{check('driving_license')}</div>
                    </div>
                }
                {
                    check('nationality') &&
                    <div className={styles.wrapper}>
                        <div className={styles.item}>
                            <h6>Nationality:</h6>
                        </div>
                        <div className={styles.item}>{check('nationality')}</div>
                    </div>
                }
                {
                    (check('place_birth') || check('date_birth')) &&
                    <div className={styles.wrapper}>
                        <div className={styles.item}>
                            <h6>Date / Place birth:</h6>
                        </div>
                        <div className={styles.item}>{check('place_birth')}</div>
                        <div className={styles.item}>{check('date_birth')}</div>
                    </div>
                }
            </div>
            <div className={styles.right}>
                {
                    check('profile').length > 7 &&
                    <div className={styles.wrapper}>
                        <h5>{config.fieldset[1].name}:</h5>
                        <div dangerouslySetInnerHTML={{__html: check('profile')}}></div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Dublin;
