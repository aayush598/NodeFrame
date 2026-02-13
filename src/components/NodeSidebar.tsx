import React from 'react';
import { useNodeRegistry } from '../hooks/useNodeRegistry';
import { Search } from 'lucide-react';

interface NodeSidebarProps {
    className?: string;
}

export const NodeSidebar: React.FC<NodeSidebarProps> = ({ className = '' }) => {
    const { getAll } = useNodeRegistry();
    const [searchTerm, setSearchTerm] = React.useState('');
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

    return (
        <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col h-full ${className}`}>
            <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Nodes</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {categories.map(category => {
                    const categoryNodes = filteredNodes.filter(n => (n.config.category || 'General') === category);
                    if (categoryNodes.length === 0) return null;

                    return (
                        <div key={category}>
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                {category}
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {categoryNodes.map(node => (
                                    <div
                                        key={node.type}
                                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-grab hover:border-blue-500 hover:shadow-md transition-all group"
                                        onDragStart={(event) => onDragStart(event, node.type)}
                                        draggable
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: node.config.color || '#3b82f6' }}
                                        >
                                            {node.config.icon || <div className="w-4 h-4 rounded-sm border-2 border-white" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-800">{node.config.label}</div>
                                            <div className="text-[10px] text-gray-400 font-medium uppercase">{node.type}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};
