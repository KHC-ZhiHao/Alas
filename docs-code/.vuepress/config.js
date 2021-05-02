module.exports = {
    label: '繁體中文',
    title: 'ALAS Guide',
    dest: './docs',
    base: '/Alas/',
    description: '資源狀態管理工具',
    head: [
        ['link', { rel: "shortcut icon", href: "/images/logo.ico"}]
    ],
    themeConfig: {
        nav: [
            {
                text: '指南',
                link: '/guide/'
            },
            {
                text: '結構與操作',
                link: '/structure/'
            },
            {
                text: 'GitHub',
                link: 'https://github.com/KHC-ZhiHao/Alas'
            },
            {
                text: 'Example',
                link: 'https://github.com/KHC-ZhiHao/Alas/tree/master/example/vue'
            }
        ],
        sidebar: {
            '/guide/': [
                '',
                'install',
                'vue',
                'form',
                'status',
                'typescript'
            ],
            '/structure/': [
                '',
                'core',
                'container',
                'model',
                'list',
                'dictionary',
                'status',
                'loader',
                'package',
                'utils'
            ]
        }
    }
}
