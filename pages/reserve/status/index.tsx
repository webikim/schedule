import { Container, Grid } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import React, { useContext, useEffect } from 'react';
import dayjs from 'dayjs';
import { TitleText } from '../../../components/theme/styles';
import { connectMongo } from '../../../lib/mongo-helper';
import { getDayReserveByUser, Reserve } from '../../../lib/dao/reserve-dao';
import ViewDaySchedule from '../../../components/reserve/ViewDaySchedule';
import LocaleContext from '../../../store/localeContext';

import { getString } from '../../../components/locale/stringUtil';

const locale = 'en';

const strings = {
    message: {},
    label: {
        status_title: {
            en: 'Reservations for ',
            kr: ' 님의 예약',
        },
    },
};

export type ReserveWtitle = {
    sch: string;
    sch_name: string;
    df: string;
    dt: string;
    nt: string;
};

interface Props {
    reserved: ReserveWtitle[];
    date: string;
}

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

    const localeCtx = useContext(LocaleContext);
    const lang = localeCtx.locale ? localeCtx.locale.lang : 'en';

    const title =
        lang === 'kr'
            ? user + getString(lang, strings.label.status_title)
            : getString(lang, strings.label.status_title) + user;
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Container maxWidth="xs" sx={{ marginTop: 5 }}>
                <TitleText sx={{ fontSize: 20, fontWeight: '700' }}>
                    <>{title}</>
                </TitleText>
                <ViewDaySchedule
                    reserved={props.reserved}
                    date={new Date(props.date)}
                />
            </Container>
        </>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    const { date } = context.query;
    // console.log('... re-rendered...');
    const dateFrom = date ? new Date(date as string) : new Date();
    if (session) {
        const client = await connectMongo();
        const reserved = await getDayReserveByUser(
            client,
            session.user!.email!,
            dayjs(dateFrom).hour(0).minute(0).second(0).millisecond(0).toDate()
        );
        await client.close();
        return {
            props: {
                reserved: reserved,
                date: dateFrom.toISOString(),
            },
        };
    }
    return {
        props: {},
    };
};

export default ReserveStatusIndexPage;
