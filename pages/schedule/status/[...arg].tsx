import { Box, Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';
import dayjs from 'dayjs';
import DayScheduleStatus from '../../../components/schedule/DayScheduleStatus';
import { getSchedule, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from 'next/router';

import { getString } from '../../../components/locale/stringUtil';
import { LinkText, TitleText } from '../../../components/theme/styles';
import Head from 'next/head';
import {
    convertReserve2Dto,
    getReserve,
    Reserve,
    ReserveDtoType,
} from '../../../lib/dao/reserve-dao';
import { filetrPathName } from '../../../components/menu/menuUtil';

const locale = 'en';

const strings = {
    message: {},
    label: {
        to_list: {
            en: 'to list',
            kr: '목록화면으로',
        },
        statue_title: {
            en: ' Schedule',
            kr: ' 예약 현황',
        },
    },
};

interface Props {
    schedule: Schedule;
    reserved: Reserve[];
    date: string;
    routeback: string;
}

const DayScheduleStatusPage = (props: Props) => {
    const router = useRouter();
    const { timefrom, timeto, slots } = props.schedule;

    const title =
        props.schedule.title + getString(locale, strings.label.statue_title);

    const handleNavi = (date: Date) => {
        router.replace(
            filetrPathName(router.pathname) +
                '/' +
                props.schedule.id +
                '/' +
                dayjs(date).format('YYYY-MM-DD') +
                '?back=' +
                props.routeback
        );
    };

    const handleClickSchedule = () => {};

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

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
                    <DayScheduleStatus
                        start={dayjs(timefrom).hour()}
                        end={dayjs(timeto).hour()}
                        slotsPerHour={parseInt(slots)}
                        date={dayjs(props.date).toDate()}
                        reserved={convertReserve2Dto(props.reserved)}
                        onClickNavi={handleNavi}
                        onClick={handleClickSchedule}
                    />
                </Box>
            </Container>
        </>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    const { arg, back } = context.query;
    const [id, date] = arg as string[];
    // console.log('... re-rendered...');
    if (session && id) {
        const client = await connectMongo();
        const schedule = await getSchedule(client, id as string);
        const reserved = await getReserve(client, id as string, date);
        await client.close();
        return {
            props: {
                schedule: schedule,
                reserved: reserved,
                date: date,
                routeback: back || '',
            },
        };
    }
    return {
        props: {},
    };
};

export default DayScheduleStatusPage;
