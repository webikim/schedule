import { Container, Grid } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import RegisterSchedule from '../../components/schedule/RegisterSchedule';
import ViewSchedule from '../../components/schedule/ViewSchedule';

interface Props {}

const ScheduleSubPage = (props: Props) => {
    const router = useRouter();
    const { sub } = router.query;
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
                {sub === 'create' && <RegisterSchedule />}
                {sub === 'view' && <ViewSchedule date={new Date()} />}
            </Container>
        </>
    );
};

export default ScheduleSubPage;
