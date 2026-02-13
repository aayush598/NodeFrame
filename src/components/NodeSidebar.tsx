import React, { useState } from 'react';
import { useNodeRegistry } from '../hooks/useNodeRegistry';
import { Search, ChevronLeft, ChevronRight, LayoutGrid, Info } from 'lucide-react';

interface NodeSidebarProps {
    className?: string;
}

export const NodeSidebar: React.FC<NodeSidebarProps> = ({ className = '' }) => {
    const { getAll } = useNodeRegistry();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const nodes = getAll();

    const filteredNodes = nodes.filter(node =>
        node.config.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.config.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const categories = Array.from(new Set(nodes.map(n => n.config.category || 'General')));

    if (isCollapsed) {
        return (
            <div className={`w-12 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4 ${className}`}>
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-2 hover:bg-gray-100 rounded-md text-gray-500"
                >
                    <ChevronRight size={20} />
                </button>
                <div className="flex flex-col gap-4 mt-4">
                    <LayoutGrid size={20} className="text-gray-400" />
                </div>
            </div>
        );
    }

    return (
        <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col h-full transition-all overflow-hidden ${className}`}>
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                    <LayoutGrid size={16} className="text-gray-600" />
                    <span className="font-bold text-gray-700 uppercase text-xs tracking-wider">Components</span>
                </div>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500"
                >
                    <ChevronLeft size={16} />
                </button>
            </div>

            <div className="p-3 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-6">
                {categories.map(category => {
                    const categoryNodes = filteredNodes.filter(n => (n.config.category || 'General') === category);
                    if (categoryNodes.length === 0) return null;

                    return (
                        <div key={category} className="space-y-2">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                {category}
                            </h3>
                            <div className="space-y-1">
                                {categoryNodes.map(node => (
                                    <div
                                        key={node.type}
                                        className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent bg-white hover:border-gray-200 hover:shadow-sm transition-all cursor-grab active:cursor-grabbing group"
                                        onDragStart={(event) => onDragStart(event, node.type)}
                                        draggable
                                    >
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shrink-0"
                                            style={{ backgroundColor: node.config.color || '#3b82f6' }}
                                        >
                                            {node.config.icon || <div className="w-2 h-2 rounded-full bg-white opacity-40" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-gray-700 truncate group-hover:text-blue-600 transition-colors">{node.config.label}</div>
                                            <div className="text-[10px] text-gray-400 capitalize truncate">{node.type}</div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Info size={12} className="text-gray-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                <span className="text-[10px] text-gray-400 uppercase font-medium">Drag to add</span>
            </div>
        </aside>
    );
};
