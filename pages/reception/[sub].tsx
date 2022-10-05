import { Container, Grid } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import BuildSchedule from '../../components/reception/BuildSchedule';
import ManageSchedule from '../../components/reception/ManageSchedule';
import ScheduleStatus from '../../components/reception/ScheduleStatus';
import { getScheduleList, Schedule } from '../../lib/dao/schedule-dao';
import { connectMongo } from '../../lib/mongo-helper';

const scheduleConfig = {
    start: 7,
    end: 22,
    slotsPerHour: 2,
};

interface Props {
    schedules: Schedule[];
}

const ReceptionSubPage = (props: Props) => {
    const router = useRouter();
    const { sub } = router.query;
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

            <Container sx={{ marginTop: 5 }}>
                {sub === 'create' && <BuildSchedule />}
                {sub === 'manage' && (
                    <ManageSchedule schedules={props.schedules} />
                )}
                {sub === 'status' && (
                    <ScheduleStatus {...scheduleConfig} date={new Date()} />
                )}
            </Container>
        </>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    if (session) {
        const client = await connectMongo();
        const schedules = await getScheduleList(client, session.user!.email!);
        client.close();
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

export default ReceptionSubPage;
