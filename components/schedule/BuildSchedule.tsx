import { Box, styled, Typography, TypographyProps } from '@mui/material';
import React, { useContext } from 'react';
import NotificationContext from '../../store/notification-context';
import BuildScheduleForm from './BuildScheduleForm';

import { getString } from '../locale/stringUtil';

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

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    fontWeight: '700',
}));

interface Props {}

const BuildSchedule = (props: Props) => {
    const notificationCtx = useContext(NotificationContext);
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
                message: getString(locale, strings.message.fail),
                status: 'error',
            });
            console.log('Schedule create failed.');
            return;
        }
        console.log('success ', await response.json());
        notificationCtx.showNotification({
            message: getString(locale, strings.message.success),
            status: 'success',
        });
    };

    return (
        <>
            <Box>
                <CenteredText sx={{ fontSize: 20 }}>
                    {getString(locale, strings.label.new_schedule)}
                </CenteredText>
                <BuildScheduleForm onSubmit={handleSubmit} />
            </Box>
        </>
    );
};

export default BuildSchedule;
