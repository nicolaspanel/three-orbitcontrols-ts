
module.exports = {
    env: {
        browser: true,
        node: true
    },
    extends: [
        "prettier",
        "prettier/@typescript-eslint"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
    },
    plugins: [
        "@typescript-eslint"
    ],
    rules: {
        "@typescript-eslint/quotes": [
            "error",
            "single"
        ]
    }
};
