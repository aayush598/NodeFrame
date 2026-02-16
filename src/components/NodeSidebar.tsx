import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNodeRegistry } from '../hooks/useNodeRegistry';
import { Search, ChevronRight, LayoutGrid, Info } from 'lucide-react';
import { FlowTooltip } from './FlowTooltip';
import { List, RowComponentProps } from 'react-window';
import { useWorkflowContext } from '../context/WorkflowProvider';

// Custom AutoSizer to avoid extra dependency
const AutoSizer = ({ children }: { children: (size: { width: number; height: number }) => React.ReactElement }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref.current) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // Use contentRect for accurate inner dimensions
                setSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="w-full h-full min-h-0 flex-1 overflow-hidden" style={{ height: '100%', width: '100%' }}>
            {size.height > 0 && children(size)}
        </div>
    );
};

interface NodeSidebarProps {
    className?: string;
}

type ListItem =
    | { type: 'category'; name: string }
    | { type: 'node'; data: any };

export const NodeSidebar: React.FC<NodeSidebarProps> = ({ className = '' }) => {
    const { getAll } = useNodeRegistry();
    const { exporters, selectedPlatform, setSelectedPlatform } = useWorkflowContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Memoize getAll result to prevent infinite loops if getAll() returns new array
    const allNodes = useMemo(() => getAll(), [getAll]);

    // Optimize filtering and flattening for virtualization
    const listItems = useMemo<ListItem[]>(() => {
        const filtered = allNodes.filter(node => {
            const matchesSearch = node.config.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                node.config.type.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (selectedPlatform === 'all') return true;

            // If a platform is selected, check if node supports it
            // Some nodes might be "Universal" (no generators property at all) or have a generator for this platform
            const generators = node.config.generators;
            if (!generators) return false; // Default nodes often don't have generators in this system

            return !!generators[selectedPlatform];
        });

        if (filtered.length === 0) return [];

        const grouped = new Map<string, any[]>();
        filtered.forEach(node => {
            const cat = node.config.category || 'General';
            if (!grouped.has(cat)) grouped.set(cat, []);
            grouped.get(cat)!.push(node);
        });

        const items: ListItem[] = [];
        // Sort categories
        const sortedCats = Array.from(grouped.keys()).sort();

        sortedCats.forEach(cat => {
            items.push({ type: 'category', name: cat });
            grouped.get(cat)!.forEach(node => {
                items.push({ type: 'node', data: node });
            });
        });

        return items;
    }, [allNodes, searchTerm, selectedPlatform]);

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    if (isCollapsed) {
        return (
            <div className={`w-12 h-full flex-shrink-0 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4 ${className}`}>
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

    const [tooltip, setTooltip] = useState<{
        label?: string;
        description?: string;
        platforms?: string[];
        x: number;
        y: number;
        visible: boolean;
    }>({ x: 0, y: 0, visible: false });

    const handleMouseEnter = (event: React.MouseEvent, node: any) => {
        if (node.config.label || node.config.description) {
            setTooltip({
                label: node.config.label,
                description: node.config.defaultData?.description || node.config.description,
                platforms: node.config.generators ? Object.keys(node.config.generators) : [],
                x: event.clientX,
                y: event.clientY,
                visible: true
            });
        }
    };

    const handleMouseMove = (event: React.MouseEvent) => {
        setTooltip(prev => prev.visible ? { ...prev, x: event.clientX, y: event.clientY } : prev);
    };

    const handleMouseLeave = () => {
        setTooltip(prev => ({ ...prev, visible: false }));
    };

    const Row = ({ index, style }: RowComponentProps) => {
        const item = listItems[index];

        if (item.type === 'category') {
            return (
                <div style={style}>
                    <div className="px-3 py-2 pt-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                            {item.name}
                        </h3>
                    </div>
                </div>
            );
        }

        const node = item.data;
        return (
            <div style={style}>
                <div className="px-3 pb-2 pt-1 h-full">
                    <div
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent bg-white hover:border-gray-200 hover:shadow-sm transition-all cursor-grab active:cursor-grabbing group h-full"
                        onDragStart={(event) => onDragStart(event, node.type)}
                        onMouseEnter={(e) => handleMouseEnter(e, node)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        draggable
                    >
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shrink-0"
                            style={{ backgroundColor: node.config.color || '#3b82f6' }}
                        >
                            {node.config.icon || <div className="w-2 h-2 rounded-full bg-white opacity-40" />}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="text-xs font-bold text-gray-700 truncate group-hover:text-blue-600 transition-colors">{node.config.label}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="text-[10px] text-gray-400 capitalize truncate">{node.type}</div>
                                {node.config.generators && (
                                    <div className="flex gap-0.5">
                                        {Object.keys(node.config.generators).map(p => (
                                            <div
                                                key={p}
                                                className={`w-1.5 h-1.5 rounded-full ${p === 'github' ? 'bg-black' : p === 'gitlab' ? 'bg-orange-500' : 'bg-blue-400'}`}
                                                title={`Supports ${p}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info size={12} className="text-gray-300" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getItemSize = (index: number) => {
        const item = listItems[index];
        return item.type === 'category' ? 40 : 64; // Adjusted heights
    };

    return (
        <>
            <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0 transition-all overflow-hidden ${className}`}>
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <LayoutGrid size={16} className="text-gray-600" />
                        <span className="font-bold text-gray-700 uppercase text-xs tracking-wider">Components</span>
                    </div>
                </div>

                <div className="p-3 border-b border-gray-200 flex-shrink-0 bg-white">
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search nodes..."
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {exporters.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight px-1">Generator Suite</span>
                            <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-lg">
                                <button
                                    onClick={() => setSelectedPlatform('all')}
                                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${selectedPlatform === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    ALL
                                </button>
                                {exporters.map(exp => (
                                    <button
                                        key={exp.id}
                                        onClick={() => setSelectedPlatform(exp.id)}
                                        className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${selectedPlatform === exp.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {exp.id.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-hidden" style={{ display: 'flex' }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                style={{ width, height }}
                                rowCount={listItems.length}
                                rowHeight={getItemSize}
                                rowComponent={Row}
                                rowProps={{}} // Adding empty rowProps to satisfy generic?
                            />
                        )}
                    </AutoSizer>
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center flex-shrink-0">
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Drag to add</span>
                </div>
            </aside>
            <FlowTooltip {...tooltip} />
        </>
    );
};
