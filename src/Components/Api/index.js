import {useEffect} from "react";
import {useDispatch} from "react-redux";

import { loadConfigData } from "../../redux/actions/configActions";

const Api = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadConfigData())

    }, [dispatch]);

    return true;
}

export default Api;
