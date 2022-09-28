import {
    Grid,
    GridProps,
    styled,
    TextField,
    Typography,
    TypographyProps,
} from '@mui/material';
import React from 'react';

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

interface PasswordProps {}

export default function Password(props: PasswordProps) {
    return (
        <>
            <Grid container>
                <Grid item xs={12} sx={{ marginBottom: '1em' }}>
                    <HeaderText>암호 변경</HeaderText>
                </Grid>
                <GridItem item xs={2}>
                    <LabelText>현재암호</LabelText>
                </GridItem>
                <GridItem item xs={10}>
                    <TextField
                        required
                        fullWidth
                        id="oldpassword"
                        name="oldpassword"
                        type="password"
                        size="small"
                    />
                </GridItem>
                <GridItem item xs={2}>
                    <LabelText>새 암호</LabelText>
                </GridItem>
                <GridItem item xs={10}>
                    <TextField
                        required
                        fullWidth
                        id="newpassword"
                        name="newpassword"
                        type="password"
                        size="small"
                    />
                </GridItem>
                <GridItem item xs={2}>
                    <LabelText>암호확인</LabelText>
                </GridItem>
                <GridItem item xs={10}>
                    <TextField
                        required
                        fullWidth
                        id="repassword"
                        name="repassword"
                        type="password"
                        size="small"
                    />
                </GridItem>
            </Grid>
        </>
    );
}
