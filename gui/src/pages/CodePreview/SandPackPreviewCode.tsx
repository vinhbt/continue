import React from "react";
import { PreviewProps } from "./utils";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import MermaidPreview from "./MermaidPreview";
import dedent from "dedent";

const SandPackPreviewCode: React.FC<{ previewInfo: PreviewProps }> = ({ previewInfo }) => {

  let content = <p>I can't preview.</p>;

  const containerClass = "relative w-full h-full min-h-[400px] overflow-auto";
  const providerClass = "flex h-full w-full grow flex-col justify-center";
  const previewClass = "flex h-full w-full grow flex-col justify-center p-4 md:pt-16";
  const fullScreenStyle= { width: "100wh", margin: "10px" }

  switch (previewInfo.language) {
    case 'html':
      content = (
          <SandpackProvider
            template="vanilla"
            files={{
              "/index.html": {
                code: previewInfo.text,
                active: true
              },
              "/index.js": {
                code: ""
              },
              "/styles.css": {
                code: ""
              },
            }}
            options={{
              visibleFiles: ["/index.html"],
              activeFile: "/index.html"
            }}
            style={ fullScreenStyle }
            className={ providerClass }
          >
            <SandpackPreview
              className={ previewClass }
              showOpenInCodeSandbox={true}
              showRefreshButton={true}
              style={ fullScreenStyle }
            />
          </SandpackProvider>
      );
      break;
    case 'tsx':
    case 'jsx':
      const template = previewInfo.language === 'tsx' ? "react-ts" : "react";
      const mainFile = `App.${previewInfo.language}`;

      content = (
        <div className={containerClass}>
          <SandpackProvider
            template={template}
            files={{
              [mainFile]: previewInfo.text,
              ...sharedFiles,
            }}
            options={{
              ...sharedOptions,
              visibleFiles: [mainFile],
            }}
            {...sharedProps}
            className={providerClass}
          >
            <SandpackPreview
              className={previewClass}
              showOpenInCodeSandbox={true}
              showRefreshButton={false}
              style={ fullScreenStyle }
            />
          </SandpackProvider>
        </div>
      );
      break;
    case 'mermaid':
      content = <MermaidPreview chart={previewInfo.text} />;
      break;
    default:
      content = <p className="p-4">I can't preview.</p>;
  }

  return (
    <div className={containerClass}>
      {content}
    </div>
  );

}

export default SandPackPreviewCode;

let sharedProps = {
  customSetup: {
    dependencies: {
      "lucide-react": "latest",
      recharts: "2.9.0",
      "react-router-dom": "latest",
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
  options: {
    editorWidthPercentage: 100,
  }
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
        <div id="app"></div>
      </body>
    </html>
  `,
};