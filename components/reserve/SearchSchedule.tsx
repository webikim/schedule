import dayjs from 'dayjs';
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
    const handleClickSchedule =
        (index: number) => (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            router.replace(
                '/reserve/register/' +
                    schedules[index].id +
                    '/' +
                    dayjs()
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .millisecond(0)
                        .toDate()
                        .toISOString() +
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
