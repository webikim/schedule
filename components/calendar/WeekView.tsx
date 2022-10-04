import {
    Box,
    Grid,
    GridProps,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import { Children, Dispatch, SetStateAction, useState } from 'react';
import Hours, { getHours } from './Hours';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Container } from '@mui/system';

class WeekData {
    day: number;
    date: Date;
    // holiday: boolean;

    constructor(day: number, date: Date) {
        this.day = day;
        this.date = date;
    }
}

const WeekString = ['일', '월', '화', '수', '목', '금', '토'];

const WeekName = styled(Grid)<GridProps>(({ theme }) => ({
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 0px 1px;',
    borderRadius: '3px',
    height: '4em',
}));

const Separator = styled(Grid)<GridProps>(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    height: '0.5em',
}));

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
}));

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

const getWeekData = (date: Date) => {
    const refDate = new Date(date);
    refDate.setDate(refDate.getDate() - refDate.getDay() - 1);

    const weekData = WeekString.map((each, index: number) => {
        refDate.setDate(refDate.getDate() + 1);
        return new WeekData(index, new Date(refDate));
    });
    return weekData;
};

const renderWeekNavi = (
    date: Date,
    setDate: Dispatch<SetStateAction<Date>>
) => {
    const handleClickPrev = () => {
        const prev = new Date(date);
        prev.setDate(prev.getDate() - prev.getDay() - 7);
        setDate(prev);
    };
    const handleClickNext = () => {
        const next = new Date(date);
        next.setDate(next.getDate() - next.getDay() + 7);
        setDate(next);
    };
    return (
        <>
            <Navigation item xs={1} onClick={handleClickPrev}>
                <ArrowBackIosIcon />
            </Navigation>
            <Navigation item xs={1} onClick={handleClickNext}>
                <ArrowForwardIosIcon />
            </Navigation>
            <CenteredText sx={{ fontWeight: '700', color: 'gray' }}>
                {date.getFullYear() + '. ' + (date.getMonth() + 1)}
            </CenteredText>
        </>
    );
};

const renderWeekHeader = (weekData: WeekData[]) => {
    const weekHeader: JSX.Element[] = [];
    weekData.map((each, index) => {
        weekHeader.push(
            <Grid item xs={1.7}>
                <WeekName sx={{ paddingTop: '0.5em' }}>
                    <CenteredText>{WeekString[each.day]}</CenteredText>
                    <CenteredText>{each.date.getDate()}</CenteredText>
                </WeekName>
            </Grid>
        );
    });
    return <> {Children.toArray(weekHeader)} </>;
};

const renderSeperator = (weekData: WeekData[]) => {
    const weekHeader: JSX.Element[] = [];
    weekData.map((each, index) => {
        weekHeader.push(<Separator item xs={1.7}></Separator>);
    });
    return <> {Children.toArray(weekHeader)} </>;
};

const renderWeeklySchedule = (props: Props, weekData: WeekData[]) => {
    const schedules: JSX.Element[] = [];
    weekData.map((each) => {
        schedules.push(
            <Grid item xs={1.7}>
                <Hours {...props}></Hours>
            </Grid>
        );
    });
    return <> {Children.toArray(schedules)} </>;
};

interface Props {
    start: number;
    end: number;
    slotsPerHour: number;
    date: Date;
}

const WeekView = (props: Props) => {
    const [date, setDate] = useState(props.date);
    const weekData = getWeekData(date);
    return (
        <>
            <Container maxWidth="xs">
                <CenteredText
                    sx={{ fontSize: 20, fontWeight: '700', marginBottom: 2 }}
                >
                    예약 하기
                </CenteredText>
                <Grid container sx={{ marginTop: 1, marginBottom: 1 }}>
                    {renderWeekNavi(date, setDate)}
                </Grid>
                <Typography
                    sx={{
                        width: '100%',
                        fontSize: 'small',
                        backgroundColor: 'lightgray',
                    }}
                >
                    * 예약할 시간을 선택하세요.
                </Typography>
                <Grid container>{renderWeekHeader(weekData)}</Grid>
                <Grid container>{renderSeperator(weekData)}</Grid>
                <Grid container>{renderWeeklySchedule(props, weekData)}</Grid>
            </Container>
        </>
    );
};

export default WeekView;
