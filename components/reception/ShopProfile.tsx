import {
    Avatar,
    Box,
    Button,
    Container,
    styled,
    TextField,
    TextFieldProps,
    Typography,
    TypographyProps,
} from '@mui/material';
import React from 'react';

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

interface Props {}

const ShopProfile = (props: Props) => {
    return (
        <>
            <Container component="main" maxWidth="xs">
                <CenteredText sx={{ fontSize: 20 }}>
                    예약 가게 등록
                </CenteredText>
                <InputField
                    required
                    fullWidth
                    id="fullname"
                    name="fullname"
                    label="상호"
                    autoComplete="fullname"
                    autoFocus
                    size="small"
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
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    정보 수정하기
                </Button>
            </Container>
        </>
    );
};

export default ShopProfile;
