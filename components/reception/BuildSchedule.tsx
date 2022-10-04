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
import React, { Dispatch, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

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
    const [datefrom, setDatefrom] = useState(new Date());
    const [dateto, setDateto] = useState(new Date());
    const [timefrom, setTimefrom] = useState(new Date('2000-01-01T09:00:00'));
    const [timeto, setTimeto] = useState(new Date('2000-01-01T22:00:00'));

    const handleChange =
        (setter: Dispatch<React.SetStateAction<Date>>) =>
        (fromdate: Date | null) => {
            if (fromdate) {
                setDatefrom(fromdate);
            }
        };
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Container component="main" maxWidth="xs">
                    <CenteredText sx={{ fontSize: 20 }}>
                        예약 만들기
                    </CenteredText>
                    <InputField
                        required
                        fullWidth
                        id="fullname"
                        name="fullname"
                        label="제목"
                        autoComplete="fullname"
                        autoFocus
                        size="small"
                    />
                    <InputField
                        required
                        fullWidth
                        id="bio"
                        name="bio"
                        label="설명"
                        autoComplete="bio"
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
                        <RemoveIcon sx={{ paddingTop: '0.5em' }}></RemoveIcon>
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
                        <RemoveIcon sx={{ paddingTop: '0.5em' }}></RemoveIcon>
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
                </Container>
            </LocalizationProvider>
        </>
    );
};

export default BuildSchedule;
