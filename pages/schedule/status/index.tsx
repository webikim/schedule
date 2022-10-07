import { Container, styled, Typography, TypographyProps } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ScheduleList from '../../../components/schedule/ScheduleList';
import { getScheduleList, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';

import { getString } from '../../../components/locale/stringUtil';
import { TitleText } from '../../../components/theme/styles';

const locale = 'en';

const strings = {
    message: {},
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
    schedules: Schedule[];
}

const ScheduleStatusPage = (props: Props) => {
    const router = useRouter();
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth');
            }
        });
    });
    const title = getString(locale, strings.label.statue_title);
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Container maxWidth="xs" sx={{ marginTop: 5 }}>
                <TitleText>
                    {getString(locale, strings.label.statue_title)}
                </TitleText>
                <ScheduleList schedules={props.schedules} />

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
        const schedules = await getScheduleList(client, session.user!.email!);
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
