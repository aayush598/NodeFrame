import { FlowcraftNode, FlowcraftEdge } from '@nodeframe/types';

export class JenkinsfileGenerator {
  private nodes: FlowcraftNode[];

  constructor(nodes: FlowcraftNode[], _edges: FlowcraftEdge[]) {
    this.nodes = nodes;
  }

  generate(): string {
    const stageBlocks = this.generateStageBlocks();

    return `pipeline {
    agent any

    stages {
${stageBlocks}
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}`;
  }

  /* 
  private generateStages(): string[] {
    const stages = new Set<string>();
    
    this.nodes.forEach(node => {
      if (node.type === 'gitPushTrigger') return;
      const stage = this.getNodeStage(node);
      stages.add(stage);
    });

    return Array.from(stages);
  }
  */

  private getNodeStage(node: FlowcraftNode): string {
    switch (node.type) {
      case 'installDeps':
      case 'buildApp':
      case 'dockerBuild':
        return 'Build';
      case 'testRunner':
      case 'lint':
        return 'Test';
      case 'securityScan':
        return 'Security';
      case 'deploy':
        return 'Deploy';
      case 'slackNotify':
        return 'Notify';
      default:
        return 'Build';
    }
  }

  private generateStageBlocks(): string {
    const stageMap = new Map<string, FlowcraftNode[]>();
    
    this.nodes.forEach(node => {
      if (node.type === 'gitPushTrigger') return;
      const stage = this.getNodeStage(node);
      if (!stageMap.has(stage)) {
        stageMap.set(stage, []);
      }
      stageMap.get(stage)!.push(node);
    });

    const blocks: string[] = [];

    stageMap.forEach((nodes, stageName) => {
      const steps = nodes.map(node => this.nodeToSteps(node)).flat();
      const stepsStr = steps.map(s => `                ${s}`).join('\n');

      blocks.push(`        stage('${stageName}') {
            steps {
${stepsStr}
            }
        }`);
    });

    return blocks.join('\n\n');
  }

  private nodeToSteps(node: FlowcraftNode): string[] {
    const steps: string[] = [];

    switch (node.type) {
      case 'installDeps':
        const pkgMgr = node.data.properties?.packageManager || 'npm';
        steps.push(`sh '${node.data.properties?.installCommand || `${pkgMgr} install`}'`);
        break;

      case 'testRunner':
        const testCmd = node.data.properties?.command || 'npm test';
        const coverage = node.data.properties?.coverageEnabled === true;
        steps.push(`sh '${coverage ? `${testCmd} --coverage` : testCmd}'`);
        break;

      case 'buildApp':
        steps.push(`sh '${node.data.properties?.buildCommand || 'npm run build'}'`);
        break;

      case 'dockerBuild':
        const imageName = node.data.properties?.imageName || 'my-app';
        const tags = node.data.properties?.tags || ['latest'];
        steps.push(`sh 'docker build -t ${imageName}:${tags[0]} .'`);
        
        if (node.data.properties?.push !== false) {
          steps.push(`sh 'docker push ${imageName}:${tags[0]}'`);
        }
        break;

      case 'securityScan':
        const scanner = node.data.properties?.scanner || 'snyk';
        steps.push(`sh '${scanner} test'`);
        break;

      case 'lint':
        const linter = node.data.properties?.linter || 'eslint';
        const autoFix = node.data.properties?.autoFix === true;
        steps.push(`sh '${autoFix ? `${linter} --fix .` : `${linter} .`}'`);
        break;

      case 'deploy':
        const platform = node.data.properties?.platform || 'aws';
        const environment = node.data.properties?.environment || 'staging';
        steps.push(`sh 'echo "Deploying to ${platform} (${environment})"'`);
        break;

      case 'slackNotify':
        const channel = node.data.properties?.channel || '#general';
        steps.push(`echo 'Sending Slack notification to ${channel}'`);
        break;

      default:
        steps.push(`echo 'Running ${node.data.label || node.type}'`);
    }

    return steps;
  }
}
