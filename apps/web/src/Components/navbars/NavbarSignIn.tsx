"use client";

import { Button } from "@/components/ui/button";
import { useUserSessionStore } from "@/src/store/useUserSessionStore";
import SignInModal from "@/src/utility/SignInModal";
import ToolTipComponent from "@/src/utility/ToolTipComponent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NavbarNameDisplay from "./NavbarNameDisplay";

export default function NavbarSignin() {
    const [opensignInModal, setOpenSignInModal] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const router = useRouter();

    function handleSignIn() {
        if (!session?.user?.token) {
            setOpenSignInModal(true);
        } else {
            router.push("/dashboard");
        }
    }

    const isSignedIn = !!session?.user?.id;

    return (
        <div>
            {isSignedIn ? (
                <NavbarNameDisplay />
            ) : (
                <ToolTipComponent content="Sign In to continue">
                    <Button
                        onClick={handleSignIn}
                        className="hover:-translate-y-0.5 tracking-wide font-sans font-light transition-all transform-3d duration-200"
                    >
                        Sign In
                    </Button>
                </ToolTipComponent>
            )}
            <SignInModal
                opensignInModal={opensignInModal}
                setOpenSignInModal={setOpenSignInModal}
            />
        </div>
    );
}
