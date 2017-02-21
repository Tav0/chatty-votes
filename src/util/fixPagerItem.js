import React from 'react';
import { Pager } from 'react-bootstrap';

// this is a work-around for https://github.com/react-bootstrap/react-bootstrap/issues/2304
// to avoid the annoying "Unknown prop `active` ... " warnings.
// We wrap <Pager.Item> but strip off the 'active' property.
export default (props) => {
    // eslint-disable-next-line
    const {active, ...propsSansActive} = props;
    return <Pager.Item {...propsSansActive}>{props.children}</Pager.Item>
}

