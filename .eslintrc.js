module.exports = {
    root: true,
    env: {
        node: true,
        mocha: true,
        browser: true,
        'shared-node-browser': true
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended'
    ],
    rules: {
        quotes: ['error', 'single'],
        indent: ['error', 4],
        camelcase: 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'prefer-const': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'space-before-function-paren': 'off',
        'no-use-before-define': 'off'
    }
}