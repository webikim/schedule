import { Box, Container, Grid } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { Children } from 'react';
import ScheduleCard from '../components/schedule/ScheduleCard';
import { getScheduleList } from '../lib/dao/schedule-dao';
import { connectMongo } from '../lib/mongo-helper';
import styles from '../styles/Home.module.css';
import { ScheduleShort } from './reserve/register';

interface Props {
    schedules: ScheduleShort[];
}

const HomePage = (props: Props) => {
    console.log('... schedules = ', props.schedules);
    const title = '';
    const scheduleList: JSX.Element[] = [];
    props.schedules.map((each) => {
        scheduleList.push(
            <Grid item xs={4} sm={3} md={2.4} sx={{ padding: 2 }}>
                <ScheduleCard schedule={each} />
            </Grid>
        );
    });
    return (
        <>
            <Head>{title}</Head>
            <Container>
                <Grid container>{Children.toArray(scheduleList)}</Grid>
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
        await client.close();
        console.log('... schedule = ', schedules);
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

export default HomePage;
