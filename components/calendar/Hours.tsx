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
import { useSession } from 'next-auth/react';
import { Schedule } from '../../lib/dao/schedule-dao';

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

const SlotTextReserved = styled(SlotTextBase)<TypographyProps>(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline',
        textDecorationColor: 'gray',
        fontWeight: 700,
    },
    color: theme.palette.error.light,
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
    if (reserved && reserved.length > 0) {
        return reserved.map((each) => {
            return {
                ...each,
                df: typeof each.df === 'string' ? new Date(each.df) : each.df,
                dt: typeof each.dt === 'string' ? new Date(each.dt) : each.dt,
            };
        });
    } else return reserved;
};

export const selectWithDate = (reserved: Reserve[], date: Date) => {
    return reserved.filter(
        (each) =>
            each.df.getTime() >= date.getTime() &&
            each.dt.getTime() <=
                dayjs(date).hour(23).minute(59).second(59).valueOf()
    );
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

export const emailInReserved = (reserved: Reserve[], email: string) => {
    return reserved.filter((each) => each.em === email);
};

const renderSlots = (
    email: string | undefined,
    date: Date,
    data: HourInDay,
    isFirst: boolean,
    ampmType: number, // 0 : off, 1 : all ways, 2: first and 12:00
    onClickSlot: (hour: number, min: number, isAdd: boolean) => () => void,
    reserved: Reserve[]
) => {
    let slots: JSX.Element[] = [];
    const formatter = Intl.NumberFormat('en', { minimumIntegerDigits: 2 });
    data.slots.map((each, index) => {
        let timeslot;
        timeslot = (
            <SlotText onClick={onClickSlot(data.hour, each, true)}>
                {convertHour(data.hour)}:{formatter.format(each)}
            </SlotText>
        );
        if (reserved && reserved.length) {
            const list = timeInReserved(
                date,
                reserved,
                data.hour,
                data.slots[index]
            );
            if (list.length > 0 && email) {
                if (emailInReserved(list, email).length > 0) {
                    timeslot = (
                        <SlotTextReserved
                            onClick={onClickSlot(data.hour, each, false)}
                        >
                            {convertHour(data.hour)}:{formatter.format(each)}
                        </SlotTextReserved>
                    );
                } else {
                    timeslot = (
                        <SlotTextDisabled>
                            {convertHour(data.hour)}:{formatter.format(each)}
                        </SlotTextDisabled>
                    );
                }
            }
        }
        slots.push(timeslot);
    });
    return (
        <>
            <Box>{Children.toArray(slots)}</Box>
        </>
    );
};

interface Props {
    date: Date;
    schedule: Schedule;
    onClick: (hour: number, min: number, isAdd: boolean) => void;
    reserved: Reserve[];
}

const Hours = (props: Props) => {
    const { date, schedule } = props;
    const start = dayjs(props.schedule.timefrom).hour();
    const end = dayjs(props.schedule.timeto).hour();
    const hourData = getHours(start, end, props.schedule.slots);
    setSlots(hourData, props.schedule.slots);

    const session = useSession();

    const handleClickSlot =
        (hour: number, min: number, isAdd: boolean) => () => {
            props.onClick(hour, min, isAdd);
        };

    if (
        dayjs(date).valueOf() < dayjs(schedule.datefrom).valueOf() ||
        (schedule.dateto &&
            dayjs(date).valueOf() > dayjs(schedule.dateto).valueOf())
    ) {
        return <></>;
    } else {
        const hourNslots: JSX.Element[] = [];
        hourData.map((data: HourInDay, index) => {
            hourNslots.push(
                renderSlots(
                    session && session.data
                        ? session.data!.user!.email!
                        : undefined,
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
    }
};

export default Hours;
