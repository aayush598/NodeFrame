import React, { useState } from 'react';
import { useWorkflowContext } from '../context/WorkflowProvider';
import {
    Settings,
    History,
    ChevronDown,
    ChevronRight,
    X,
    Trash2,
    Info,
    CheckCircle,
    AlertCircle,
    Clock,
    Type,
    AlignLeft
} from 'lucide-react';
import { PropertyDefinition, WorkflowNode } from '../types';

export const RightSidebar: React.FC = () => {
    const [historyExpanded, setHistoryExpanded] = useState(true);
    const [propertiesExpanded, setPropertiesExpanded] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const {
        nodes,
        updateNode,
        updateNodeProperty,
        executionHistory,
        clearHistory,
        getRegistryItem
    } = useWorkflowContext();

    const selectedNode = nodes.find(n => n.selected);
    const registryItem = selectedNode ? getRegistryItem(selectedNode.type!) : null;

    const renderPropertyInput = (prop: PropertyDefinition, node: WorkflowNode) => {
        const value = (node.data.properties && node.data.properties[prop.name] !== undefined)
            ? node.data.properties[prop.name]
            : prop.defaultValue;

        const handleChange = (newValue: any) => {
            updateNodeProperty(node.id, prop.name, newValue);
        };

        const baseInputClasses = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all";

        switch (prop.type) {
            case 'string':
            case 'number':
            case 'password':
                return (
                    <input
                        type={prop.type}
                        value={value || ''}
                        placeholder={prop.placeholder}
                        onChange={(e) => handleChange(prop.type === 'number' ? Number(e.target.value) : e.target.value)}
                        className={baseInputClasses}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        value={value || ''}
                        placeholder={prop.placeholder}
                        onChange={(e) => handleChange(e.target.value)}
                        className={`${baseInputClasses} h-20 resize-none`}
                    />
                );
            case 'boolean':
                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleChange(!value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                        <span className="text-xs text-gray-500">{value ? 'Enabled' : 'Disabled'}</span>
                    </div>
                );
            case 'select':
                return (
                    <div className="relative">
                        <select
                            value={value || ''}
                            onChange={(e) => handleChange(e.target.value)}
                            className={`${baseInputClasses} appearance-none pr-8 cursor-pointer`}
                        >
                            {prop.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                );
            default:
                return <div className="text-xs text-red-500">Unsupported type: {prop.type}</div>;
        }
    };

    if (isCollapsed) {
        return (
            <div className="w-12 h-full flex-shrink-0 bg-white border-l border-gray-200 flex flex-col items-center py-4 gap-4">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
                >
                    <ChevronRight size={20} />
                </button>
                <div className="flex flex-col gap-4 mt-4">
                    <Settings size={20} className="text-gray-400" />
                    <History size={20} className="text-gray-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 h-full flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden transition-all shadow-inner">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                        <Settings size={14} />
                    </div>
                    <span className="font-bold text-gray-800 uppercase text-[10px] tracking-widest">Inspector</span>
                </div>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                {/* Properties Section */}
                <div className="border-b border-gray-100">
                    <button
                        onClick={() => setPropertiesExpanded(!propertiesExpanded)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2 font-bold text-xs text-gray-600">
                            Node Configuration
                        </div>
                        {propertiesExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                    </button>

                    {propertiesExpanded && (
                        <div className="px-4 pb-4 space-y-5">
                            {selectedNode ? (
                                <>
                                    <div className="pb-4 border-b border-gray-100 mb-2">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                                                style={{ backgroundColor: selectedNode.data.color || '#3b82f6' }}
                                            >
                                                {selectedNode.data.icon || <Info size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900 leading-tight">
                                                    {selectedNode.data.label || selectedNode.type}
                                                </h3>
                                                <p className="text-[10px] text-gray-500 font-medium">#{selectedNode.id}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1.5 font-sans">
                                                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                                                    <Type size={12} />
                                                    <label className="text-[10px] font-bold uppercase tracking-wider">Display Label</label>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={selectedNode.data.label || ''}
                                                    onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
                                                    placeholder="Enter node label..."
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all"
                                                />
                                            </div>

                                            <div className="space-y-1.5 font-sans">
                                                <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                                                    <AlignLeft size={12} />
                                                    <label className="text-[10px] font-bold uppercase tracking-wider">Description</label>
                                                </div>
                                                <textarea
                                                    value={selectedNode.data.description || ''}
                                                    onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                                                    placeholder="Describe what this node does..."
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all h-20 resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dynamic Registry Properties */}
                                    {registryItem?.config.propertyDefinitions && registryItem.config.propertyDefinitions.length > 0 && (
                                        <div className="space-y-5 animate-in fade-in duration-300">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specific Properties</h4>
                                            </div>
                                            {registryItem.config.propertyDefinitions.map(prop => (
                                                <div key={prop.name} className="space-y-1.5 font-sans group">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                                                            {prop.label}
                                                        </label>
                                                        {prop.required && <span className="text-[10px] text-red-400 font-bold">*</span>}
                                                    </div>
                                                    {renderPropertyInput(prop, selectedNode)}
                                                    {prop.description && (
                                                        <p className="text-[10px] text-gray-400 leading-normal italic pl-1">{prop.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-12 px-6 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <Settings size={32} />
                                    </div>
                                    <h5 className="text-sm font-bold text-gray-700 mb-1">No Selection</h5>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Select a node on the canvas to inspect its configuration and properties.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* History Section */}
                <div>
                    <button
                        onClick={() => setHistoryExpanded(!historyExpanded)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2 font-bold text-xs text-gray-600">
                            Execution History
                        </div>
                        <div className="flex items-center gap-2">
                            {executionHistory.length > 0 && (
                                <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {executionHistory.length}
                                </span>
                            )}
                            {historyExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                        </div>
                    </button>

                    {historyExpanded && (
                        <div className="px-4 pb-6">
                            {executionHistory.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] text-gray-400 font-medium tracking-tight">RECENT RUNS</span>
                                        <button
                                            onClick={clearHistory}
                                            className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors px-2 py-1 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 size={12} />
                                            CLEAR
                                        </button>
                                    </div>
                                    {executionHistory.map((run) => (
                                        <div key={run.id} className="p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-100 transition-all cursor-default group overflow-hidden">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1 rounded ${run.status === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                                                        {run.status === 'success' ? (
                                                            <CheckCircle size={14} />
                                                        ) : (
                                                            <AlertCircle size={14} />
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">Run #{run.id.slice(0, 4)}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <Clock size={10} />
                                                    <span className="text-[10px] font-medium">{run.timestamp.split(', ')[1]}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div className="bg-gray-50 p-2 rounded-lg">
                                                    <span className="block text-[9px] text-gray-400 uppercase font-bold mb-0.5">Nodes</span>
                                                    <span className="text-sm font-bold text-gray-700">{run.totalNodes}</span>
                                                </div>
                                                <div className={`p-2 rounded-lg ${run.status === 'success' ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
                                                    <span className="block text-[9px] text-gray-400 uppercase font-bold mb-0.5">Status</span>
                                                    <span className={`text-sm font-bold ${run.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {run.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 mx-1">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-gray-300">
                                        <History size={24} />
                                    </div>
                                    <h5 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Empty History</h5>
                                    <p className="text-[10px] text-gray-400 px-6 mt-1 uppercase tracking-tight">Launch a workflow to see results here</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
