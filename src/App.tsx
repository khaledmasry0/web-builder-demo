import "./App.css";
// import EditorProvider, { useEditor } from "./redux/editor-provider";
// import FunnelEditorNavigation from "./_components/funnel-editor-navigation";
// import FunnelEditor from "./_components/funnel-editor";
// import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
// import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
// import { loadData, setFunnelPageId } from "";
import MainApp from "./MainApp";

function App() {
  return (
    <Provider store={store}>
      <MainApp />
      {/* </EditorProvider> */}
    </Provider>
  );
}

export default App;
