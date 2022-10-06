import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import NotificationContext from '../../store/notification-context';

import { getString } from '../locale/stringUtil';

const locale = 'en';

const strings = {
    message: {
        signup_failed: {
            en: 'Could not sign up.',
            kr: '가입에 실패했습니다.',
        },
        exist: {
            en: 'Same email already exists.',
            kr: '같은 이메일로 이미 가입되었습니다.',
        },
        signup_success: {
            en: 'Signed up successfully.',
            kr: '가입되었습니다.',
        },
    },
    label: {
        signup_title: {
            en: 'Sign Up',
            kr: '간편가입',
        },
        fullname: {
            en: 'Full name',
            kr: '이름',
        },
        email: {
            en: 'eMail',
            kr: '이메일',
        },
        password: {
            en: 'Password',
            kr: '암호',
        },
        signup_button: {
            en: 'Join in',
            kr: '가입하기',
        },
        to_signin: {
            en: 'Go back to Sign In',
            kr: '로그인화면으로',
        },
    },
};

interface Props {
    setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUp = (props: Props) => {
    const notificationCtx = useContext(NotificationContext);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            fullname: data.get('fullname'),
            email: data.get('email'),
            password: data.get('password'),
        });
        const fullname = data.get('fullname');
        const email = data.get('email');
        const password = data.get('password');

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                fullname: fullname,
                email: email,
                password: password,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            let message = getString(locale, strings.message.signup_failed);
            if (response.status === 422) {
                message = getString(locale, strings.message.exist);
            }
            notificationCtx.showNotification({
                message: message,
                status: 'error',
            });
            return;
        }

        notificationCtx.showNotification({
            message: getString(locale, strings.message.signup_success),
            status: 'success',
        });
        props.setLogin(true);
        console.log('success ', await response.json());
    };
    return (
        <>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        {getString(locale, strings.label.signup_title)}
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="fullname"
                                    name="fullname"
                                    id="fullname"
                                    label={getString(
                                        locale,
                                        strings.label.fullname
                                    )}
                                    size="small"
                                    required
                                    fullWidth
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label={getString(
                                        locale,
                                        strings.label.email
                                    )}
                                    size="small"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    type="password"
                                    id="password"
                                    label={getString(
                                        locale,
                                        strings.label.password
                                    )}
                                    size="small"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {getString(locale, strings.label.signup_button)}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link
                                    href="#"
                                    variant="body2"
                                    onClick={() => props.setLogin(true)}
                                >
                                    {getString(locale, strings.label.to_signin)}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default SignUp;
