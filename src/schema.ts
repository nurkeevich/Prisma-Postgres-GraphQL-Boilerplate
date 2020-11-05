import { makeSchema } from "@nexus/schema";
import { nexusPrismaPlugin } from "nexus-prisma";
import * as types from "./types";

const schema = makeSchema({
    types,
    plugins: [nexusPrismaPlugin()],
    outputs: {
        schema: __dirname + "/../schema.graphql",
        typegen: __dirname + "/generated/nexus.ts"
    },
    typegenAutoConfig: {
        contextType: "Context.Context",
        sources: [
            {
                source: "@prisma/client",
                alias: "prisma"
            },
            {
                source: require.resolve("./context"),
                alias: "Context"
            }
        ]
    }
});

export default schema;
