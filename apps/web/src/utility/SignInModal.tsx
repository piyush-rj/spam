"use client";

import { Dispatch, SetStateAction } from "react";
import BlurBG from "./BlurBG";
import SignInCard from "./SignInCard";

interface LoginModalProps {
    opensignInModal: boolean;
    setOpenSignInModal: Dispatch<SetStateAction<boolean>>;
}

export default function SignInModal({
    opensignInModal,
    setOpenSignInModal,
}: LoginModalProps) {
    if (!opensignInModal) return null;

    return (
        <BlurBG onBackgroundClick={() => setOpenSignInModal(false)}>
            <SignInCard />
        </BlurBG>
    );
}
