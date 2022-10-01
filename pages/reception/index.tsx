import { Container } from '@mui/material';
import React from 'react';
import ShopProfile from '../../components/reception/ShopProfile';

interface Props {}

const ReceptionPage = (props: Props) => {
    return (
        <>
            <Container sx={{ marginTop: 5 }}>
                <ShopProfile></ShopProfile>
            </Container>
        </>
    );
};

export default ReceptionPage;
