import { createRoot } from "react-dom/client";
// @ts-ignore -- allow side-effect css import without type declarations
import "./index.css";

import * as React from "react";
import { PortalTypes } from "./utils/model/common-enums";

// Add type declarations for Vite's import.meta.env
interface ImportMetaEnv {
  readonly VITE_APP_TYPE: string;
  // add other env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const appType = import.meta.env.VITE_APP_TYPE;
console.log("this is app type", appType);
async function loadApplication() {
  if (appType === PortalTypes.ADMIN) {
    const { default: AdminApp } = await import("../src/modules/admin/App");
    createRoot(document.getElementById("root")!).render(<AdminApp />);
  } else if (appType === PortalTypes.STUDENT) {
    const { default: StudentApp } = await import("../src/modules/students/App");
    createRoot(document.getElementById("root")!).render(<StudentApp />);
  } else {
    const Fallback = () => <h1>Unknown App Type</h1>;
    createRoot(document.getElementById("root")!).render(<Fallback />);
  }
}
loadApplication();
