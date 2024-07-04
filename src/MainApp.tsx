import React, { useEffect } from "react";
import FunnelEditorNavigation from "./_components/funnel-editor-navigation";
import FunnelEditor from "./_components/funnel-editor";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
import { useDispatch } from "react-redux";
import { loadData, setFunnelPageId } from "./state/Slice";

const fakeFunnelPageDetails = {
  id: "7026b459-4229-46d8-a2b2-ac79231c3405",
  name: "k",
  pathName: "",
  createdAt: "2024-06-21T14:04:33.545Z",
  updatedAt: "2024-06-21T14:04:33.545Z",
  visits: 0,
  content:
    '[{"content":[],"id":"_body","name":"Body","styles":{"backgroundColor":"white"},"type":"_body"}]',
  order: 0,
  previewImage: null,
  funnelId: "b59b9c82-0e36-44da-871a-4d04bd3743b4",
};
const params = {
  subaccountId: "40fbb21d-2165-4a7a-a643-724c27e033f5",
  funnelId: "b59b9c82-0e36-44da-871a-4d04bd3743b4",
  funnelPageId: "7026b459-4229-46d8-a2b2-ac79231c3405",
};
const MainApp = () => {
  const savedData: any = JSON.parse(localStorage.getItem("funnelData"));
  const dispatch = useDispatch();
  useEffect(() => {
    if (savedData) {
      dispatch(loadData(savedData));
    } else {
      dispatch(loadData(fakeFunnelPageDetails));
    }
    dispatch(setFunnelPageId(params.funnelPageId));
  }, [dispatch, savedData, fakeFunnelPageDetails, params.funnelPageId]);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <FunnelEditorNavigation
        funnelId={params.funnelId}
        funnelPageDetails={fakeFunnelPageDetails}
        subaccountId={params.subaccountId}
      />
      <div className="h-full flex justify-center">
        <FunnelEditor funnelPageId={params.funnelPageId} />
      </div>
      <FunnelEditorSidebar subaccountId={params.subaccountId} />
    </div>
  );
};

export default MainApp;
