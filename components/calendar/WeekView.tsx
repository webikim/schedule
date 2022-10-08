import {
    Grid,
    GridProps,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import { Children, Dispatch, SetStateAction, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import Hours from './Hours';

import { getString } from '../locale/stringUtil';
import { ReserveDtoType } from '../../lib/dao/reserve-dao';
import { CenteredText } from '../theme/styles';

const locale = 'en';

const strings = {
    message: {
        select_time: {
            en: '* Pick a time for me.',
            kr: '* 예약할 시간을 선택하세요.',
        },
    },
    label: {},
};

class WeekData {
    day: number;
    date: Date;
    // holiday: boolean;

    constructor(day: number, date: Date) {
        this.day = day;
        this.date = date;
    }
}

const WeekString = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    kr: ['일', '월', '화', '수', '목', '금', '토'],
};

const WeekName = styled(Grid)<GridProps>(({ theme }) => ({
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 0px 1px;',
    borderRadius: '3px',
    height: '4em',
}));

const Separator = styled(Grid)<GridProps>(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    height: '0.5em',
}));

const HCenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
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
    // refDate.setDate(refDate.getDate() - refDate.getDay() - 1);
    refDate.setDate(refDate.getDate() - 1);

    const weekData = WeekString[locale].map((each, index: number) => {
        refDate.setDate(refDate.getDate() + 1);
        // return new WeekData(index, new Date(refDate));
        return new WeekData(refDate.getDay(), new Date(refDate));
    });
    return weekData;
};

const renderWeekNavi = (
    date: Date,
    setDate: Dispatch<SetStateAction<Date>>
) => {
    const handleClickPrev = () => {
        const prev = new Date(date);
        // prev.setDate(prev.getDate() - prev.getDay() - 7);
        prev.setDate(prev.getDate() - 7);
        setDate(prev);
    };
    const handleClickNext = () => {
        const next = new Date(date);
        // next.setDate(next.getDate() - next.getDay() + 7);
        next.setDate(next.getDate() + 7);
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
                    <HCenteredText>
                        {WeekString[locale][each.day]}
                    </HCenteredText>
                    <HCenteredText>{each.date.getDate()}</HCenteredText>
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

// const renderWeeklySchedule = (props: Props, weekData: WeekData[]) => {
//     const schedules: JSX.Element[] = [];
//     weekData.map((each) => {
//         schedules.push(
//             <Grid item xs={1.7}>
//                 <Hours {...props}></Hours>
//             </Grid>
//         );
//     });
//     return <> {Children.toArray(schedules)} </>;
// };

interface Props {
    start: number;
    end: number;
    slotsPerHour: number;
    date: Date;
    reserved: ReserveDtoType[];
    // setDate: React.Dispatch<React.SetStateAction<Date>>;
    onClick: (date: Date) => void;
}

const selectWithDate = (reserved: ReserveDtoType[], date: Date) => {
    return reserved.map((each) => {
        if (each.date.getDate() === date.getDate()) return each;
    });
};

const WeekView = (props: Props) => {
    const { start, end, slotsPerHour, onClick } = props;
    const [date, setDate] = useState(props.date);
    const weekData = getWeekData(date);

    const handleClickSlot = (data: WeekData) => (hour: number, min: number) => {
        onClick(dayjs(data.date).hour(hour).minute(min).second(0).toDate());
    };

    const schedules: JSX.Element[] = [];
    weekData.map((each) => {
        schedules.push(
            <Grid item xs={1.7}>
                <Hours
                    start={start}
                    end={end}
                    slotsPerHour={slotsPerHour}
                    date={date}
                    reserved={
                        selectWithDate(
                            props.reserved,
                            each.date
                        ) as ReserveDtoType[]
                    }
                    onClick={handleClickSlot(each)}
                ></Hours>
            </Grid>
        );
    });
    return (
        <>
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
                {getString(locale, strings.message.select_time)}
            </Typography>
            <Grid container>{renderWeekHeader(weekData)}</Grid>
            <Grid container>{renderSeperator(weekData)}</Grid>
            <Grid container>{Children.toArray(schedules)}</Grid>
            {/* <Grid container>{renderWeeklySchedule(props, weekData)}</Grid> */}
        </>
    );
};

export default WeekView;
