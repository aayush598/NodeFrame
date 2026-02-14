import React, { useState } from 'react';
import { Keyboard, ChevronDown, Copy, Clipboard, Trash2, MousePointer2, Move, ZoomIn, Box, Undo2, Redo2 } from 'lucide-react';

export const ShortcutsHelp: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const shortcuts = [
        { label: 'Undo Action', keys: ['Ctrl', 'Z'], icon: <Undo2 size={12} /> },
        { label: 'Redo Action', keys: ['Ctrl', 'Y'], icon: <Redo2 size={12} /> },
        { label: 'Copy Nodes', keys: ['Ctrl', 'C'], icon: <Copy size={12} /> },
        { label: 'Paste Nodes', keys: ['Ctrl', 'V'], icon: <Clipboard size={12} /> },
        { label: 'Delete Selection', keys: ['Del'], icon: <Trash2 size={12} /> },
        { label: 'Multi-Select', keys: ['Ctrl', 'Click'], icon: <MousePointer2 size={12} /> },
        { label: 'Box Selection', keys: ['Shift', 'Drag'], icon: <Box size={12} /> },
        { label: 'Pan Canvas', keys: ['Space', 'Drag'], icon: <Move size={12} /> },
        { label: 'Zoom', keys: ['Scroll'], icon: <ZoomIn size={12} /> },
    ];

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2 pr-3"
            >
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Keyboard size={14} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 tracking-wider">SHORTCUTS</span>
            </button>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-64 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Keyboard size={16} className="text-blue-500" />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-tighter">Keyboard Shortcuts</span>
                </div>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500"
                >
                    <ChevronDown size={14} />
                </button>
            </div>
            <div className="p-2 space-y-1">
                {shortcuts.map((s, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors group">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 group-hover:text-blue-500 transition-colors">{s.icon}</span>
                            <span className="text-[11px] font-medium text-gray-600">{s.label}</span>
                        </div>
                        <div className="flex gap-1">
                            {s.keys.map((k, ki) => (
                                <kbd key={ki} className="px-1.5 py-0.5 bg-gray-100 border-b-2 border-gray-300 rounded text-[9px] font-bold text-gray-500 min-w-[20px] text-center">
                                    {k}
                                </kbd>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 bg-blue-50 text-center">
                <p className="text-[10px] text-blue-600 font-medium">Use shortcuts for a faster workflow</p>
            </div>
        </div>
    );
};
