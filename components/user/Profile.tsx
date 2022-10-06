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
import React, { useContext } from 'react';
import NotificationContext from '../../store/notification-context';

import { getString } from '../locale/stringUtil';

const locale = 'en';

const strings = {
    message: {
        update_failed: {
            en: 'Could not update profile.',
            kr: '내 정보를 수정할수 없습니다.',
        },
        update_success: {
            en: 'Updated profile successfully.',
            kr: '정보가 수정되었습니다.',
        },
    },
    label: {
        profile_title: {
            en: 'Update Profile',
            kr: '내 정보 수정',
        },
        fullname: {
            en: 'Full name',
            kr: '이름',
        },
        contact: {
            en: 'Contact',
            kr: '연락처',
        },
        bio: {
            en: 'Biography',
            kr: '특이사항',
        },
        update_button: {
            en: 'Update Profile',
            kr: '정보 수정하기',
        },
    },
};

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
    const notificationCtx = useContext(NotificationContext);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const fullname = data.get('fullname');
        const contact = data.get('contact');
        const bio = data.get('bio');

        console.log(
            'fullname = ',
            fullname,
            ', contact = ',
            contact,
            ', bio = ',
            bio
        );

        const response = await fetch('/api/user/' + props.email, {
            method: 'PATCH',
            body: JSON.stringify({
                email: props.email,
                fullname: fullname,
                contact: contact,
                bio: bio,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            notificationCtx.showNotification({
                message: getString(locale, strings.message.update_failed),
                status: 'error',
            });
            console.log('Schedule create failed.');
            return;
        }
        console.log('success ', await response.json());
        notificationCtx.showNotification({
            message: getString(locale, strings.message.update_success),
            status: 'success',
        });
    };
    return (
        <>
            <Container component="main" maxWidth="xs">
                <CenteredText sx={{ fontSize: 20 }}>
                    {getString(locale, strings.label.profile_title)}
                </CenteredText>
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
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <InputField
                        required
                        fullWidth
                        id="fullname"
                        name="fullname"
                        label={getString(locale, strings.label.fullname)}
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
                        label={getString(locale, strings.label.contact)}
                        autoComplete="contact"
                        size="small"
                    />
                    <InputField
                        required
                        fullWidth
                        id="bio"
                        name="bio"
                        label={getString(locale, strings.label.bio)}
                        autoComplete="bio"
                        size="small"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {getString(locale, strings.label.update_button)}
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default Profile;
