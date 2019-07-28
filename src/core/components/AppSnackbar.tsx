import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

interface AppSnackbarProps {
    duration?:number;
    message:string;
    onClose?: () => void;
};


function AppSnackbar (props: AppSnackbarProps) {
    // const classes = useStyles();
    const [open, setOpen] = React.useState(false);


    function handleClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
        setOpen(false);
        if (props.onClose) {
            props.onClose();
        }

    }


    useEffect(() => {
        if (props.message !== null && props.message !== "") setOpen(true);
    }, [props.message]);

    return  (
        <Snackbar
            // className={clsx(classes[props.variant], className)}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            open={open}
            autoHideDuration={props.duration || 2000}
            onClose={handleClose}
            ContentProps={{'aria-describedby': 'message-id',}}
            message={<span id="message-id">{props.message}</span>}
            action={[]}
        />
    );

}

export default AppSnackbar;
