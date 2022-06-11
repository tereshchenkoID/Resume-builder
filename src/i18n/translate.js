import React from "react";
import {FormattedMessage} from "react-intl";
import {useIntl} from 'react-intl';

export const translate = (id) => <FormattedMessage id={id} />

export const translateString = (id) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const intl = useIntl();

    return intl.formatMessage({id: id})
}
