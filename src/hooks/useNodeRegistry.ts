import { useCallback } from 'react';
import { nodeRegistry } from '../utils/nodeRegistry';
import { NodeConfig } from '../types';
import { NodeProps } from '@reactflow/core';

export const useNodeRegistry = () => {
  const register = useCallback(
    (type: string, component: React.ComponentType<NodeProps>, config: NodeConfig) => {
      nodeRegistry.register(type, component, config);
    },
    []
  );

  const unregister = useCallback((type: string) => {
    nodeRegistry.unregister(type);
  }, []);

  const get = useCallback((type: string) => {
    return nodeRegistry.get(type);
  }, []);

  const getAll = useCallback(() => {
    return nodeRegistry.getAll();
  }, []);

  const getAllByCategory = useCallback((category: string) => {
    return nodeRegistry.getAllByCategory(category);
  }, []);

  const getTypes = useCallback(() => {
    return nodeRegistry.getTypes();
  }, []);

  return {
    register,
    unregister,
    get,
    getAll,
    getAllByCategory,
    getTypes
  };
};
