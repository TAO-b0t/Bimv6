import { useEffect, useState } from "react";
import getReadableTimeAgo from "../../utils/getReadableTimeAgo";
import notificationSVG from "./mockImg/notification_svgrepo.com.svg"


const MOCK_DATA = [
    {
        user: "admin01",
        activity: "registered in to team",
        timeStamp: 1736687449
    },
    {
        user: "admin02",
        activity: "added new bim file to team project",
        timeStamp: 1736683449
    },
    {
        user: "technician01",
        activity: "finish maintenance : o2d water system",
        timeStamp: 1736673449
    }
]
//
// TEST: end mock

const EPOCH_TIME_MINUTE = 60000

// better let render drop down even no have new drop down. send back "visible" event , store to user meta data
//
export default function NotificationButton() {
    const [isToggle, setIsToggle] = useState(false)
    const [notifications, setNotifications] = useState([])

    const toggleDropDown = () => setIsToggle(!isToggle)

    // TEST:mock fetch
    useEffect(() => {
        const fetchNotification = MOCK_DATA.map((item) => ({
            ...item,
            timeAgo: getReadableTimeAgo(item.timeStamp)
        }))
        setNotifications(fetchNotification)
    }, [])

    // update every minute  TODO: decide for optimization ( remove | active only minute condition)
    useEffect(() => {
        const interval = setInterval(() => {
            setNotifications((prev) =>
                prev.map((item) => ({
                    ...item,
                    timeAgo: getReadableTimeAgo(item.timeStamp),
                }))
            );
        }, EPOCH_TIME_MINUTE);

        return () => clearInterval(interval);
    })
    return (
        <div className="relative">
            <button onClick={toggleDropDown} className="relative p-2 rounded-xl bg-teal-hl focus:outline-none ">
                <span className="absolute bottom-[-0.1em] right-[-0.1em] w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                <img src={notificationSVG} alt="notification" />
            </button>
            <div>
                {isToggle && notifications && (
                    <div className="absolute right-0 top-[2.8125em] mt-2 w-96 bg-teal-hl rounded-lg overflow-y-auto z-10 text-left text-[14px]">
                        <div className="px-2.5 pt-[1em] font-light flex flex-row justify-between items-center">
                            <p>
                                แจ้งเตือน
                            </p>
                            <button onClick={() => setIsToggle(false)}>
                                X
                            </button>

                        </div>
                        <div className="grid grid-cols-3 pt-3.5 font-light">
                            <button> ข้อความทั่วไป
                            </button>
                            <button> โครงการ
                            </button>
                            <button> เอกสาร
                            </button>
                        </div>
                        <ul className="space-y-2 px-4 pt-2">
                            {notifications.map((notification, index) => (
                                <li key={index} className="border-b last:border-0 pb-2">
                                    <p className="text-sm text-white">
                                        <span className="font-bold">{notification.user}</span> {notification.activity}
                                    </p>
                                    <p className="text-xs text-sky-400">{notification.timeAgo}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
