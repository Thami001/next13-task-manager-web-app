"use client"

import {Dialog, DialogContent} from "@/components/ui/dialog";
import {useCardModal} from "@/hooks/useCardModal";
import {useQuery} from "@tanstack/react-query";
import {CardWIthList} from "@/types";
import {fetcher} from "@/lib/fetcher";
import {Header} from "@/components/modals/cardModal/header";
import {Description} from "@/components/modals/cardModal/description";
import {Actions} from "@/components/modals/cardModal/actions";
import {AuditLog} from "@prisma/client";
import { Activity } from "./activity";

export const CardModal = () => {
    const id = useCardModal((state) => state.id)
    const isOpen = useCardModal((state) => state.isOpen)
    const onClose = useCardModal((state) => state.onClose)

    const {data: cardData} = useQuery<CardWIthList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`),
    })

    const {data: auditLogsData} = useQuery<AuditLog[]>({
        queryKey: ["card-logs", id],
        queryFn: () => fetcher(`/api/cards/${id}/logs`),
    })

    return (
        <Dialog onOpenChange={onClose} open={isOpen}>
            <DialogContent>
                {!cardData ? <Header.Skeleton/> : <Header data={cardData}/>}
                <div className={"grid grid-cols-1 md:grid-cols-4 md:gap-4"}>
                    <div className={"col-span-3"}>
                        <div className={"w-full space-y-6"}>
                            {!cardData ? <Description.Skeleton/> : <Description data={cardData}/>}
                            {!auditLogsData ? <Activity.Skeleton/> : <Activity items={auditLogsData}/>}
                        </div>
                    </div>
                    {!cardData ? <Actions.Skeleton/> : <Actions data={cardData}/> }
                </div>
            </DialogContent>
        </Dialog>
    )
}
