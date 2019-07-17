import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

// import { makeStyles } from '@material-ui/styles';
// import { Theme } from '@material-ui/core';

interface AppSnackbarProps {
    duration?:number;
    message:string;
};

// const variantStyle = {
//   error: 'error',
//   info: 'info',
// };

// const useStyles = makeStyles((theme: Theme) => ({
//   error: {
//     backgroundColor: theme.palette.error.dark,
//   },
//   info: {
//     backgroundColor: theme.palette.primary.main,
//   }
// }));

export interface Props {
//   className?: string;
  message?: string;
//   onClose?: () => void;
//   variant: keyof typeof variantStyle;
}

function AppSnackbar (props: AppSnackbarProps) {
    // const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    function handleClick() {
        setOpen(true);
    }

    function handleClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
        if (reason === 'clickaway') {
        return;
        }
        setOpen(false);
    }

    useEffect(() => {
        if (props.message != null && props.message != "") setOpen(true);
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