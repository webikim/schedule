import {
    Box,
    Container,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import DayScheduleStatus from '../../../components/reception/DayScheduleStatus';
import { getSchedule, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from 'next/router';

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}));

const LinkText = styled(Typography)<TypographyProps>(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline',
        textDecorationColor: 'gray',
        fontWeight: 700,
    },
}));

interface Props {
    schedule: Schedule;
}

const DayScheduleStatusPage = (props: Props) => {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const { timefrom, timeto, slots } = props.schedule;
    const title = props.schedule.title + ' 예약 현황';
    return (
        <Container sx={{ marginTop: 5 }} maxWidth="xs">
            <Box sx={{ display: 'flex' }}>
                <ChevronLeftIcon />
                <LinkText
                    onClick={() => {
                        router.replace('/reception/status/');
                    }}
                >
                    목록화면으로
                </LinkText>
            </Box>

            <CenteredText sx={{ fontSize: 20, fontWeight: '700' }}>
                {title}
            </CenteredText>
            <DayScheduleStatus
                start={dayjs(timefrom).hour()}
                end={dayjs(timeto).hour()}
                slotsPerHour={parseInt(slots)}
                date={date}
                setDate={setDate}
            />
        </Container>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    const { id } = context.query;
    // console.log('... re-rendered...');
    if (session && id) {
        const client = await connectMongo();
        const schedule = await getSchedule(client, id as string);
        await client.close();
        return {
            props: {
                schedule: schedule,
            },
        };
    }
    return {
        props: {},
    };
};

export default DayScheduleStatusPage;
