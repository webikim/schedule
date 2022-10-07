import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import WeekView from '../../../components/calendar/WeekView';
import { getSchedule, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import { Box, Container } from '@mui/material';
import { LinkText, TitleText } from '../../../components/theme/styles';

import { getString } from '../../../components/locale/stringUtil';

const locale = 'en';

const strings = {
    message: {},
    label: {
        register_title: {
            en: 'Reserve - ',
            kr: '예약 하기 - ',
        },
        to_list: {
            en: 'to list',
            kr: '목록화면으로',
        },
    },
};

interface Props {
    schedule: Schedule;
    routeback: string;
}

const DayRegisterPage = (props: Props) => {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const { timefrom, timeto, slots } = props.schedule;
    const title =
        getString(locale, strings.label.register_title) + props.schedule.title;
    return (
        <Container maxWidth="xs" sx={{ marginTop: 1 }}>
            <Box sx={{ display: 'flex' }}>
                <ChevronLeftIcon />
                <LinkText
                    onClick={() => {
                        router.replace(props.routeback);
                    }}
                >
                    {getString(locale, strings.label.to_list)}
                </LinkText>
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <TitleText>{title}</TitleText>
                <WeekView
                    start={dayjs(timefrom).hour()}
                    end={dayjs(timeto).hour()}
                    slotsPerHour={parseInt(slots)}
                    date={date}
                    setDate={setDate}
                />
            </Box>
        </Container>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    const { id, back } = context.query;

    if (session && id) {
        const client = await connectMongo();
        const schedule = await getSchedule(client, id as string);
        await client.close();
        return {
            props: {
                schedule: schedule,
                routeback: back || '',
            },
        };
    }
    return {
        props: {},
    };
};

export default DayRegisterPage;
