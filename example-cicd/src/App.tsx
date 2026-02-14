import React, { useState } from 'react';
import { FlowCanvasCore as Flowcraft, FlowProvider } from '@nodeframe';
import { registerCICDNodes } from './utils/registerCICDNodes';
import { CodeExportModal } from './components/CodeExportModal';
import { useFlow } from '@nodeframe/context/FlowProvider';
import { FileCode, Zap, Layers } from 'lucide-react';
import '@nodeframe/styles/index.css';
import './styles.css';

// Register CI/CD nodes
registerCICDNodes();

const CICDApp: React.FC = () => {
    const [isExportOpen, setIsExportOpen] = useState(false);

    return (
        <FlowProvider>
            <div className="w-screen h-screen flex flex-col bg-gray-50">
                {/* Header */}
                <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">CI/CD Pipeline Builder</h1>
                                <p className="text-sm text-white/80">Visual DevOps Automation with NodeFrame</p>
                            </div>
                        </div>
                        <ExportButton onClick={() => setIsExportOpen(true)} />
                    </div>
                </header>

                {/* Main Canvas */}
                <div className="flex-1 relative">
                    <Flowcraft
                        showMinimap={true}
                        showControls={true}
                        showSidebar={true}
                    />
                </div>

                {/* Export Modal */}
                <ExportModalWrapper isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
            </div>
        </FlowProvider>
    );
};

const ExportButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-white/90 transition-all shadow-lg font-bold group"
        >
            <FileCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Export Code</span>
            <Zap className="w-4 h-4 text-yellow-500" />
        </button>
    );
};

const ExportModalWrapper: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { nodes, edges } = useFlow();

    return <CodeExportModal isOpen={isOpen} onClose={onClose} nodes={nodes} edges={edges} />;
};

export default CICDApp;
