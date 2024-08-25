import React, { useState } from "react";
import { getLocalStorage } from "../../util/localStorage";
import { lightGray, Select, vscBackground } from "../../components";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigationListener } from "../../hooks/useNavigationListener";
import { useNavigate } from "react-router-dom";
import { PreviewProps } from "./utils";
import SandPackPreviewCode from "./SandPackPreviewCode";


const PreviewCode: React.FC = () => {
  useNavigationListener();
  const navigate = useNavigate();

  const previewInfo: PreviewProps = getLocalStorage("previewInfo") ?? { text: "", showCode: false, language: "" };

  return (
    <div className="overflow-auto w-full">
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
      <SandPackPreviewCode previewInfo={previewInfo} />
    </div>
  );
};


export default PreviewCode;