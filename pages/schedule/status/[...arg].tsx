import { Box, Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import React, { useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import DayScheduleStatus from '../../../components/schedule/DayScheduleStatus';
import { getSchedule, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from 'next/router';

import { getString } from '../../../components/locale/stringUtil';
import { LinkText, TitleText } from '../../../components/theme/styles';
import Head from 'next/head';
import { getDayReserve, Reserve } from '../../../lib/dao/reserve-dao';
import { filetrPathName } from '../../../components/menu/menuUtil';
import LocaleContext from '../../../store/localeContext';

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

    const localeCtx = useContext(LocaleContext);
    const lang = localeCtx.locale ? localeCtx.locale.lang : 'en';

    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth');
            }
        });
    });

    const title =
        (props.schedule && props.schedule.title) +
        getString(lang, strings.label.statue_title);

    const handleNavi = (date: Date) => {
        router.replace(
            filetrPathName(router.pathname) +
                '/' +
                props.schedule.id +
                '/' +
                dayjs(date)
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .toDate()
                    .toISOString() +
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
                        {getString(lang, strings.label.to_list)}
                    </LinkText>
                </Box>

                <Box sx={{ marginTop: 4 }}>
                    <TitleText>{title}</TitleText>
                    {props.schedule && (
                        <DayScheduleStatus
                            start={dayjs(props.schedule.timefrom).hour()}
                            end={dayjs(props.schedule.timeto).hour()}
                            slotsPerHour={props.schedule.slots}
                            date={dayjs(props.date).toDate()}
                            reserved={props.reserved}
                            onClickNavi={handleNavi}
                            onClick={handleClickSchedule}
                        />
                    )}
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
        const reserved = await getDayReserve(
            client,
            id as string,
            new Date(date)
        );
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
