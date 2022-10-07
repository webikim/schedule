import styled from '@emotion/styled';
import { Typography, TypographyProps } from '@mui/material';

export const CenteredText = styled(Typography)<TypographyProps>(
    ({ theme }) => ({
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    })
);

export const TitleText = styled(CenteredText)<TypographyProps>(({ theme }) => ({
    fontSize: 20,
    marginBottom: '1em',
    fontWeight: '700',
}));

export const LinkText = styled(Typography)<TypographyProps>(({ theme }) => ({
    '&:hover': {
        cursor: 'pointer',
        textDecoration: 'underline',
        textDecorationColor: 'gray',
        fontWeight: 700,
    },
}));
