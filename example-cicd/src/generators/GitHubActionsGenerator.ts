import { WorkflowNode, WorkflowEdge, CodeGenerator, WorkflowStrategy } from 'workflow-canvas';
import { nodeRegistry } from 'workflow-canvas/utils/nodeRegistry';
import yaml from 'js-yaml';

export class GitHubActionsGenerator {
    private generator: CodeGenerator;
    private nodes: WorkflowNode[];
    private edges: WorkflowEdge[];

    constructor(nodes: WorkflowNode[], edges: WorkflowEdge[]) {
        this.nodes = nodes;
        this.edges = edges;
        this.generator = new CodeGenerator(nodeRegistry);
    }

    generate(): string {
        return this.generator.generate(this.nodes, this.edges, {
            platform: 'github',
            strategy: {
                ...WorkflowStrategy,
                finalizeStage: (steps: any[], _name, deps) => {
                    if (steps.length === 0) return null;
                    return {
                        'runs-on': 'ubuntu-latest',
                        steps: [
                            { uses: 'actions/checkout@v4' },
                            ...steps
                        ],
                        needs: deps.length > 0 ? deps : undefined
                    };
                }
            },
            wrapper: (jobs, triggers) => {
                return {
                    name: 'CI/CD Pipeline',
                    on: triggers,
                    jobs: jobs
                };
            },
            triggerAggregator: (nodes) => {
                const triggerNodes = nodes.filter(n => n.type === 'gitPushTrigger');
                if (triggerNodes.length === 0) {
                    return { push: { branches: ['main'] } };
                }

                const triggers: any = {};
                triggerNodes.forEach(node => {
                    const eventType = node.data.properties?.eventType || 'push';
                    const branches = node.data.properties?.branches || ['main'];
                    const paths = node.data.properties?.paths;

                    if (!triggers[eventType]) {
                        triggers[eventType] = {};
                    }
                    if (branches.length > 0) {
                        triggers[eventType].branches = branches;
                    }
                    if (paths && paths.length > 0) {
                        triggers[eventType].paths = paths;
                    }
                });
                return triggers;
            },
            formatter: (data) => yaml.dump(data, { lineWidth: -1, noRefs: true })
        });
    }
}
