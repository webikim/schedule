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

import { getString } from '../locale/stringUtil';

const locale = 'en';

const strings = {
    message: {},
    label: {
        profile_title: {
            en: 'Change Password',
            kr: '암호 변경',
        },
        password: {
            en: 'current password',
            kr: '현재암호',
        },
        new_password: {
            en: 'new password',
            kr: '새 암호',
        },
        re_password: {
            en: 'confirm new password',
            kr: '암호확인',
        },
    },
};

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
                    label={getString(locale, strings.label.password)}
                    type="password"
                    size="small"
                />
                <InputField
                    required
                    fullWidth
                    id="newpassword"
                    name="newpassword"
                    label={getString(locale, strings.label.new_password)}
                    type="password"
                    size="small"
                />
                <InputField
                    required
                    fullWidth
                    id="repassword"
                    name="repassword"
                    label={getString(locale, strings.label.re_password)}
                    type="password"
                    size="small"
                />
            </Container>
        </>
    );
}
