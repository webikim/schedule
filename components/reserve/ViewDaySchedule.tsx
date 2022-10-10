import { Box, BoxProps, Grid, styled, Typography } from '@mui/material';
import { TypographyProps } from '@mui/system';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { Children } from 'react';
import { ReserveWname } from '../../pages/reserve/status';
import DateNavigator from '../calendar/DateNavigator';
import { convertHour, getAMPM } from '../calendar/Hours';
import { filetrPathName } from '../menu/menuUtil';
import { CenteredText } from '../theme/styles';

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

const renderSchedule = (reserved: ReserveWname[]) => {
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
};

interface Props {
    reserved: ReserveWname[];
    date: Date;
}

const ViewDaySchedule = (props: Props) => {
    const session = useSession();
    const router = useRouter();
    const user = session.data?.user?.name;

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
                    * 예약을 변경하려면 선택해 주세요.
                </Typography>
            </Box>
            <Box>{renderSchedule(props.reserved)}</Box>
        </>
    );
};

export default ViewDaySchedule;
