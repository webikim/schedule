import dayjs from 'dayjs';
import { Box, BoxProps, styled, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { Children, useContext } from 'react';
import { HourInDay } from '../calendar/Hours';
import DateNavigator from '../calendar/DateNavigator';
import { CenteredText } from '../theme/styles';
import HoursReserved from '../calendar/HourReserved';
import LocaleContext from '../../store/localeContext';

import { getString } from '../locale/stringUtil';
import { ReserveWname } from '../../pages/schedule/status/[...arg]';
import { Schedule } from '../../lib/dao/schedule-dao';

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

const renderSchedule = (data: HourInDay, isFirst: boolean) => {
    let slots: JSX.Element[] = [];
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
    schedule: Schedule;
    date: Date;
    reserved: ReserveWname[];
    onClick: () => void;
    onClickNavi: (date: Date) => void;
}

const DayScheduleStatus = (props: Props) => {
    const { date, onClick } = props;
    const router = useRouter();

    const localeCtx = useContext(LocaleContext);
    const lang = localeCtx.locale ? localeCtx.locale.lang : 'en';

    const handleClickSlot = () => {
        onClick();
    };

    return (
        <>
            <DateNavigator
                date={date}
                incdec={1}
                onPrev={props.onClickNavi}
                onNext={props.onClickNavi}
            >
                <CenteredText sx={{ fontWeight: '700', color: 'gray' }}>
                    {dayjs(date).format('YYYY.M.D')}
                </CenteredText>
            </DateNavigator>
            <Box>
                <Typography
                    sx={{
                        width: '100%',
                        fontSize: 'small',
                        backgroundColor: 'lightgray',
                        paddingLeft: 1,
                    }}
                >
                    {getString(lang, strings.message.select_to_update)}
                </Typography>
            </Box>
            <HoursReserved
                date={date}
                schedule={props.schedule}
                reserved={props.reserved}
                onClick={handleClickSlot}
            ></HoursReserved>
        </>
    );
};

export default DayScheduleStatus;
