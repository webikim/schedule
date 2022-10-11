import React, { Children, useContext, useState } from 'react';
import MonthView from '../calendar/MonthView';
import {
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { Schedule } from '../../lib/dao/schedule-dao';
import { Delete, Edit } from '@mui/icons-material';
import NotificationContext from '../../store/notification-context';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

import { getString } from '../locale/stringUtil';
import AlertBox from '../layout/AlertBox';

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
        ask_delete: {
            en: 'Do you really want to delete ?',
            kr: '삭제하시겠습니까?',
        },
    },
    label: {
        yes: {
            en: 'Yes',
            kr: '예',
        },
        no: {
            en: 'No',
            kr: '아니오',
        },
    },
};

interface Props {
    schedules: Schedule[];
    update: React.Dispatch<React.SetStateAction<Schedule[]>>;
}

const ManageSchedule = (props: Props) => {
    const [alert, setAlert] = useState(false);
    const [candidate, setCandidate] = useState(-1);
    const router = useRouter();
    const notificationCtx = useContext(NotificationContext);
    const { schedules, update } = props;

    if (!schedules || (schedules && schedules.length === 0)) {
        return (
            <Typography>
                {getString(locale, strings.message.no_schedule)}
            </Typography>
        );
    }

    const list: JSX.Element[] = [];
    const handleClickSchedule =
        (index: number) => (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            router.replace(
                '/schedule/status/' +
                    schedules[index].id +
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
            router.replace('/schedule/manage/' + schedules[index].id);
        };
    const handleClickDelete =
        (index: number) =>
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setCandidate(index);
            setAlert(true);
        };
    const handleClose = (choice: number) => async () => {
        if (choice === 0) {
            const response = await fetch(
                '/api/schedule/' + schedules[candidate].id,
                {
                    method: 'DELETE',
                }
            );
            console.log('delete clicked ', response);
            schedules.splice(candidate, 1);
            update([...schedules]);
            notificationCtx.showNotification({
                message: getString(locale, strings.message.deleted),
                status: 'success',
            });
        }
        setAlert(false);
    };
    schedules.map((each, index) => {
        list.push(
            <>
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
                <AlertBox
                    title=""
                    answers={[
                        getString(locale, strings.label.yes),
                        getString(locale, strings.label.no),
                    ]}
                    content={getString(locale, strings.message.no_schedule)}
                    open={alert}
                    onClose={handleClose}
                ></AlertBox>
            </>
        );
    });
    return <>{Children.toArray(list)}</>;

    // return (
    //     <>
    //         {renderScheduleList(
    //             props.schedules,
    //             props.update,
    //             router,
    //             notificationCtx
    //         )}
    //         {/* <MonthView
    //                 date={date}
    //                 setdate={setDate}
    //                 hint="* 예약내용을 변경할 날짜를 선택하세요."
    //             /> */}
    //     </>
    // );
};

export default ManageSchedule;
