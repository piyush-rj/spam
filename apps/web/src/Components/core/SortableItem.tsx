'use client';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DraggableButton, { DraggableButtonProps } from "./DraggableButton";

interface SortableDraggableButtonProps extends DraggableButtonProps {
    id: string;
}

export default function SortableDraggableButton({
    id,
    text,
    logo,
    className,
}: SortableDraggableButtonProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <DraggableButton text={text} logo={logo} className={className} />
        </div>
    );
}
