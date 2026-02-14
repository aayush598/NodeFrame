import { FlowcraftNode, FlowcraftEdge, CodeGenerator, WorkflowStrategy } from '@nodeframe';
import { nodeRegistry } from '@nodeframe/utils/nodeRegistry';
import yaml from 'js-yaml';

export class GitLabCIGenerator {
    private generator: CodeGenerator;
    private nodes: FlowcraftNode[];
    private edges: FlowcraftEdge[];

    constructor(nodes: FlowcraftNode[], edges: FlowcraftEdge[]) {
        this.nodes = nodes;
        this.edges = edges;
        this.generator = new CodeGenerator(nodeRegistry);
    }

    generate(): string {
        return this.generator.generate(this.nodes, this.edges, {
            platform: 'gitlab',
            strategy: {
                ...WorkflowStrategy,
                finalizeStage: (jobs, _stageName, _deps) => {
                    if (!jobs || jobs.length === 0) return null;
                    return jobs;
                },
                combineStages: (stageOutputs) => {
                    const config: any = { stages: [] };
                    const jobs: any = {};

                    stageOutputs.forEach((jobPartials: any[], stageName: string) => {
                        const cleanStageName = stageName.toLowerCase();
                        config.stages.push(cleanStageName);

                        // Merge all scripts from all nodes in this stage into one job
                        const scripts: string[] = [];
                        let image = undefined;
                        let services = undefined;
                        let cache = undefined;
                        let only = undefined;

                        jobPartials.forEach((partial: any) => {
                            if (partial.script) scripts.push(...partial.script);
                            if (partial.image) image = partial.image;
                            if (partial.services) services = partial.services;
                            if (partial.cache) cache = partial.cache;
                            if (partial.only) only = partial.only;
                        });

                        if (scripts.length > 0) {
                            jobs[cleanStageName] = {
                                stage: cleanStageName,
                                script: scripts,
                                image,
                                services,
                                cache,
                                only: only ? { refs: only } : undefined
                            };
                        }
                    });

                    return { ...config, ...jobs };
                }
            },
            wrapper: (config, _triggers) => {
                return config;
            },
            formatter: (data) => yaml.dump(data, { lineWidth: -1, noRefs: true })
        });
    }
}
