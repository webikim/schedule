import { Container, Grid } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ViewSchedule from '../../components/reserve/ViewSchedule';

interface Props {}

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
                <ViewSchedule date={new Date()} />
            </Container>
        </>
    );
};

export default ScheduleSubPage;
