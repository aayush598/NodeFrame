import { FlowcraftNode, FlowcraftEdge, NodeRegistryItem } from '../types';

export interface GenerationStrategy<TStage = any, TFinal = any> {
    /**
     * Initialize the accumulator for a new stage
     */
    initStage: () => TStage;

    /**
     * Process a single node's generator output and add it to the stage accumulator
     */
    processNode: (node: FlowcraftNode, generatorOutput: any, stageAccumulator: TStage) => void;

    /**
     * Transform the stage accumulator into the final stage output (e.g., add dependencies, job configuration)
     */
    finalizeStage: (stageAccumulator: TStage, stageName: string, dependencies: string[]) => any;

    /**
     * Combine all finalized stages into the final result structure
     */
    combineStages: (stageOutputs: Map<string, any>) => TFinal;
}

export interface GeneratorConfig<TResult = any> {
    platform: string;
    strategy: GenerationStrategy<any, TResult>;
    /**
     * Optional wrapper to add global configuration around the generated result
     */
    wrapper?: (result: TResult, triggers: any, nodes: FlowcraftNode[]) => any;
    formatter?: (data: any) => string;
    triggerAggregator?: (nodes: FlowcraftNode[]) => any;
}

export interface RegistryInterface {
    get(type: string): NodeRegistryItem | undefined;
}

// Pre-defined Strategies

/**
 * Strategy for accumulating simple flat lists of outputs (e.g. lines of code)
 */
export const FlatStrategy: GenerationStrategy<string[], string> = {
    initStage: () => [],
    processNode: (_node, output, acc) => acc.push(typeof output === 'string' ? output : JSON.stringify(output)),
    finalizeStage: (acc) => acc.join('\n'),
    combineStages: (stages) => Array.from(stages.values()).join('\n')
};

/**
 * Strategy for standard CI/CD workflows (Steps -> Jobs)
 */
export const WorkflowStrategy: GenerationStrategy<any[], Record<string, any>> = {
    initStage: () => [],
    processNode: (_node, output, acc) => {
        if (Array.isArray(output)) acc.push(...output);
        else if (output) acc.push(output);
    },
    finalizeStage: (steps, _name, deps) => {
        if (steps.length === 0) return null;
        const job: any = { steps };
        if (deps.length > 0) job.needs = deps;
        return job;
    },
    combineStages: (stages) => {
        const jobs: Record<string, any> = {};
        stages.forEach((job, name) => {
            if (job) jobs[name.toLowerCase().replace(/\s+/g, '-')] = job;
        });
        return jobs;
    }
};

/**
 * Strategy for file-system generation (Nodes return { [filename]: content })
 */
export const FileSystemStrategy: GenerationStrategy<Record<string, string>, Record<string, string>> = {
    initStage: () => ({}),
    processNode: (_node, output, acc) => Object.assign(acc, output),
    finalizeStage: (acc) => acc,
    combineStages: (stages) => {
        const result: Record<string, string> = {};
        stages.forEach((stageFiles) => Object.assign(result, stageFiles));
        return result;
    }
};

export class CodeGenerator {
    private registry: RegistryInterface;

    constructor(registry: RegistryInterface | Map<string, NodeRegistryItem>) {
        if (registry instanceof Map) {
            this.registry = { get: (type) => registry.get(type) };
        } else {
            this.registry = registry;
        }
    }

    generate<TResult = any>(
        nodes: FlowcraftNode[],
        edges: FlowcraftEdge[],
        config: GeneratorConfig<TResult>
    ): string {
        const { strategy } = config;

        // 1. Group nodes into stages (Dependency Resolution)
        const stages = this.groupNodesByStage(nodes, edges);
        const nodeStageMap = new Map<string, string>();
        stages.forEach((stageNodes, stageName) => {
            stageNodes.forEach(n => nodeStageMap.set(n.id, stageName));
        });

        // 2. Process each stage
        const finalizedStages = new Map<string, any>();

        stages.forEach((stageNodes, stageName) => {
            // Calculate dependencies
            const dependencies = new Set<string>();
            stageNodes.forEach(node => {
                const incoming = edges.filter(e => e.target === node.id);
                incoming.forEach(edge => {
                    const sourceStage = nodeStageMap.get(edge.source);
                    if (sourceStage && sourceStage !== stageName) {
                        dependencies.add(sourceStage.toLowerCase().replace(/\s+/g, '-'));
                    }
                });
            });

            // Initialize Accumulator
            const accumulator = strategy.initStage();

            // Visit Nodes
            stageNodes.forEach(node => {
                if (!node.type) return;
                const item = this.registry.get(node.type);
                if (item && item.config.generators && item.config.generators[config.platform]) {
                    const output = item.config.generators[config.platform](node);
                    strategy.processNode(node, output, accumulator);
                }
            });

            // Finalize Stage
            const finalized = strategy.finalizeStage(accumulator, stageName, Array.from(dependencies));
            if (finalized) {
                finalizedStages.set(stageName, finalized);
            }
        });

        // 3. Combine Stages
        const combinedResult = strategy.combineStages(finalizedStages);

        // 4. Global Wrappers & Triggers
        let triggers = {};
        if (config.triggerAggregator) {
            triggers = config.triggerAggregator(nodes);
        }

        const finalData = config.wrapper
            ? config.wrapper(combinedResult, triggers, nodes)
            : combinedResult;

        // 5. Format
        if (config.formatter) {
            return config.formatter(finalData);
        }

        // Default to JSON if result is object, or string if string
        return typeof finalData === 'string'
            ? finalData
            : JSON.stringify(finalData, null, 2);
    }

    private groupNodesByStage(nodes: FlowcraftNode[], edges: FlowcraftEdge[]): Map<string, FlowcraftNode[]> {
        const stages = new Map<string, FlowcraftNode[]>();
        const visited = new Set<string>();

        const triggerNodes = nodes.filter(n =>
            (n.data?.config?.category === 'Triggers') || // Check data.config if available
            (n.type && n.type.toLowerCase().includes('trigger')) ||
            !edges.some(e => e.target === n.id)
        );

        const startNodes = triggerNodes.length > 0 ? triggerNodes : (nodes.length > 0 ? [nodes[0]] : []);
        if (startNodes.length === 0) return stages;

        const queue: Array<{ node: FlowcraftNode; stage: number }> = startNodes.map(n => ({ node: n, stage: 0 }));

        while (queue.length > 0) {
            const { node, stage } = queue.shift()!;
            if (visited.has(node.id)) continue;
            visited.add(node.id);

            const stageName = `stage-${stage}`;
            if (!stages.has(stageName)) {
                stages.set(stageName, []);
            }
            stages.get(stageName)!.push(node);

            const childrenEdges = edges.filter(e => e.source === node.id);
            childrenEdges.forEach(edge => {
                const child = nodes.find(n => n.id === edge.target);
                if (child) {
                    queue.push({ node: child, stage: stage + 1 });
                }
            });
        }

        return stages;
    }
}
