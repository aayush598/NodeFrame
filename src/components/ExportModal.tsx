import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Package } from 'lucide-react';
import { useWorkflowContext } from '../context/WorkflowProvider';
import { WorkflowNode, WorkflowEdge, CodeExporter } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { nodeRegistry } from '../utils/nodeRegistry';
import { AlertTriangle } from 'lucide-react';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    exporters: CodeExporter[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, nodes, edges, exporters }) => {
    const [selectedExporterId, setSelectedExporterId] = useState<string>(exporters[0]?.id || '');
    const [copied, setCopied] = useState(false);

    const { selectedPlatform } = useWorkflowContext();

    React.useEffect(() => {
        if (!selectedExporterId && exporters.length > 0) {
            const initial = exporters.find(e => e.id === selectedPlatform) || exporters[0];
            setSelectedExporterId(initial.id);
        }
    }, [exporters, selectedExporterId, selectedPlatform]);

    React.useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || exporters.length === 0) return null;

    const selectedExporter = exporters.find(e => e.id === selectedExporterId) || exporters[0];
    const code = selectedExporter.generate(nodes, edges);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const ignoredNodes = nodes.filter(node => {
        const nodeType = node.type;
        if (!nodeType) return false;
        const item = nodeRegistry.get(nodeType);
        // We only care about nodes that have SOME generators but not the SELECTED one
        // Base nodes with NO generators are usually engine-level and might be handled by strategy/aggregator differently
        if (!item || !item.config.generators) return false;
        return !item.config.generators[selectedExporterId];
    });

    const handleDownload = () => {
        const fileName = (selectedExporter.fileName || 'export.txt').split('/').pop() || 'export.txt';
        const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, fileName);
    };

    const handleExportAll = async () => {
        try {
            const zip = new JSZip();

            exporters.forEach(exporter => {
                const exporterCode = exporter.generate(nodes, edges);
                zip.file(exporter.fileName, exporterCode);
            });

            const readme = `# Exported Files\n\nThis package contains following exports:\n\n${exporters.map(e => `- ${e.label}: ${e.fileName}`).join('\n')}`;
            zip.file('README.md', readme);

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'workflow-canvas-exports.zip');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to generate export.');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <FileCode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Export Logic</h2>
                            <p className="text-sm text-gray-500 font-medium">Generate production-ready code</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Exporter Selector */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-wrap gap-2">
                        {exporters.map((exporter) => (
                            <button
                                key={exporter.id}
                                onClick={() => setSelectedExporterId(exporter.id)}
                                className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${selectedExporterId === exporter.id
                                    ? 'bg-gray-900 text-white shadow-xl scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {exporter.icon}
                                {exporter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Code Preview */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-mono font-bold text-gray-500">{selectedExporter.fileName}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all text-sm font-bold active:scale-95"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} className="text-green-600" />
                                        <span className="text-green-600">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} className="text-gray-600" />
                                        <span className="text-gray-700">Copy</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200 text-sm font-bold active:scale-95"
                            >
                                <Download size={16} />
                                Download
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-0 bg-[#1e1e1e] relative">
                        {ignoredNodes.length > 0 && (
                            <div className="sticky top-0 z-10 bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-start gap-3 animate-in slide-in-from-top duration-300">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-amber-900">Platform Compatibility Warning</h4>
                                    <p className="text-xs text-amber-700 mt-0.5">
                                        The following {ignoredNodes.length} nodes do not support <strong>{selectedExporter.label}</strong> and will be skipped in this export:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {ignoredNodes.map(n => (
                                            <span key={n.id} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono text-[10px] border border-amber-200">
                                                {n.data.label || n.type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Code content */}
                        <pre className="p-6 text-sm text-gray-300 font-mono leading-relaxed">
                            <code>{code}</code>
                        </pre>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase">
                            {nodes.length} Nodes
                        </div>
                        <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase">
                            {edges.length} Edges
                        </div>
                    </div>
                    <button
                        onClick={handleExportAll}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-xl shadow-purple-100 font-bold text-sm active:scale-95"
                    >
                        <Package size={18} />
                        EXPORT BUNDLE (ZIP)
                    </button>
                </div>
            </div>
        </div>
    );
};
