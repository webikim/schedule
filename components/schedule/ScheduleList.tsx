import {
    Container,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Children } from 'react';
import { Schedule } from '../../lib/dao/schedule-dao';

interface Props {
    schedules: Schedule[];
}

const ScheduleList = (props: Props) => {
    const { schedules } = props;
    const router = useRouter();
    if (!schedules || (schedules && schedules.length === 0)) {
        return <Typography>먼저 예약을 만드세요.</Typography>;
    }

    const scheduleList: JSX.Element[] = [];
    const handleClickSchedule =
        (index: number) => (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            console.log('item clicked');
            router.replace(
                '/schedule/status/' +
                    schedules[index].id +
                    '?back=/schedule/status'
            );
        };
    schedules.map((each, index) => {
        scheduleList.push(
            <ListItem
                component="div"
                disablePadding
                sx={{ borderBottom: 'lightgray 1px solid' }}
            >
                <ListItemButton
                    sx={{ height: '2.5em' }}
                    onClick={handleClickSchedule(index)}
                >
                    <ListItemText
                        primary={each.title}
                        primaryTypographyProps={{
                            fontWeight: 'medium',
                        }}
                    />
                </ListItemButton>
            </ListItem>
        );
    });
    return <>{Children.toArray(scheduleList)}</>;
};

export default ScheduleList;
