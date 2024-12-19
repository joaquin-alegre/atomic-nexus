import type { Edge, EdgeTypes } from '@xyflow/react';
import { CustomDeletableEdge } from './CustomDeletableEdge';

// Lista inicial de edges
export const initialEdges: Edge[] = [
    { id: 'a->b', source: 'a', target: 'b', type: 'custom' },
    {
        id: 'b_output->c',
        source: 'b',
        target: 'c',
        sourceHandle: 'output',
        type: 'custom'
    },
    {
        id: 'b_output->d',
        source: 'b',
        target: 'd',
        sourceHandle: 'output',
        type: 'custom'
    },
    {
        id: 'b_return->d',
        source: 'b',
        target: 'e',
        sourceHandle: 'return',
        type: 'custom'
    }
];

// Definir los tipos de edges sin pasar props personalizados aquí
export const edgeTypes = {
    custom: CustomDeletableEdge
} satisfies EdgeTypes;
