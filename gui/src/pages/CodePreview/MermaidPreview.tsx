import React, { useEffect } from "react";
import mermaid from "mermaid";

const MermaidPreview: React.FC<{ theme: string, chart: string }> = ({ theme, chart }) => {
  useEffect(() => {
    mermaid.initialize({
      theme: theme,
    });
    mermaid.contentLoaded(); // This will render the Mermaid diagrams
  }, [chart, theme]);

  return (
    <div className="flex h-full w-full grow flex-col justify-center">
      <div className="mermaid">
        {chart}
      </div>
    </div>
  );
};

export default MermaidPreview;
