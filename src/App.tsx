import { useEffect, useState, useRef } from "react";
import ForceGraph2D, { type ForceGraphMethods } from "react-force-graph-2d";
import { transformData } from "./utils/transformData";

export type NodeType = {
  id: string;
  label: string;
  properties: any;
  x?: number;
  y?: number;
};

export type LinkType = {
  source: string;
  target: string;
  label: string;
};

export type RawNode = {
  id: string;
  labels: string[];
  properties: any;
};

type RawRelationship = {
  id: string;
  startNode: number;
  endNode: number;
  type: string;
  properties: any;
};

export type RawData = {
  nodes: RawNode[];
  relationships: RawRelationship[];
};

export default function App() {
  const [graphData, setGraphData] = useState<{
    nodes: NodeType[];
    links: LinkType[];
  }>({
    nodes: [],
    links: [],
  });

  const fgRef = useRef<ForceGraphMethods>();

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL)
      .then((res) => res.json())
      .then((data: RawData) => {
        setGraphData(transformData(data));
      });
  }, []);

  // Optional: increase node spacing by modifying force parameters
  useEffect(() => {
    if (!fgRef.current) return;

    const fg = fgRef.current;

    // Increase charge strength (more repulsion)
    fg.d3Force("charge")?.strength(-300);

    // Increase link distance (more spacing)
    fg.d3Force("link")?.distance(150);
  }, [graphData]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="label"
        linkCurvature={0.25}
        linkDirectionalArrowLength={10}
        linkDirectionalArrowRelPos={0.95}
        linkDirectionalArrowColor={() => "rgba(0,0,0,0.8)"}
        linkWidth={2}
        linkLabel={(link) => link.label}
        nodeLabel={(node) =>
          node.label === "Account"
            ? `Account: ${node.properties.accountNumber.toString()}`
            : `Txn: £${node.properties.amountPaid?.toLocaleString() ?? "N/A"}`
        }
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label =
            node.label === "Account"
              ? "Account"
              : `£${node.properties.amountPaid?.toLocaleString() ?? ""}`;

          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";

          // Draw node circle bigger
          ctx.fillStyle = node.label === "Account" ? "orange" : "lightblue";
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, 14, 0, 2 * Math.PI, false);
          ctx.fill();

          // Draw label below node circle
          ctx.fillStyle = "black";
          ctx.fillText(label, node.x!, node.y! + 14);
        }}
      />
    </div>
  );
}
