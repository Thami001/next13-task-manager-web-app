"use client"

import {ListWithCards} from "@/types";
import {ListForm} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/listForm";
import {useEffect, useState} from "react";
import {ListItem} from "@/app/(platform)/(dashboard)/board/[boardId]/_components/listItem";
import {DragDropContext, Droppable} from "@hello-pangea/dnd";
import {useAction} from "@/hooks/useAction";
import {updateListOrder} from "@/actions/update-list-order";
import {updateCardOrder} from "@/actions/update-card-order";
import {toast} from "sonner";

interface ListContainerProps {
    data: ListWithCards[]
    boardId: string
}

function reorder<T>(list:T[], startIndex: number, endIndex: number)  {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex,0 , removed)

    return result;
}

export const ListContainer = ({data, boardId} : ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);

    const {execute: executeUpdateListOrder} = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List Reordered")
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const {execute: executeUpdateCardOrder} = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card Reordered")
        },
        onError: (error) => {
            toast.error(error)
        }
    })


    useEffect(() => {
        setOrderedData(data)
    }, [data])

    const onDragEnd = (result:any) => {
        const {destination, source, type} = result

        if(!destination) {
            return
        }

        //If dropped in the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        //if user is moving a list
        if(type === "list") {
            const items = reorder(orderedData, source.index, destination.index).map((item, index) => (
                {...item, order: index}
            ))

            setOrderedData(items)
            executeUpdateListOrder({items, boardId})
        }

        //if user moves a card
        if(type === "card") {
            let newOrderedData = [...orderedData]

            const sourceList = newOrderedData.find(list => list.id === source.droppableId)
            const destList = newOrderedData.find(list => list.id === destination.droppableId)

            if(!sourceList || !destList) {
                return;
            }

            //Check if cards exist on source list
            if(!sourceList.cards) {
                sourceList.cards = []
            }

            //Check if cards exist on destination list
            if(!destList.cards) {
                destList.cards = []
            }

            //Moving the card in the same list
            if(source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                )

                reorderedCards.forEach((card, idx) => {
                    card.order = idx
                })

                sourceList.cards = reorderedCards

                setOrderedData(newOrderedData)
                executeUpdateCardOrder({items: reorderedCards, boardId: boardId})


                //User moves card to another list
            } else {
                //Removes card from source list
                const [movedCards] = sourceList.cards.splice(source.index, 1)

                //Assign new listId to moved card
                movedCards.listId = destination.droppableId

                //Add card to the destination list
                destList.cards.splice(destination.index, 0, movedCards)

                //Changing the order for cards when moved
                sourceList.cards.forEach((card, idx) => {
                    card.order = idx
                })

                destList.cards.forEach((card, idx) => {
                    card.order = idx
                })

                setOrderedData(newOrderedData)
                executeUpdateCardOrder({boardId: boardId, items: destList.cards})
            }
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={"lists"} type={"list"} direction={"horizontal"}>
                {(provided) => (
                     <ol {...provided.droppableProps} ref={provided.innerRef} className={"flex gap-x-3 h-full"} onChange={() => {}}>
                        {orderedData.map((list, index) => {
                            return (
                                <ListItem key={list.id} data={list} index={index} />
                                    )
                                    })}
                                {provided.placeholder}
                                   <ListForm/>
                         <div className={"flex-shrink-0 w-1"}/>
                     </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}