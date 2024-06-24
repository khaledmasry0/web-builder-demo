import React from 'react'
import { EditorBtns } from "../../../../lib/constants";
import { SquareMinus } from 'lucide-react';

const ButtonPlaceholder = () => {
	const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    console.log(e.dataTransfer);
    
    e.dataTransfer.setData("componentType", type);
  };
	return (
		<div
		draggable
		onDragStart={(e) => {
			handleDragState(e, "button");
		}}
		className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
	>
		<SquareMinus size={40} className="text-muted-foreground" />
	</div>
	)
}

export default ButtonPlaceholder