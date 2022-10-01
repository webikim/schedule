import { Container } from '@mui/material';
import React, { useState } from 'react';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

interface Props {}

const Auth = (props: Props) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
            <Container sx={{ marginTop: 5 }}>
                {isLogin ? (
                    <SignIn setLogin={setIsLogin} />
                ) : (
                    <SignUp setLogin={setIsLogin} />
                )}
            </Container>
        </>
    );
};

export default Auth;
