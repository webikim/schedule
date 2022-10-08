import React from 'react';
import WeekView from '../calendar/WeekView';

interface Props {}

const scheduleConfig = {
    start: 7,
    end: 22,
    slotsPerHour: 2,
};

const RegisterSchedule = (props: Props) => {
    return (
        <>{/* <WeekView {...scheduleConfig} date={new Date()}></WeekView> */}</>
    );
};

export default RegisterSchedule;
