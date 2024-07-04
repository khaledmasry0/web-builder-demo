import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
// import { saveActivityLogsNotification, upsertFunnelPage } from "@/lib/queries";
// import { DeviceTypes, useEditor } from '@/providers/editor/editor-provider'
// import { FunnelPage } from '@prisma/client'
import clsx from "clsx";
import {
  ArrowLeftCircle,
  EyeIcon,
  Code,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
import React, { FocusEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DeviceTypes,
  EditorElement,
  useEditor,
} from "../redux/editor-provider";
// import { useNavigation } from "react-router";
// import { Link } from "react-router-dom";
// import grapesjs from 'grapesjs';
// import "grapesjs/dist/css/grapes.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import beautify from "js-beautify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { changeDevice, redo, toggleLiveMode, togglePreviewMode, undo } from "../state/Slice";

type Props = {
  funnelId: string;
  funnelPageDetails: any;
  subaccountId: string;
};

const FunnelEditorNavigation = ({
  funnelId,
  funnelPageDetails,
  subaccountId,
}: Props) => {
  // const router = useNavigation();
  // const { state, dispatch } = useEditor();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.editor);
  const [codePreview, setCodePreview] = useState("");
  // console.log("=== stateaaaaa ===" , state);

  // useEffect(() => {
  //   dispatch({
  //     type: "SET_FUNNELPAGE_ID",
  //     payload: { funnelPageId: funnelPageDetails.id },
  //   });
  // }, [funnelPageDetails]);

  // const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (
  //   event
  // ) => {
  //   if (event.target.value === funnelPageDetails.name) return;
  //   if (event.target.value) {
  //     await upsertFunnelPage(
  //       subaccountId,
  //       {
  //         id: funnelPageDetails.id,
  //         name: event.target.value,
  //         order: funnelPageDetails.order,
  //       },
  //       funnelId
  //     );

  //     toast("Success", {
  //       description: "Saved Funnel Page title",
  //     });
  //     window.location.reload();
  //   } else {
  //     toast("Oppse!", {
  //       description: "You need to have a title!",
  //     });
  //     event.target.value = funnelPageDetails.name;
  //   }
  // };

  const handlePreviewClick = () => {
    dispatch(togglePreviewMode());
    // dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    // dispatch({ type: "TOGGLE_LIVE_MODE" });
    console.log("mohamed");
    
    dispatch(toggleLiveMode({value : true}));
  };

  const handleUndo = () => {
    dispatch(undo())
    // dispatch({ type: "UNDO" });
  };

  const handleRedo = () => {
    dispatch(redo())
    // dispatch({ type: "REDO" });
  };

  const handleOnSave = async () => {
    const content = state.editor;
    // const content = state.editor;
    // console.log(content);
    localStorage.setItem("funnelData", JSON.stringify(state.editor));
  };
  const [openCode, setOpenCode] = useState(false);
  // console.log(openCode);

  const handleShowCode = () => {
    handleOpenCodePreview();
    setOpenCode((prev) => true);
  };
  const handleCloseCode = () => {
    setCodePreview("");
    setOpenCode((prev) => false);
  };
  // console.log("=== state.editor.elements ===" , state.editor.elements);
  function handleOpenCodePreview() {
    const renderABC = generateCode(state.editor.elements);
    const formattedCode = beautify.html(renderABC, { indent_size: 2 });
    // console.log(state.editor.elements);

    // setCodePreview(renderABC);
    setCodePreview(formattedCode);
  }
  function generateCode(elements) {
    if (!elements || elements.length === 0) return "";

    const elementsConvertCode = elements
      .map((ele) => {
        if (ele.type === "text") {
          return `<p id="${ele.id}">${ele.content.innerText}</p>`;
        }
        if (ele.type === "button") {
          return `<button id="${ele.id}">${ele.content.innerText}</button>`;
        }
        if (ele.type === "container" || ele.type === "__body") {
          return `<section id="${ele.id}">${generateCode(
            ele.content
          )}</section>`;
        }
        if (ele.type === "2Col") {
          return `<section id="${ele.id}">${generateCode(
            ele.content
          )}</section>`;
        }
        // Add more types as needed
        return null;
      })
      .filter(Boolean)
      .join("");

    return elementsConvertCode;
  }

  return (
    <TooltipProvider>
      <nav
        className={clsx(
          "border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all",
          { "!h-0 !p-0 !overflow-hidden": state?.editor?.previewMode }
        )}
      >
        <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
          <a href={`/subaccount/${subaccountId}/funnels/${funnelId}`}>
            <ArrowLeftCircle />
          </a>
          <div className="flex flex-col w-full ">
            <Input
              defaultValue={funnelPageDetails.name}
              className="border-none h-5 m-0 p-0 text-lg"
              // onBlur={handleOnBlurTitleChange}
            />
            {/* <span className="text-sm text-muted-foreground">
              Path: /{funnelPageDetails.pathName}
            </span> */}
          </div>
        </aside>
        {/* Responsive Icon */}
        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit"
            value={state.editor.device}
            onValueChange={(value) => {
              dispatch(changeDevice({ device: value as DeviceTypes }))
              // dispatch({
              //   type: "CHANGE_DEVICE",
              //   payload: { device: value as DeviceTypes },
              // });
            }}
          >
            <TabsList className="grid w-full gap-3 grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Desktop"
                    className={`toolTip data-[state=active]:bg-[#3f67ad] data-[state=active]:text-[white] w-10 h-10 p-0`}
                  >
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Tablet"
                    className={`toolTip w-10 h-10 p-0 data-[state=active]:bg-[#3f67ad] data-[state=active]:text-[white]`}
                  >
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger
                    value="Mobile"
                    className={`toolTip w-10 h-10 p-0 data-[state=active]:bg-[#3f67ad] data-[state=active]:text-[white]`}
                  >
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-4">
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-[#3f67ad] hover:text-[white]"
            onClick={handleShowCode}
          >
            <Code />
          </Button>
          <div
            className={`${
              openCode ? "block" : "hidden"
            } absolute top-40 right-[500px] w-[400px] h-[400px] bg-slate-700 z-50 text-white p-4`}
          >
            {openCode && (
              <span
                className="cursor-pointer mb-2 block"
                onClick={handleCloseCode}
              >
                x
              </span>
            )}

            <SyntaxHighlighter
              language="html"
              style={vscDarkPlus}
              className="w-full h-[90%]"
            >
              {codePreview}
            </SyntaxHighlighter>
          </div>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-[#3f67ad] hover:text-[white]"
            onClick={handlePreviewClick}
          >
            <EyeIcon />
          </Button>
          <Button
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
            variant={"ghost"}
            size={"icon"}
            className={`${
              !(state.history.currentIndex > 0) ? " " : " text-[black]"
            } hover:bg-[#3f67ad] hover:text-[white]`}
          >
            <Undo2 />
          </Button>
          <Button
            disabled={
              !(state.history.currentIndex < state.history.history.length - 1)
            }
            onClick={handleRedo}
            variant={"ghost"}
            size={"icon"}
            className={`${
              !(state.history.currentIndex < state.history.history.length - 1)
                ? " "
                : " text-[black]"
            } hover:bg-[#3f67ad] hover:text-[white] mr-4`}
          >
            <Redo2 />
          </Button>
          <div className="flex flex-col item-center mr-4">
            {/* <div className="flex flex-row items-center gap-4">
              Draft
              <Switch disabled defaultChecked={true} />
              Publish
            </div> */}
            <span className="text-muted-foreground text-sm">
              Last updated {"11/11/2024-12:00:00"}
            </span>
          </div>
          <Button
            className={`bg-[#3f67ad] text-[white] text-[15px]`}
            onClick={handleOnSave}
          >
            Save
          </Button>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default FunnelEditorNavigation;
