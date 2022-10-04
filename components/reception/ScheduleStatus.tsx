import {
    Box,
    BoxProps,
    Container,
    Grid,
    IconButton,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import React, { Children, Dispatch, useState } from 'react';
import {
    AMPM_FIRST,
    getHours,
    HourInDay,
    renderHourNslot,
    setSlots,
} from '../calendar/Hours';
import dayjs from 'dayjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}));

interface FillerProps extends BoxProps {
    index: number;
}

const Filler = styled(Box)<FillerProps>(({ theme, index }) => ({
    height: '1.3em',
    borderTop: index === 0 ? 'lightgray 1px solid' : undefined,
}));

const renderHeader = (
    date: Date,
    setDate: Dispatch<React.SetStateAction<Date>>
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
            <IconButton>
                <ArrowBackIosNewIcon onClick={handleClickPrev} />
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
            <IconButton>
                <ArrowForwardIosIcon onClick={handleClickNext} />
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
}

const ScheduleStatus = (props: Props) => {
    const [date, setDate] = useState(props.date);
    const hourData = getHours(props.start, props.end, props.slotsPerHour);
    setSlots(hourData, props.slotsPerHour);
    const dayString = dayjs(date).format('YYYY.M.D');
    return (
        <>
            <Container maxWidth="xs">
                <CenteredText sx={{ fontSize: 20, fontWeight: '700' }}>
                    예약 현황
                </CenteredText>
                {renderHeader(date, setDate)}
                <Box>
                    <Typography
                        sx={{
                            width: '100%',
                            fontSize: 'small',
                            backgroundColor: 'lightgray',
                            paddingLeft: 1,
                        }}
                    >
                        * 예약변경을 하려면 예약자를 선택하세요.
                    </Typography>
                </Box>
                <Grid container>
                    <Grid item xs={1.5}>
                        {/* {renderStatusHour(hourData)} */}
                        {renderHourNslot(hourData, false, true, AMPM_FIRST)}
                    </Grid>
                    <Grid item xs={10.5}>
                        {renderStatus(hourData)}
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default ScheduleStatus;
