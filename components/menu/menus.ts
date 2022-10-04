export const menus = [
    [
        {
            title: '예약 만들기',
            picon: 'BorderColor',
            sicon: 'BorderColorOutlined',
            route: '/reception/create'
        },
        {
            title: '예약 일정 관리',
            picon: 'ManageHistory',
            sicon: 'ManageHistory',
            route: '/reception/manage'
        },
        {
            title: '예약 현황',
            picon: 'WatchLater',
            sicon: 'WatchLaterOutlined',
            route: '/reception/status'
        },
    ],
    [
        {
            title: '예약 하기',
            picon: 'CheckBox',
            sicon: 'CheckBoxOutlined',
            route: '/schedule/create'
        },
        {
            title: '예약 확인',
            picon: 'CalendarMonth',
            sicon: 'CalendarMonthOutlined',
            route: '/schedule/view'
        },
        {
            title: '자주하는 예약',
            picon: 'Repeat',
            sicon: 'RepeatOn',
            route: '/schedule/favorite'
        },
    ],
    [
        {
            title: '정보 변경',
            picon: 'ManageAccounts',
            sicon: 'ManageAccountsOutlined',
            route: '/user/profile'
        },
        {
            title: '암호 변경',
            picon: 'VpnKey',
            sicon: 'VpnKeyOutlined',
            route: '/user/password'
        }
    ]
];