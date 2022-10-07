import {
    Box,
    Button,
    ButtonProps,
    Container,
    Grid,
    IconButton,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import React, { Children, Dispatch, useState } from 'react';
import dayjs from 'dayjs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
    AMPM_ALWAYS,
    convertHour,
    getAMPM,
    getHours,
    HourInDay,
    renderHourNslot,
    setSlots,
} from '../calendar/Hours';
import MonthView from '../calendar/MonthView';
import { useSession } from 'next-auth/react';

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}));

interface ViewChoiceProps extends ButtonProps {
    selected: number;
}

const ViewChoice = styled(Button)<ViewChoiceProps>(({ theme, selected }) => ({
    marginTop: '0.4em',
    paddingTop: '0.2em',
    border: '1px solid',
    borderColor: selected === 1 ? 'gray' : 'lightgray',
    borderRadius: '4px',
    height: '2em',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: selected === 1 ? 'lightgray' : undefined,
    color: selected === 1 ? 'black' : 'gray',
}));

const SlotText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '1.3em',
}));

const AMPM = styled(Typography)<TypographyProps>(({ theme }) => ({
    color: theme.palette.warning.light,
    height: '1.3em',
}));

const DAY_VIEW = 0;
const MONTH_VIEW = 1;

const renderHeader = (
    date: Date,
    setDate: Dispatch<React.SetStateAction<Date>>,
    view: number,
    setView: Dispatch<React.SetStateAction<number>>
) => {
    const handleClickPrev = () => {
        const prev = new Date(date);
        if (view === DAY_VIEW) {
            prev.setDate(prev.getDate() - 1);
        } else {
            prev.setDate(0);
        }
        setDate(prev);
    };
    const handleClickNext = () => {
        let next = new Date(date);
        if (view === MONTH_VIEW) {
            next = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        }
        next.setDate(next.getDate() + 1);
        setDate(next);
    };
    const handleClickDay = () => {
        setView(DAY_VIEW);
    };
    const handleClickMonth = () => {
        setView(MONTH_VIEW);
    };
    const format = view === DAY_VIEW ? 'YYYY.M.D' : 'YYYY.M';
    return (
        <Box sx={{ display: 'flex' }}>
            <IconButton onClick={handleClickPrev}>
                <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton onClick={handleClickNext}>
                <ArrowForwardIosIcon />
            </IconButton>
            <Typography
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    fontWeight: '700',
                    margin: 'auto 0',
                }}
            >
                {dayjs(date).format(format)}
            </Typography>
            <ViewChoice
                size="small"
                onClick={handleClickDay}
                selected={view === DAY_VIEW ? 1 : 0}
            >
                일
            </ViewChoice>
            <ViewChoice
                size="small"
                onClick={handleClickMonth}
                selected={view === MONTH_VIEW ? 1 : 0}
            >
                월
            </ViewChoice>
        </Box>
    );
};

const renderDaySchedule = (hourData: HourInDay[]) => {
    return (
        <>
            <Grid container>
                <Grid item xs={1.5}>
                    {renderHourNslot(hourData, false, false, AMPM_ALWAYS)}
                </Grid>
            </Grid>
        </>
    );
};

const renderMonthSchedule = (
    date: Date,
    setDate: Dispatch<React.SetStateAction<Date>>
) => {
    return (
        <>
            <MonthView
                date={date}
                setdate={setDate}
                hint="* 예약내용을 확인할 날짜를 선택하세요."
            />
        </>
    );
};

interface Props {
    date: Date;
}

const ViewSchedule = (props: Props) => {
    const [date, setDate] = useState(props.date);
    const [view, setView] = useState(DAY_VIEW);
    const session = useSession();
    const user = session.data?.user?.name;
    // for test
    const hourData = getHours(10, 14, 2);
    setSlots(hourData, 2);
    //
    return (
        <>
            {renderHeader(date, setDate, view, setView)}
            {view === DAY_VIEW && renderDaySchedule(hourData)}
            {view === MONTH_VIEW && renderMonthSchedule(date, setDate)}
        </>
    );
};

export default ViewSchedule;
