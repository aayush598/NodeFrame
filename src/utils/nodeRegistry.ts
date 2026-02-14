import { NodeRegistryItem, NodeConfig } from '../types';
import { NodeProps } from '@reactflow/core';

class NodeRegistry {
  private registry: Map<string, NodeRegistryItem> = new Map();

  register(
    type: string,
    component: React.ComponentType<NodeProps>,
    config: NodeConfig
  ): void {
    this.registry.set(type, { type, component, config });
  }

  get(type: string): NodeRegistryItem | undefined {
    return this.registry.get(type);
  }

  getAll(): NodeRegistryItem[] {
    return Array.from(this.registry.values());
  }

  getAllByCategory(category: string): NodeRegistryItem[] {
    return this.getAll().filter(item => item.config.category === category);
  }

  getTypes(): Record<string, React.ComponentType<NodeProps>> {
    const types: Record<string, React.ComponentType<NodeProps>> = {};
    this.registry.forEach((item, key) => {
      types[key] = item.component;
    });
    return types;
  }

  unregister(type: string): void {
    this.registry.delete(type);
  }

  clear(): void {
    this.registry.clear();
  }

  has(type: string): boolean {
    return this.registry.has(type);
  }
}

export const nodeRegistry = new NodeRegistry();
