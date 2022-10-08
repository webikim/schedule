import styled from '@emotion/styled';
import { Box, Grid, GridProps } from '@mui/material';
import React, { ReactNode } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Navigation = styled(Grid)<GridProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: 'lightgray',
    '&:hover': {
        cursor: 'pointer',
        fontWeight: 700,
        color: 'black',
    },
}));

interface Props {
    date: Date;
    incdec: number;
    onPrev: (date: Date) => void;
    onNext: (date: Date) => void;
    children: ReactNode | string;
}

const DateNavigator = (props: Props) => {
    const { date } = props;
    const handleClickPrev = () => {
        const prev = new Date(date);
        prev.setDate(prev.getDate() - props.incdec);
        props.onPrev(prev);
    };
    const handleClickNext = () => {
        const next = new Date(date);
        next.setDate(next.getDate() + props.incdec);
        props.onNext(next);
    };
    return (
        <>
            <Grid container sx={{ marginTop: 1, marginBottom: 1 }}>
                <Navigation item xs={1} onClick={handleClickPrev}>
                    <ArrowBackIosIcon />
                </Navigation>
                <Navigation item xs={1} onClick={handleClickNext}>
                    <ArrowForwardIosIcon />
                </Navigation>
                {props.children}
            </Grid>
        </>
    );
};

export default DateNavigator;
