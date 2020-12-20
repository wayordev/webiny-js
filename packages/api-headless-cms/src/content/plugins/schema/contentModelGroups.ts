import { GraphQLSchemaPlugin, Resolvers } from "@webiny/handler-graphql/types";
import { ErrorResponse, Response } from "@webiny/handler-graphql";

import {
    CmsContentModelGroupCreateInputType,
    CmsContentModelGroupUpdateInputType,
    CmsContext
} from "../../../types";

type CreateContentModelGroupArgsType = {
    data: CmsContentModelGroupCreateInputType;
};

type ReadContentModelGroupArgsType = {
    id: string;
};

type UpdateContentModelGroupArgsType = ReadContentModelGroupArgsType & {
    data: CmsContentModelGroupUpdateInputType;
};

type DeleteContentModelGroupArgsType = {
    id: string;
};

const plugin = (context: CmsContext): GraphQLSchemaPlugin<CmsContext> => {
    let manageSchema = "";
    if (context.cms.MANAGE) {
        manageSchema = /* GraphQL */ `
            input CmsContentModelGroupInput {
                name: String
                slug: String
                description: String
                icon: String
            }

            type CmsContentModelGroupResponse {
                data: CmsContentModelGroup
                error: CmsError
            }

            type CmsContentModelGroupListResponse {
                data: [CmsContentModelGroup]
                meta: CmsListMeta
                error: CmsError
            }

            extend type Query {
                getContentModelGroup(id: ID): CmsContentModelGroupResponse
                listContentModelGroups: CmsContentModelGroupListResponse
            }

            extend type Mutation {
                createContentModelGroup(
                    data: CmsContentModelGroupInput!
                ): CmsContentModelGroupResponse

                updateContentModelGroup(
                    id: ID!
                    data: CmsContentModelGroupInput!
                ): CmsContentModelGroupResponse

                deleteContentModelGroup(id: ID!): CmsDeleteResponse
            }
        `;
    }

    let resolvers: Resolvers<CmsContext> = {};

    if (context.cms.MANAGE) {
        resolvers = {
            CmsContentModelGroup: {
                contentModels: async (group, args, context) => {
                    const models = await context.cms.models.list();
                    return models.filter(m => m.group === group.id);
                },
                totalContentModels: async (group, args, context) => {
                    const models = await context.cms.models.list();
                    return models.filter(m => m.group === group.id).length;
                }
            },
            Query: {
                getContentModelGroup: async (_, args: ReadContentModelGroupArgsType, context) => {
                    try {
                        const { id } = args;
                        const model = await context.cms.groups.get(id);
                        return new Response(model);
                    } catch (e) {
                        return new ErrorResponse(e);
                    }
                },
                listContentModelGroups: async (_, __, context) => {
                    try {
                        const models = await context.cms.groups.list();
                        return new Response(models);
                    } catch (e) {
                        return new ErrorResponse(e);
                    }
                }
            },
            Mutation: {
                createContentModelGroup: async (
                    _,
                    args: CreateContentModelGroupArgsType,
                    context
                ) => {
                    try {
                        const model = await context.cms.groups.create(args.data);
                        return new Response(model);
                    } catch (e) {
                        return new ErrorResponse(e);
                    }
                },
                updateContentModelGroup: async (
                    _,
                    args: UpdateContentModelGroupArgsType,
                    context
                ) => {
                    try {
                        const group = await context.cms.groups.update(args.id, args.data);
                        return new Response(group);
                    } catch (e) {
                        return new ErrorResponse(e);
                    }
                },
                deleteContentModelGroup: async (
                    _,
                    args: DeleteContentModelGroupArgsType,
                    context
                ) => {
                    try {
                        await context.cms.groups.delete(args.id);
                        return new Response(true);
                    } catch (e) {
                        return new ErrorResponse(e);
                    }
                }
            }
        };
    }

    return {
        type: "graphql-schema",
        schema: {
            typeDefs: /* GraphQL */ `
                type CmsContentModelGroup {
                    id: ID
                    createdOn: DateTime
                    savedOn: DateTime
                    name: String
                    contentModels: [CmsContentModel]
                    totalContentModels: Int
                    slug: String
                    description: String
                    icon: String
                    createdBy: JSON
                }
                ${manageSchema}
            `,
            resolvers
        }
    };
};

export default plugin;
