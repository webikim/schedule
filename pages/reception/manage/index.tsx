import { Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ManageSchedule from '../../../components/reception/ManageSchedule';
import { getScheduleList, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';

interface Props {
    schedules: Schedule[];
}

const ReceptionSubPage = (props: Props) => {
    const [schedules, setSchedules] = useState(props.schedules);
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

            <Container sx={{ marginTop: 5 }}>
                <ManageSchedule schedules={schedules} update={setSchedules} />
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

export default ReceptionSubPage;
