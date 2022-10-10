import { Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import ScheduleList from '../../../components/schedule/ScheduleList';
import { getScheduleList } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import { TitleText } from '../../../components/theme/styles';

import { getString } from '../../../components/locale/stringUtil';
import { ScheduleShort } from '../../reserve/register';
import dayjs from 'dayjs';
import { filetrPathName } from '../../../components/menu/menuUtil';
import LocaleContext from '../../../store/localeContext';

const locale = 'en';

const strings = {
    message: {
        no_schedule: {
            en: 'Need to create schedule.',
            kr: '먼저 예약을 만드세요.',
        },
    },
    label: {
        statue_title: {
            en: 'Reservation Status',
            kr: '예약 현황',
        },
    },
};

const scheduleConfig = {
    start: 7,
    end: 22,
    slotsPerHour: 2,
};

interface Props {
    schedules: ScheduleShort[];
}

const ScheduleStatusPage = (props: Props) => {
    const { schedules } = props;
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

    const handleClickSchedule =
        (index: number) => (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            router.replace(
                '/schedule/status/' +
                    schedules[index].id +
                    '/' +
                    dayjs()
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .millisecond(0)
                        .toDate()
                        .toISOString() +
                    '?back=/schedule/status'
            );
        };

    const handleNavi = (date: Date) => {
        console.log(filetrPathName(router.pathname));
    };

    const title = getString(lang, strings.label.statue_title);
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Container maxWidth="xs" sx={{ marginTop: 5 }}>
                <TitleText>
                    {getString(lang, strings.label.statue_title)}
                </TitleText>
                <ScheduleList
                    schedules={schedules}
                    onClick={handleClickSchedule}
                    emptymessage={getString(lang, strings.message.no_schedule)}
                />

                {/* <ScheduleStatus {...scheduleConfig} date={new Date()} /> */}
            </Container>
        </>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    // console.log('... re-rendered...');
    if (session) {
        const client = await connectMongo();
        const schedules: ScheduleShort[] = await getScheduleList(
            client,
            session.user!.email!
        );
        await client.close();
        return {
            props: {
                schedules: schedules,
            },
        };
    }
    return {
        props: {},
    };
};

export default ScheduleStatusPage;
