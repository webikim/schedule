export const menus = [
    [
        {
            title: 'New Schedule',
            picon: 'BorderColor',
            sicon: 'BorderColorOutlined',
            route: '/schedule/create'
        },
        {
            title: 'Manage Schedule',
            picon: 'ManageHistory',
            sicon: 'ManageHistory',
            route: '/schedule/manage'
        },
        {
            title: 'Reservation Status',
            picon: 'WatchLater',
            sicon: 'WatchLaterOutlined',
            route: '/schedule/status'
        },
    ],
    [
        {
            title: 'Reserve Seat',
            picon: 'CheckBox',
            sicon: 'CheckBoxOutlined',
            route: '/reserve/register'
        },
        {
            title: 'My Reservations',
            picon: 'CalendarMonth',
            sicon: 'CalendarMonthOutlined',
            route: '/reserve/status'
        },
    ],
    [
        {
            title: 'Edit Profile',
            picon: 'ManageAccounts',
            sicon: 'ManageAccountsOutlined',
            route: '/user/profile'
        },
        {
            title: 'Change Password',
            picon: 'VpnKey',
            sicon: 'VpnKeyOutlined',
            route: '/user/password'
        }
    ]
];