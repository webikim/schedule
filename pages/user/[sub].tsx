import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import { getUserByEmail } from '../../lib/dao/user-dao';
import { connectMongo } from '../../lib/mongo-helper';
import Profile from '../../components/user/Profile';
import Password from '../../components/user/Password';

interface Props {
    fullname: string;
    email: string;
}

const UserSubPage = (props: Props) => {
    const router = useRouter();
    const { sub } = router.query;
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth');
            }
        });
    });
    const title = props.fullname + '(' + props.email + ')';
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Grid container sx={{ marginTop: 5 }}>
                <Grid item xs={12}>
                    {sub === 'profile' && (
                        <Profile
                            fullname={props.fullname}
                            email={props.email}
                        />
                    )}
                    {sub === 'password' && (
                        <Password email={props.email}></Password>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    if (session) {
        const client = await connectMongo();
        console.log('user = ', session.user);
        const dbuser = await getUserByEmail(client, session.user!.email!);
        console.log('dbuser = ', dbuser);
        if (dbuser) {
            return {
                props: {
                    fullname: dbuser.fullname,
                    email: dbuser.email,
                },
            };
        }
    }
    return {
        props: {},
    };
};

export default UserSubPage;
