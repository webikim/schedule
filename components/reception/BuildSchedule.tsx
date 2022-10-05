import {
    Box,
    Button,
    Container,
    styled,
    TextField,
    TextFieldProps,
    Typography,
    TypographyProps,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import React, { Dispatch, useContext, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react';
import NotificationContext from '../../store/notification-context';

const CenteredText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    fontWeight: '700',
}));

const InputField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    marginBottom: '1em',
    width: '100%',
}));

interface Props {}

const BuildSchedule = () => {
    const notificationCtx = useContext(NotificationContext);
    const [datefrom, setDatefrom] = useState<Dayjs>(
        dayjs().hour(0).minute(0).second(0)
    );
    const [dateto, setDateto] = useState<Dayjs>(
        dayjs().hour(0).minute(0).second(0)
    );
    const [timefrom, setTimefrom] = useState<Dayjs>(
        dayjs(new Date('2000-01-01T09:00:00'))
    );
    const [timeto, setTimeto] = useState<Dayjs>(
        dayjs(new Date('2000-01-01T22:00:00'))
    );
    const { data } = useSession();

    const handleChange =
        (setter: Dispatch<React.SetStateAction<Dayjs>>) =>
        (date: Dayjs | null) => {
            console.log('date = ', date);
            if (date) {
                setter(date);
            }
        };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formdata = new FormData(event.currentTarget);

        const title = formdata.get('title');
        const desc = formdata.get('desc');
        const contact = formdata.get('contact');
        const response = await fetch('/api/schedule', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                desc: desc,
                contact: contact,
                datefrom: datefrom.toDate(),
                dateto: dateto.toDate(),
                timefrom: timefrom.toDate(),
                timeto: timeto.toDate(),
                createdby: data?.user?.email,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            notificationCtx.showNotification({
                message: '예약작업이 생성되지 않았습니다.',
                status: 'error',
            });
            console.log('Schedule create failed.');
            return;
        }
        console.log('success ', await response.json());
        notificationCtx.showNotification({
            message: '새로운 예약작업이 생성되었습니다.',
            status: 'success',
        });
    };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Container component="main" maxWidth="xs">
                    <CenteredText sx={{ fontSize: 20 }}>
                        예약 만들기
                    </CenteredText>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <InputField
                            required
                            fullWidth
                            id="title"
                            name="title"
                            label="제목"
                            autoFocus
                            size="small"
                        />
                        <InputField
                            required
                            fullWidth
                            id="desc"
                            name="desc"
                            label="설명"
                            size="small"
                            multiline
                            minRows={4}
                        />
                        <InputField
                            required
                            fullWidth
                            id="contact"
                            name="contact"
                            label="연락처"
                            autoComplete="contact"
                            size="small"
                        />

                        <Box sx={{ display: 'flex' }}>
                            <DesktopDatePicker
                                label="시작일"
                                inputFormat="MM/DD/YYYY"
                                value={datefrom}
                                onChange={handleChange(setDatefrom)}
                                renderInput={(params) => (
                                    <InputField {...params} size="small" />
                                )}
                            />
                            <RemoveIcon
                                sx={{ paddingTop: '0.5em' }}
                            ></RemoveIcon>
                            <DesktopDatePicker
                                label="종료일"
                                inputFormat="MM/DD/YYYY"
                                value={dateto}
                                onChange={handleChange(setDateto)}
                                renderInput={(params) => (
                                    <InputField {...params} size="small" />
                                )}
                            />
                        </Box>

                        <Box sx={{ display: 'flex' }}>
                            <TimePicker
                                label="시작시간"
                                value={timefrom}
                                onChange={handleChange(setTimefrom)}
                                renderInput={(params) => (
                                    <InputField {...params} size="small" />
                                )}
                            />
                            <RemoveIcon
                                sx={{ paddingTop: '0.5em' }}
                            ></RemoveIcon>
                            <TimePicker
                                label="종료시간"
                                value={timeto}
                                onChange={handleChange(setTimeto)}
                                renderInput={(params) => (
                                    <InputField {...params} size="small" />
                                )}
                            />
                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            만들기
                        </Button>
                    </Box>
                </Container>
            </LocalizationProvider>
        </>
    );
};

export default BuildSchedule;
