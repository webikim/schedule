import React from 'react';

import path from 'path';
import fs from 'fs/promises';

import Head from 'next/head';

import WeekTable from '../../components/week/WeekTabke';
import { Container } from '@mui/material';

interface WeekProps {
    scheduleConfig: {
        start: number;
        end: number;
        slotsPerHour: number;
    };
}

function Week(props: WeekProps) {
    const { scheduleConfig } = props;
    return (
        <>
            <Head>
                <title>Schedule my works</title>
            </Head>

            <Container sx={{ marginTop: 5 }}>
                <WeekTable {...scheduleConfig} date={new Date()}></WeekTable>
            </Container>
        </>
    );
}

export async function getStaticProps() {
    const dataPath = path.join(process.cwd(), 'config', 'scheduleit.json');
    const jsonData = await fs.readFile(dataPath);
    const data = JSON.parse(jsonData.toString());

    return {
        props: data,
    };
}

export default Week;
