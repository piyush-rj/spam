

import { JSX } from "react";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    return (
            <div className="relative flex flex-col text-white min-h-screen">
                <div className="z-10 sticky top-0 text-white">
                    navbar
                </div>

                <div className="flex-1 px-4 pt-4 pb-24">{children}</div>
            </div>
    );
}
