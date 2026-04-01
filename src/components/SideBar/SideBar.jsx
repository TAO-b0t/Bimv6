import UserStatus from "./UserStatus.jsx";
import SidePane from "./SidePane.jsx";
import SideBarFooter from "./SideBarFooter.jsx";

export default function SideBar() {
    return (
        <div className="w-full col-start-1 col-end-2 row-start-1 row-end-4 h-lvh text-black bg-white">
            <div className="grid h-screen grid-rows-[122px,1fr,162px]">
                <UserStatus />
                <SidePane />
                <SideBarFooter />
            </div>
        </div>
    )
}
