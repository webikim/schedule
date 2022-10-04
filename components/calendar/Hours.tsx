import React, { Children } from 'react';
import {
    Box,
    Grid,
    GridProps,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';

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

const HourTitle = styled(Grid)<GridProps>(({ theme }) => ({
    background: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    borderBottom: '1px solid gray',
    height: '2em',
}));

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}));

interface SlotTextProps extends TypographyProps {
    index: number;
    cursor: number;
}

export const SlotText = styled(Typography)<SlotTextProps>(
    ({ theme, index, cursor }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '1.3em',
        '&:hover':
            cursor === 1
                ? {
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textDecorationColor: 'gray',
                      fontWeight: 700,
                  }
                : undefined,
        borderTop: index === 0 ? 'lightgray 1px solid' : undefined,
    })
);

const AMPM = styled(Typography)<TypographyProps>(({ theme }) => ({
    color: theme.palette.warning.light,
    height: '1.3em',
}));

export const getHours = (start: number, end: number, slots: number = 0) => {
    let hourData: HourInDay[] = [];
    for (let i = start; i <= end; i++) hourData.push(new HourInDay(i, slots));
    return hourData;
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

const renderSlots = (
    data: HourInDay,
    isFirst: boolean,
    enableHover: boolean,
    drawBorder: boolean,
    ampmType: number // 0 : off, 1 : all ways, 2: first and 12:00
) => {
    let slots: JSX.Element[] = [];
    const formatter = Intl.NumberFormat('en', { minimumIntegerDigits: 2 });
    data.slots.map((each, index) => {
        slots.push(
            <>
                {(ampmType === 1 ||
                    ((isFirst || data.hour === 12) && index === 0)) && (
                    <AMPM>{getAMPM(data.hour)}</AMPM>
                )}
                <SlotText
                    index={drawBorder ? index : 1}
                    cursor={enableHover ? 1 : 0}
                >
                    {convertHour(data.hour)}:{formatter.format(each)}
                </SlotText>
            </>
        );
    });
    return (
        <>
            <Box>{Children.toArray(slots)}</Box>
        </>
    );
};

export const renderHourNslot = (
    hourData: HourInDay[],
    enableHover: boolean,
    drawBorder: boolean,
    ampmType: number
) => {
    let hourNslots: JSX.Element[] = [];
    hourData.map((data: HourInDay, index) => {
        hourNslots.push(
            renderSlots(data, index === 0, enableHover, drawBorder, ampmType)
        );
    });
    return <> {Children.toArray(hourNslots)} </>;
};

interface Props {
    start: number;
    end: number;
    slotsPerHour: number;
    date: Date;
}

const Hours = (props: Props) => {
    const hourData = getHours(props.start, props.end, props.slotsPerHour);
    setSlots(hourData, props.slotsPerHour);
    return <>{renderHourNslot(hourData, true, false, AMPM_FIRST)}</>;
};

export default Hours;
