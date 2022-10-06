import { Container } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import BuildSchedule from '../../components/reception/BuildSchedule';
import { Schedule } from '../../lib/dao/schedule-dao';

interface Props {
    schedules: Schedule[];
}

const CreateSchedulePage = (props: Props) => {
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
                <BuildSchedule />
            </Container>
        </>
    );
};

export default CreateSchedulePage;
