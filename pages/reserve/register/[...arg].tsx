import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import dayjs from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import WeekView from '../../../components/calendar/WeekView';
import { getSchedule, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import { Box, Container } from '@mui/material';
import { LinkText, TitleText } from '../../../components/theme/styles';

import { getString } from '../../../components/locale/stringUtil';
import NotificationContext from '../../../store/notification-context';
import {
    getWeekReserve,
    Reserve,
    ReserveDtoType,
} from '../../../lib/dao/reserve-dao';

const locale = 'en';

const strings = {
    message: {
        register_success: {
            en: 'Sucessfully Reserved.',
            ko: '예약 되었습다.',
        },
        register_failed: {
            en: 'Could not Reserve this time.',
            ko: '예약이 되지 않았습니다.',
        },
    },
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

const convertReserve2Dto = (reserved: Reserve[]) => {
    return reserved.map((each) => {
        return {
            email: each.email,
            date: new Date(each.ymd + ':' + each.hm),
        };
    });
};

interface Props {
    schedule: Schedule;
    reserved: Reserve[];
    routeback: string;
}

const DayRegisterPage = (props: Props) => {
    const [reserved, setReserved] = useState(
        convertReserve2Dto(props.reserved)
    );
    const notificationCtx = useContext(NotificationContext);
    const session = useSession();
    const router = useRouter();
    // const [date, setDate] = useState(new Date());
    convertReserve2Dto(props.reserved);
    const { timefrom, timeto, slots } = props.schedule;
    const title =
        getString(locale, strings.label.register_title) + props.schedule.title;

    const addToReserved = (email: string, date: Date) => {
        setReserved([...reserved, { email: email, date: date }]);
    };

    const handleClickTime = async (date: Date) => {
        const response = await fetch('/api/reserve', {
            method: 'POST',
            body: JSON.stringify({
                email: session.data?.user?.email,
                schedule: props.schedule.id,
                date: date,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            notificationCtx.showNotification({
                message: getString(locale, strings.message.register_failed),
                status: 'error',
            });
            console.log('Schedule create failed.');
            return;
        }
        console.log('success ', await response.json());
        notificationCtx.showNotification({
            message: getString(locale, strings.message.register_success),
            status: 'success',
        });
        addToReserved(session.data!.user!.email!, date);
    };
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
                    date={new Date()}
                    // setDate={setDate}
                    onClick={handleClickTime}
                    reserved={reserved}
                />
            </Box>
        </Container>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    const { arg, back } = context.query;
    const [id, date] = arg as string[];

    if (session && id) {
        const client = await connectMongo();
        const schedule = await getSchedule(client, id as string);
        const reserved = await getWeekReserve(client, id as string, date);
        // console.log('.. reserved = ', reserved);
        await client.close();
        return {
            props: {
                schedule: schedule,
                reserved: reserved,
                routeback: back || '',
            },
        };
    }
    return {
        props: {},
    };
};

export default DayRegisterPage;
