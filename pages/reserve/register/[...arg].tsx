import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import dayjs from 'dayjs';

import { getSchedule, Schedule } from '../../../lib/dao/schedule-dao';
import { connectMongo } from '../../../lib/mongo-helper';
import { LinkText, TitleText } from '../../../components/theme/styles';
import NotificationContext from '../../../store/notification-context';
import { getWeekReserve, Reserve } from '../../../lib/dao/reserve-dao';
import { filetrPathName } from '../../../components/menu/menuUtil';
import {
    addMinutes,
    convertReserved,
    slot2Minutes,
} from '../../../components/calendar/Hours';
import WeekView from '../../../components/calendar/WeekView';

import { getString } from '../../../components/locale/stringUtil';
import LocaleContext from '../../../store/localeContext';
import AlertBox from '../../../components/layout/AlertBox';

const locale = 'en';

const strings = {
    message: {
        register_success: {
            en: 'Sucessfully Reserved.',
            ko: '예약 되었습니다.',
        },
        register_failed: {
            en: 'Could not Reserve this time.',
            ko: '예약이 되지 않았습니다.',
        },
        cancel_success: {
            en: 'Sucessfully Canceled.',
            ko: '취소 되었습다.',
        },
        cancel_failed: {
            en: 'Could not Cancel.',
            ko: '취소가 되지 않았습니다.',
        },
        ask_cancel: {
            en: 'Do you really want to cancel ?',
        },
    },
    label: {
        register_title: {
            en: 'Reserve - ',
            kr: '예약 하기 - ',
        },
        to_list: {
            en: 'to list',
            kr: '목록화면으로',
        },
        yes: {
            en: 'Yes',
            kr: '예',
        },
        no: {
            en: 'No',
            kr: '아니오',
        },
    },
};

interface Props {
    schedule: Schedule;
    reserved: Reserve[];
    routeback: string;
    date: string;
}

const DayRegisterPage = (props: Props) => {
    const [alert, setAlert] = useState(false);
    const [candidate, setCandidate] = useState<Date | null>(null);
    const [reserved, setReserved] = useState<Reserve[]>(
        convertReserved(props.reserved)
    );
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth');
            }
        });
        setReserved(convertReserved(props.reserved));
    }, [props.reserved]);
    const notificationCtx = useContext(NotificationContext);
    const session = useSession();
    const router = useRouter();

    const localeCtx = useContext(LocaleContext);
    const lang = localeCtx.locale ? localeCtx.locale.lang : 'en';

    const title =
        getString(lang, strings.label.register_title) +
        (props.schedule && props.schedule.title);

    const addToReserved = (email: string, date: Date) => {
        setReserved([
            ...reserved,
            {
                sch: props.schedule.id!,
                em: email,
                df: date,
                dt: addMinutes(date, slot2Minutes(props.schedule.slots)),
            },
        ]);
    };

    const removeReserved = (email: string, date: Date) => {
        let pnt = -1;
        reserved.map((each, index) => {
            if (
                each.em === email &&
                each.sch === props.schedule.id &&
                dayjs(each.df).valueOf() === dayjs(date).valueOf()
            ) {
                pnt = index;
            }
        });
        if (pnt !== -1) {
            setReserved(reserved.filter((each, index) => index !== pnt));
        }
    };

    const handleClickAdd = async (date: Date) => {
        const reserve: Reserve = {
            sch: props.schedule.id!,
            em: session.data!.user!.email!,
            df: date,
            dt: addMinutes(date, slot2Minutes(props.schedule.slots)),
        };
        const response = await fetch('/api/reserve', {
            method: 'POST',
            body: JSON.stringify(reserve),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            notificationCtx.showNotification({
                message: getString(lang, strings.message.register_failed),
                status: 'error',
            });
            console.log('Schedule create failed.');
            return;
        }
        console.log('success ', await response.json());
        notificationCtx.showNotification({
            message: getString(lang, strings.message.register_success),
            status: 'success',
        });
        addToReserved(session.data!.user!.email!, date);
    };

    const handleClickDelete = async (date: Date) => {
        setCandidate(date);
        setAlert(true);
    };

    const handleClose = (choice: number) => async () => {
        if (choice === 0) {
            const response = await fetch(
                '/api/reserve?' +
                    'em=' +
                    session.data!.user!.email! +
                    '&sch=' +
                    props.schedule.id +
                    '&df=' +
                    candidate?.toISOString(),
                {
                    method: 'DELETE',
                }
            );
            if (!response.ok) {
                notificationCtx.showNotification({
                    message: getString(lang, strings.message.cancel_failed),
                    status: 'error',
                });
                console.log('Schedule create failed.');
                setAlert(false);
                return;
            }
            notificationCtx.showNotification({
                message: getString(lang, strings.message.cancel_success),
                status: 'success',
            });
            removeReserved(session.data!.user!.email!, candidate!);
        }
        setAlert(false);
    };

    const handleNavi = (date: Date) => {
        router.replace(
            filetrPathName(router.pathname) +
                '/' +
                props.schedule.id +
                '/' +
                dayjs(date)
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .toDate()
                    .toISOString() +
                '?back=' +
                props.routeback
        );
    };

    // const { timefrom, timeto, slots } = props.schedule;
    return (
        <Container maxWidth="xs" sx={{ marginTop: 1 }}>
            <Box sx={{ display: 'flex' }}>
                <ChevronLeftIcon />
                <LinkText
                    onClick={() => {
                        router.replace(props.routeback);
                    }}
                >
                    {getString(lang, strings.label.to_list)}
                </LinkText>
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <TitleText>{title}</TitleText>
                {props.schedule && (
                    <WeekView
                        schedule={props.schedule}
                        date={dayjs(props.date).toDate()}
                        reserved={reserved}
                        onClickAdd={handleClickAdd}
                        onClickDelete={handleClickDelete}
                        onClickNavi={handleNavi}
                    />
                )}
            </Box>
            <AlertBox
                title=""
                answers={[
                    getString(lang, strings.label.yes),
                    getString(lang, strings.label.no),
                ]}
                content={getString(lang, strings.message.ask_cancel)}
                open={alert}
                onClose={handleClose}
            ></AlertBox>
        </Container>
    );
};

export const getServerSideProps = async (
    context: GetServerSidePropsContext
) => {
    const session = await getSession({ req: context.req });
    const { arg, back } = context.query;
    const [id, date] = arg as string[];
    if (session && id) {
        const client = await connectMongo();
        const schedule = await getSchedule(client, id as string);
        const reserved = await getWeekReserve(
            client,
            id as string,
            new Date(date)
        );
        await client.close();
        return {
            props: {
                schedule: schedule,
                reserved: reserved,
                routeback: back || '',
                date: date,
            },
        };
    }
    return {
        props: {},
    };
};

export default DayRegisterPage;
