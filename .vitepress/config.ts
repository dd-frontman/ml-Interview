import { defineConfig } from "vitepress";
import { sidebar } from "./sidebar";

const fallbackRepoName = "ml-interview";
const repoName =
	process.env.REPO_NAME ?? process.env.GITHUB_REPOSITORY?.split("/")[1] ?? fallbackRepoName;
const siteBase = `/${repoName}/`;

export default defineConfig({
	title: "ML Interview Documentation",
	description: "Документация по machine learning для подготовки к собеседованиям",

	head: [
		["link", { rel: "icon", type: "image/svg+xml", href: `${siteBase}favicon.svg` }],
		["link", { rel: "shortcut icon", href: `${siteBase}favicon.svg` }],
	],

	// База для GitHub Pages вычисляется из имени репозитория.
	// В CI используется имя из GitHub context, локально — fallbackRepoName.
	base: siteBase,

	// Чистые URL без .html
	cleanUrls: true,

	// Настройки темы
	themeConfig: {
		// Логотип сайта (опционально)
		// logo: '/logo.svg',

		// Навигация в верхней части
		nav: [],

		// Боковая панель навигации - глобальный sidebar для всех страниц
		// Используем массив вместо объекта, чтобы sidebar отображался на всех страницах
		sidebar,

		// Настройки поиска
		search: {
			provider: "local",
		},

		// Социальные ссылки (опционально)
		socialLinks: [
			// { icon: 'github', link: 'https://github.com/yourusername/web-interview' }
		],

		// Футер (опционально)
		footer: {
			message:
				'Документация по machine learning · <a href="https://github.com/dd-frontman/ml-interview" target="_blank" rel="noreferrer">поставь звезду на GitHub, если понравилось</a>',
			copyright: "Copyright © 2024",
		},

		// Настройки редактирования (опционально)
		// editLink: {
		// 	pattern: 'https://github.com/yourusername/web-interview/edit/main/docs/:path',
		// 	text: 'Редактировать эту страницу на GitHub'
		// },
	},

	// Указываем, что исходные файлы находятся в папке docs
	// Это нужно для правильной работы с base path
	srcDir: "docs",

	// Настройки Markdown для исправления ошибок Shiki
	markdown: {
		theme: {
			light: "github-light",
			dark: "github-dark",
		},
		codeTransformers: [],
	},

	// Локальный поисковый индекс собирается в отдельный JS-чанк и для большой базы знаний
	// он закономерно превышает дефолтный warning-порог 500kb.
	vite: {
		build: {
			chunkSizeWarningLimit: 1500,
		},
	},
});
