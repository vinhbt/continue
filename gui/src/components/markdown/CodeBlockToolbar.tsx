import {
  ArrowLeftEndOnRectangleIcon,
  CheckIcon,
  ClipboardIcon,
  PlayIcon,
  CommandLineIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  defaultBorderRadius,
  lightGray,
  vscEditorBackground,
  vscForeground,
} from "..";
import { IdeMessengerContext } from "../../context/IdeMessenger";
import { useWebviewListener } from "../../hooks/useWebviewListener";
import { incrementNextCodeBlockToApplyIndex } from "../../redux/slices/uiStateSlice";
import { getFontSize, getMetaKeyLabel, isJetBrains } from "../../util";
import FileIcon from "../FileIcon";
import ButtonWithTooltip from "../ButtonWithTooltip";
import { CopyButton as CopyButtonHeader } from "./CopyButton";
import { ToolbarButtonWithTooltip } from "./ToolbarButtonWithTooltip";
import { getBasename } from "core/util";
import { setLocalStorage } from "../../util/localStorage";
import { useNavigate } from "react-router-dom";

const ToolbarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: inherit;
  font-size: ${getFontSize() - 2}px;
  padding: 3px;
  padding-left: 4px;
  padding-right: 4px;
  border-bottom: 0.5px solid ${lightGray}80;
  margin: 0;
`;

export const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  border: none;
  outline: none;
  background: transparent;

  color: ${vscForeground};
  font-size: ${getFontSize() - 2}px;

  &:hover {
    cursor: pointer;
  }
`;

const HoverDiv = styled.div`
  position: sticky;
  top: 0;
  left: 100%;
  height: 0;
  width: 0;
  overflow: visible;
  z-index: 100;
`;

const InnerHoverDiv = styled.div<{ bottom: boolean }>`
  position: absolute;
  ${(props) => (props.bottom ? "bottom: 3px;" : "top: -11px;")}
  right: 10px;
  display: flex;
  padding: 1px 2px;
  gap: 4px;
  border: 0.5px solid #8888;
  border-radius: ${defaultBorderRadius};
  background-color: ${vscEditorBackground};
`;

interface CodeBlockToolBarProps {
  text: string;
  bottom: boolean;
  language: string | undefined;
  isNextCodeBlock: boolean;
  filepath?: string;
}

const terminalLanguages = ["bash", "sh"];
const commonTerminalCommands = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
  "deno",
  "npx",
  "cd",
  "ls",
  "pwd",
  "pip",
  "python",
  "node",
  "git",
  "curl",
  "wget",
  "rbenv",
  "gem",
  "ruby",
  "bundle",
];

function isTerminalCodeBlock(language: string | undefined, text: string) {
  return (
    terminalLanguages.includes(language) ||
    ((!language || language?.length === 0) &&
      (text.trim().split("\n").length === 1 ||
        commonTerminalCommands.some((c) => text.trim().startsWith(c))))
  );
}

function getTerminalCommand(text: string): string {
  return text.startsWith("$ ") ? text.slice(2) : text;
}

function CodeBlockToolBar(props: CodeBlockToolBarProps) {
  const ideMessenger = useContext(IdeMessengerContext);
  const dispatch = useDispatch();
  const isTerminal = isTerminalCodeBlock(props.language, props.text);
  const [showAcceptReject, setShowAcceptReject] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  // Handle apply keyboard shortcut
  useWebviewListener(
    "applyCodeFromChat",
    async () => {
      await ideMessenger.request("applyToCurrentFile", {
        text: props.text,
      });
      dispatch(incrementNextCodeBlockToApplyIndex({}));
    },
    [props.isNextCodeBlock, props.text],
    !props.isNextCodeBlock,
  );

  function onClickCopy() {
    if (isJetBrains()) {
      ideMessenger.request("copyText", { text: props.text });
    } else {
      navigator.clipboard.writeText(props.text);
    }

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  function onClickApply() {
    if (isApplying) return;

    if (isTerminal) {
      ideMessenger.ide.runCommand(getTerminalCommand(props.text));
    } else {
      ideMessenger.post("applyToCurrentFile", { text: props.text });
      setIsApplying(true);
      setTimeout(() => setIsApplying(false), 2000);
      setShowAcceptReject(true);
    }
  }

  function onClickHeader() {
    // TODO: Need to turn into relative or fq path
    ideMessenger.post("showFile", {
      filepath: props.filepath,
    });
  }

  function onClickAccept() {
    ideMessenger.post("acceptDiff", { filepath: props.filepath });
    setShowAcceptReject(false);
  }

  function onClickReject() {
    ideMessenger.post("rejectDiff", { filepath: props.filepath });
    setShowAcceptReject(false);
  }

  if (!props.filepath) {
    return (
      <HoverDiv>
        <InnerHoverDiv bottom={props.bottom || false}>
          {!isJetBrains() && isTerminal && (
            <ButtonWithTooltip
              text="Run in terminal"
              disabled={isApplying}
              style={{ backgroundColor: vscEditorBackground }}
              onClick={onClickApply}
            >
              <CommandLineIcon className="w-4 h-4" />
            </ButtonWithTooltip>
          )}
          <ButtonWithTooltip
            text="Insert at cursor"
            style={{ backgroundColor: vscEditorBackground }}
            onClick={() =>
              ideMessenger.post("insertAtCursor", { text: props.text })
            }
          >
            <ArrowLeftEndOnRectangleIcon className="w-4 h-4" />
          </ButtonWithTooltip>
          <ButtonWithTooltip
            text="Preview Code"
            style={{ backgroundColor: vscEditorBackground }}
            onClick={() => {
              // ideMessenger.post("insertAtCursor", { text: props.text });
              setLocalStorage("previewInfo", { text: props.text, showCode: true, language: props.language });
              navigate("/preview");
            }}
          >
            <EyeIcon className="w-4 h-4" />
          </ButtonWithTooltip>

          <CopyButtonHeader text={props.text} />
        </InnerHoverDiv>
      </HoverDiv>
    );
  }

  return (
    <ToolbarDiv>
      <div
        className="flex items-center cursor-pointer py-0.5 px-0.5 max-w-[50%]"
        onClick={onClickHeader}
      >
        <FileIcon filename={props.filepath} height="18px" width="18px" />
        <div className="ml-1 truncate">
          <span className="hover:brightness-125 truncate inline-block w-full">
            {getBasename(props.filepath)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ToolbarButton onClick={onClickCopy}>
          <div
            className="flex items-center gap-1 hover:brightness-125 transition-colors duration-200"
            style={{ color: lightGray }}
          >
            {isCopied ? (
              <>
                <CheckIcon className="w-3 h-3 text-green-500 hover:brightness-125" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <ClipboardIcon className="w-3 h-3 hover:brightness-125" />
                <span className="hidden xs:inline">Copy</span>
              </>
            )}
          </div>
        </ToolbarButton>

        {!isJetBrains() && (
          <div className="flex">
            {!showAcceptReject ? (
              <ToolbarButton
                onClick={onClickApply}
                style={{ color: lightGray }}
              >
                <div
                  className="flex items-center gap-1 hover:brightness-125 transition-colors duration-200"
                  style={{ color: lightGray }}
                >
                  <PlayIcon className="w-3 h-3" />
                  <span className="hidden xs:inline">Apply</span>
                </div>
              </ToolbarButton>
            ) : (
              <>
                <ToolbarButtonWithTooltip
                  onClick={onClickReject}
                  tooltipContent={`${getMetaKeyLabel()}⇧⌫`}
                >
                  <XMarkIcon className="w-4 h-4 text-red-500 hover:brightness-125 mr-1" />
                  <div className="flex items-center gap-1 hover:brightness-125 transition-colors duration-200 ">
                    <span>Reject</span>
                  </div>
                </ToolbarButtonWithTooltip>

                <ToolbarButtonWithTooltip
                  onClick={onClickAccept}
                  tooltipContent={`${getMetaKeyLabel()}⇧⏎`}
                >
                  <CheckIcon className="w-4 h-4 text-green-500 hover:brightness-125 mr-1" />
                  <div className="flex items-center gap-1 hover:brightness-125 transition-colors duration-200">
                    <span>Accept</span>
                  </div>
                </ToolbarButtonWithTooltip>
              </>
            )}
          </div>
        )}
      </div>
    </ToolbarDiv>
  );
}

export default CodeBlockToolBar;
