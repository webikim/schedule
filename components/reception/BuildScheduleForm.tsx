import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    styled,
    TextField,
    TextFieldProps,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import React, { Dispatch, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react';
import { Schedule } from '../../lib/dao/schedule-dao';

const InputField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    marginBottom: '1em',
    width: '100%',
}));

interface Props {
    schedule?: Schedule;
    onSubmit: (jsonData: string) => void;
}

const BuildScheduleForm = (props: Props) => {
    const { schedule } = props;
    const [datefrom, setDatefrom] = useState<Dayjs>(
        schedule && schedule.datefrom
            ? dayjs(schedule.datefrom)
            : dayjs().hour(0).minute(0).second(0)
    );
    const [dateto, setDateto] = useState<Dayjs>(
        schedule && schedule.dateto
            ? dayjs(schedule.dateto)
            : dayjs().hour(0).minute(0).second(0)
    );
    const [timefrom, setTimefrom] = useState<Dayjs>(
        schedule && schedule.timefrom
            ? dayjs(schedule.timefrom)
            : dayjs(new Date('2000-01-01T09:00:00'))
    );
    const [timeto, setTimeto] = useState<Dayjs>(
        schedule && schedule.timeto
            ? dayjs(schedule.timeto)
            : dayjs(new Date('2000-01-01T22:00:00'))
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formdata = new FormData(event.currentTarget);

        const title = formdata.get('title');
        const desc = formdata.get('desc');
        const contact = formdata.get('contact');

        props.onSubmit(
            JSON.stringify({
                title: title,
                desc: desc,
                contact: contact,
                datefrom: datefrom.toDate(),
                dateto: dateto.toDate(),
                timefrom: timefrom.toDate(),
                timeto: timeto.toDate(),
                createdby: data?.user?.email,
                slots: formdata.get('slots'),
            })
        );
    };

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Container component="main" maxWidth="xs">
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
                            defaultValue={schedule && schedule.title}
                            size="small"
                        />
                        <InputField
                            required
                            fullWidth
                            id="desc"
                            name="desc"
                            label="설명"
                            defaultValue={schedule && schedule.desc}
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
                            defaultValue={schedule && schedule.contact}
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
                        <FormControl>
                            <FormLabel id="slots-per-hour">시간간격</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="slots-per-hour"
                                name="slots"
                                defaultValue={schedule ? schedule.slots : '2'}
                            >
                                <FormControlLabel
                                    value="1"
                                    control={<Radio />}
                                    label="1시간 간격"
                                />
                                <FormControlLabel
                                    value="2"
                                    control={<Radio />}
                                    label="30분 간격"
                                />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {schedule ? '수정하기' : '만들기'}
                        </Button>
                    </Box>
                </Container>
            </LocalizationProvider>
        </>
    );
};

export default BuildScheduleForm;
