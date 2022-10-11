import React, { Children } from 'react';
import {
    Box,
    BoxProps,
    Grid,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import { CenteredText } from '../theme/styles';
import {
    HourInDay,
    getAMPM,
    convertHour,
    getHours,
    AMPM_FIRST,
    HourTitle,
    setSlots,
    timeInReserved,
} from './Hours';
import { Reserve } from '../../lib/dao/reserve-dao';
import { ReserveWname } from '../../pages/schedule/status/[...arg]';

interface SlotTextProps extends TypographyProps {
    index: number;
}

export const SlotText = styled(Typography)<SlotTextProps>(
    ({ theme, index }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderTop: index === 0 ? 'lightgray 1px solid' : undefined,
    })
);

const AMPM = styled(Typography)<TypographyProps>(({ theme }) => ({
    color: theme.palette.warning.light,
}));

interface FillerProps extends BoxProps {
    index: number;
}

const Filler = styled(Box)<FillerProps>(({ theme, index }) => ({
    borderTop: index === 0 ? 'lightgray 1px solid' : undefined,
}));

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

const renderReserved = (
    date: Date,
    hour: number,
    min: number,
    reserved: ReserveWname[]
) => {
    const selected = timeInReserved(date, reserved, hour, min);
    if (selected.length) {
        const list: JSX.Element[] = [];
        selected.map((each) => {
            list.push(
                <>
                    <Typography sx={{ paddingLeft: 1 }}>
                        {(each as ReserveWname).name}
                    </Typography>
                    <Typography>{'(' + each.em + ')'}</Typography>{' '}
                </>
            );
        });
        return <Box sx={{ display: 'flex' }}>{Children.toArray(list)}</Box>;
    }
    return <></>;
};

const renderSlots = (
    date: Date,
    data: HourInDay,
    isFirst: boolean,
    drawBorder: boolean,
    ampmType: number, // 0 : off, 1 : all ways, 2: first and 12:00
    reserved: ReserveWname[]
) => {
    let slots: JSX.Element[] = [];
    const formatter = Intl.NumberFormat('en', { minimumIntegerDigits: 2 });
    data.slots.map((each, index) => {
        slots.push(
            <>
                <Grid container>
                    <Grid item xs={1.5}>
                        {(ampmType === 1 ||
                            ((isFirst || data.hour === 12) && index === 0)) && (
                            <AMPM>{getAMPM(data.hour)}</AMPM>
                        )}
                        <SlotText index={drawBorder ? index : 1}>
                            {convertHour(data.hour)}:{formatter.format(each)}
                        </SlotText>
                    </Grid>
                    <Grid item xs={10.5}>
                        {(ampmType === 1 ||
                            ((isFirst || data.hour === 12) && index === 0)) && (
                            <Filler index={1}>&nbsp;</Filler>
                        )}
                        <Filler index={index}>
                            {renderReserved(date, data.hour, each, reserved)}
                        </Filler>
                    </Grid>
                </Grid>
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
    reserved: ReserveWname[];
}

const HoursReserved = (props: Props) => {
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
                true,
                AMPM_FIRST,
                props.reserved
            )
        );
    });

    return <>{Children.toArray(hourNslots)}</>;
};

export default HoursReserved;
