import type { LinkType, NodeType, RawData } from "../App";

// Transform backend data to react-force-graph format
export function transformData(data: RawData) {
  const nodes: NodeType[] = data.nodes.map((node) => ({
    id: node.id,
    label: node.labels[0] || "Unknown",
    properties: node.properties,
  }));

  const links: LinkType[] = data.relationships.map((rel) => ({
    source: String(rel.startNode),
    target: String(rel.endNode),
    label: rel.type,
  }));

  return { nodes, links };
}
