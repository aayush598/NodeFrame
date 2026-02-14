import React from 'react';
import { GitHubActionsGenerator } from '../generators/GitHubActionsGenerator';
import { GitLabCIGenerator } from '../generators/GitLabCIGenerator';
import { JenkinsfileGenerator } from '../generators/JenkinsfileGenerator';
import { Github, Gitlab, Terminal } from 'lucide-react';

export const registerCICDExporters = (registerExporter: any) => {
    registerExporter({
        id: 'github',
        label: 'GitHub Actions',
        icon: React.createElement(Github, { size: 16 }),
        fileName: '.github/workflows/ci.yml',
        generate: (nodes: any, edges: any) => new GitHubActionsGenerator(nodes, edges).generate()
    });

    registerExporter({
        id: 'gitlab',
        label: 'GitLab CI',
        icon: React.createElement(Gitlab, { size: 16 }),
        fileName: '.gitlab-ci.yml',
        generate: (nodes: any, edges: any) => new GitLabCIGenerator(nodes, edges).generate()
    });

    registerExporter({
        id: 'jenkins',
        label: 'Jenkinsfile',
        icon: React.createElement(Terminal, { size: 16 }),
        fileName: 'Jenkinsfile',
        generate: (nodes: any, edges: any) => new JenkinsfileGenerator(nodes, edges).generate()
    });
};
