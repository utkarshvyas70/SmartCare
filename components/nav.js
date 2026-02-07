import React from "react";
import Navbar from "./navbar";
import { getFullUserProfile } from '@/app/lib/user';

export default async function nav() {
    const user = await getFullUserProfile();
    return (
        <div>
            <Navbar user = {user} />
        </div>
    )
}