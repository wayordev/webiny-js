import { useContentGqlHandler } from "../utils/useContentGqlHandler";
import { CmsContentModelGroupType } from "@webiny/api-headless-cms/types";
import models from "./mocks/contentModels";
import { useReviewManageHandler } from "../utils/useReviewManageHandler";
import { useProductManageHandler } from "../utils/useProductManageHandler";

describe("refField", () => {
    const esCmsIndex = "root-headless-cms";

    const manageOpts = { path: "manage/en-US" };

    const {
        elasticSearch,
        createContentModelMutation,
        updateContentModelMutation,
        createContentModelGroupMutation
    } = useContentGqlHandler(manageOpts);

    // This function is not directly within `beforeEach` as we don't always setup the same content model.
    // We call this function manually at the beginning of each test, where needed.
    const setupContentModelGroup = async (): Promise<CmsContentModelGroupType> => {
        const [createCMG] = await createContentModelGroupMutation({
            data: {
                name: "Group",
                slug: "group",
                icon: "ico/ico",
                description: "description"
            }
        });
        return createCMG.data.createContentModelGroup.data;
    };

    const setupCategoryModel = async (contentModelGroup: CmsContentModelGroupType) => {
        const model = models.find(m => m.modelId === "category");
        // Create initial record
        const [create] = await createContentModelMutation({
            data: {
                name: model.name,
                modelId: model.modelId,
                group: contentModelGroup.id
            }
        });

        if (create.errors) {
            console.error(`[beforeEach] ${create.errors[0].message}`);
            process.exit(1);
        }

        const [update] = await updateContentModelMutation({
            modelId: create.data.createContentModel.data.modelId,
            data: {
                fields: model.fields,
                layout: model.layout
            }
        });
        return update.data.updateContentModel.data;
    };

    beforeEach(async () => {
        try {
            await elasticSearch.indices.create({ index: esCmsIndex });
        } catch {}
    });

    afterEach(async () => {
        try {
            await elasticSearch.indices.delete({ index: esCmsIndex });
        } catch {}
    });

    test("should create a product and then connect reviews", async () => {
        const contentModelGroup = await setupContentModelGroup();
        const category = await setupCategoryModel(contentModelGroup);
        // create a entry so fields get locked
        const { createProduct } = useProductManageHandler({
            ...manageOpts
        });

        // todo ProductInput does not exist
        const [createProductResponse] = await createProduct({
            data: {
                title: "Potato",
                price: 100,
                availableOn: "2020-12-25T16:37:00Z.000",
                color: "white",
                availableSizes: ["s", "m"],
                image: "file.jpg",
                category: {
                    modelId: category.modelId,
                    entryId: category.id
                }
            }
        });

        const product = createProductResponse.data.createProduct.data;

        const { createReview } = useReviewManageHandler({
            ...manageOpts
        });

        const [response] = await createReview({
            data: {
                product: product.id,
                text: `review text`,
                rating: 5
            }
        });

        expect(response).toEqual({
            data: {
                createReview: {
                    data: {
                        id: expect.any(String),
                        createOn: /^20/,
                        savedOn: /^20/,
                        text: "review text",
                        rating: 5
                    },
                    meta: {},
                    error: null
                }
            }
        });
    });
});
