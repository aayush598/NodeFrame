import React from 'react';
import { Play, Code, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface NodeActionsProps {
    status?: 'idle' | 'executing' | 'success' | 'error';
    onRun?: () => void;
    onCopyCode?: () => void;
    className?: string;
    showLabels?: boolean;
}

export const NodeActions: React.FC<NodeActionsProps> = ({
    status = 'idle',
    onRun,
    onCopyCode,
    className = '',
    showLabels = false,
}) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (onCopyCode) {
            onCopyCode();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={`flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 ${className}`}>
            <div className="flex-1 flex items-center gap-2">
                {status === 'executing' && (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                )}
                {status === 'success' && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {status !== 'idle' && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${status === 'success' ? 'text-green-600' :
                        status === 'error' ? 'text-red-600' :
                            'text-blue-600'
                        }`}>
                        {status}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1">
                {onCopyCode && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy();
                        }}
                        title="Copy logic code"
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors relative group"
                    >
                        {copied ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                            <Code className="w-3.5 h-3.5" />
                        )}
                        {showLabels && <span className="text-xs ml-1 font-medium">Copy Code</span>}

                        {/* Tooltip */}
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {copied ? 'Copied!' : 'Copy logic code'}
                        </span>
                    </button>
                )}

                {onRun && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRun();
                        }}
                        disabled={status === 'executing'}
                        title="Run node"
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${status === 'executing'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95'
                            }`}
                    >
                        <Play className={`w-3 h-3 ${status === 'executing' ? 'opacity-0' : ''}`} fill="currentColor" />
                        <span>RUN</span>
                    </button>
                )}
            </div>
        </div>
    );
};
