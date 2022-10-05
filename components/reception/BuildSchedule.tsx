import { Box, styled, Typography, TypographyProps } from '@mui/material';
import React, { useContext } from 'react';
import NotificationContext from '../../store/notification-context';
import BuildScheduleForm from './BuildScheduleForm';

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
                message: '새로운 예약작업을 만들수 없습니다.',
                status: 'error',
            });
            console.log('Schedule create failed.');
            return;
        }
        console.log('success ', await response.json());
        notificationCtx.showNotification({
            message: '새로운 예약작업이 생성되었습니다.',
            status: 'success',
        });
    };

    return (
        <>
            <Box>
                <CenteredText sx={{ fontSize: 20 }}>예약 만들기</CenteredText>
                <BuildScheduleForm onSubmit={handleSubmit} />
            </Box>
        </>
    );
};

export default BuildSchedule;
