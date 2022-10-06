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

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
}));

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
    const title = '예약만들기';
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Container maxWidth="xs" sx={{ marginTop: 5 }}>
                <CenteredText sx={{ fontSize: 20, fontWeight: '700' }}>
                    {getString(locale, strings.label.statue_title)}
                </CenteredText>
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
