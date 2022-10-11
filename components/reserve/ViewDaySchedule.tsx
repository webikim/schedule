import { Box, Grid, styled, Typography } from '@mui/material';
import { TypographyProps } from '@mui/system';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { Children, useContext } from 'react';
import { ReserveWtitle } from '../../pages/reserve/status';
import DateNavigator from '../calendar/DateNavigator';
import { convertHour, getAMPM } from '../calendar/Hours';
import { filetrPathName } from '../menu/menuUtil';
import { CenteredText } from '../theme/styles';

import { getString } from '../../components/locale/stringUtil';
import LocaleContext from '../../store/localeContext';

const locale = 'en';

const strings = {
    message: {
        no_schedule: {
            en: 'You do not have a reservation for the day.',
            kr: '예약된 내용이 없습니다.',
        },
        comment: {
            en: '* Select to change reservation.',
            kr: '* 예약을 변경하려면 선택해 주세요.',
        },
    },
    label: {},
};

const ScheduleText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '1.3em',
    borderBottom: 'lightgray 1px solid',
}));

const SlotText = styled(ScheduleText)<TypographyProps>(({ theme }) => ({
    justifyContent: 'center',
}));

const AMPM = styled(Typography)<TypographyProps>(({ theme }) => ({
    color: theme.palette.warning.light,
    height: '1.3em',
}));

const renderSchedule = (lang: string, reserved: ReserveWtitle[]) => {
    if (reserved && reserved.length > 0) {
        let list: JSX.Element[] = [];
        reserved.map((each) => {
            const datefrom = dayjs(each.df);
            const dateto = dayjs(each.dt);
            list.push(
                <Grid container>
                    <Grid item xs={1.5}>
                        <AMPM>{getAMPM(datefrom.hour())}</AMPM>
                        <SlotText>{datefrom.format('h:mm')}</SlotText>
                    </Grid>
                    <Grid item xs={10.5}>
                        <AMPM> </AMPM>
                        <ScheduleText>{each.sch_name}</ScheduleText>
                    </Grid>
                </Grid>
            );
        });
        return <>{Children.toArray(list)}</>;
    } else {
        return (
            <Box sx={{ marginTop: 3 }}>
                <CenteredText>
                    {getString(lang, strings.message.no_schedule)}
                </CenteredText>
            </Box>
        );
    }
};

interface Props {
    reserved: ReserveWtitle[];
    date: Date;
}

const ViewDaySchedule = (props: Props) => {
    const session = useSession();
    const router = useRouter();
    const user = session.data?.user?.name;

    const localeCtx = useContext(LocaleContext);
    const lang = localeCtx.locale ? localeCtx.locale.lang : 'en';

    const handleNavi = (date: Date) => {
        router.replace(
            filetrPathName(router.pathname) +
                '?date=' +
                dayjs(date)
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .toDate()
                    .toISOString()
        );
    };

    console.log(props.reserved);

    return (
        <>
            <DateNavigator
                date={props.date}
                incdec={1}
                onPrev={handleNavi}
                onNext={handleNavi}
            >
                <CenteredText sx={{ fontWeight: '700', color: 'gray' }}>
                    {dayjs(props.date).format('YYYY.M.D')}
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
                    {getString(lang, strings.message.comment)}
                </Typography>
            </Box>
            <Box>{renderSchedule(lang, props.reserved)}</Box>
        </>
    );
};

export default ViewDaySchedule;
