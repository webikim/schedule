import React, { useState } from 'react';
import moment from 'moment';
import MonthView from '../calendar/MonthView';
import { Container, styled, Typography, TypographyProps } from '@mui/material';

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    fontWeight: '700',
}));

const ManageSchedule = () => {
    const [date, setDate] = useState(new Date());
    let state = {
        events: [
            {
                start: moment().toDate(),
                end: moment().add(1, 'days').toDate(),
                title: 'Some title',
            },
        ],
    };
    return (
        <>
            <Container maxWidth="xs">
                <CenteredText sx={{ fontSize: 20 }}>
                    예약 일정 관리
                </CenteredText>

                <MonthView
                    date={date}
                    setdate={setDate}
                    hint="* 예약내용을 변경할 날짜를 선택하세요."
                />
            </Container>
        </>
    );
};

export default ManageSchedule;
