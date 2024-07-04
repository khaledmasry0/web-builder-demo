import "./App.css";
import EditorProvider, { useEditor } from "./redux/editor-provider";
import FunnelEditorNavigation from "./_components/funnel-editor-navigation";
import FunnelEditor from "./_components/funnel-editor";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
import { useEffect } from "react";
import { Provider } from "@radix-ui/react-tooltip";
import MainApp from "./MainApp";
import store from './store/index'

function App() {
  return (
    <Provider store={store}>
      <MainApp/>
    </Provider>
  );
}

export default App;
