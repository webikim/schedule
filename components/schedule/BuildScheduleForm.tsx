import {
    Avatar,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    Radio,
    RadioGroup,
    styled,
    TextField,
    TextFieldProps,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import React, {
    createRef,
    Dispatch,
    useContext,
    useRef,
    useState,
} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useSession } from 'next-auth/react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { Schedule } from '../../lib/dao/schedule-dao';
import LocaleContext from '../../store/localeContext';

import { getString } from '../locale/stringUtil';

const locale = 'en';

const strings = {
    message: {},
    label: {
        title: {
            en: 'Title',
            kr: '제목',
        },
        desc: {
            en: 'Description',
            kr: '설명',
        },
        contact: {
            en: 'Contact',
            kr: '연락처',
        },
        fromdate: {
            en: 'From Date',
            kr: '시작일',
        },
        todate: {
            en: 'To Date',
            kr: '종료일',
        },
        starttime: {
            en: 'Start Time',
            kr: '시작시간',
        },
        endtime: {
            en: 'End Time',
            kr: '종료시간',
        },
        duration: {
            en: 'Duration',
            kr: '시간간격',
        },
        hour: {
            en: '1 Hour',
            kr: '1시간 간격',
        },
        halfhour: {
            en: '30 Min',
            kr: '30분 간격',
        },
        create: {
            en: 'Build Schedule',
            kr: '만들기',
        },
        update: {
            en: 'Update Schedule',
            kr: '수정하기',
        },
    },
};

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
    const filePickerRef = useRef<HTMLInputElement>(null);
    const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
    const localeCtx = useContext(LocaleContext);
    const lang = localeCtx.locale ? localeCtx.locale.lang : 'en';

    const [datefrom, setDatefrom] = useState<Dayjs>(
        schedule && schedule.datefrom
            ? dayjs(schedule.datefrom)
            : dayjs().hour(0).minute(0).second(0).millisecond(0)
    );
    const [dateto, setDateto] = useState<Dayjs>(
        schedule && schedule.dateto
            ? dayjs(schedule.dateto)
            : dayjs().hour(0).minute(0).second(0).millisecond(0)
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

    const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event);
        const reader = new FileReader();
        if (event.target.files && event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setAvatar(readerEvent.target!.result);
        };
    };

    const handleChange =
        (setter: Dispatch<React.SetStateAction<Dayjs>>) =>
        (date: Dayjs | null) => {
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
                <Box component="main" maxWidth="xs">
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <IconButton component="label">
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    hidden
                                    onChange={handleChangeAvatar}
                                />
                                {avatar ? (
                                    <Avatar
                                        src={avatar as string}
                                        sx={{ width: '3em', height: '3em' }}
                                    />
                                ) : (
                                    <Avatar
                                        sx={{ width: '3em', height: '3em' }}
                                    >
                                        <CalendarTodayIcon />
                                    </Avatar>
                                )}
                            </IconButton>
                        </Box>
                        <InputField
                            required
                            fullWidth
                            id="title"
                            name="title"
                            label={getString(lang, strings.label.title)}
                            autoFocus
                            defaultValue={schedule && schedule.title}
                            size="small"
                        />
                        <InputField
                            required
                            fullWidth
                            id="desc"
                            name="desc"
                            label={getString(lang, strings.label.desc)}
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
                            label={getString(lang, strings.label.contact)}
                            defaultValue={schedule && schedule.contact}
                            size="small"
                        />

                        <Box sx={{ display: 'flex' }}>
                            <DesktopDatePicker
                                label={getString(lang, strings.label.fromdate)}
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
                                label={getString(lang, strings.label.todate)}
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
                                label={getString(lang, strings.label.starttime)}
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
                                label={getString(lang, strings.label.endtime)}
                                value={timeto}
                                onChange={handleChange(setTimeto)}
                                renderInput={(params) => (
                                    <InputField {...params} size="small" />
                                )}
                            />
                        </Box>
                        <FormControl>
                            <FormLabel id="slots-per-hour">
                                {getString(lang, strings.label.duration)}
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="slots-per-hour"
                                name="slots"
                                defaultValue={schedule ? schedule.slots : '2'}
                            >
                                <FormControlLabel
                                    value="1"
                                    control={<Radio />}
                                    label={getString(lang, strings.label.hour)}
                                />
                                <FormControlLabel
                                    value="2"
                                    control={<Radio />}
                                    label={getString(
                                        lang,
                                        strings.label.halfhour
                                    )}
                                />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {schedule
                                ? getString(lang, strings.label.update)
                                : getString(lang, strings.label.create)}
                        </Button>
                    </Box>
                </Box>
            </LocalizationProvider>
        </>
    );
};

export default BuildScheduleForm;
