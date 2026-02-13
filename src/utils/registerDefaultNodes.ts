import React from 'react';
import { nodeRegistry } from './nodeRegistry';
import { StartNode } from '../nodes/StartNode';
import { EndNode } from '../nodes/EndNode';
import { ActionNode } from '../nodes/ActionNode';
import { ConditionalNode } from '../nodes/ConditionalNode';
import { InputNode } from '../nodes/InputNode';
import { OutputNode } from '../nodes/OutputNode';
import { ApiCallNode } from '../nodes/ApiCallNode';
import { TransformNode } from '../nodes/TransformNode';
import {
    Play,
    Square,
    Zap,
    GitBranch,
    Download,
    Upload,
    Globe,
    RefreshCw
} from 'lucide-react';

export const registerDefaultNodes = () => {
    if (nodeRegistry.has('start')) return;

    nodeRegistry.register('start', StartNode, {
        id: 'start',
        type: 'start',
        label: 'Start',
        category: 'Engine',
        color: '#10b981', // green-500
        icon: React.createElement(Play, { size: 16 })
    });

    nodeRegistry.register('end', EndNode, {
        id: 'end',
        type: 'end',
        label: 'End',
        category: 'Engine',
        color: '#ef4444', // red-500
        icon: React.createElement(Square, { size: 16 })
    });

    nodeRegistry.register('action', ActionNode, {
        id: 'action',
        type: 'action',
        label: 'Action',
        category: 'Logic',
        color: '#3b82f6', // blue-500
        icon: React.createElement(Zap, { size: 16 })
    });

    nodeRegistry.register('conditional', ConditionalNode, {
        id: 'conditional',
        type: 'conditional',
        label: 'Condition',
        category: 'Logic',
        color: '#f59e0b', // amber-500
        icon: React.createElement(GitBranch, { size: 16 })
    });

    nodeRegistry.register('input', InputNode, {
        id: 'input',
        type: 'input',
        label: 'Input',
        category: 'Data',
        color: '#8b5cf6', // violet-500
        icon: React.createElement(Download, { size: 16 })
    });

    nodeRegistry.register('output', OutputNode, {
        id: 'output',
        type: 'output',
        label: 'Output',
        category: 'Data',
        color: '#ec4899', // pink-500
        icon: React.createElement(Upload, { size: 16 })
    });

    nodeRegistry.register('apiCall', ApiCallNode, {
        id: 'apiCall',
        type: 'apiCall',
        label: 'API Call',
        category: 'Integration',
        color: '#06b6d4', // cyan-500
        icon: React.createElement(Globe, { size: 16 })
    });

    nodeRegistry.register('transform', TransformNode, {
        id: 'transform',
        type: 'transform',
        label: 'Transform',
        category: 'Integration',
        color: '#6366f1', // indigo-500
        icon: React.createElement(RefreshCw, { size: 16 })
    });
};
