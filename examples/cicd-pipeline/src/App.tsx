import React, { useEffect } from 'react';
import { WorkflowCanvasCore as WorkflowCanvas, WorkflowProvider, useWorkflowContext } from 'workflow-canvas';
import { registerCICDNodes } from './utils/registerCICDNodes';
import { registerCICDExporters } from './utils/registerCICDExporters';
import { Layers } from 'lucide-react';
import 'workflow-canvas/styles/index.css';
import './styles.css';

// Register CI/CD nodes initially
registerCICDNodes();

const CICDAppContent: React.FC = () => {
    const { registerExporter } = useWorkflowContext();

    useEffect(() => {
        // Register the exporters into the WorkflowCanvas system
        registerCICDExporters(registerExporter);
    }, [registerExporter]);

    return (
        <div className="w-screen h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-4 shadow-lg border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">CI/CD Pipeline Builder</h1>
                            <p className="text-sm text-white/70 font-medium">Production-Ready visual automation</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                            v0.1.1
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Canvas */}
            <div className="flex-1 relative overflow-hidden">
                <WorkflowCanvas
                    showMinimap={true}
                    showControls={true}
                    showSidebar={true}
                />
            </div>
        </div>
    );
};

const CICDApp: React.FC = () => {
    return (
        <WorkflowProvider>
            <CICDAppContent />
        </WorkflowProvider>
    );
};

export default CICDApp;
