import { types } from '../types/types';

const initialState = {
    config: {}
};

export const configReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_CONFIG_DATA:
            return {
                ...state,
                config: action.payload,
            };
        default:
            return state;
    }
}
