import React, { useContext, useEffect, useState } from "react";
import { useNavigationListener } from "../../hooks/useNavigationListener";
import { useNavigate } from "react-router-dom";
import { defaultBorderRadius, lightGray, vscBackground, vscInputBackground } from "../../components";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { getFontSize } from "../../util";
import { IdeMessengerContext, IIdeMessenger } from "../../context/IdeMessenger";
import { PromptItem } from "@continuedev/core";

const Th = styled.th`
  padding: 0.5rem;
  text-align: left;
  border: 1px solid ${vscInputBackground};
`;

const Tr = styled.tr`
  overflow-wrap: anywhere;

  border: 1px solid ${vscInputBackground};
`;

const Td = styled.td`
  padding: 0.5rem;
  border: 1px solid ${vscInputBackground};
`;

const PublishButton = styled.div`
  width: fit-content;
  margin-right: auto;
  margin-left: auto;

  font-size: ${getFontSize() - 2}px;

  border: 0.5px solid ${lightGray};
  border-radius: ${defaultBorderRadius};
  padding: 4px 8px;
  color: ${lightGray};
  &:hover {
    background-color: ${vscInputBackground};
  }
  cursor: pointer;
`;

async function getPromptList(ideMessenger: IIdeMessenger): Promise<PromptItem[]> {
  const result = await ideMessenger.request("config/listPromptFile", undefined);

  return result.status === "success" ? result.content : [];
}

const PromptLocal: React.FC = () => {
  const ideMessenger = useContext(IdeMessengerContext);

  useNavigationListener();
  const navigate = useNavigate();

  const [listPrompt, setListPrompt] = useState<PromptItem[]>([]);

  useEffect(() => {
    console.log("Getting prompt list");
    getPromptList(ideMessenger).then((list) => setListPrompt(list));
  }, []);

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
        <h3 className="text-lg font-bold m-2 inline-block">Back</h3>
      </div>
      <table className="w-full border-collapse">
        <thead>
        <Tr>
          <Th>Prompt Name</Th>
          <Th>Publish</Th>
        </Tr>
        </thead>
        <tbody>
        {listPrompt.map((prompt) => (
          <Tr key={prompt.name} className="">
            <Td>{prompt.name}</Td>
            <Td>
              <PublishButton
                className="mt-2 mb-4"
                onClick={() => {
                  ideMessenger.post("config/publishPrompt", {
                    name: prompt.name,
                    fileUrl: prompt.fileUrl
                  });
                }}
              >
                Publish
              </PublishButton>
            </Td>
          </Tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};


export default PromptLocal;