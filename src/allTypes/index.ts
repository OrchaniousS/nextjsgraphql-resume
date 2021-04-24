import {decorateType} from '@nexus/schema'
import {GraphQLDate,GraphQLURL} from 'graphql-scalars'

export const GQLDate = decorateType(GraphQLDate,{})

export * from './Query'
export * from './Bio'