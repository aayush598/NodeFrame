import React, { useState } from 'react';
import { useFlow } from '../context/FlowProvider';
import { Settings, History, ChevronDown, ChevronRight, X, Trash2, Info, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const RightSidebar: React.FC = () => {
    const [historyExpanded, setHistoryExpanded] = useState(true);
    const [propertiesExpanded, setPropertiesExpanded] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { nodes, updateNode, executionHistory, clearHistory } = useFlow();

    const selectedNode = nodes.find(n => n.selected);

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
        <div className="w-80 h-full flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden transition-all">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <span className="font-bold text-gray-700 uppercase text-xs tracking-wider">Inspector</span>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                {/* Properties Section */}
                <div className="border-b border-gray-200">
                    <button
                        onClick={() => setPropertiesExpanded(!propertiesExpanded)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                            <Settings size={16} className="text-blue-500" />
                            Node Properties
                        </div>
                        {propertiesExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>

                    {propertiesExpanded && (
                        <div className="px-4 pb-4 space-y-4">
                            {selectedNode ? (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Label</label>
                                        <input
                                            type="text"
                                            value={selectedNode.data.label || ''}
                                            onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
                                        <textarea
                                            value={selectedNode.data.description || ''}
                                            onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all h-20 resize-none"
                                        />
                                    </div>
                                    <div className="pt-2">
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                                            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-blue-700 leading-relaxed">
                                                ID: <code className="bg-blue-100 px-1 rounded">{selectedNode.id}</code><br />
                                                Type: <code className="bg-blue-100 px-1 rounded">{selectedNode.type}</code>
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400">Select a node to view properties</p>
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
                        <div className="flex items-center gap-2 font-semibold text-sm text-gray-700">
                            <History size={16} className="text-purple-500" />
                            Execution History
                        </div>
                        <div className="flex items-center gap-2">
                            {executionHistory.length > 0 && (
                                <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                    {executionHistory.length}
                                </span>
                            )}
                            {historyExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                    </button>

                    {historyExpanded && (
                        <div className="px-4 pb-4">
                            {executionHistory.length > 0 ? (
                                <div className="space-y-3">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={clearHistory}
                                            className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <Trash2 size={12} />
                                            CLEAR ALL
                                        </button>
                                    </div>
                                    {executionHistory.map((run) => (
                                        <div key={run.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-all cursor-default group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {run.status === 'success' ? (
                                                        <CheckCircle size={14} className="text-green-500" />
                                                    ) : (
                                                        <AlertCircle size={14} className="text-red-500" />
                                                    )}
                                                    <span className="text-[11px] font-bold text-gray-700 uppercase">Run #{run.id.slice(0, 4)}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <Clock size={10} />
                                                    <span className="text-[10px]">{run.timestamp.split(', ')[1]}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[11px]">
                                                    <span className="text-gray-500">Nodes Executed</span>
                                                    <span className="font-bold text-gray-700">{run.totalNodes}</span>
                                                </div>
                                                <div className="flex justify-between text-[11px]">
                                                    <span className="text-gray-500">Overall Status</span>
                                                    <span className={`font-bold ${run.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {run.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-400">No execution history yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
