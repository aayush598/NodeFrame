import { NodeConfig, PropertyDefinition } from '../types';

/**
 * Type-safe helper to define a node configuration.
 * Using this ensures your node follows the NodeFrame standard and provides autocomplete.
 * 
 * @example
 * export const config = defineNodeConfig({
 *   id: 'my-node',
 *   type: 'my-node',
 *   label: 'My Node',
 *   category: 'Logic',
 *   color: '#3b82f6',
 *   propertyDefinitions: [
 *     { name: 'apiKey', label: 'API Key', type: 'password', required: true }
 *   ]
 * });
 */
export const defineNodeConfig = (config: NodeConfig): NodeConfig => config;

/**
 * Helper to define properties with full type support.
 */
export const defineProperties = (props: PropertyDefinition[]): PropertyDefinition[] => props;
