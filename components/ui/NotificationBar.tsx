import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';
import { Alert, AlertColor, Slide, Snackbar } from '@mui/material';
import { Notification } from '../../store/notification-context';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    open: boolean;
    onClose: () => void;
    notification: Notification | null;
}

const NotificationBar = (props: Props) => {
    const { open, onClose, notification } = props;
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        onClose();
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                action={action}
                TransitionComponent={Transition}
            >
                <Alert
                    onClose={handleClose}
                    severity={
                        notification
                            ? (notification!.status as AlertColor)
                            : undefined
                    }
                    sx={{
                        width: '100%',
                        backgroundColor: 'black',
                        color: 'white',
                    }}
                >
                    {notification?.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default NotificationBar;
