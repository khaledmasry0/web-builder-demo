"use client";
import { Badge } from "../../../components/ui/badge";
// import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";
import { EditorElement, useEditor } from "../../../redux/editor-provider";
import { EditorBtns } from "../../../lib/constants";

type Props = {
  element: EditorElement;
};

const ButtonComponent = (props: Props) => {
  const { dispatch, state } = useEditor();

  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: props.element },
    });
  };
  const styles = props.element.styles;

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {
        elementDetails: props.element,
      },
    });
  };
  const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    console.log(e.dataTransfer);

    e.dataTransfer.setData("componentType", type);
  };

  //WE ARE NOT ADDING DRAG DROP
  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => {
        handleDragState(e, "button");
      }}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all inline",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,

          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[12px] rounded-none rounded-t-lg">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <button
        type="button"
        contentEditable={!state.editor.liveMode}
        onBlur={(e) => {
          const spanElement = e.target as HTMLSpanElement;
          dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...props.element,
                content: {
                  innerText: spanElement.innerText,
                },
              },
            },
          });
        }}
      >
        {!Array.isArray(props.element.content) &&
          props.element.content.innerText}
      </button>

      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[12px] rounded-none rounded-t-lg ">
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

export default ButtonComponent;