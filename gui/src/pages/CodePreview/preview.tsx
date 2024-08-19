import React, { useState } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { getLocalStorage } from "../../util/localStorage";
import { lightGray, Select, vscBackground } from "../../components";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigationListener } from "../../hooks/useNavigationListener";
import { useNavigate } from "react-router-dom";
import { PreviewProps } from "./utils";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react/unstyled";
import dedent from "dedent";
import { dracula as draculaTheme } from "@codesandbox/sandpack-themes";
import MermaidPreview from "./MermaidPreview";
import SandPackPreview from "./SandPackPreview";


const PreviewCode: React.FC = () => {
  useNavigationListener();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<string>("forest");

  const previewInfo: PreviewProps = getLocalStorage("previewInfo") ?? { text: "", showCode: false, language: "" };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  return (
    <div className="overflow-y-scroll overflow-x-hidden">
      <div
        className="items-center flex m-0 p-0 sticky top-0"
        style={{
          borderBottom: `0.5px solid ${lightGray}`,
          backgroundColor: vscBackground,
        }}
      >
        <ArrowLeftIcon
          width="1.2em"
          height="1.2em"
          onClick={() => navigate("/")}
          className="inline-block ml-4 cursor-pointer"
        />
        <h3 className="text-lg font-bold m-2 inline-block">Back {previewInfo.language}</h3>
      </div>
      <div>
        <label htmlFor="theme-select">Select Theme: </label>
        <Select
          id="theme-select"
          defaultValue="forest"
          onChange={handleThemeChange}
        >
          <option value="default">Default</option>
          <option value="dark">Dark</option>
          <option value="forest">Forest</option>
          <option value="neutral">Neutral</option>
        </Select>
      </div>
      <SandPackPreview theme={theme} previewInfo={previewInfo} />

    </div>
  );
}



export default PreviewCode;