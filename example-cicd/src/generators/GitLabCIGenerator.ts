import { FlowcraftNode, FlowcraftEdge } from '@nodeframe/types';
import yaml from 'js-yaml';

interface GitLabCIConfig {
    stages: string[];
    [key: string]: any;
}

export class GitLabCIGenerator {
    private nodes: FlowcraftNode[];

    constructor(nodes: FlowcraftNode[], _edges: FlowcraftEdge[]) {
        this.nodes = nodes;
    }

    generate(): string {
        const config: GitLabCIConfig = {
            stages: this.generateStages(),
            ...this.generateJobs(),
        };

        return yaml.dump(config, { lineWidth: -1, noRefs: true });
    }

    private generateStages(): string[] {
        const stages = new Set<string>();

        this.nodes.forEach(node => {
            if (node.type === 'gitPushTrigger') return;

            const stage = this.getNodeStage(node);
            stages.add(stage);
        });

        return Array.from(stages);
    }

    private getNodeStage(node: FlowcraftNode): string {
        switch (node.type) {
            case 'installDeps':
            case 'buildApp':
            case 'dockerBuild':
                return 'build';
            case 'testRunner':
            case 'lint':
                return 'test';
            case 'securityScan':
                return 'security';
            case 'deploy':
                return 'deploy';
            case 'slackNotify':
                return 'notify';
            default:
                return 'build';
        }
    }

    private generateJobs(): Record<string, any> {
        const jobs: Record<string, any> = {};

        this.nodes.forEach(node => {
            if (node.type === 'gitPushTrigger') return;

            const jobName = this.getJobName(node);
            jobs[jobName] = this.nodeToJob(node);
        });

        return jobs;
    }

    private getJobName(node: FlowcraftNode): string {
        const name = node.data?.label || node.type || 'node';
        return name.toLowerCase().replace(/\s+/g, '-');
    }

    private nodeToJob(node: FlowcraftNode): any {
        const job: any = {
            stage: this.getNodeStage(node),
            script: this.nodeToScript(node),
        };

        // Add image if needed
        if (node.type === 'dockerBuild') {
            job.image = 'docker:latest';
            job.services = ['docker:dind'];
        }

        // Add cache
        if (node.type === 'installDeps' && node.data.properties?.cacheEnabled !== false) {
            const pkgMgr = node.data.properties?.packageManager || 'npm';
            job.cache = {
                paths: [pkgMgr === 'npm' ? 'node_modules/' : '.cache/'],
            };
        }

        // Add only/except rules
        const branches = this.getTriggerBranches();
        if (branches.length > 0) {
            job.only = { refs: branches };
        }

        return job;
    }

    private nodeToScript(node: FlowcraftNode): string[] {
        const scripts: string[] = [];

        switch (node.type) {
            case 'installDeps':
                const pkgMgr = node.data.properties?.packageManager || 'npm';
                scripts.push(node.data.properties?.installCommand || `${pkgMgr} install`);
                break;

            case 'testRunner':
                const testCmd = node.data.properties?.command || 'npm test';
                const coverage = node.data.properties?.coverageEnabled === true;
                scripts.push(coverage ? `${testCmd} --coverage` : testCmd);
                break;

            case 'buildApp':
                scripts.push(node.data.properties?.buildCommand || 'npm run build');
                break;

            case 'dockerBuild':
                const imageName = node.data.properties?.imageName || 'my-app';
                const tags = node.data.properties?.tags || ['latest'];
                scripts.push(`docker build -t ${imageName}:${tags[0]} .`);

                if (node.data.properties?.push !== false) {
                    scripts.push(`docker push ${imageName}:${tags[0]}`);
                }
                break;

            case 'securityScan':
                const scanner = node.data.properties?.scanner || 'snyk';
                scripts.push(`${scanner} test`);
                break;

            case 'lint':
                const linter = node.data.properties?.linter || 'eslint';
                const autoFix = node.data.properties?.autoFix === true;
                scripts.push(autoFix ? `${linter} --fix .` : `${linter} .`);
                break;

            case 'deploy':
                const platform = node.data.properties?.platform || 'aws';
                const environment = node.data.properties?.environment || 'staging';
                scripts.push(`echo "Deploying to ${platform} (${environment})"`);
                break;

            case 'slackNotify':
                scripts.push('echo "Sending Slack notification"');
                break;

            default:
                scripts.push('echo "Running step"');
        }

        return scripts;
    }

    private getTriggerBranches(): string[] {
        const triggerNodes = this.nodes.filter(n => n.type === 'gitPushTrigger');
        if (triggerNodes.length === 0) return ['main'];

        const branches: string[] = [];
        triggerNodes.forEach(node => {
            const nodeBranches = node.data.properties?.branches || ['main'];
            branches.push(...nodeBranches);
        });

        return [...new Set(branches)];
    }
}
