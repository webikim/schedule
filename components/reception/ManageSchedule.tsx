import React, { useState } from 'react';
import MonthView from '../calendar/MonthView';
import { Container, styled, Typography, TypographyProps } from '@mui/material';
import { Schedule } from '../../lib/dao/schedule-dao';

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    fontWeight: '700',
}));

interface Props {
    schedules: Schedule[];
}

const ManageSchedule = (props: Props) => {
    const [date, setDate] = useState(new Date());
    return (
        <>
            <Container maxWidth="xs">
                <CenteredText sx={{ fontSize: 20 }}>예약 관리</CenteredText>

                {props.schedules.map((schedule, index) => (
                    <>
                        <Typography key={index}>{schedule.title}</Typography>
                    </>
                ))}
                {/* <MonthView
                    date={date}
                    setdate={setDate}
                    hint="* 예약내용을 변경할 날짜를 선택하세요."
                /> */}
            </Container>
        </>
    );
};

export default ManageSchedule;
