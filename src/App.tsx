import "./App.css";
import EditorProvider, { useEditor } from "./redux/editor-provider";
import FunnelEditorNavigation from "./_components/funnel-editor-navigation";
import FunnelEditor from "./_components/funnel-editor";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
import { useEffect } from "react";

function App() {
  // const { state, dispatch } = useEditor();
  // console.log("state", state);

  const fakeFunnelPageDetails = {
    id: "7026b459-4229-46d8-a2b2-ac79231c3405",
    name: "k",
    pathName: "",
    createdAt: "2024-06-21T14:04:33.545Z",
    updatedAt: "2024-06-21T14:04:33.545Z",
    visits: 0,
    content:
      '[{"content":[],"id":"__body","name":"Body","styles":{"backgroundColor":"white"},"type":"__body"}]',
    order: 0,
    previewImage: null,
    funnelId: "b59b9c82-0e36-44da-871a-4d04bd3743b4",
  };

  const params = {
    subaccountId: "40fbb21d-2165-4a7a-a643-724c27e033f5",
    funnelId: "b59b9c82-0e36-44da-871a-4d04bd3743b4",
    funnelPageId: "7026b459-4229-46d8-a2b2-ac79231c3405",
  };

  const savedData: any = JSON.parse(localStorage.getItem("funnelData"));
  console.log(savedData);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        subaccountId={params.subaccountId}
        funnelId={params.funnelId}
        pageDetails={fakeFunnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={params.funnelId}
          funnelPageDetails={fakeFunnelPageDetails}
          subaccountId={params.subaccountId}
        />
        <div className="h-full flex justify-center">
          <FunnelEditor funnelPageId={params.funnelPageId} />
        </div>

        <FunnelEditorSidebar subaccountId={params.subaccountId} />
      </EditorProvider>
    </div>
  );
}

export default App;
