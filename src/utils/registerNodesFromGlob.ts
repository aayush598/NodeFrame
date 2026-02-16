import { nodeRegistry } from './nodeRegistry';
import { NodeConfig } from '../types';
import { NodeProps } from '@reactflow/core';

export const registerNodesFromGlob = (modules: Record<string, any>) => {
    Object.keys(modules).forEach((path) => {
        const module = modules[path];

        // 1. Get the Config
        const config = module.config as NodeConfig;
        if (!config) {
            console.warn(`[WorkflowCanvas] Skipped registration for ${path}: Missing 'export const config'`);
            return;
        }

        // 2. Get the Component
        // We try to find the component in a few ways:
        // a) 'export default'
        // b) 'export const [ComponentName]' where ComponentName matches config config.label (removed spaces) or something?
        // c) Just take the first valid React component found if not default.
        let component = module.default;

        if (!component) {
            // Try to find a named export that looks like a component
            const entry = Object.entries(module).find(([key, value]) => {
                return key !== 'config' && typeof value === 'function';
            });
            if (entry) {
                component = entry[1];
            }
        }

        if (!component) {
            console.warn(`[WorkflowCanvas] Skipped registration for ${path}: No component found.`);
            return;
        }

        // 3. Register
        const type = config.type || config.id;
        if (!type) {
            console.warn(`[WorkflowCanvas] Skipped registration for ${path}: Config missing 'type' or 'id'`);
            return;
        }

        // Ensure ID is set in config
        if (!config.id) config.id = type;

        nodeRegistry.register(type, component as React.ComponentType<NodeProps>, config);
        // console.log(`[WorkflowCanvas] Auto-registered node: ${type}`);
    });
};
