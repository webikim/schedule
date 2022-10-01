import {
    Avatar,
    Box,
    Container,
    Grid,
    GridProps,
    styled,
    TextField,
    TextFieldProps,
    Typography,
    TypographyProps,
} from '@mui/material';
import React from 'react';

const LabelText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'right',
    paddingRight: '2em',
}));

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
}));

interface Props {
    email: string;
}

export default function Password(props: Props) {
    return (
        <>
            <Container component="main" maxWidth="xs">
                <CenteredText sx={{ fontSize: 20 }}>암호 변경</CenteredText>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '1em',
                    }}
                >
                    <Avatar>N</Avatar>
                </Box>
                <CenteredText fontWeight={700}>{props.email}</CenteredText>

                <InputField
                    required
                    fullWidth
                    id="oldpassword"
                    name="oldpassword"
                    label="현재암호"
                    type="password"
                    size="small"
                />
                <InputField
                    required
                    fullWidth
                    id="newpassword"
                    name="newpassword"
                    label="새 암호"
                    type="password"
                    size="small"
                />
                <InputField
                    required
                    fullWidth
                    id="repassword"
                    name="repassword"
                    label="암호확인"
                    type="password"
                    size="small"
                />
            </Container>
        </>
    );
}
