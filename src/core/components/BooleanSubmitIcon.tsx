import React from 'react';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './BooleanSubmitIcon.scss';
// import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';

interface BooleanSubmitIconProps {
    // an object is used instead of the boolean so that
    // every time the object is updated, the status, the effect retriggers
    isPending: boolean;
    state: boolean | undefined;
    isListIcon: boolean;
    // falseIcon: [IconPrefix, IconName];
    falseIcon: any;
    trueIcon: any;
    onClick(): void;
};

function BooleanSubmitIcon (props: BooleanSubmitIconProps) {


    return  (
        <div className="Boolean-submit-container" onClick={props.onClick}>
            {/* {
                props.isPending ? (
                    <FontAwesomeIcon icon='spinner' className="Boolean-submit-pending" pulse listItem={props.isListIcon} />
                ) : (
                    props.state ?
                        <FontAwesomeIcon icon={props.trueIcon} listItem={props.isListIcon} />
                    :
                        <FontAwesomeIcon icon={props.falseIcon} listItem={props.isListIcon} />
                )
            } */}
        </div>

    );

}

export default BooleanSubmitIcon;