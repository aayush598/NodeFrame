
declare module 'reactflow' {
    import * as React from 'react';

    export interface Node<T = any> {
        id: string;
        position: { x: number; y: number };
        data: T;
        type?: string;
        style?: React.CSSProperties;
        className?: string;
        targetPosition?: Position;
        sourcePosition?: Position;
        hidden?: boolean;
        selected?: boolean;
        dragging?: boolean;
        draggable?: boolean;
        selectable?: boolean;
        connectable?: boolean;
        deletable?: boolean;
        dragHandle?: string;
        width?: number | null;
        height?: number | null;
        parentNode?: string;
        zIndex?: number;
        extent?: 'parent' | { x: number; y: number; width: number; height: number } | [number, number];
        expandParent?: boolean;
        ariaLabel?: string;
        [key: string]: any;
    }

    export interface Edge<T = any> {
        id: string;
        type?: string;
        source: string;
        target: string;
        sourceHandle?: string | null;
        targetHandle?: string | null;
        label?: string | React.ReactNode;
        labelStyle?: React.CSSProperties;
        labelShowBg?: boolean;
        labelBgStyle?: React.CSSProperties;
        labelBgPadding?: [number, number];
        labelBgBorderRadius?: number;
        style?: React.CSSProperties;
        animated?: boolean;
        hidden?: boolean;
        deletable?: boolean;
        selected?: boolean;
        className?: string;
        sourceNode?: Node;
        targetNode?: Node;
        markerEnd?: any;
        markerStart?: any;
        zIndex?: number;
        ariaLabel?: string;
        interactionWidth?: number;
        data?: T;
        [key: string]: any;
    }

    export interface NodeProps<T = any> {
        id: string;
        type: string;
        data: T;
        selected: boolean;
        isConnectable: boolean;
        xPos: number;
        yPos: number;
        dragging: boolean;
        zIndex: number;
        targetPosition?: Position;
        sourcePosition?: Position;
        dragHandle?: string;
        [key: string]: any;
    }

    export type NodeTypes = Record<string, React.ComponentType<NodeProps>>;
    export type EdgeTypes = Record<string, React.ComponentType<any>>;

    export type Connection = {
        source: string | null;
        target: string | null;
        sourceHandle: string | null;
        targetHandle: string | null;
    };

    export enum Position {
        Left = 'left',
        Top = 'top',
        Right = 'right',
        Bottom = 'bottom'
    }

    export enum BackgroundVariant {
        Lines = 'lines',
        Dots = 'dots',
        Cross = 'cross'
    }

    export type XYPosition = {
        x: number;
        y: number;
    };

    export interface ReactFlowProps {
        nodes?: Node[];
        edges?: Edge[];
        onNodesChange?: any;
        onEdgesChange?: any;
        onConnect?: any;
        nodeTypes?: NodeTypes;
        edgeTypes?: EdgeTypes;
        fitView?: boolean;
        snapToGrid?: boolean;
        snapGrid?: [number, number];
        defaultViewport?: { x: number; y: number; zoom: number };
        attributionPosition?: string;
        proOptions?: any;
        className?: string;
        children?: React.ReactNode;
        [key: string]: any;
    }

    const ReactFlow: React.FC<ReactFlowProps>;
    export default ReactFlow;

    export const Background: React.FC<any>;
    export const Controls: React.FC<any>;
    export const MiniMap: React.FC<any>;
    export const Panel: React.FC<any>;
    export const Handle: React.FC<any>;
    export const ReactFlowProvider: React.FC<any>;

    export function useNodesState(initialNodes: Node[]): [Node[], React.Dispatch<React.SetStateAction<Node[]>>, any];
    export function useEdgesState(initialEdges: Edge[]): [Edge[], React.Dispatch<React.SetStateAction<Edge[]>>, any];
    export function addEdge(edgeParams: Edge | Connection, edges: Edge[]): Edge[];
}
