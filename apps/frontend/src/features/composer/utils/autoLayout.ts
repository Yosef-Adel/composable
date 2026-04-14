import dagre from '@dagrejs/dagre';
import type { Node, Edge } from 'reactflow';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 140;

export type LayoutDirection = 'TB' | 'LR';

export function autoLayout(
  nodes: Node[],
  edges: Edge[],
  direction: LayoutDirection = 'TB',
): Node[] {
  if (nodes.length === 0) return nodes;

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    nodesep: 60,
    ranksep: 80,
    edgesep: 20,
    marginx: 40,
    marginy: 40,
  });

  for (const node of nodes) {
    const isService = node.type === 'service';
    g.setNode(node.id, {
      width: isService ? NODE_WIDTH : 160,
      height: isService ? NODE_HEIGHT : 60,
    });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    const isService = node.type === 'service';
    const w = isService ? NODE_WIDTH : 160;
    const h = isService ? NODE_HEIGHT : 60;

    return {
      ...node,
      position: {
        x: pos.x - w / 2,
        y: pos.y - h / 2,
      },
    };
  });
}
