import { Container } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { buildNavigation } from '../../../components/menu/menuUtil';
import RegisterSchedule from '../../../components/reserve/RegisterSchedule';
import MenuContext from '../../../store/menuContext';

interface Props {}

const ScheduleSubPage = (props: Props) => {
    const router = useRouter();
    // buildNavigation(router.pathname);
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
                <RegisterSchedule />
            </Container>
        </>
    );
};

export default ScheduleSubPage;
