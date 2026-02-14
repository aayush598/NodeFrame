import React from 'react';
import { nodeRegistry } from '@nodeframe/utils/nodeRegistry';
import { GitPushTriggerNode } from '../nodes/GitPushTriggerNode';
import { InstallDepsNode } from '../nodes/InstallDepsNode';
import { DockerBuildNode } from '../nodes/DockerBuildNode';
import { TestRunnerNode } from '../nodes/TestRunnerNode';
import { SecurityScanNode } from '../nodes/SecurityScanNode';
import { DeployNode } from '../nodes/DeployNode';
import { SlackNotifyNode } from '../nodes/SlackNotifyNode';
import { BuildAppNode } from '../nodes/BuildAppNode';
import { LintNode } from '../nodes/LintNode';
import {
    GitBranch,
    Package,
    Container,
    FlaskConical,
    Shield,
    Rocket,
    MessageSquare,
    Code,
    Gauge,
} from 'lucide-react';

export const registerCICDNodes = () => {
    if (nodeRegistry.has('gitPushTrigger')) return;

    // Git Push Trigger
    nodeRegistry.register('gitPushTrigger', GitPushTriggerNode, {
        id: 'gitPushTrigger',
        type: 'gitPushTrigger',
        label: 'Git Push',
        category: 'Triggers',
        color: '#10b981',
        icon: React.createElement(GitBranch, { size: 16 }),
        defaultData: {
            properties: {
                eventType: 'push',
                branches: ['main'],
                paths: [],
            },
            onExecute: () => ({ triggered: true, timestamp: Date.now() }),
        },
        propertyDefinitions: [
            {
                name: 'eventType',
                label: 'Event Type',
                type: 'select',
                options: [
                    { label: 'Push', value: 'push' },
                    { label: 'Pull Request', value: 'pull_request' },
                    { label: 'Tag', value: 'tag' },
                ],
            },
            {
                name: 'branches',
                label: 'Branches (comma-separated)',
                type: 'string',
                defaultValue: 'main',
            },
            {
                name: 'paths',
                label: 'Path Filters (comma-separated)',
                type: 'string',
            },
        ],
    });

    // Install Dependencies
    nodeRegistry.register('installDeps', InstallDepsNode, {
        id: 'installDeps',
        type: 'installDeps',
        label: 'Install Dependencies',
        category: 'Build',
        color: '#3b82f6',
        icon: React.createElement(Package, { size: 16 }),
        defaultData: {
            properties: {
                packageManager: 'npm',
                cacheEnabled: true,
                installCommand: '',
            },
            onExecute: () => ({ installed: true }),
        },
        propertyDefinitions: [
            {
                name: 'packageManager',
                label: 'Package Manager',
                type: 'select',
                options: [
                    { label: 'npm', value: 'npm' },
                    { label: 'yarn', value: 'yarn' },
                    { label: 'pnpm', value: 'pnpm' },
                    { label: 'bun', value: 'bun' },
                ],
            },
            {
                name: 'cacheEnabled',
                label: 'Enable Cache',
                type: 'boolean',
                defaultValue: true,
            },
            {
                name: 'installCommand',
                label: 'Custom Install Command',
                type: 'string',
            },
        ],
    });

    // Docker Build
    nodeRegistry.register('dockerBuild', DockerBuildNode, {
        id: 'dockerBuild',
        type: 'dockerBuild',
        label: 'Docker Build',
        category: 'Build',
        color: '#0ea5e9',
        icon: React.createElement(Container, { size: 16 }),
        defaultData: {
            properties: {
                imageName: 'my-app',
                tags: ['latest'],
                dockerfile: 'Dockerfile',
                push: true,
            },
            onExecute: () => ({ built: true }),
        },
        propertyDefinitions: [
            {
                name: 'imageName',
                label: 'Image Name',
                type: 'string',
                defaultValue: 'my-app',
            },
            {
                name: 'tags',
                label: 'Tags (comma-separated)',
                type: 'string',
                defaultValue: 'latest',
            },
            {
                name: 'dockerfile',
                label: 'Dockerfile Path',
                type: 'string',
                defaultValue: 'Dockerfile',
            },
            {
                name: 'push',
                label: 'Push to Registry',
                type: 'boolean',
                defaultValue: true,
            },
        ],
    });

    // Test Runner
    nodeRegistry.register('testRunner', TestRunnerNode, {
        id: 'testRunner',
        type: 'testRunner',
        label: 'Run Tests',
        category: 'Test',
        color: '#a855f7',
        icon: React.createElement(FlaskConical, { size: 16 }),
        defaultData: {
            properties: {
                testType: 'unit',
                framework: 'jest',
                command: 'npm test',
                coverageEnabled: false,
            },
            onExecute: () => ({ passed: true }),
        },
        propertyDefinitions: [
            {
                name: 'testType',
                label: 'Test Type',
                type: 'select',
                options: [
                    { label: 'Unit Tests', value: 'unit' },
                    { label: 'Integration Tests', value: 'integration' },
                    { label: 'E2E Tests', value: 'e2e' },
                ],
            },
            {
                name: 'framework',
                label: 'Test Framework',
                type: 'select',
                options: [
                    { label: 'Jest', value: 'jest' },
                    { label: 'Vitest', value: 'vitest' },
                    { label: 'Playwright', value: 'playwright' },
                    { label: 'Cypress', value: 'cypress' },
                ],
            },
            {
                name: 'command',
                label: 'Test Command',
                type: 'string',
                defaultValue: 'npm test',
            },
            {
                name: 'coverageEnabled',
                label: 'Enable Coverage',
                type: 'boolean',
                defaultValue: false,
            },
        ],
    });

    // Security Scan
    nodeRegistry.register('securityScan', SecurityScanNode, {
        id: 'securityScan',
        type: 'securityScan',
        label: 'Security Scan',
        category: 'Security',
        color: '#f59e0b',
        icon: React.createElement(Shield, { size: 16 }),
        defaultData: {
            properties: {
                scanner: 'snyk',
                severity: 'high',
                failOnIssues: true,
            },
            onExecute: () => ({ scanned: true, vulnerabilities: 0 }),
        },
        propertyDefinitions: [
            {
                name: 'scanner',
                label: 'Scanner',
                type: 'select',
                options: [
                    { label: 'Snyk', value: 'snyk' },
                    { label: 'Trivy', value: 'trivy' },
                    { label: 'SonarQube', value: 'sonarqube' },
                ],
            },
            {
                name: 'severity',
                label: 'Minimum Severity',
                type: 'select',
                options: [
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                    { label: 'Critical', value: 'critical' },
                ],
            },
            {
                name: 'failOnIssues',
                label: 'Fail on Issues',
                type: 'boolean',
                defaultValue: true,
            },
        ],
    });

    // Deploy
    nodeRegistry.register('deploy', DeployNode, {
        id: 'deploy',
        type: 'deploy',
        label: 'Deploy',
        category: 'Deploy',
        color: '#ec4899',
        icon: React.createElement(Rocket, { size: 16 }),
        defaultData: {
            properties: {
                platform: 'aws',
                environment: 'staging',
                region: 'us-east-1',
                healthCheck: '',
            },
            onExecute: () => ({ deployed: true }),
        },
        propertyDefinitions: [
            {
                name: 'platform',
                label: 'Platform',
                type: 'select',
                options: [
                    { label: 'AWS', value: 'aws' },
                    { label: 'Vercel', value: 'vercel' },
                    { label: 'Kubernetes', value: 'kubernetes' },
                    { label: 'SSH', value: 'ssh' },
                ],
            },
            {
                name: 'environment',
                label: 'Environment',
                type: 'select',
                options: [
                    { label: 'Development', value: 'development' },
                    { label: 'Staging', value: 'staging' },
                    { label: 'Production', value: 'production' },
                ],
            },
            {
                name: 'region',
                label: 'Region',
                type: 'string',
                defaultValue: 'us-east-1',
            },
            {
                name: 'healthCheck',
                label: 'Health Check URL',
                type: 'string',
            },
        ],
    });

    // Slack Notify
    nodeRegistry.register('slackNotify', SlackNotifyNode, {
        id: 'slackNotify',
        type: 'slackNotify',
        label: 'Slack Notify',
        category: 'Notifications',
        color: '#6366f1',
        icon: React.createElement(MessageSquare, { size: 16 }),
        defaultData: {
            properties: {
                webhookUrl: '',
                channel: '#general',
                message: 'Pipeline completed!',
                onlyOnFailure: false,
            },
            onExecute: () => ({ notified: true }),
        },
        propertyDefinitions: [
            {
                name: 'channel',
                label: 'Channel',
                type: 'string',
                defaultValue: '#general',
            },
            {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                defaultValue: 'Pipeline completed!',
            },
            {
                name: 'onlyOnFailure',
                label: 'Only on Failure',
                type: 'boolean',
                defaultValue: false,
            },
        ],
    });

    // Build App
    nodeRegistry.register('buildApp', BuildAppNode, {
        id: 'buildApp',
        type: 'buildApp',
        label: 'Build App',
        category: 'Build',
        color: '#8b5cf6',
        icon: React.createElement(Code, { size: 16 }),
        defaultData: {
            properties: {
                buildTool: 'vite',
                outputDir: 'dist',
                buildCommand: 'npm run build',
            },
            onExecute: () => ({ built: true }),
        },
        propertyDefinitions: [
            {
                name: 'buildTool',
                label: 'Build Tool',
                type: 'select',
                options: [
                    { label: 'Vite', value: 'vite' },
                    { label: 'Webpack', value: 'webpack' },
                    { label: 'Rollup', value: 'rollup' },
                    { label: 'esbuild', value: 'esbuild' },
                ],
            },
            {
                name: 'outputDir',
                label: 'Output Directory',
                type: 'string',
                defaultValue: 'dist',
            },
            {
                name: 'buildCommand',
                label: 'Build Command',
                type: 'string',
                defaultValue: 'npm run build',
            },
        ],
    });

    // Lint
    nodeRegistry.register('lint', LintNode, {
        id: 'lint',
        type: 'lint',
        label: 'Lint Code',
        category: 'Quality',
        color: '#14b8a6',
        icon: React.createElement(Gauge, { size: 16 }),
        defaultData: {
            properties: {
                linter: 'eslint',
                autoFix: false,
            },
            onExecute: () => ({ linted: true }),
        },
        propertyDefinitions: [
            {
                name: 'linter',
                label: 'Linter',
                type: 'select',
                options: [
                    { label: 'ESLint', value: 'eslint' },
                    { label: 'Prettier', value: 'prettier' },
                    { label: 'Biome', value: 'biome' },
                ],
            },
            {
                name: 'autoFix',
                label: 'Auto-fix Issues',
                type: 'boolean',
                defaultValue: false,
            },
        ],
    });
};
