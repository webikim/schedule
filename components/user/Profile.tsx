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

interface Props {
    photo?: string;
    fullname: string;
    email: string;
    contact?: string;
    bio?: string;
}

const Profile = (props: Props) => {
    return (
        <>
            <Container component="main" maxWidth="xs">
                <CenteredText sx={{ fontSize: 20 }}>내 정보 수정</CenteredText>
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
                    id="fullname"
                    name="fullname"
                    label="이름"
                    autoComplete="fullname"
                    autoFocus
                    defaultValue={props.fullname}
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
                    label="특이사항"
                    autoComplete="bio"
                    size="small"
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

export default Profile;
