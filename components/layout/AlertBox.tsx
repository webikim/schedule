import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import React from 'react';

interface Props {
    title?: string | undefined;
    answers: string[];
    content: string;
    open: boolean;
    onClose: (answer: number) => () => void;
}

const AlertBox = (props: Props) => {
    const { title, answers, content, open, onClose } = props;

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose(0)}>{answers[0]}</Button>
                <Button onClick={onClose(1)} autoFocus>
                    {answers[1]}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertBox;
