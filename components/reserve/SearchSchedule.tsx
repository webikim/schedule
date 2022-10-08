import { useRouter } from 'next/router';
import React from 'react';
import { ScheduleShort } from '../../pages/reserve/register';

import { getString } from '../locale/stringUtil';
import ScheduleList from '../schedule/ScheduleList';

const locale = 'en';

const strings = {
    message: {
        no_schedule: {
            en: 'Nothing to reserve.',
            kr: '예약 대상이 없습니다.',
        },
    },
    label: {},
};

interface Props {
    schedules: ScheduleShort[];
}

const SearchSchedule = (props: Props) => {
    const { schedules } = props;
    const router = useRouter();
    console.log('... schedule = ', props.schedules);
    const handleClickSchedule =
        (index: number) => (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            console.log('item clicked');
            router.replace(
                '/reserve/register/' +
                    schedules[index].id +
                    '/' +
                    new Date().toISOString() +
                    '?back=/reserve/register/'
            );
        };
    return (
        <>
            <ScheduleList
                schedules={schedules}
                onClick={handleClickSchedule}
                emptymessage={getString(locale, strings.message.no_schedule)}
            />
        </>
    );
};

export default SearchSchedule;
