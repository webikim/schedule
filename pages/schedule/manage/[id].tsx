import {
    Box,
    Container,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import BuildScheduleForm from '../../../components/schedule/BuildScheduleForm';
import { getSchedule, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import NotificationContext from '../../../store/notification-context';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { getString } from '../../../components/locale/stringUtil';

const locale = 'en';

const strings = {
    message: {
        update_failed: {
            en: 'Failed to update schedule.',
            kr: '예약작업을 수정할수 없습니다.',
        },
        update_success: {
            en: 'Updated Schedule successful.',
            kr: '예약작업이 수정되었습니다.',
        },
    },
    label: {
        to_list: {
            en: 'to list',
            kr: '목록화면으로',
        },
        update_title: {
            en: 'Update Schedule',
            kr: '예약 수정',
        },
    },
};

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    fontWeight: '700',
}));

const LinkText = styled(Typography)<TypographyProps>(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline',
        textDecorationColor: 'gray',
        fontWeight: 700,
    },
}));

interface Props {
    schedule: Schedule;
}

const UpdateSchedulePage = (props: Props) => {
    const router = useRouter();
    const { id } = router.query;
    const notificationCtx = useContext(NotificationContext);
    console.log('schedule = ', props.schedule);

    const handleSubmit = async (jsonData: string) => {
        console.log('jsondata = ', jsonData);
        const response = await fetch('/api/schedule/' + id, {
            method: 'PATCH',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            notificationCtx.showNotification({
                message: getString(locale, strings.message.update_failed),
                status: 'error',
            });
            console.log('Schedule create failed.');
            return;
        }
        console.log('success ', await response.json());
        notificationCtx.showNotification({
            message: getString(locale, strings.message.update_success),
            status: 'success',
        });
    };

    return (
        <>
            <Container maxWidth="xs" sx={{ marginTop: 1 }}>
                <Box sx={{ display: 'flex' }}>
                    <ChevronLeftIcon />
                    <LinkText
                        onClick={() => {
                            router.replace('/schedule/manage/');
                        }}
                    >
                        {getString(locale, strings.label.to_list)}
                    </LinkText>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <CenteredText sx={{ fontSize: 20 }}>
                        {getString(locale, strings.label.update_title)}
                    </CenteredText>
                    <BuildScheduleForm
                        schedule={props.schedule}
                        onSubmit={handleSubmit}
                    />
                    {/* <MonthView
                    date={date}
                    setdate={setDate}
                    hint="* 예약내용을 변경할 날짜를 선택하세요."
                /> */}
                </Box>
            </Container>
        </>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    const { id } = context.query;
    // console.log('... re-rendered...');
    if (session && id) {
        const client = await connectMongo();
        const schedule = await getSchedule(client, id as string);
        await client.close();
        return {
            props: {
                schedule: schedule,
            },
        };
    }
    return {
        props: {},
    };
};

export default UpdateSchedulePage;
