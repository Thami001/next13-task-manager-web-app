"use client"

import {Card} from "@prisma/client";
import {Draggable} from "@hello-pangea/dnd";
import {useCardModal} from "@/hooks/useCardModal";


interface CardItemProps {
    data: Card
    index: number
}

export const CardItem = ({data, index} : CardItemProps) => {
    const cardModal = useCardModal()

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <div role={"button"} onClick={() => cardModal.onOpen(data.id)} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className={"truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"}>
                    {data.title}
                </div>
                    )}
        </Draggable>
    );
};

