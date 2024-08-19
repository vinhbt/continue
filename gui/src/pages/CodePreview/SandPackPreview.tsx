import React from "react";
import { PreviewProps } from "./utils";
import { SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react/unstyled";
import MermaidPreview from "./MermaidPreview";
import dedent from "dedent";

const SandPackPreview: React.FC<{ theme: string, previewInfo: PreviewProps }> = ({ theme, previewInfo }) => {

  let content = <p>I can't preview.</p>;

  switch (previewInfo.language) {
    case 'html':
      content = <SandpackProvider
        template="vanilla"
        files={{
          "/index.html": previewInfo.text,
          "/index.js": "",
        }}
      >
        <SandpackPreview
          className="flex h-full w-full grow flex-col justify-center"
          showOpenInCodeSandbox={true}
          showRefreshButton={false}
        />
      </SandpackProvider>;
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
        template="react-ts"
      >
        <SandpackPreview
          className="flex h-full w-full grow flex-col justify-center"
          showOpenInCodeSandbox={true}
          showRefreshButton={false}
        />
      </SandpackProvider>;
      break;
    case 'jsx':
      content = <SandpackProvider
        files={{
          "App.js": previewInfo.text,
          ...sharedFiles,
        }}
        className="flex h-full w-full grow flex-col justify-center"
        options={{ ...sharedOptions }}
        {...sharedProps}
        template="react"
      >
        <SandpackPreview
          className="flex h-full w-full grow flex-col justify-center min-w-screen"
          showOpenInCodeSandbox={true}
          showRefreshButton={false}
        />
      </SandpackProvider>;
      break;
    case 'mermaid':
      content = <MermaidPreview chart={previewInfo.text} theme={theme} />;
      break;
    default:
      content = <p>I can't preview.</p>;
  }
  return (
    <div className="h-full w-full">
      {content}
    </div>
  );

}

export default SandPackPreview;

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