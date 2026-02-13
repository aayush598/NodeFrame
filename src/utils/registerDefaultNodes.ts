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
        color: '#10b981',
        icon: React.createElement(Play, { size: 16 }),
        defaultData: {
            onExecute: () => {
                console.log('Workflow Started');
                return { message: 'Workflow Started', timestamp: Date.now() };
            },
            code: `// Start Node Logic\nreturn { started: true, time: Date.now() };`
        }
    });

    nodeRegistry.register('end', EndNode, {
        id: 'end',
        type: 'end',
        label: 'End',
        category: 'Engine',
        color: '#ef4444',
        icon: React.createElement(Square, { size: 16 }),
        defaultData: {
            onExecute: (inputs: any) => {
                console.log('Workflow Completed with inputs:', inputs);
                return { message: 'Workflow Completed', finalData: inputs };
            },
            code: `// End Node Logic\nconsole.log("Workflow Complete");\nreturn { completed: true };`
        }
    });

    nodeRegistry.register('action', ActionNode, {
        id: 'action',
        type: 'action',
        label: 'Action',
        category: 'Logic',
        color: '#3b82f6',
        icon: React.createElement(Zap, { size: 16 }),
        defaultData: {
            onExecute: (inputs: any) => {
                return { ...inputs, action: 'processed' };
            },
            code: `// Action Node Logic\nconst result = { ...inputs, action: 'processed' };\nreturn result;`
        }
    });

    nodeRegistry.register('conditional', ConditionalNode, {
        id: 'conditional',
        type: 'conditional',
        label: 'Condition',
        category: 'Logic',
        color: '#f59e0b',
        icon: React.createElement(GitBranch, { size: 16 }),
        defaultData: {
            onExecute: (inputs: any) => {
                const result = Object.values(inputs).some(v => !!v);
                return result;
            },
            code: `// Conditional Node Logic\nconst result = Object.values(inputs).some(v => !!v);\nreturn result;`
        }
    });

    nodeRegistry.register('input', InputNode, {
        id: 'input',
        type: 'input',
        label: 'Input',
        category: 'Data',
        color: '#8b5cf6',
        icon: React.createElement(Download, { size: 16 }),
        defaultData: {
            onExecute: () => {
                return { userData: 'Sample Input Data' };
            },
            code: `// Input Node Logic\nreturn { userData: 'Sample Input Data' };`
        }
    });

    nodeRegistry.register('output', OutputNode, {
        id: 'output',
        type: 'output',
        label: 'Output',
        category: 'Data',
        color: '#ec4899',
        icon: React.createElement(Upload, { size: 16 }),
        defaultData: {
            onExecute: (inputs: any) => {
                return { output: 'Data Received', data: inputs };
            },
            code: `// Output Node Logic\nreturn { output: 'Data Received', data: inputs };`
        }
    });

    nodeRegistry.register('apiCall', ApiCallNode, {
        id: 'apiCall',
        type: 'apiCall',
        label: 'API Call',
        category: 'Integration',
        color: '#06b6d4',
        icon: React.createElement(Globe, { size: 16 }),
        defaultData: {
            onExecute: async (inputs: any) => {
                // Mock API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                return { status: 200, data: inputs };
            },
            code: `// API Call Logic\nconst response = await fetch('https://api.example.com/data', {\n  method: 'POST',\n  body: JSON.stringify(inputs)\n});\nreturn await response.json();`
        }
    });

    nodeRegistry.register('transform', TransformNode, {
        id: 'transform',
        type: 'transform',
        label: 'Transform',
        category: 'Integration',
        color: '#6366f1',
        icon: React.createElement(RefreshCw, { size: 16 }),
        defaultData: {
            onExecute: (inputs: any) => {
                return { ...inputs, transformed: true, timestamp: Date.now() };
            },
            code: `// Transform Node Logic\nreturn { ...inputs, transformed: true, timestamp: Date.now() };`
        }
    });
};
