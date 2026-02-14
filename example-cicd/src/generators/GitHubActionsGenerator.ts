import { FlowcraftNode, FlowcraftEdge } from '@nodeframe/types';
import yaml from 'js-yaml';

interface GitHubActionsWorkflow {
    name: string;
    on: any;
    jobs: Record<string, any>;
}

export class GitHubActionsGenerator {
    private nodes: FlowcraftNode[];
    private edges: FlowcraftEdge[];

    constructor(nodes: FlowcraftNode[], edges: FlowcraftEdge[]) {
        this.nodes = nodes;
        this.edges = edges;
    }

    generate(): string {
        const workflow: GitHubActionsWorkflow = {
            name: 'CI/CD Pipeline',
            on: this.generateTriggers(),
            jobs: this.generateJobs(),
        };

        return yaml.dump(workflow, { lineWidth: -1, noRefs: true });
    }

    private generateTriggers(): any {
        const triggerNodes = this.nodes.filter(n => n.type === 'gitPushTrigger');

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
    }

    private generateJobs(): Record<string, any> {
        const jobs: Record<string, any> = {};
        const stages = this.groupNodesByStage();

        stages.forEach((stageNodes, stageName) => {
            const jobName = stageName.toLowerCase().replace(/\s+/g, '-');

            jobs[jobName] = {
                'runs-on': 'ubuntu-latest',
                steps: this.generateSteps(stageNodes),
            };

            // Add dependencies between jobs
            const dependencies = this.getJobDependencies(stageNodes);
            if (dependencies.length > 0) {
                jobs[jobName].needs = dependencies;
            }
        });

        return jobs;
    }

    private groupNodesByStage(): Map<string, FlowcraftNode[]> {
        const stages = new Map<string, FlowcraftNode[]>();
        const visited = new Set<string>();
        const triggerNodes = this.nodes.filter(n => n.type === 'gitPushTrigger');

        // Start from trigger nodes
        const startNodes = triggerNodes.length > 0 ? triggerNodes : (this.nodes.length > 0 ? [this.nodes[0]] : []);

        if (startNodes.length === 0) return stages;

        // let stageIndex = 0; // Removed unused variable
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

            // Find connected nodes
            const outgoingEdges = this.edges.filter(e => e.source === node.id);
            outgoingEdges.forEach(edge => {
                const targetNode = this.nodes.find(n => n.id === edge.target);
                if (targetNode && !visited.has(targetNode.id)) {
                    queue.push({ node: targetNode, stage: stage + 1 });
                }
            });
        }

        return stages;
    }

    private generateSteps(nodes: FlowcraftNode[]): any[] {
        const steps: any[] = [
            { uses: 'actions/checkout@v4' }
        ];

        nodes.forEach(node => {
            const nodeSteps = this.nodeToSteps(node);
            steps.push(...nodeSteps);
        });

        return steps;
    }

    private nodeToSteps(node: FlowcraftNode): any[] {
        const steps: any[] = [];

        switch (node.type) {
            case 'installDeps':
                const pkgMgr = node.data.properties?.packageManager || 'npm';
                const cacheEnabled = node.data.properties?.cacheEnabled !== false;

                if (cacheEnabled) {
                    steps.push({
                        name: 'Cache dependencies',
                        uses: 'actions/cache@v3',
                        with: {
                            path: pkgMgr === 'npm' ? '~/.npm' : '~/.cache',
                            key: `\${{ runner.os }}-${pkgMgr}-\${{ hashFiles('**/package-lock.json') }}`,
                        }
                    });
                }

                steps.push({
                    name: node.data.label || 'Install dependencies',
                    run: node.data.properties?.installCommand || `${pkgMgr} install`,
                });
                break;

            case 'testRunner':
                const testCmd = node.data.properties?.command || 'npm test';
                const coverage = node.data.properties?.coverageEnabled === true;

                steps.push({
                    name: node.data.label || 'Run tests',
                    run: coverage ? `${testCmd} --coverage` : testCmd,
                });
                break;

            case 'buildApp':
                // const buildTool = node.data.properties?.buildTool || 'vite'; // Removed unused variable
                steps.push({
                    name: node.data.label || 'Build application',
                    run: node.data.properties?.buildCommand || `npm run build`,
                });
                break;

            case 'dockerBuild':
                const imageName = node.data.properties?.imageName || 'my-app';
                const tags = node.data.properties?.tags || ['latest'];

                steps.push({
                    name: node.data.label || 'Build Docker image',
                    run: `docker build -t ${imageName}:${tags[0]} .`,
                });

                if (node.data.properties?.push !== false) {
                    steps.push({
                        name: 'Push Docker image',
                        run: `docker push ${imageName}:${tags[0]}`,
                    });
                }
                break;

            case 'securityScan':
                const scanner = node.data.properties?.scanner || 'snyk';

                if (scanner === 'snyk') {
                    steps.push({
                        name: node.data.label || 'Security scan',
                        uses: 'snyk/actions/node@master',
                        env: {
                            SNYK_TOKEN: '\${{ secrets.SNYK_TOKEN }}',
                        }
                    });
                }
                break;

            case 'lint':
                const linter = node.data.properties?.linter || 'eslint';
                const autoFix = node.data.properties?.autoFix === true;

                steps.push({
                    name: node.data.label || 'Lint code',
                    run: autoFix ? `${linter} --fix .` : `${linter} .`,
                });
                break;

            case 'deploy':
                const platform = node.data.properties?.platform || 'aws';
                const environment = node.data.properties?.environment || 'staging';

                if (platform === 'vercel') {
                    steps.push({
                        name: node.data.label || 'Deploy to Vercel',
                        uses: 'amondnet/vercel-action@v25',
                        with: {
                            'vercel-token': '\${{ secrets.VERCEL_TOKEN }}',
                            'vercel-org-id': '\${{ secrets.VERCEL_ORG_ID }}',
                            'vercel-project-id': '\${{ secrets.VERCEL_PROJECT_ID }}',
                        }
                    });
                } else {
                    steps.push({
                        name: node.data.label || `Deploy to ${platform}`,
                        run: `echo "Deploying to ${platform} (${environment})"`,
                    });
                }
                break;

            case 'slackNotify':
                const channel = node.data.properties?.channel || '#general';
                const onlyOnFailure = node.data.properties?.onlyOnFailure === true;

                const slackStep: any = {
                    name: node.data.label || 'Notify Slack',
                    uses: 'slackapi/slack-github-action@v1',
                    with: {
                        'channel-id': channel,
                        'slack-message': 'Pipeline completed!',
                    },
                    env: {
                        SLACK_BOT_TOKEN: '\${{ secrets.SLACK_BOT_TOKEN }}',
                    }
                };

                if (onlyOnFailure) {
                    slackStep.if = 'failure()';
                }

                steps.push(slackStep);
                break;
        }

        return steps;
    }

    private getJobDependencies(stageNodes: FlowcraftNode[]): string[] {
        const dependencies: string[] = [];

        stageNodes.forEach(node => {
            const incomingEdges = this.edges.filter(e => e.target === node.id);
            incomingEdges.forEach(edge => {
                const sourceNode = this.nodes.find(n => n.id === edge.source);
                if (sourceNode && sourceNode.type !== 'gitPushTrigger') {
                    // Find which stage the source node belongs to
                    // This is simplified - in production you'd track this properly
                }
            });
        });

        return dependencies;
    }
}
