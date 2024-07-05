"use client";
import { Badge } from "../../../components/ui/badge";
import { EditorBtns } from "../../../lib/constants";

// import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from "clsx";
import { Trash } from "lucide-react";
import { Link } from "react-router-dom";

import React, { useRef } from "react";
import {
  EditorElement,
  changeClickedElement,
  deleteElement,
} from "../../../state/Slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
// import { EditorElement, useEditor } from "../../../redux/editor-provider";

type Props = {
  element: EditorElement;
};

const LinkComponent = (props: Props) => {
  const state = useSelector((state: RootState) => state.editor);

  // const { state } = useEditor();
  const dispatch = useDispatch();

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    e.stopPropagation();

    if (type === null) return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    // dispatch({
    //   type: "CHANGE_CLICKED_ELEMENT",
    //   payload: {
    //     elementDetails: props.element,
    //   },
    // });
    dispatch(changeClickedElement({ elementDetails: props.element }));
  };

  const styles = props.element.styles;

  const handleDeleteElement = () => {
    // dispatch({
    //   type: "DELETE_ELEMENT",
    //   payload: { elementDetails: props.element },
    // });
    dispatch(deleteElement({ elementDetails: props.element }));
  };

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, "text")}
      onClick={handleOnClickBody}
      className={clsx(
        "p-[2px] w-full m-[5px] relative text-[16px] transition-all",
        {
          "!border-blue-500":
            state.editor.selectedElement.id === props.element.id,

          "!border-solid": state.editor.selectedElement.id === props.element.id,
          "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      {!Array.isArray(props.element.content) &&
        (state.editor.previewMode || state.editor.liveMode) && (
          <Link to={props.element.content.href || "#"}>
            {props.element.content.innerText}
          </Link>
        )}
      {!state.editor.previewMode && !state.editor.liveMode && (
        <span
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
        </span>
      )}
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
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

export default LinkComponent;
