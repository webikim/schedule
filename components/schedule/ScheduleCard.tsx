import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    IconButton,
    Typography,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import dayjs from 'dayjs';
import { CenteredText } from '../theme/styles';
import { ScheduleShort } from '../../pages/reserve/register';

interface Props {
    schedule: ScheduleShort;
}

const ScheduleCard = ({ schedule }: Props) => {
    console.log('.. schedule = ', schedule);
    return (
        <>
            <Card sx={{ maxWidth: 345, paddingTop: 1 }}>
                <CenteredText sx={{ fontWeight: '700' }}>
                    {schedule.title}
                </CenteredText>
                <Box sx={{ display: 'flex', paddingLeft: 1 }}>
                    <Typography sx={{ fontSize: 'small' }}>
                        {dayjs(schedule.datefrom).format('YYYY.M.D') +
                            '부터 시작'}
                    </Typography>
                </Box>
                {schedule.image ? (
                    <CardMedia
                        component="img"
                        height="194"
                        image={process.env.S3URL + schedule.image}
                        alt={schedule.title}
                        sx={{ borderRadius: '3px' }}
                    />
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '194',
                        }}
                    >
                        <Avatar>{schedule.title.charAt(0)}</Avatar>
                    </Box>
                )}
                <CardContent>
                    <Typography
                        variant="body2"
                        sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                        }}
                    >
                        {schedule.desc}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </>
    );
};

export default ScheduleCard;
