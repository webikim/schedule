import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { getUserByEmail } from '../../lib/auth/auth-dao';
import { connectMongo } from '../../lib/mongo-helper';
import Profile from '../../components/user/Profile';
import Password from '../../components/user/Password';
import ShopProfile from '../../components/reception/ShopProfile';

interface UserPageProps {
    fullname: string;
    email: string;
}

const UserPage = (props: UserPageProps) => {
    const router = useRouter();
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth');
            }
        });
    });
    console.log('props = ', props);
    const title = props.fullname + '(' + props.email + ')';
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>

            <Grid container sx={{ marginTop: 5 }}>
                <Grid item xs={12}>
                    <Profile fullname={props.fullname} email={props.email} />
                    {/* <Password email={props.email}></Password> */}
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

export default UserPage;
