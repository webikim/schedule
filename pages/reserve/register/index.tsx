import { Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { getScheduleList, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import SearchSchedule from '../../../components/reserve/SearchSchedule';
import RegisterSchedule from '../../../components/reserve/RegisterSchedule';

export type ScheduleShort = {
    id: string;
    title: string;
    desc: string;
    created: string;
};

interface Props {
    schedules: ScheduleShort;
}

const ScheduleSubPage = (props: Props) => {
    const router = useRouter();
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth');
            }
        });
    });

    const title = '예약하기';
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Container sx={{ marginTop: 5 }}>
                {/* <SearchSchedule schedules={props.schedules}/> */}
                <RegisterSchedule />
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
        const schedules = await getScheduleList(client);
        console.log('.... schedules = ', schedules);
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

export default ScheduleSubPage;
