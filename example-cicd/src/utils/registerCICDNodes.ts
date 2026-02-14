/// <reference types="vite/client" />
import { registerNodesFromGlob } from '@nodeframe';

export const registerCICDNodes = () => {
    // Automatically import all .tsx files from the ../nodes directory
    const modules = import.meta.glob('../nodes/**/*.tsx', { eager: true });

    // Register them using the helper
    registerNodesFromGlob(modules);
};
