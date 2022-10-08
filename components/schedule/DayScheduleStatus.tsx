import {
    Box,
    BoxProps,
    Grid,
    IconButton,
    styled,
    Typography,
} from '@mui/material';
import React, { Children, useState } from 'react';
import dayjs from 'dayjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    AMPM_FIRST,
    getHours,
    HourInDay,
    renderHourNslot,
    setSlots,
} from '../calendar/Hours';

import { getString } from '../locale/stringUtil';

const locale = 'en';

const strings = {
    message: {
        select_to_update: {
            en: '* Select people to update status.',
            kr: '* 예약변경을 하려면 예약자를 선택하세요.',
        },
    },
    label: {},
};

interface FillerProps extends BoxProps {
    index: number;
}

const Filler = styled(Box)<FillerProps>(({ theme, index }) => ({
    height: '1.3em',
    borderTop: index === 0 ? 'lightgray 1px solid' : undefined,
}));

const renderHeader = (
    date: Date,
    setDate: React.Dispatch<React.SetStateAction<Date>>
) => {
    const handleClickPrev = () => {
        const prev = new Date(date);
        prev.setDate(prev.getDate() - 1);
        setDate(prev);
    };
    const handleClickNext = () => {
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        setDate(next);
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <IconButton onClick={handleClickPrev}>
                <ArrowBackIosNewIcon />
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
                {dayjs(date).format('YYYY.M.D')}
            </Typography>
            <IconButton onClick={handleClickNext}>
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
};

const renderSchedule = (data: HourInDay, isFirst: boolean) => {
    let slots: JSX.Element[] = [];
    const formatter = Intl.NumberFormat('en', { minimumIntegerDigits: 2 });
    data.slots.map((each, index) => {
        slots.push(
            <>
                {(isFirst || data.hour === 12) && index === 0 && (
                    <Filler index={1}> </Filler>
                )}

                <Filler index={index}> </Filler>
            </>
        );
    });
    return (
        <>
            <Box>{Children.toArray(slots)}</Box>
        </>
    );
};

const renderStatus = (hourData: HourInDay[]) => {
    let hourNslots: JSX.Element[] = [];
    hourData.map((data: HourInDay, index) => {
        hourNslots.push(renderSchedule(data, index === 0));
    });
    return <> {Children.toArray(hourNslots)} </>;
};

interface Props {
    start: number;
    end: number;
    slotsPerHour: number;
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DayScheduleStatus = (props: Props) => {
    const hourData = getHours(props.start, props.end, props.slotsPerHour);
    setSlots(hourData, props.slotsPerHour);

    const handleClickSlot = (hour: number, min: number) => () => {};

    return (
        <>
            {renderHeader(props.date, props.setDate)}
            <Box>
                <Typography
                    sx={{
                        width: '100%',
                        fontSize: 'small',
                        backgroundColor: 'lightgray',
                        paddingLeft: 1,
                    }}
                >
                    {getString(locale, strings.message.select_to_update)}
                </Typography>
            </Box>
            <Grid container>
                <Grid item xs={1.5}>
                    {/* {renderStatusHour(hourData)} */}
                    {renderHourNslot(
                        hourData,
                        false,
                        true,
                        AMPM_FIRST,
                        handleClickSlot
                    )}
                </Grid>
                <Grid item xs={10.5}>
                    {renderStatus(hourData)}
                </Grid>
            </Grid>
        </>
    );
};

export default DayScheduleStatus;
