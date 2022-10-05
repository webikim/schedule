import React, { Children, useState } from 'react';
import MonthView from '../calendar/MonthView';
import {
    Box,
    Container,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
    styled,
    Tooltip,
    Typography,
    TypographyProps,
} from '@mui/material';
import { Schedule } from '../../lib/dao/schedule-dao';
import { Delete, Edit } from '@mui/icons-material';

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    fontWeight: '700',
}));

const renderScheduleList = (data: Schedule[]) => {
    if (data && data.length > 0) {
        const schedules: JSX.Element[] = [];
        const handleClickSchedule =
            () => (event: React.MouseEvent<HTMLElement>) => {
                event.preventDefault();
                console.log('item clicked');
            };
        const handleClickEdit =
            () => (event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                console.log('edit clicked');
            };
        const handleClickDelete =
            () => (event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                console.log('delete clicked');
            };
        data.map((each) => {
            schedules.push(
                <ListItem
                    component="div"
                    disablePadding
                    sx={{ borderBottom: 'lightgray 1px solid' }}
                >
                    <ListItemButton
                        sx={{ height: '2em' }}
                        onClick={handleClickSchedule()}
                    >
                        <ListItemText
                            primary={each.title}
                            primaryTypographyProps={{
                                fontWeight: 'medium',
                            }}
                        />
                    </ListItemButton>
                    <IconButton onClick={handleClickEdit()}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={handleClickDelete()}>
                        <Delete />
                    </IconButton>
                </ListItem>
            );
        });
        return <>{Children.toArray(schedules)}</>;
    }
    return <Typography>먼저 예약을 만드세요.</Typography>;
};

interface Props {
    schedules: Schedule[];
}

const ManageSchedule = (props: Props) => {
    const [date, setDate] = useState(new Date());
    return (
        <>
            <Container maxWidth="xs">
                <CenteredText sx={{ fontSize: 20 }}>예약 관리</CenteredText>
                {renderScheduleList(props.schedules)}
                {/* <MonthView
                    date={date}
                    setdate={setDate}
                    hint="* 예약내용을 변경할 날짜를 선택하세요."
                /> */}
            </Container>
        </>
    );
};

export default ManageSchedule;
