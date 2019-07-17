import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './BooleanSubmitIcon.scss';
import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

interface BooleanSubmitIconProps {
    state?: boolean;
    isListIcon: boolean;
    falseIcon: [IconPrefix, IconName];
    trueIcon: [IconPrefix, IconName];
    onClick(): void;
};

function BooleanSubmitIcon (props: BooleanSubmitIconProps) {

    const [isPending, setIsPending] = useState<boolean>(false);


    const handleClick = () => {
        if (isPending !== true) {
            setIsPending(true);
            props.onClick();
        }
    }

    useEffect(() => {
        if (isPending === true) setIsPending(false);
    }, [props.state])

    return  (
        <div className="Boolean-submit-container" onClick={handleClick}>
            {
                isPending ? (
                    <FontAwesomeIcon icon='spinner' className="Boolean-submit-pending" pulse listItem={props.isListIcon} />
                ) : (
                    props.state ?
                        <FontAwesomeIcon icon={props.trueIcon} listItem={props.isListIcon} />
                    :
                        <FontAwesomeIcon icon={props.falseIcon} listItem={props.isListIcon} />
                )
            }
        </div>

    );

}

export default BooleanSubmitIcon;