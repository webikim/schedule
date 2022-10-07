import {
    Box,
    Container,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { NextRouter, useRouter } from 'next/router';
import React, { Children } from 'react';
import { Schedule } from '../../lib/dao/schedule-dao';
import { ScheduleShort } from '../../pages/reserve/register';

import { getString } from '../locale/stringUtil';

const locale = 'en';

const strings = {
    message: {},
    label: {},
};

const renderScheduleList = (data: ScheduleShort[], router: NextRouter) => {
    if (!data || (data && data.length === 0)) {
        return <Typography></Typography>;
    }

    const schedules: JSX.Element[] = [];
    const handleClickSchedule =
        (index: number) => (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault();
            console.log('item clicked');
            router.replace(
                '/reserve/register/' +
                    data[index].id +
                    '?back=/reserve/register/'
            );
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
            </ListItem>
        );
    });
    return <>{Children.toArray(schedules)}</>;
};

interface Props {
    schedules: ScheduleShort[];
}

const SearchSchedule = (props: Props) => {
    const router = useRouter();
    console.log('... schedule = ', props.schedules);
    return renderScheduleList(props.schedules, router);
};

export default SearchSchedule;
