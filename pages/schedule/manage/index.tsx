import { Container } from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import ManageSchedule from '../../../components/schedule/ManageSchedule';
import { TitleText } from '../../../components/theme/styles';
import { getScheduleList, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';

import { getString } from '../../../components/locale/stringUtil';
import LocaleContext from '../../../store/localeContext';

const locale = 'en';

const strings = {
    message: {},
    label: {
        manage_title: {
            en: 'Manage Schedules',
            kr: '예약 관리',
        },
    },
};

interface Props {
    schedules: Schedule[];
}

const ManageSchedulePage = (props: Props) => {
    const [schedules, setSchedules] = useState(props.schedules);
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
    const title = getString(lang, strings.label.manage_title);
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Container maxWidth="xs" sx={{ marginTop: 5 }}>
                <TitleText sx={{ fontSize: 20 }}>{title}</TitleText>
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

export default ManageSchedulePage;
