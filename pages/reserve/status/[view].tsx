import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react';
import { connectMongo } from '../../../lib/mongo-helper';

interface Props {}

const ReserveStatusView = (props: Props) => {
    return <div>[view]</div>;
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = getSession();
    const { view, back } = context.query;

    if (view && back) {
        const client = await connectMongo();
        await client.close();
    }
    return {
        props: {},
    };
};

export default ReserveStatusView;
