import React from 'react';
import {Board} from "@prisma/client";
import {BoardTitleForm} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/boardTitleForm";
import {BoardOptions} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/boardOptions";

interface BoardNavbarProps {
    data: Board
}

export const BoardNavbar = async ({data}: BoardNavbarProps) => {

    return (
        <div className={"w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white"}>
            <BoardTitleForm data={data}/>
            <div className={"ml-auto"}>
                <BoardOptions id={data.id}/>
            </div>
        </div>
    );
};

