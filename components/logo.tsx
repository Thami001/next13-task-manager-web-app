import React from 'react';
import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
    return (
        <Link href={"/"}>
            <div className={"hover:opacity-75 transition items-center gap-x-2 hidden md:flex"}>
                <Image src={"/Logo.jpg"} alt={"logo"} width={30} height={30}/>
                <p className={"text-;g text-neutral-700 pb-1"}>
                    Taskify
                </p>
            </div>
        </Link>
    );
};

