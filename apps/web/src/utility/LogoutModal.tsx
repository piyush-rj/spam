"use client";

import { Dispatch, SetStateAction } from "react";
import BlurBG from "./BlurBG";
import SignInCard from "./SignInCard";
import LogoutCard from "./LogoutCard";

interface LoginModalProps {
    opeLogoutModal: boolean;
    setOpeLogoutModal: Dispatch<SetStateAction<boolean>>;
}

export default function LogoutModal({
    opeLogoutModal,
    setOpeLogoutModal,
}: LoginModalProps) {
    if (!opeLogoutModal) return null;

    return (
        <BlurBG onBackgroundClick={() => setOpeLogoutModal(false)}>
            <LogoutCard onCancel={() => setOpeLogoutModal(false)} />
        </BlurBG>
    );
}
