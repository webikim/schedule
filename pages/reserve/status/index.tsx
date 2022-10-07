import { Container, Grid } from '@mui/material';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ViewSchedule from '../../../components/reserve/ViewSchedule';
import { TitleText } from '../../../components/theme/styles';

import { getString } from '../../../components/locale/stringUtil';

const locale = 'en';

const strings = {
    message: {},
    label: {},
};

interface Props {}

const ReserveStatusIndexPage = (props: Props) => {
    const router = useRouter();
    const session = useSession();
    const user = session.data?.user?.name;
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

            <Container maxWidth="xs" sx={{ marginTop: 5 }}>
                <TitleText sx={{ fontSize: 20, fontWeight: '700' }}>
                    <>{user} 님의 예약</>
                </TitleText>
                <ViewSchedule date={new Date()} />
            </Container>
        </>
    );
};

export default ReserveStatusIndexPage;
