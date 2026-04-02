import UserStatus from "./UserStatus.jsx";
import SidePane from "./SidePane.jsx";
import SideBarFooter from "./SideBarFooter.jsx";

export default function SideBar() {
    return (
        <div className="w-full col-start-1 col-end-2 row-start-1 row-end-4 h-lvh text-black bg-white shadow-[6px_0_15px_-3px_rgba(0,0,0,0.3)] z-10">
            <div className="grid h-screen grid-rows-[122px,1fr,162px]">
                <UserStatus />
                <SidePane />
                <SideBarFooter />
            </div>
        </div>
    )
}
