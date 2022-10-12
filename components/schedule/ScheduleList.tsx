import {
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { Children } from 'react';
import Image from 'next/image';
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

    console.log('... schedule list = ', schedules);

    const scheduleList: JSX.Element[] = [];
    schedules.map((each, index) => {
        scheduleList.push(
            <ListItem
                component="div"
                disablePadding
                sx={{ borderBottom: 'lightgray 1px solid' }}
            >
                {each.image && (
                    <div style={{ borderRadius: '5px', overflow: 'hidden' }}>
                        <Image
                            src={process.env.S3URL + each.image}
                            alt={each.title}
                            width={22}
                            height={22}
                        />
                    </div>
                )}
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
