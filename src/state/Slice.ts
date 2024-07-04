import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorBtns } from "../lib/constants";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content:
    | EditorElement[]
    | { href?: string; innerText?: string; src?: string };
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  previewMode: boolean;
  funnelPageId: string;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: Editor = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
  },
  device: "Desktop",
  previewMode: false,
  liveMode: false,
  funnelPageId: "",
};

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

const addAnElement = (
  // containerId,
  // elementDetails,
  editorArray: EditorElement[],
  action: PayloadAction<{ containerId: string; elementDetails: EditorElement }>
): EditorElement[] => {
  return editorArray.map((item) => {
    
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      };
    }
    return item;
  });
  // return editorArray.map((item) => {
  //   if (item.id === action.payload.containerId && Array.isArray(item.content)) {
  //     return {
  //       ...item,
  //       content: [...item.content, action.payload.elementDetails],
  //     };
  //   } else if (item.content && Array.isArray(item.content)) {
  //     return {
  //       ...item,
  //       content: addAnElement(item.content, action),
  //     };
  //   }
  //   return item;
  // });
};

const updateAnElement = (
  editorArray: EditorElement[],
  action: PayloadAction<{ elementDetails: EditorElement }>
): EditorElement[] => {
  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return { ...item, ...action.payload.elementDetails };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateAnElement(item.content, action),
      };
    }
    return item;
  });
  // return editorArray.map((item) => {
  //   if (item.id === action.payload.elementDetails.id) {
  //     return { ...item, ...action.payload.elementDetails };
  //   } else if (item.content && Array.isArray(item.content)) {
  //     return {
  //       ...item,
  //       content: updateAnElement(item.content, action),
  //     };
  //   }
  //   return item;
  // });
};

const deleteAnElement = (
  editorArray: EditorElement[],
  action: PayloadAction<{ elementDetails: EditorElement }>
): EditorElement[] => {
  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false;
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteAnElement(item.content, action);
    }
    return true;
  });
  // return editorArray.filter((item) => {
  //   if (item.id === action.payload.elementDetails.id) {
  //     return false;
  //   } else if (item.content && Array.isArray(item.content)) {
  //     item.content = deleteAnElement(item.content, action);
  //   }
  //   return true;
  // });
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addElement(state, action) {
      const updatedEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      };
      // console.log("=== updatedEditorState ===", updatedEditorState);
      
      // Update the history to include the entire updated EditorState
      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState }, // Save a copy of the updated state
      ];

      const newEditorState = {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      };

      return newEditorState;

      // const updatedEditorState = {
      //   ...state.editor,
      //   elements: addAnElement(state.editor.elements, action),
      // };
      // state.editor = updatedEditorState;
      // state.history.history.push({ ...updatedEditorState });
      // state.history.currentIndex++;
    },
    updateElement(state, action) {
      const updatedElements = updateAnElement(state.editor.elements, action);

      const UpdatedElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;

      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: UpdatedElementIsSelected
          ? action.payload.elementDetails
          : {
              id: "",
              content: [],
              name: "",
              styles: {},
              type: null,
            },
      };

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate }, // Save a copy of the updated state
      ];
      const updatedEditor = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      };
      return updatedEditor;
    },
    deleteElement(state, action) {
      const updatedElements = deleteAnElement(state.editor.elements, action);
      const updatedEditorState = {
        ...state.editor,
        elements: updatedElements,
      };
      state.editor = updatedEditorState;
      
      state.history.history.push({ ...updatedEditorState });
      state.history.currentIndex++;
    },
    changeClickedElement(state, action) {
      // console.log("====  CHANGE_CLICKED_ELEMENT Action ====", action.payload.elementDetails);
      state.editor.selectedElement = action.payload.elementDetails;
      console.log("^^^^ newSelectedElement &&&", state.editor.selectedElement);

      state.history.history.push({ ...state.editor });
      state.history.currentIndex++;
    },
    changeDevice(state, action) {
      state.editor.device = action.payload.device;
    },
    togglePreviewMode(state) {
      state.editor.previewMode = !state.editor.previewMode;
      console.log("ssssssssssssssssssssssssssssssss" , state.editor.previewMode);
    },
    toggleLiveMode(state, action) {
      state.editor.liveMode = action.payload.value;
      // console.log("^^^^ newSelectedElement &&&", state.editor.liveMode);
    },
    redo(state) {
      if (state.history.currentIndex < state.history.history.length - 1) {
        state.history.currentIndex++;
        state.editor = state.history.history[state.history.currentIndex];
      }
    },
    undo(state) {
      if (state.history.currentIndex > 0) {
        state.history.currentIndex--;
        state.editor = state.history.history[state.history.currentIndex];
      }
    },
    loadData(state, action) {
      state.editor.elements =
        action.payload.elements || initialEditorState.elements;
      state.editor.liveMode = !!action.payload.withLive;
    },
    setFunnelPageId(state, action) {
      state.editor.funnelPageId = action.payload.funnelPageId;
      state.history.history.push({ ...state.editor });
      state.history.currentIndex++;
    },
  },
});

export const {
  addElement,
  updateElement,
  deleteElement,
  changeClickedElement,
  changeDevice,
  togglePreviewMode,
  toggleLiveMode,
  redo,
  undo,
  loadData,
  setFunnelPageId,
} = editorSlice.actions;

export default editorSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorBtns } from "../lib/constants";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content:
    | EditorElement[]
    | { href?: string; innerText?: string; src?: string };
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  previewMode: boolean;
  funnelPageId: string;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: Editor = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
  },
  device: "Desktop",
  previewMode: false,
  liveMode: false,
  funnelPageId: "",
};

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

const addAnElement = (
  // containerId,
  // elementDetails,
  editorArray: EditorElement[],
  action: PayloadAction<{ containerId: string; elementDetails: EditorElement }>
): EditorElement[] => {
  return editorArray.map((item) => {
    
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      };
    }
    return item;
  });
  // return editorArray.map((item) => {
  //   if (item.id === action.payload.containerId && Array.isArray(item.content)) {
  //     return {
  //       ...item,
  //       content: [...item.content, action.payload.elementDetails],
  //     };
  //   } else if (item.content && Array.isArray(item.content)) {
  //     return {
  //       ...item,
  //       content: addAnElement(item.content, action),
  //     };
  //   }
  //   return item;
  // });
};

const updateAnElement = (
  editorArray: EditorElement[],
  action: PayloadAction<{ elementDetails: EditorElement }>
): EditorElement[] => {
  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return { ...item, ...action.payload.elementDetails };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateAnElement(item.content, action),
      };
    }
    return item;
  });
  // return editorArray.map((item) => {
  //   if (item.id === action.payload.elementDetails.id) {
  //     return { ...item, ...action.payload.elementDetails };
  //   } else if (item.content && Array.isArray(item.content)) {
  //     return {
  //       ...item,
  //       content: updateAnElement(item.content, action),
  //     };
  //   }
  //   return item;
  // });
};

const deleteAnElement = (
  editorArray: EditorElement[],
  action: PayloadAction<{ elementDetails: EditorElement }>
): EditorElement[] => {
  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false;
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteAnElement(item.content, action);
    }
    return true;
  });
  // return editorArray.filter((item) => {
  //   if (item.id === action.payload.elementDetails.id) {
  //     return false;
  //   } else if (item.content && Array.isArray(item.content)) {
  //     item.content = deleteAnElement(item.content, action);
  //   }
  //   return true;
  // });
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addElement(state, action) {
      const updatedEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      };
      // console.log("=== updatedEditorState ===", updatedEditorState);
      
      // Update the history to include the entire updated EditorState
      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState }, // Save a copy of the updated state
      ];

      const newEditorState = {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      };

      return newEditorState;

      // const updatedEditorState = {
      //   ...state.editor,
      //   elements: addAnElement(state.editor.elements, action),
      // };
      // state.editor = updatedEditorState;
      // state.history.history.push({ ...updatedEditorState });
      // state.history.currentIndex++;
    },
    updateElement(state, action) {
      const updatedElements = updateAnElement(state.editor.elements, action);

      const UpdatedElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;

      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: UpdatedElementIsSelected
          ? action.payload.elementDetails
          : {
              id: "",
              content: [],
              name: "",
              styles: {},
              type: null,
            },
      };

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate }, // Save a copy of the updated state
      ];
      const updatedEditor = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      };
      return updatedEditor;
    },
    deleteElement(state, action) {
      const updatedElements = deleteAnElement(state.editor.elements, action);
      const updatedEditorState = {
        ...state.editor,
        elements: updatedElements,
      };
      state.editor = updatedEditorState;
      
      state.history.history.push({ ...updatedEditorState });
      state.history.currentIndex++;
    },
    changeClickedElement(state, action) {
      // console.log("====  CHANGE_CLICKED_ELEMENT Action ====", action.payload.elementDetails);
      state.editor.selectedElement = action.payload.elementDetails;
      console.log("^^^^ newSelectedElement &&&", state.editor.selectedElement);

      state.history.history.push({ ...state.editor });
      state.history.currentIndex++;
    },
    changeDevice(state, action) {
      state.editor.device = action.payload.device;
    },
    togglePreviewMode(state) {
      state.editor.previewMode = !state.editor.previewMode;
      console.log("ssssssssssssssssssssssssssssssss" , state.editor.previewMode);
    },
    toggleLiveMode(state, action) {
      state.editor.liveMode = action.payload.value;
      // console.log("^^^^ newSelectedElement &&&", state.editor.liveMode);
    },
    redo(state) {
      if (state.history.currentIndex < state.history.history.length - 1) {
        state.history.currentIndex++;
        state.editor = state.history.history[state.history.currentIndex];
      }
    },
    undo(state) {
      if (state.history.currentIndex > 0) {
        state.history.currentIndex--;
        state.editor = state.history.history[state.history.currentIndex];
      }
    },
    loadData(state, action) {
      state.editor.elements =
        action.payload.elements || initialEditorState.elements;
      state.editor.liveMode = !!action.payload.withLive;
    },
    setFunnelPageId(state, action) {
      state.editor.funnelPageId = action.payload.funnelPageId;
      state.history.history.push({ ...state.editor });
      state.history.currentIndex++;
    },
  },
});

export const {
  addElement,
  updateElement,
  deleteElement,
  changeClickedElement,
  changeDevice,
  togglePreviewMode,
  toggleLiveMode,
  redo,
  undo,
  loadData,
  setFunnelPageId,
} = editorSlice.actions;

export default editorSlice.reducer;
