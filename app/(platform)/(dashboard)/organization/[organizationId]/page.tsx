import React, {Suspense} from 'react';
import {Info} from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info";
import {Separator} from "@/components/ui/separator";
import {BoardList} from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/boardList";


const OrganizationIdPage =  async () => {
    return (
        <div className={"w-full mb-20"}>
            <Info/>
            <Separator/>
            <div>
                <Suspense fallback={<BoardList.Skeleton/>}>
                <BoardList/>
                </Suspense>
            </div>
        </div>
    );
};

export default OrganizationIdPage;