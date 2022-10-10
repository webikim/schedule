import { Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { getScheduleList } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import SearchSchedule from '../../../components/reserve/SearchSchedule';
import { TitleText } from '../../../components/theme/styles';

import { getString } from '../../../components/locale/stringUtil';
import LocaleContext from '../../../store/localeContext';

const locale = 'en';

const strings = {
    message: {},
    label: {
        reserve_title: {
            en: 'Reserve Seat',
            kr: '예약 하기',
        },
    },
};

export type ScheduleShort = {
    id: string;
    title: string;
    desc: string;
    created: string;
};

interface Props {
    schedules: ScheduleShort[];
}

const ReserveRegisterPage = (props: Props) => {
    const router = useRouter();

    const localeCtx = useContext(LocaleContext);
    const lang = localeCtx.locale ? localeCtx.locale.lang : 'en';

    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth');
            }
        });
    });

    const title = getString(lang, strings.label.reserve_title);
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Container maxWidth="xs" sx={{ marginTop: 5 }}>
                <TitleText sx={{ fontSize: 20 }}>{title}</TitleText>
                <SearchSchedule schedules={props.schedules} />
                {/* <RegisterSchedule /> */}
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

export default ReserveRegisterPage;
