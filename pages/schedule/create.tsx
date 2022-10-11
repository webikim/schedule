import { Container } from '@mui/material';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { CenteredText, TitleText } from '../../components/theme/styles';
import { Schedule } from '../../lib/dao/schedule-dao';
import { getString } from '../../components/locale/stringUtil';
import NotificationContext from '../../store/notification-context';
import BuildScheduleForm from '../../components/schedule/BuildScheduleForm';
import LocaleContext from '../../store/localeContext';

const locale = 'en';

const strings = {
    message: {
        success: {
            en: 'Created a New Schedule.',
            kr: '새로운 예약작업이 생성되었습니다.',
        },
        fail: {
            en: 'Could not create a new schedule.',
            kr: '새로운 예약작업을 만들수 없습니다.',
        },
    },
    label: {
        new_schedule: {
            en: 'New Schedule',
            kr: '예약 만들기',
        },
    },
};

interface Props {
    schedules: Schedule[];
}

const CreateSchedulePage = (props: Props) => {
    const notificationCtx = useContext(NotificationContext);
    const router = useRouter();
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth');
            }
        });
    });

    const localeCtx = useContext(LocaleContext);
    const lang = localeCtx.locale ? localeCtx.locale.lang : 'en';

    const handleSubmit = async (jsonData: string) => {
        const response = await fetch('/api/schedule', {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            notificationCtx.showNotification({
                message: getString(lang, strings.message.fail),
                status: 'error',
            });
            console.log('Schedule create failed.');
            return;
        }
        console.log('success ', await response.json());
        notificationCtx.showNotification({
            message: getString(lang, strings.message.success),
            status: 'success',
        });
    };

    const title = '예약만들기';
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Container maxWidth="xs" sx={{ marginTop: 5 }}>
                <CenteredText sx={{ fontSize: 20, fontWeight: '700' }}>
                    {getString(lang, strings.label.new_schedule)}
                </CenteredText>
                <BuildScheduleForm onSubmit={handleSubmit} />
            </Container>
        </>
    );
};

export default CreateSchedulePage;
