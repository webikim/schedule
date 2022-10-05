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
            let message = '가입에 실패하였습니다.';
            if (response.status === 422) {
                message = '같은 이메일로 이미 가입되었습니다.';
            }
            notificationCtx.showNotification({
                message: message,
                status: 'error',
            });
            return;
        }

        notificationCtx.showNotification({
            message: '가입되었습니다.',
            status: 'success',
        });
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
                        간편가입
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
                                    label="이름"
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
                                    label="이메일"
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
                                    label="암호"
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
                            가입하기
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link
                                    href="#"
                                    variant="body2"
                                    onClick={() => props.setLogin(true)}
                                >
                                    로그인 화면으로
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
