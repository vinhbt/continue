import React from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { getLocalStorage } from "../../util/localStorage";
import { lightGray, vscBackground } from "../../components";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigationListener } from "../../hooks/useNavigationListener";
import { useNavigate } from "react-router-dom";
import { PreviewProps } from "./utils";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react/unstyled";
import dedent from "dedent";
import { dracula as draculaTheme } from "@codesandbox/sandpack-themes";
import MermaidPreview from "./MermaidPreview";


const PreviewCode: React.FC = () => {
  useNavigationListener();
  const navigate = useNavigate();

  const previewInfo: PreviewProps = getLocalStorage("previewInfo") ?? { text: "", showCode: false, language: "" };

  let content = <p>I can't preview.</p>;
  switch (previewInfo.language) {
    case 'html':
      content = <Sandpack
        template="vanilla"
        files={{
          "/index.html": previewInfo.text,
          "/index.js": "",
        }}
        options={{
          showNavigator: true,
          showTabs: false,
          showLineNumbers: true,
          editorHeight: 400,
        }}
      />;
      break;
    case 'tsx':
      content = <SandpackProvider
        files={{
          "App.tsx": previewInfo.text,
          ...sharedFiles,
        }}
        className="flex h-full w-full grow flex-col justify-center"
        options={{ ...sharedOptions }}
        {...sharedProps}
      >
        <SandpackPreview
          className="flex h-full w-full grow flex-col justify-center p-4 md:pt-16"
          showOpenInCodeSandbox={true}
          showRefreshButton={false}
        />
      </SandpackProvider>;
      break;
    case 'mermaid':
      content = <MermaidPreview chart={ previewInfo.text} theme='forest'/>;
      break;
    default:
      content = <p>I can't preview.</p>;
  }

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
        {content}
      </div>
    </div>
  );
}

let sharedProps = {
  template: "react-ts",
  theme: draculaTheme,
  customSetup: {
    dependencies: {
      "lucide-react": "latest",
      recharts: "2.9.0",
      "react-router-dom": "latest",
      "@radix-ui/react-accordion": "^1.2.0",
      "@radix-ui/react-alert-dialog": "^1.1.1",
      "@radix-ui/react-aspect-ratio": "^1.1.0",
      "@radix-ui/react-avatar": "^1.1.0",
      "@radix-ui/react-checkbox": "^1.1.1",
      "@radix-ui/react-collapsible": "^1.1.0",
      "@radix-ui/react-dialog": "^1.1.1",
      "@radix-ui/react-dropdown-menu": "^2.1.1",
      "@radix-ui/react-hover-card": "^1.1.1",
      "@radix-ui/react-label": "^2.1.0",
      "@radix-ui/react-menubar": "^1.1.1",
      "@radix-ui/react-navigation-menu": "^1.2.0",
      "@radix-ui/react-popover": "^1.1.1",
      "@radix-ui/react-progress": "^1.1.0",
      "@radix-ui/react-radio-group": "^1.2.0",
      "@radix-ui/react-select": "^2.1.1",
      "@radix-ui/react-separator": "^1.1.0",
      "@radix-ui/react-slider": "^1.2.0",
      "@radix-ui/react-slot": "^1.1.0",
      "@radix-ui/react-switch": "^1.1.0",
      "@radix-ui/react-tabs": "^1.1.0",
      "@radix-ui/react-toast": "^1.2.1",
      "@radix-ui/react-toggle": "^1.1.0",
      "@radix-ui/react-toggle-group": "^1.1.0",
      "@radix-ui/react-tooltip": "^1.1.2",
      "class-variance-authority": "^0.7.0",
      clsx: "^2.1.1",
      "date-fns": "^3.6.0",
      "embla-carousel-react": "^8.1.8",
      "react-day-picker": "^8.10.1",
      "tailwind-merge": "^2.4.0",
      "tailwindcss-animate": "^1.0.7",
      vaul: "^0.9.1",
    },
  },
} as const;

let sharedOptions = {
  externalResources: [
    "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
  ],
};

let sharedFiles = {
  "/public/index.html": dedent`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `,
};

export default PreviewCode;