import React from 'react';
import { ScheduleShort } from '../../pages/reserve/register';

interface Props {
    schedules: ScheduleShort;
}

const SearchSchedule = (props: Props) => {
    console.log('... schedule = ', props.schedules);
    return <div>SearchSchedule</div>;
};

export default SearchSchedule;
