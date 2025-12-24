import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
    // 1. On dit quels fichiers surveiller
    { files: ["**/*.{js,mjs,cjs,ts}"] },

    // 2. On configure l'environnement (Node.js)
    { languageOptions: { globals: globals.node } },

    // 3. Les configurations recommandées de base (JS + TS)
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,

    // 4. Tes règles personnalisées (Le "Strict Mode" du Tech Lead)
    {
        rules: {
            // Interdit le type 'any'. On veut du typage fort.
            "@typescript-eslint/no-explicit-any": "error",

            // Avertissement si on laisse des variables inutilisées (sauf si elles commencent par _)
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

            // On évite les console.log en prod, mais on tolère warn et error
            "no-console": ["warn", { allow: ["warn", "error", "info"] }],
        },
    },

    // 5. On ignore les fichiers de build (équivalent de l'ancien .eslintignore)
    {
        ignores: ["dist/", "node_modules/"],
    }
];