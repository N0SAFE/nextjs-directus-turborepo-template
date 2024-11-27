import { Collections, CollectionsType, createTypedClient, Schema, TypedClient } from "@repo/directus-sdk/client";
import { DirectusClient, staticToken, updateFlow } from "@repo/directus-sdk";
import { ApplyFields, TypedDirectusClient } from "@repo/directus-sdk/utils";
import { Command } from "commander";
import * as fs from "fs";

type IdedItem<T extends string, Type extends string | number = string | number> = {
    [key in T]: Type;
};

type CollectionSeeds = {
    id: string;
    get: (directus: TypedDirectusClient & TypedClient) => Promise<unknown>;
    preSet?: (
        directus: TypedDirectusClient & TypedClient,
        items: object & object[],
        ctx: {
            newAdminRoleId: string;
            newAdminPolicyId: string;
            newAdminAccessId: string;
        }
    ) => Promise<(object & object[]) | undefined | void>;
    set: (
        directus: TypedDirectusClient & TypedClient,
        items: object & object[],
        ctx: {
            newAdminRoleId: string;
            newAdminPolicyId: string;
            newAdminAccessId: string;
            preSetValues?: (object & object[]) | undefined | void;
        }
    ) => Promise<(object & object[]) | undefined | void>;
    postSet?: (
        directus: TypedDirectusClient & TypedClient,
        items: object & object[],
        ctx: {
            newAdminRoleId: string;
            newAdminPolicyId: string;
            newAdminAccessId: string;
            preSetValues?: (object & object[]) | undefined | void;
            setValues?: (object & object[]) | undefined | void;
        }
    ) => Promise<(object & object[]) | undefined | void>;
}[];

const collectionSeeds = [
    {
        id: "adding directus_roles",
        get: (directus) =>
            directus.DirectusRoles.query().then((roles) => {
                return roles.map(({ users, policies, ...role }) => role);
            }),
        set: (directus, items: IdedItem<"id", string>[], {}) => directus.DirectusRoles.create(items.filter(({ id }) => id)),
        preSet: async (directus, items, { newAdminRoleId }) => {
            const rolesToDelete = await directus.DirectusRoles.query({
                filter: {
                    id: {
                        _neq: newAdminRoleId
                    }
                }
            });
            if (rolesToDelete.length === 0) {
                return;
            }
            await directus.DirectusRoles.remove(rolesToDelete.map(({ id }) => id));
        },
        postSet: async (directus, items, { newAdminPolicyId }) => {}
    },
    {
        id: "adding creatingdirectus_policies",
        get: (directus) =>
            directus.DirectusPolicies.query().then((policies) => {
                return policies.map(({ roles, users, permissions, ...policy }) => policy);
            }),
        set: (directus, items, {}) => directus.DirectusPolicies.create(items),
        preSet: async (directus, items, { newAdminPolicyId }) => {
            const policiesToDelete = await directus.DirectusPolicies.query({
                filter: {
                    id: {
                        _neq: newAdminPolicyId
                    }
                }
            });
            if (policiesToDelete.length === 0) {
                return;
            }
            await directus.DirectusPolicies.remove(policiesToDelete.map(({ id }) => id));
        }
    },
    {
        id: "adding directus_permissions",
        get: (directus) =>
            directus.DirectusPermissions.query().then((permissions: ApplyFields<Collections.DirectusPermission>[] & { system: boolean }[]) => {
                return permissions.filter(({ system }: { system: boolean }) => !system).map(({ system, ...permission }) => permission);
            }),
        set: (directus, items) => directus.DirectusPermissions.create(items)
    },
    {
        id: "adding directus_access" as unknown as keyof CollectionsType,
        get: async (directus) =>
            directus.request(() => ({
                method: "GET",
                path: "/access"
            })),
        set: async (directus, items) =>
            directus.request(() => ({
                method: "POST",
                path: "/access",
                body: JSON.stringify(items)
            })),
        preSet: async (directus, items, { newAdminAccessId }) => {
            const accessToDelete = (await directus.request(() => ({
                method: "GET",
                path: `/access?filter[id][_neq]=${newAdminAccessId}`
            }))) as { id: string }[];
            if (accessToDelete.length === 0) {
                return;
            }
            await directus.request(() => ({
                method: "DELETE",
                path: "/access",
                body: JSON.stringify(accessToDelete.map(({ id }) => id))
            }));
        }
    },
    {
        id: "adding directus_flows",
        get: (directus) =>
            directus.DirectusFlows.query().then((flows: (ApplyFields<Collections.DirectusFlow> & {operations: string[]})[]) => {
                return flows.map(({ operation, operations, ...flow }) => flow);
            }),
        set: (directus, items) => directus.DirectusFlows.create(items),
        preSet: async (directus, items) => {
            const flowsToDelete = await directus.DirectusFlows.query({});
            if (flowsToDelete.length === 0) {
                return;
            }
            await directus.DirectusFlows.remove(flowsToDelete.map(({ id }) => id));
        }
    },
    {
        id: "adding directus_operations",
        get: (directus) =>
            directus.DirectusOperations.query({
                fields: ["*"]
            }).then((op) => {
                const operations = op.map(({ ...operation }) => operation);
                // Créer un graphe de dépendances
                const graph = new Map<string, Set<string>>();
                const inDegree = new Map<string, number>();

                // Initialiser le graphe
                operations.forEach((item) => {
                    graph.set(item.id, new Set());
                    inDegree.set(item.id, 0);
                });

                // Construire les relations de dépendance
                operations.forEach((item) => {
                    if (item.resolve) {
                        graph.get(item.resolve)?.add(item.id);
                        inDegree.set(item.id, (inDegree.get(item.id) || 0) + 1);
                    }
                    if (item.reject) {
                        graph.get(item.reject)?.add(item.id);
                        inDegree.set(item.id, (inDegree.get(item.id) || 0) + 1);
                    }
                });

                // Tri topologique avec file d'attente
                const queue: string[] = [];
                const result: typeof operations = [];
                const itemMap = new Map(operations.map((item) => [item.id, item]));

                // Ajouter tous les nœuds sans dépendance à la file
                inDegree.forEach((degree, id) => {
                    if (degree === 0) {
                        queue.push(id);
                    }
                });

                // Traiter la file
                while (queue.length > 0) {
                    const currentId = queue.shift()!;
                    const currentItem = itemMap.get(currentId);
                    if (currentItem) {
                        result.push(currentItem);
                    }

                    graph.get(currentId)?.forEach((dependentId) => {
                        inDegree.set(dependentId, (inDegree.get(dependentId) || 0) - 1);
                        if (inDegree.get(dependentId) === 0) {
                            queue.push(dependentId);
                        }
                    });
                }

                // Vérifier s'il y a des cycles
                if (result.length !== operations.length) {
                    throw new Error("Cycle détecté dans les dépendances");
                }

                return result;
            }),
        set: (directus, items) => directus.DirectusOperations.create(items),
        preSet: async (directus, items) => {
            const operationsToDelete = await directus.DirectusOperations.query({});
            if (operationsToDelete.length === 0) {
                return;
            }
            await directus.DirectusOperations.remove(operationsToDelete.map(({ id }) => id));
        }
    },
    {
        id: "updating directus_flows",
        get: async (directus) => {
            const flows = await directus.DirectusFlows.query({
                fields: ["id", "operation"]
            });
            return flows;
        },
        set: async (directus, items: (IdedItem<"id", string> & { operation: string; name: string })[]) => {
            for (const { id, operation } of items) {
                await directus.request(() => ({
                    method: "PATCH",
                    path: `/flows`,
                    body: JSON.stringify({
                        keys: [id],
                        data: {
                            operation: operation
                        }
                    })
                }));
            }
        }
    }
] satisfies CollectionSeeds;

const program = new Command();

type FieldsRole = {
    policies: (keyof Collections.DirectusPolicy)[];
    parent?: [FieldsRole];
};

type _FieldsRole = {
    policies: [{ policy: (keyof Collections.DirectusPolicy)[] }];
    parent?: [_FieldsRole];
};

const fieldsRoleParentBuilder = <ToSearch extends keyof Collections.DirectusPolicy = "admin_access">(deep: number, toSearch?: ToSearch[]): FieldsRole => {
    return _fieldsRoleParentBuilder(deep, toSearch) as unknown as FieldsRole;
};

const _fieldsRoleParentBuilder = <ToSearch extends keyof Collections.DirectusPolicy = "admin_access">(deep: number, toSearch?: ToSearch[]): _FieldsRole => {
    if (deep === 0) {
        return { policies: [{ policy: toSearch ?? ["admin_access"] }] };
    }
    return { policies: [{ policy: toSearch ?? ["admin_access"] }], parent: [_fieldsRoleParentBuilder(deep - 1, toSearch)] };
};

type _Role = {
    policies: { policy: { admin_access: boolean } }[];
    parent?: _Role | undefined;
};

const checkHasAdminAccess = (role: _Role) => {
    return (
        role?.policies?.some(({ policy }) => {
            return policy.admin_access === true;
        }) || (role?.parent ? checkHasAdminAccess(role.parent) : false)
    );
};

program
    .addCommand(
        new Command("export")
            .option("-o, --output <path>", "Output path")
            .option("-t, --token <token>", "Directus token")
            .option("-u, --url <url>", "Directus url")
            .action(async (options) => {
                try {
                    const client = createTypedClient(options.url).with(staticToken(options.token));
                    const me = await client.DirectusUser.Me.read({
                        fields: [
                            {
                                role: ["id", fieldsRoleParentBuilder(6)],
                                policies: [{ policy: "admin_access" }] as unknown as ["admin_access"]
                            }
                        ]
                    });

                    if (!checkHasAdminAccess({ policies: me.policies! } as unknown as _Role) && !checkHasAdminAccess(me.role as unknown as _Role)) {
                        throw new Error("User does not have an admin access, make sure the token is linked to a user with the admin access");
                    }

                    const seedData = [];
                    for (const collection of collectionSeeds) {
                        const items = await collection.get(client);
                        seedData.push({
                            id: collection.id,
                            items
                        });
                    }

                    fs.writeFileSync(
                        options.output,
                        JSON.stringify(
                            {
                                lastAdminRoleId: me.role!.id,
                                data: seedData
                            },
                            null,
                            2
                        )
                    );
                } catch (error) {
                    console.error(error);
                }
            })
    )
    .addCommand(
        new Command("import")
            .option("-i, --input <path>", "Input path")
            .option("-t, --token <token>", "Directus token")
            .option("-u, --url <url>", "Directus url")
            .action(async (options) => {
                try {
                    const client = createTypedClient(options.url).with(staticToken(options.token));
                    const me = await client.DirectusUser.Me.read({
                        fields: [
                            {
                                role: ["id", fieldsRoleParentBuilder(6)],
                                policies: ["admin_access"]
                            }
                        ]
                    });

                    if (checkHasAdminAccess({ policies: me.policies! } as unknown as _Role) || checkHasAdminAccess(me.role as unknown as _Role)) {
                        throw new Error("User does not have an admin access, make sure the token is linked to a user with the admin access");
                    }

                    const { lastAdminRoleId, data: seedData } = JSON.parse(fs.readFileSync(options.input).toString()) as {
                        lastAdminRoleId: string;
                        data: {
                            id: string;
                            items: IdedItem<string, string & number> & IdedItem<string, string & number>[];
                        }[];
                    };

                    console.log("creating new admin policy");
                    const newAdminPolicy = await client.DirectusPolicy.create({
                        admin_access: true,
                        name: "Admin Access temporary policy"
                    });
                    console.log("created new admin role");
                    const newAdminRole = await client.DirectusRole.create({
                        name: "Admin Access temporary role"
                    });
                    console.log("creating new admin access");
                    const newAdminAccess = (await client.request(() => ({
                        method: "POST",
                        path: `/access`,
                        body: JSON.stringify([
                            {
                                role: newAdminRole.id,
                                policy: newAdminPolicy.id
                            }
                        ])
                    }))) as { id: string }[];

                    console.log("updating user role");
                    await client.DirectusUser.Me.update({
                        role: newAdminRole.id
                    });

                    console.log("start seeding");

                    for (const { id, items } of seedData) {
                        console.log(id);
                        const collectionSeed = collectionSeeds.find((c) => c.id === id);
                        if (collectionSeed) {
                            const preSetValues = await collectionSeed.preSet?.(client, items, {
                                newAdminRoleId: newAdminRole.id,
                                newAdminPolicyId: newAdminPolicy.id,
                                newAdminAccessId: newAdminAccess?.[0]?.id ?? ""
                            });
                            const setValues = await collectionSeed.set(client, items, {
                                newAdminRoleId: newAdminRole.id,
                                newAdminPolicyId: newAdminPolicy.id,
                                newAdminAccessId: newAdminAccess?.[0]?.id ?? "",
                                preSetValues
                            });
                            await collectionSeed.postSet?.(client, items, {
                                newAdminRoleId: newAdminRole.id,
                                newAdminPolicyId: newAdminPolicy.id,
                                newAdminAccessId: newAdminAccess?.[0]?.id ?? "",
                                preSetValues,
                                setValues
                            });
                        }
                    }

                    console.log("pass the actual user to the read admin role");
                    await client.DirectusUser.Me.update({
                        role: lastAdminRoleId
                    });
                    console.log("removing temporary admin access");
                    await Promise.all([client.DirectusRole.remove(newAdminRole.id), client.DirectusPolicy.remove(newAdminPolicy.id)]);
                } catch (error) {
                    console.error(error);
                }
            })
    );

program.parse(process.argv);
