import {
    Box,
    Container,
    Grid,
    GridProps,
    IconButton,
    IconButtonProps,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import React, { Children, Dispatch, useState } from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Border = styled(Grid)<GridProps>(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
}));

const DayGrid = styled(Grid)<GridProps>(({ theme }) => ({
    height: '4em',
    border: 'lightgray 1px solid',
    borderRadius: '3px',
}));

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    fontWeight: '700',
}));

const Navigator = styled(IconButton)<IconButtonProps>(({ theme }) => ({}));

interface Props {
    date: Date;
    hint: string;
    setdate: Dispatch<React.SetStateAction<Date>>;
}

const getMonthStart = (date: Date) => {
    const dayone = new Date(date);
    dayone.setDate(1);
    dayone.setDate(1 - dayone.getDay());
    return dayone;
};

const getMonthEnd = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const formatDate = (date: Date) => {
    return date.getMonth() + 1 + '.' + date.getDate();
};

const renderHeader = (
    date: Date,
    setDate: Dispatch<React.SetStateAction<Date>>
) => {
    const handleClickPrev = () => {
        const prev = new Date(date);
        prev.setDate(0);
        setDate(prev);
    };
    const handleClickNext = () => {
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        setDate(next);
    };
    return (
        <Grid container>
            <Border
                item
                xs={11.9}
                sx={{
                    color: 'white',
                }}
            >
                <Box sx={{ display: 'flex' }}>
                    <IconButton>
                        <ArrowBackIosNewIcon
                            onClick={handleClickPrev}
                            sx={{ color: 'white' }}
                        />
                    </IconButton>
                    <Typography
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                            justifyContent: 'center',
                            fontWeight: '700',
                            margin: 'auto 0',
                        }}
                    >
                        {date.getFullYear() + '. ' + (date.getMonth() + 1)}
                    </Typography>
                    <IconButton>
                        <ArrowForwardIosIcon
                            onClick={handleClickNext}
                            sx={{ color: 'white' }}
                        />
                    </IconButton>
                </Box>
            </Border>
        </Grid>
    );
};

const renderBorder = (date: Date, height: string) => {
    return (
        <Grid container>
            <Border item xs={11.9} sx={{ height: height }}></Border>
        </Grid>
    );
};

const renderRow = (datePnt: Date) => {
    const days: JSX.Element[] = [];
    for (let i = 0; i < 7; i++) {
        days.push(
            <DayGrid item xs={1.7}>
                <Typography fontSize={14} sx={{ color: 'gray' }}>
                    {formatDate(datePnt)}
                </Typography>
            </DayGrid>
        );
        datePnt.setDate(datePnt.getDate() + 1);
    }
    return <Grid container>{Children.toArray(days)}</Grid>;
};

const renderMonth = (
    start: Date,
    end: Date,
    setDate: Dispatch<React.SetStateAction<Date>>
) => {
    const rows: JSX.Element[] = [];
    const datePnt = new Date(start);
    rows.push(renderHeader(end, setDate));
    while (datePnt <= end) {
        rows.push(renderRow(datePnt));
    }
    rows.push(renderBorder(start, '1em'));
    return <>{Children.toArray(rows)}</>;
};

const MonthView = (props: Props) => {
    const start = getMonthStart(props.date);
    const end = getMonthEnd(props.date);
    console.log('props = ', props);
    console.log('start = ', start, ', end = ', end);
    return (
        <>
            <Typography
                sx={{
                    width: '100%',
                    fontSize: 'small',
                }}
            >
                {props.hint}
            </Typography>
            {renderMonth(start, end, props.setdate)}
        </>
    );
};

export default MonthView;
