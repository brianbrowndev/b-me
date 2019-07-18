import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './BooleanSubmitIcon.scss';
import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

interface BooleanSubmitIconProps {
    // an object is used instead of the boolean so that
    // every time the object is updated, the status, the effect retriggers
    state: {status:boolean | undefined};
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
        if(isPending === true) setIsPending(false)
    }, [props.state]);

    return  (
        <div className="Boolean-submit-container" onClick={handleClick}>
            {
                isPending ? (
                    <FontAwesomeIcon icon='spinner' className="Boolean-submit-pending" pulse listItem={props.isListIcon} />
                ) : (
                    props.state.status ?
                        <FontAwesomeIcon icon={props.trueIcon} listItem={props.isListIcon} />
                    :
                        <FontAwesomeIcon icon={props.falseIcon} listItem={props.isListIcon} />
                )
            }
        </div>

    );

}

export default BooleanSubmitIcon;