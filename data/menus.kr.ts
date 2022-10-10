export const menus = [
    [
        {
            title: '예약 만들기',
            picon: 'BorderColor',
            sicon: 'BorderColorOutlined',
            route: '/schedule/create'
        },
        {
            title: '예약 관리',
            picon: 'ManageHistory',
            sicon: 'ManageHistory',
            route: '/schedule/manage'
        },
        {
            title: '예약 현황',
            picon: 'WatchLater',
            sicon: 'WatchLaterOutlined',
            route: '/schedule/status'
        },
    ],
    [
        {
            title: '예약 하기',
            picon: 'CheckBox',
            sicon: 'CheckBoxOutlined',
            route: '/reserve/register'
        },
        {
            title: '예약 확인',
            picon: 'CalendarMonth',
            sicon: 'CalendarMonthOutlined',
            route: '/reserve/status'
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