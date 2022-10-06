import { Container, styled, Typography, TypographyProps } from '@mui/material';
import React, { useState } from 'react';
import DayScheduleStatus from './DayScheduleStatus';
import ScheduleList from './ScheduleList';

const LIST_VIEW = 0;
const DAY_VIEW = 1;

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
}));

interface Props {
    start: number;
    end: number;
    slotsPerHour: number;
    date: Date;
}

const ScheduleStatus = (props: Props) => {
    const [view, setView] = useState(LIST_VIEW);
    const [date, setDate] = useState(props.date);
    const { start, end, slotsPerHour } = props;
    return (
        <>
            <Container maxWidth="xs">
                <CenteredText sx={{ fontSize: 20, fontWeight: '700' }}>
                    예약 현황
                </CenteredText>
                {view === LIST_VIEW && <ScheduleList schedules={[]} />}
                {view === DAY_VIEW && (
                    <DayScheduleStatus
                        start={start}
                        end={end}
                        slotsPerHour={slotsPerHour}
                        date={date}
                        setDate={setDate}
                    />
                )}
            </Container>
        </>
    );
};

export default ScheduleStatus;
