import {
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { Children } from 'react';
import { ScheduleShort } from '../../pages/reserve/register';

interface Props {
    schedules: ScheduleShort[];
    onClick: (index: number) => (event: React.MouseEvent<HTMLElement>) => void;
    emptymessage: string;
}

const ScheduleList = (props: Props) => {
    const { schedules, onClick, emptymessage } = props;
    if (!schedules || (schedules && schedules.length === 0)) {
        return <Typography>{emptymessage}</Typography>;
    }

    const scheduleList: JSX.Element[] = [];
    schedules.map((each, index) => {
        scheduleList.push(
            <ListItem
                component="div"
                disablePadding
                sx={{ borderBottom: 'lightgray 1px solid' }}
            >
                <ListItemButton
                    sx={{ height: '2.5em' }}
                    onClick={onClick(index)}
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
