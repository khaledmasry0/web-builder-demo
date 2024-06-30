"use client";
import { Badge } from "../../../components/ui/badge";
// import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from "clsx";
import { Trash } from "lucide-react";
import React, { useState } from "react";
import { EditorElement, useEditor } from "../../../redux/editor-provider";
import { EditorBtns } from "../../../lib/constants";

type Props = {
  element: EditorElement;
};

const TextComponent = ({ element }: Props) => {
  const [clicked, setclicked] = useState(false);
  const { dispatch, state } = useEditor();

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };
  const styles = element.styles;

  const handleOnClickBody = (e: React.MouseEvent) => {
    setclicked((prev) => !prev);
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  //WE ARE NOT ADDING DRAG DROP
  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    e.stopPropagation(); // prevent
    if (type === null) return;

    e.dataTransfer.setData("componentType", type);
  };
  return (
    <div
      style={styles}
      draggable={
        state.editor.selectedElement.id === element.id && clicked ? true : false
      }
      onDragStart={(e) => {
        handleDragState(e, "text");
      }}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all",
        {
          "!border-blue-500 cursor-copy":
            state.editor.selectedElement.id === element.id,

          "!border-solid": state.editor.selectedElement.id === element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <span
        contentEditable={!state.editor.liveMode}
        onBlur={(e) => {
          const spanElement = e.target as HTMLSpanElement;
          dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...element,
                content: {
                  innerText: spanElement.innerText,
                },
              },
            },
          });
        }}
      >
        {!Array.isArray(element.content) && element.content.innerText}
      </span>
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default TextComponent;
