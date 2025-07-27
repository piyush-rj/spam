import AppLogo from "@/src/utility/AppLogo";
import DarkModeToggle from "../core/DarkModeToggle";
import NavbarSignin from "./NavbarSignIn";

export default function DashboardNavbar() {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 py-4 rounded-full shadow-lg border bg-light-base dark:bg-[#131313]">
            <div className="px-4 flex items-center justify-between w-full">
                <AppLogo />

                <div className="flex gap-x-3">
                    <DarkModeToggle />
                    <NavbarSignin />
                </div>

            </div>
        </div>
    )
}