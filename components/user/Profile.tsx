import {
    Button,
    Grid,
    GridProps,
    styled,
    TextField,
    Typography,
    TypographyProps,
} from '@mui/material';
import React from 'react';

interface ProfileProps {
    photo?: string;
    fullname: string;
    email: string;
    contact?: string;
    bio?: string;
}

const LabelText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'right',
    paddingRight: '2em',
}));

const HeaderText = styled(Typography)<TypographyProps>(({ theme }) => ({
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1em',
    fontWeight: '700',
    fontSize: 20,
}));

const GridItem = styled(Grid)<GridProps>(({ theme }) => ({
    marginBottom: '1em',
}));

const Profile = (props: ProfileProps) => {
    return (
        <>
            <Grid container>
                <Grid item xs={12} sx={{ marginBottom: '1em' }}>
                    <HeaderText>내 정보 수정</HeaderText>
                </Grid>
                <GridItem item xs={2}>
                    <LabelText>이메일</LabelText>
                </GridItem>
                <GridItem item xs={10}>
                    <Typography fontWeight={700}>{props.email}</Typography>
                </GridItem>
                <GridItem item xs={2}>
                    <LabelText>이름</LabelText>
                </GridItem>
                <GridItem item xs={10}>
                    <TextField
                        required
                        fullWidth
                        id="fullname"
                        name="fullname"
                        autoComplete="fullname"
                        autoFocus
                        defaultValue={props.fullname}
                        size="small"
                    />
                </GridItem>
                <GridItem item xs={2}>
                    <LabelText>연락처</LabelText>
                </GridItem>
                <GridItem item xs={10}>
                    <TextField
                        required
                        fullWidth
                        id="contact"
                        name="contact"
                        autoComplete="contact"
                        size="small"
                    />
                </GridItem>
                <GridItem item xs={2}>
                    <LabelText>특이사항</LabelText>
                </GridItem>
                <GridItem item xs={10}>
                    <TextField
                        required
                        fullWidth
                        id="bio"
                        name="bio"
                        autoComplete="bio"
                        size="small"
                    />
                </GridItem>
                <GridItem item xs={2}></GridItem>
                <Grid item xs={10}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Update profile
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default Profile;
