import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigationListener } from "../../hooks/useNavigationListener";
import { useNavigate } from "react-router-dom";
import {
  defaultBorderRadius,
  lightGray,
  vscBackground,
  vscEditorBackground,
  vscInputBackground,
} from "../../components";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { getFontSize } from "../../util";
import { IdeMessengerContext, IIdeMessenger } from "../../context/IdeMessenger";
import { PromptItem, PromptPublish } from "@continuedev/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ButtonWithTooltip from "../../components/ButtonWithTooltip";
import { setDialogMessage, setShowDialog } from "../../redux/slices/uiStateSlice";
import ConfirmationDialog from "../../components/dialogs/ConfirmationDialog";

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

const DownloadButton = styled.div`
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

async function getPromptListOnFiles(ideMessenger: IIdeMessenger): Promise<PromptItem[]> {
  const result = await ideMessenger.request("config/listPromptFile", undefined);

  return result.status === "success" ? result.content : [];
}

async function getPromptListOnServer(ideMessenger: IIdeMessenger): Promise<PromptPublish[]> {
  const result = await ideMessenger.request("config/listPromptInServer", undefined);

  return result.status === "success" ? result.content : [];
}

async function publishPromptToServer(ideMessenger: IIdeMessenger, prompt: PromptItem): Promise<PromptPublish | undefined> {
  const result = await ideMessenger.request("config/publishPrompt", {
    name: prompt.name,
    fileUrl: prompt.fileUrl,
  });

  return result.status === "success" ? result.content : undefined;
}

const PromptLocal: React.FC = () => {
  const dispatch = useDispatch();
  const ideMessenger = useContext(IdeMessengerContext);

  useNavigationListener();
  const navigate = useNavigate();

  const [publishSuccessNotice, setPublishSuccessNotice] = useState<string>(null);

  const [listPromptOnFiles, setListPromptOnFiles] = useState<PromptItem[]>([]);

  const [listPromptOnServer, setListPromptOnServer] = useState<PromptPublish[]>([]);

  const selectedProfileId = useSelector(
    (store: RootState) => store.state.selectedProfileId,
  );

  useEffect(() => {
    console.log("Getting prompt list");
    getPromptListOnFiles(ideMessenger).then((list) => setListPromptOnFiles(list));
  }, [ideMessenger]);

  useEffect(() => {
    console.log("Getting prompt on server");
    if (selectedProfileId === "local") {
      setListPromptOnServer([]);
    } else {
      getPromptListOnServer(ideMessenger).then((list) => setListPromptOnServer(list));
    }
  }, [selectedProfileId, ideMessenger]);

  // Using useCallback to memoize the handleSubmitShowDialog function
  const handleSubmitShowDialog = useCallback((txt: string) => {
    console.log("Prompt handleSubmitShowDialog called");
    dispatch(setShowDialog(true));
    dispatch(
      setDialogMessage(
        <ConfirmationDialog
          text={ txt }
          hideCancelButton={true}
          confirmText="Ok"
          onConfirm={() => {
            setPublishSuccessNotice(null);
          }}
        />,
      ),
    );
  }, [dispatch, setPublishSuccessNotice]); // No dependencies, so the function is only created once

  useEffect(() => {
    if (publishSuccessNotice) {
      handleSubmitShowDialog(publishSuccessNotice);
    }
  }, [publishSuccessNotice, handleSubmitShowDialog]);

  const handleClick = useCallback(async (prompt: PromptItem) => {
    try {
      setPublishSuccessNotice(null);
      const result = await publishPromptToServer(ideMessenger, prompt);
      if (result) {
        console.log("Prompt published successfully");
        setPublishSuccessNotice("The prompt has been published successfully. You can now access it from the Prompts Library.");
      } else {
        setPublishSuccessNotice("The prompt has been published fail. Please try again.");
      }
    } catch (error) {
      setPublishSuccessNotice("An error occurred while publishing the prompt. Please try again.");
    }
  }, [ideMessenger, setPublishSuccessNotice]);

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
          {listPromptOnFiles.map((prompt) => (
            <Tr key={prompt.name} className="">
              <Td>{prompt.name}</Td>
              <Td>
                <PublishButton
                  className="mt-2 mb-4"
                  onClick={async () => void handleClick(prompt)}
                >
                  Publish
                </PublishButton>
              </Td>
            </Tr>
          ))}
        </tbody>
      </table>

      <div
        className="items-center text-center"
        style={{
          marginTop: `15px`,
          borderTop: `0.5px solid ${lightGray}`,
          borderBottom: `0.5px solid ${lightGray}`,
          backgroundColor: vscBackground,
        }}
      >
        <h3 className="text-lg font-bold m-2 inline-block">Prompts Library</h3>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <Tr>
            <Th>Prompt Name</Th>
            <Th>Show Diff</Th>
            <Th>Download</Th>
          </Tr>
        </thead>
        <tbody>
          {listPromptOnServer.map((prompt) => (
            <Tr key={prompt.name}>
              <Td>{prompt.name}</Td>
              <Td>
                <ButtonWithTooltip
                  text="Show diff"
                  style={{ backgroundColor: vscEditorBackground, border: "none" }}
                  onClick={() => {
                    const localPrompt: PromptItem | undefined = listPromptOnFiles.find((p) => p.name === prompt.name);
                    if (localPrompt) {
                      ideMessenger.post("showDiff", {
                        filepath: localPrompt.fileUrl,
                        newContents: prompt.content,
                        stepIndex: 0,
                      });
                    } else {
                      ideMessenger.post("showVirtualFile", { name: prompt.name, content: prompt.content });
                    }
                  }}
                  className="flex justify-center items-center w-full"
                >
                  <EyeIcon className="w-6 h-6" />
                </ButtonWithTooltip>
              </Td>
              <Td>
                <DownloadButton
                  className="mt-2 mb-4"
                  onClick={async () => {
                    const localPrompt: PromptItem | undefined = listPromptOnFiles.find((p) => p.name === prompt.name);
                    await ideMessenger.request("config/downloadPromptContent", {
                      name: prompt.name,
                      fileUrl: localPrompt?.fileUrl,
                      content: prompt.content,
                    });
                  }}
                >
                  Download
                </DownloadButton>
              </Td>
            </Tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PromptLocal;