import { FlowcraftNode, FlowcraftEdge, CodeGenerator, WorkflowStrategy } from '@nodeframe';
import { nodeRegistry } from '@nodeframe/utils/nodeRegistry';

export class JenkinsfileGenerator {
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
            platform: 'jenkins',
            strategy: {
                ...WorkflowStrategy,
                 finalizeStage: (steps, stageName, _deps) => {
                    // steps is Array of string lists (from each node)
                    // Wait, WorkflowStrategy.processNode flattens output? No, it pushes partials.
                    // My nodes return arrays of strings. 
                    // processNode accumulates them into one big array?
                    // "processNode: (node, output, acc) => { if (Array.isArray(output)) acc.push(...output); ... }"
                    // Yes, so steps here is flat string array.
                    
                    if (steps.length === 0) return null;
                    const stepsStr = steps.map((s: string) => `                ${s}`).join('\n');
                    return `        stage('${stageName}') {
            steps {
${stepsStr}
            }
        }`;
                },
                combineStages: (stageOutputs) => {
                    // stageOutputs is Map<string, stringBlock>
                    const stagesBlock = Array.from(stageOutputs.values()).join('\n\n');
                    return stagesBlock; 
                }
            },
            wrapper: (stagesBlock, triggers) => {
                let triggersBlock = '';
                // triggers object might have 'triggers' string property if from Jenkins generator?
                // Our aggregator combines triggers.
                // Assuming triggers is object with property or string?
                // Our GitPushTriggerNode returns { triggers: 'pollSCM...' }
                
                // Let's iterate trigger properties if any
                // The generic aggregator merges objects. 
                // { triggers: '...' }
                
                if (triggers && triggers.triggers) {
                    triggersBlock = `
    triggers {
        ${triggers.triggers}
    }
`;
                }

                return `pipeline {
    agent any
${triggersBlock}
    stages {
${stagesBlock}
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
            },
            triggerAggregator: (nodes) => {
                 // Custom aggregator for Jenkins strings
                 const triggerNodes = nodes.filter(n => n.type === 'gitPushTrigger');
                 if (triggerNodes.length === 0) return {};
                 
                 // If multiple triggers, we might need to combine them. 
                 // Jenkins usually has one triggers block.
                 // We'll just take the first one for simplicity or concat?
                 // Let's concat unique strings.
                 
                 const triggers = new Set<string>();
                 triggerNodes.forEach(node => {
                     // We invoke generator manually? 
                     // Or rely on CodeGenerator? 
                     // CodeGenerator calls aggregator. It doesn't run generators for triggers automatically (filtered out).
                     
                     // So we must manually invoke generator or extract logic.
                     // To keep it clean, let's extract logic or hardcode for now as the node config has it.
                     
                     // We can access nodeRegistry to get generator if we want.
                     // But here we are inside the class that knows about registry? No.
                     // We can import registry.
                     
                     if (!node.type) return;
                     const item = nodeRegistry.get(node.type);
                     if (item && item.config.generators && item.config.generators.jenkins) {
                         const res = item.config.generators.jenkins(node);
                         if (res && res.triggers) triggers.add(res.triggers);
                     }
                 });
                 
                 return { triggers: Array.from(triggers).join('\n        ') };
            },
            formatter: (s) => s // Return string as is
        });
    }
}
