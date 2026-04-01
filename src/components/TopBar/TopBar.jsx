import { shallowEqual, useSelector } from "react-redux";
import bgImg from "../../assets/app/workbench/bg.png"
import NotificationButton from "./NotifincationButton";
import UserGroupDisplay from "./UserGroupDisplay";

function Title() {
    // use redux for managing workbench state
    // const title = useSelector((state) => state.title.name, shallowEqual) || "untitle";
    const title = useSelector((state) => state.title.name); // 👈 ใช้ title จาก Redux

    return <p className="pl-3">{title}</p>;
}

export default function TopBar() {
    const backgroundImageStyle = {
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
    };

    return (
        <div className="flex justify-between items-center col-start-2 col-end-3 row-start-1 row-end-2 h-16"
            style={backgroundImageStyle}>
            <Title />
            <div className="flex flex-row items-center pr-[9em]">
                <NotificationButton />
                <UserGroupDisplay />

            </div>
        </div>
    );
}
