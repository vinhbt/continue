import React, { useEffect } from "react";
import mermaid from "mermaid";
import { lightGray, vscBackground, vscEditorBackground, vscListActiveBackground } from "../../components";

const MermaidPreview: React.FC<{ chart: string }> = ({ chart }) => {
  useEffect(() => {
    mermaid.initialize({
      theme: "forest",
      themeVariables: {
        background: "#faf4d3",
        primaryColor: "#ff6347",
        secondaryColor: "#4e79a7",
        fontFamily: "Arial, sans-serif",
      },
    });
    mermaid.contentLoaded(); // This will render the Mermaid diagrams
  }, [chart]);

  return (
      <div className="mermaid mx-auto grow flex flex-col min-w-[300px] p-5 max-w-full overflow-auto"
           style={{
             borderBottom: `0.5px solid ${lightGray}`,
             backgroundColor: "#faf4d3",
           }}
      >
        {chart}
      </div>
  );
};

export default MermaidPreview;
