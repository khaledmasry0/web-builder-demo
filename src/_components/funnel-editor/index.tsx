// "use client";
import { Button } from "../../components/ui/button";
// import { getFunnelPageDetails } from "../../../lib/queries";
// import { useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { EyeOff } from "lucide-react";
import React, { useEffect } from "react";
import Recursive from "./funnel-editor-components/recursive";
import { useEditor } from "../../redux/editor-provider";

type Props = { funnelPageId: string; liveMode?: boolean };

const FunnelEditor = ({ funnelPageId, liveMode }: Props) => {
  const { dispatch, state } = useEditor();
  // console.log("=== state ===" , state);

  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode]);

  useEffect(() => {
    const savedData: any = localStorage.getItem("funnelData");
    if (savedData) {
      console.log(JSON.parse(savedData));
      // return;
      dispatch({
        type: "LOAD_DATA",
        payload: {
          elements: JSON.parse(savedData).elements,
          withLive: false,
        },
      });
      console.log("savedData", savedData);
    }
  }, []);

  const handleClick = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const handleUnpreview = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };
  console.log("===== state ===", state.editor.elements);

  return (
    <div
      className={clsx(
        "use-automation-zoom-in h-full overflow-y-hidden  mr-[385px] bg-background transition-all rounded-md",
        {
          "!p-0 !mr-0":
            state.editor.previewMode === true || state.editor.liveMode === true,
          "!w-[850px]": state.editor.device === "Tablet",
          "!w-[420px]": state.editor.device === "Mobile",
          "w-full": state.editor.device === "Desktop",
        }
      )}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button
          variant={"ghost"}
          size={"icon"}
          className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]"
          onClick={handleUnpreview}
        >
          <EyeOff />
        </Button>
      )}
      {/* ========== */}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => (
          // console.log(childElement)

          <Recursive key={childElement.id} element={childElement} />
        ))}
    </div>
  );
};

export default FunnelEditor;
