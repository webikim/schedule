import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Grid,
    Link,
    TextField,
    Typography,
} from '@mui/material';
import React, { useContext } from 'react';
import { signIn } from 'next-auth/react';
import NotificationContext from '../../store/notification-context';
import { useRouter } from 'next/router';

import { getString } from '../locale/stringUtil';

const locale = 'en';

const strings = {
    message: {
        login_failed: {
            en: 'Could not sign in.',
            kr: '로그인에 실패했습니다.',
        },
        login_success: {
            en: 'Signed in successful.',
            kr: '로그인 되었습니다.',
        },
    },
    label: {
        login_title: {
            en: 'Login',
            kr: '로그린',
        },
        email: {
            en: 'eMail',
            kr: '이메일',
        },
        password: {
            en: 'Password',
            kr: '암호',
        },
        stay_connected: {
            en: 'Stay Connected',
            kr: '로그인 상태 유지',
        },
        to_signup: {
            en: 'Let me Sign Up',
            kr: '가입화면으로',
        },
    },
};

interface Props {
    setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignIn = (props: Props) => {
    const notificationCtx = useContext(NotificationContext);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        const response = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
        });

        if (!response!.ok) {
            notificationCtx.showNotification({
                message: getString(locale, strings.message.login_failed),
                status: 'error',
            });

            return;
        }

        router.replace('/');

        notificationCtx.showNotification({
            message: getString(locale, strings.message.login_success),
            status: 'success',
        });
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
                        {getString(locale, strings.label.login_title)}
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            label={getString(locale, strings.label.email)}
                            size="small"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            name="password"
                            label={getString(locale, strings.label.password)}
                            size="small"
                            type="password"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox value="remember" color="primary" />
                            }
                            label={getString(
                                locale,
                                strings.label.stay_connected
                            )}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {getString(locale, strings.label.login_title)}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            {/* <Grid item xs>
                                <Link href="#" variant="body2" onClick={ openForgot }>
                                    Forgot password?
                                </Link>
                            </Grid> */}
                            <Grid item>
                                <Link
                                    href="#"
                                    variant="body2"
                                    onClick={() => props.setLogin(false)}
                                >
                                    {getString(locale, strings.label.to_signup)}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default SignIn;
