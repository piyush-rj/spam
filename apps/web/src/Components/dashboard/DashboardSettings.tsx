import { Button } from "@/components/ui/button";
import { useSettingsRendererStore } from "@/src/store/useSettingsActiveStore";
import { SettingsRendererEnum } from "@/src/types/SettingsRendererEnum";
import SettingsChangeTheme from "./DashboardSettings/SettingsChangeTheme";
import ToolTipComponent from "@/src/utility/ToolTipComponent";
import SettingsAccountInfo from "./DashboardSettings/SettingsAccountInfo";

export default function DashboardSettings() {
    const { value, setValue } = useSettingsRendererStore();

    function handleDashboardSettingsOption() {
        switch (value) {
            case SettingsRendererEnum.CHANGE_THEME:
                return <SettingsChangeTheme />;
            case SettingsRendererEnum.ACCOUNT_INFO:
                return <SettingsAccountInfo/>;
        }
    }

    return (
        <div className="h-full w-full pt-2 px-10">
            <div className="flex flex-col">
                <div className="flex text-xl border-b py-3 px-4 space-x-3">
                    <ToolTipComponent content="Choose your preferred theme">
                        <Button
                            variant={"outline"}
                            className="border-none bg-neutral-200 text-black dark:text-white shadow-none text-[17px]"
                            onClick={() => setValue(SettingsRendererEnum.CHANGE_THEME)}
                        >
                            Theme
                        </Button>
                    </ToolTipComponent>

                    <ToolTipComponent content="View Account details">
                        <Button
                            variant={"outline"}
                            className="border-none bg-neutral-200 text-black dark:text-white shadow-none text-[17px]"
                            onClick={() => setValue(SettingsRendererEnum.ACCOUNT_INFO)}
                        >
                            Account Info
                        </Button>
                    </ToolTipComponent>

                </div>

                <div className="h-full w-full">
                    {handleDashboardSettingsOption()}
                </div>

            </div>
        </div>
    )
}