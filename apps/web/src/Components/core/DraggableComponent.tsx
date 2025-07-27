'use client';

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";


import { CiLock } from "react-icons/ci";
import { MdPrivacyTip } from "react-icons/md";
import { BsWifi } from "react-icons/bs";
import { FiMessageSquare } from "react-icons/fi";
import SortableDraggableButton from "@/src/Components/core/SortableItem";

const features = [
    { id: "auth", text: "AUTHENTICATION", icon: <CiLock size={26} /> },
    { id: "privacy", text: "PRIVACY", icon: <MdPrivacyTip size={26} /> },
    { id: "connection", text: "CONNECTION", icon: <BsWifi size={26} /> },
    { id: "messages", text: "MESSAGES", icon: <FiMessageSquare size={26} /> },
];

export default function DraggableComponent() {
    const [items, setItems] = useState(features);

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        setItems((items) => arrayMove(items, oldIndex, newIndex));
    };

    return (
        <div className="w-full h-full space-y-3 overflow-hidden px-1 py-1">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    {items.map((item) => (
                        <SortableDraggableButton
                            key={item.id}
                            id={item.id}
                            text={item.text}
                            logo={item.icon}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}
