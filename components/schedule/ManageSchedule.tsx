import React, { Children, useContext } from 'react';
import MonthView from '../calendar/MonthView';
import {
    Container,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';
import { Schedule } from '../../lib/dao/schedule-dao';
import { Delete, Edit } from '@mui/icons-material';
import NotificationContext, {
    NotificationContextInterface,
} from '../../store/notification-context';
import { NextRouter, useRouter } from 'next/router';
import dayjs from 'dayjs';

import { getString } from '../locale/stringUtil';

const locale = 'en';

const strings = {
    message: {
        no_schedule: {
            en: 'Need to create schedule.',
            kr: '먼저 예약을 만드세요.',
        },
        deleted: {
            en: 'Schedule is deleted.',
            kr: '예약작업이 삭제되었습니다.',
        },
    },
    label: {},
};

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    fontWeight: '700',
}));

const renderScheduleList = (
    data: Schedule[],
    update: React.Dispatch<React.SetStateAction<Schedule[]>>,
    router: NextRouter,
    notificationCtx: NotificationContextInterface
) => {
    if (!data || (data && data.length === 0)) {
        return (
            <Typography>
                {getString(locale, strings.message.no_schedule)}
            </Typography>
        );
    }

    const schedules: JSX.Element[] = [];
    const handleClickSchedule =
        (index: number) => (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            router.replace(
                '/schedule/status/' +
                    data[index].id +
                    '/' +
                    dayjs()
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .millisecond(0)
                        .toDate()
                        .toISOString() +
                    '?back=/schedule/manage/'
            );
        };
    const handleClickEdit =
        (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            router.replace('/schedule/manage/' + data[index].id);
        };
    const handleClickDelete =
        (index: number) =>
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            const response = await fetch('/api/schedule/' + data[index].id, {
                method: 'DELETE',
            });
            console.log('delete clicked ', response);
            data.splice(index, 1);
            update([...data]);
            notificationCtx.showNotification({
                message: getString(locale, strings.message.deleted),
                status: 'success',
            });
        };
    data.map((each, index) => {
        schedules.push(
            <ListItem
                component="div"
                disablePadding
                sx={{ borderBottom: 'lightgray 1px solid' }}
            >
                <ListItemButton
                    sx={{ height: '2em' }}
                    onClick={handleClickSchedule(index)}
                >
                    <ListItemText
                        primary={each.title}
                        primaryTypographyProps={{
                            fontWeight: 'medium',
                        }}
                    />
                </ListItemButton>
                <IconButton onClick={handleClickEdit(index)}>
                    <Edit />
                </IconButton>
                <IconButton onClick={handleClickDelete(index)}>
                    <Delete />
                </IconButton>
            </ListItem>
        );
    });
    return <>{Children.toArray(schedules)}</>;
};

interface Props {
    schedules: Schedule[];
    update: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

const ManageSchedule = (props: Props) => {
    const router = useRouter();
    const notificationCtx = useContext(NotificationContext);

    return (
        <>
            {renderScheduleList(
                props.schedules,
                props.update,
                router,
                notificationCtx
            )}
            {/* <MonthView
                    date={date}
                    setdate={setDate}
                    hint="* 예약내용을 변경할 날짜를 선택하세요."
                /> */}
        </>
    );
};

export default ManageSchedule;
