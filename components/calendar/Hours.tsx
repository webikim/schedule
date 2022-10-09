import React, { Children } from 'react';
import {
    Box,
    Grid,
    GridProps,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import dayjs from 'dayjs';

import { CenteredText } from '../theme/styles';
import { Reserve } from '../../lib/dao/reserve-dao';

export class HourInDay {
    hour: number;
    slots: number[];

    constructor(hour: number, slots: number) {
        this.hour = hour;
        this.slots = Array(slots);
    }
}

export const AMPM_OFF = 0;
export const AMPM_ALWAYS = 1;
export const AMPM_FIRST = 2;

export const HourTitle = styled(Grid)<GridProps>(({ theme }) => ({
    background: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    borderBottom: '1px solid gray',
    height: '2em',
}));

const SlotTextBase = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '1.3em',
}));

const SlotText = styled(SlotTextBase)<TypographyProps>(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline',
        textDecorationColor: 'gray',
        fontWeight: 700,
    },
}));

const SlotTextDisabled = styled(SlotTextBase)<TypographyProps>(({ theme }) => ({
    color: 'lightgray',
}));

const AMPM = styled(Typography)<TypographyProps>(({ theme }) => ({
    color: theme.palette.warning.light,
    height: '1.3em',
}));

export const addMinutes = (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
};

export const slot2Minutes = (slots: number) => {
    return 60 / slots;
};

export const getHours = (start: number, end: number, slots: number = 0) => {
    let hourData: HourInDay[] = [];
    for (let i = start; i <= end; i++) hourData.push(new HourInDay(i, slots));
    return hourData;
};

export const convertReserved = (reserved: Reserve[]) => {
    return reserved.map((each) => {
        return {
            ...each,
            df: typeof each.df === 'string' ? new Date(each.df) : each.df,
            dt: typeof each.dt === 'string' ? new Date(each.dt) : each.dt,
        };
    });
};

export const selectWithDate = (reserved: Reserve[], date: Date) => {
    return reserved.filter((each) => {
        return (
            each.df.getTime() >= date.getTime() &&
            each.dt.getTime() <=
                dayjs(date).hour(23).minute(59).second(59).valueOf()
        );
    });
};

export const renderHourTitles = (hourData: HourInDay[]) => {
    return (
        <>
            {hourData.map((hour, key) => {
                return (
                    <HourTitle item key={key}>
                        <CenteredText>{hour.hour}</CenteredText>
                    </HourTitle>
                );
            })}
        </>
    );
};

export const setSlots = (hours: HourInDay[], slotsPerHour: number) => {
    const slotSize = 60 / slotsPerHour;
    hours.map((hour) => {
        for (let i = 0; i < hour.slots.length; i++)
            hour.slots[i] = i * slotSize;
    });
};

export const getAMPM = (hour: number) => {
    return hour >= 12 ? 'pm' : 'am';
};

export const convertHour = (hour: number) => {
    return hour > 12 ? hour % 12 : hour;
};

export const timeInReserved = (
    date: Date,
    reserved: Reserve[],
    hour: number,
    min: number
): Reserve[] => {
    const compdate = dayjs(date).hour(hour).minute(min).second(0).valueOf();
    return reserved.filter((each) => {
        return each !== undefined && dayjs(each.df).valueOf() === compdate;
    });
};

const renderSlots = (
    date: Date,
    data: HourInDay,
    isFirst: boolean,
    ampmType: number, // 0 : off, 1 : all ways, 2: first and 12:00
    onClickSlot: (hour: number, min: number) => () => void,
    reserved: Reserve[]
) => {
    let slots: JSX.Element[] = [];
    const formatter = Intl.NumberFormat('en', { minimumIntegerDigits: 2 });
    data.slots.map((each, index) => {
        slots.push(
            <>
                {(ampmType === AMPM_ALWAYS ||
                    (ampmType &&
                        (isFirst || data.hour === 12) &&
                        index === 0)) && <AMPM>{getAMPM(data.hour)}</AMPM>}
                {reserved &&
                reserved.length > 0 &&
                timeInReserved(date, reserved, data.hour, data.slots[index])
                    .length > 0 ? (
                    <SlotTextDisabled onClick={onClickSlot(data.hour, each)}>
                        {convertHour(data.hour)}:{formatter.format(each)}
                    </SlotTextDisabled>
                ) : (
                    <SlotText onClick={onClickSlot(data.hour, each)}>
                        {convertHour(data.hour)}:{formatter.format(each)}
                    </SlotText>
                )}
            </>
        );
    });
    return (
        <>
            <Box>{Children.toArray(slots)}</Box>
        </>
    );
};

interface Props {
    date: Date;
    start: number;
    end: number;
    slotsPerHour: number;
    onClick: (hour: number, min: number) => void;
    reserved: Reserve[];
}

const Hours = (props: Props) => {
    const hourData = getHours(props.start, props.end, props.slotsPerHour);
    setSlots(hourData, props.slotsPerHour);

    const handleClickSlot = (hour: number, min: number) => () => {
        props.onClick(hour, min);
    };

    const hourNslots: JSX.Element[] = [];
    hourData.map((data: HourInDay, index) => {
        hourNslots.push(
            renderSlots(
                props.date,
                data,
                index === 0,
                AMPM_FIRST,
                handleClickSlot,
                props.reserved
            )
        );
    });

    return <> {Children.toArray(hourNslots)} </>;
};

export default Hours;
