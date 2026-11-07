import fs from "node:fs";
import path from "node:path";
import {
	collectMarkdownFiles,
	escapeTsString,
	inferTitle,
	routeFromFilePath,
	splitFrontmatter,
} from "./lib/content-utils.mjs";

const cwd = process.cwd();
const outputPath = path.join(cwd, ".vitepress", "sidebar.generated.ts");

const SECTION_ORDER = ["interview-prep", "math", "ml", "deep-learning", "mlops", "python", "vue"];

const SECTION_TITLES = {
	"interview-prep": "Подготовка к интервью",
	math: "Математика",
	ml: "Machine Learning",
	"deep-learning": "Deep Learning",
	mlops: "MLOps",
	python: "Python",
	vue: "Vue",
};

const TITLE_OVERRIDES = {
	"/math/veroyatnost-i-statistika-dlya-ml": "Вероятность и статистика",
	"/math/lineynaya-algebra-dlya-ml": "Линейная алгебра",
	"/mlops/deploy-i-monitoring": "Deploy и мониторинг",
	"/mlops/feature-engineering-i-validatsiya": "Признаки и валидация",
	"/python": "Обзор",
	"/python/roadmap-python-dlya-ml-inzhenera": "Roadmap Python",
	"/python/roadmap-algoritmy-i-struktury-dannykh-na-python": "Алгоритмы на Python",
	"/python/algoritmy/algoritmy-glavnaya": "Обзор",
	"/python/algoritmy/etap-1-osnovy/glavnaya": "Обзор этапа",
	"/python/algoritmy/etap-1-osnovy/big-o-i-analiz-slozhnosti": "Big O",
	"/python/algoritmy/etap-1-osnovy/slozhnost-operatsiy-python": "Сложность операций",
	"/python/algoritmy/etap-1-osnovy/massivy-i-stroki": "Массивы и строки",
	"/python/algoritmy/etap-1-osnovy/heshirovanie-i-sortirovka": "Хеширование и сортировка",
	"/python/algoritmy/etap-2-patterny/glavnaya": "Обзор этапа",
	"/python/algoritmy/etap-2-patterny/nedelya-4-two-pointers": "4. Two Pointers",
	"/python/algoritmy/etap-2-patterny/nedelya-5-sliding-window": "5. Sliding Window",
	"/python/algoritmy/etap-2-patterny/nedelya-6-prefix-sum": "6. Prefix Sum",
	"/python/algoritmy/etap-2-patterny/nedelya-7-binary-search": "7. Binary Search",
	"/python/algoritmy/etap-2-patterny/nedelya-8-sorting-i-intervaly": "8. Intervals",
	"/python/algoritmy/etap-3-lineynye-struktury/glavnaya": "Обзор этапа",
	"/python/algoritmy/etap-3-lineynye-struktury/nedelya-9-stack-i-monotonic-stack": "9. Stack",
	"/python/algoritmy/etap-3-lineynye-struktury/nedelya-10-queue-i-deque": "10. Queue",
	"/python/algoritmy/etap-3-lineynye-struktury/nedelya-11-linked-list": "11. Linked List",
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/glavnaya": "Обзор этапа",
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-12-recursion": "12. Recursion",
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-13-binary-trees": "13. Binary Trees",
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-14-matritsy-i-grid-traversal": "14. Grid Traversal",
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-15-graphs": "15. Graphs",
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-16-backtracking": "16. Backtracking",
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-17-heap-i-priority-queue": "17. Heap",
	"/python/algoritmy/etap-5-greedy-dp/glavnaya": "Обзор этапа",
	"/python/algoritmy/etap-5-greedy-dp/nedelya-18-greedy": "18. Greedy",
	"/python/algoritmy/etap-5-greedy-dp/nedelya-19-dynamic-programming-i": "19. DP I",
	"/python/algoritmy/etap-5-greedy-dp/nedelya-20-dynamic-programming-ii": "20. DP II",
	"/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek": "21. Advanced",
	"/python/algoritmy/etap-6-praktika-intervyu/glavnaya": "Обзор этапа",
	"/python/algoritmy/etap-6-praktika-intervyu/nedelya-22-mixed-problems": "22. Mixed Problems",
	"/python/algoritmy/etap-6-praktika-intervyu/nedelya-23-mock-interviews": "23. Mock Interviews",
	"/python/algoritmy/etap-6-praktika-intervyu/nedelya-24-finalnaya-diagnostika": "24. Диагностика",
	"/python/ekosistema-python/json-i-serializatsiya": "JSON и сериализация",
	"/python/ekosistema-python/http-zaprosy-requests": "HTTP-запросы requests",
	"/python/ekosistema-python/dekorator-retry-i-api-pogody": "Retry и погода",
	"/python/ekosistema-python/zagruzka-dannykh-i-formaty": "Загрузка данных",
	"/python/ekosistema-python/numpy-i-pandas-dlya-ml": "NumPy и Pandas",
	"/python/ekosistema-python/logging-i-cli-dlya-ml-skriptov": "Logging и CLI",
	"/python/ekosistema-python/jupyter-workflow": "Jupyter workflow",
	"/python/ekosistema-python/sql-iz-python": "SQL из Python",
	"/python/ekosistema-python/prodvinutyy-preprocessing": "Продвинутый preprocessing",
	"/python/ekosistema-python/experiment-tracking": "Experiment tracking",
	"/python/ekosistema-python/pytorch-basics": "PyTorch basics",
	"/python/ekosistema-python/artefakty-modeli-i-inference": "Артефакты и inference",
	"/python/yazyk-python/isklyucheniya-context-managers-i-fayly": "Исключения и файлы",
	"/python/yazyk-python/iteratory-generatory-i-comprehensions": "Итерация и comprehensions",
	"/python/yazyk-python/asyncio-korutiny-i-taskgroup": "Asyncio и TaskGroup",
	"/python/yazyk-python/typing-dlya-python-i-ml": "Typing для ML",
	"/python/yazyk-python/datetime-i-timezone": "Дата и время",
	"/python/yazyk-python/1-core/logicheskie-i-pobitovye-operatory": "Логические и побитовые",
	"/python/yazyk-python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip": "Core обзор",
	"/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye": "Синтаксис и переменные",
	"/python/yazyk-python/1-core/osnovnye-funktsii": "Основные функции",
	"/python/yazyk-python/1-core/vse-operatory-python": "Все операторы",
	"/python/yazyk-python/1-core/arifmeticheskie-operatory": "Арифметические операторы",
	"/python/yazyk-python/1-core/operatory-sravneniya": "Операторы сравнения",
	"/python/yazyk-python/1-core/boolean-i-usloviya": "Boolean и условия",
	"/python/yazyk-python/1-core/tsikly-for-i-range": "Документация",
	"/python/yazyk-python/1-core/tsikly-for-i-range/zadacha-brilliantovyy-romb": "Задача: ромб",
	"/python/yazyk-python/1-core/tsikl-while": "Цикл while",
	"/python/yazyk-python/1-core/funktsii-v-python": "Функции",
	"/python/yazyk-python/1-core/prodvinutye-funktsii-args-kwargs": "Args и kwargs",
	"/python/yazyk-python/1-core/oblast-vidimosti-peremennyh": "Область видимости",
	"/python/yazyk-python/1-core/importy-i-moduli": "Импорты и модули",
	"/python/yazyk-python/1-core/moduli-venv-i-pip": "Модули и окружение",
	"/python/yazyk-python/1-core/comprehensions-v-python": "Comprehensions",
	"/python/yazyk-python/1-core/sorted-i-filter": "Sorted и filter",
	"/python/yazyk-python/1-core/lambda-funktsii": "Lambda-функции",
	"/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except": "Try и except",
	"/python/yazyk-python/1-core/dekoratory-v-python": "Декораторы",
	"/python/yazyk-python/1-core/fayly-v-python": "Файлы",
	"/python/yazyk-python/klassy/klassy-glavnaya": "Обзор классов",
	"/python/yazyk-python/klassy/klass-i-ekzemplyar": "Класс и экземпляр",
	"/python/yazyk-python/klassy/init-self-atributy-i-metody": "Инициализация и методы",
	"/python/yazyk-python/klassy/nasledovanie-i-polimorfizm": "Наследование",
	"/python/yazyk-python/klassy/property-super-i-pereopredelenie": "Property и super",
	"/python/yazyk-python/klassy/praktika-igrovye-personazhi": "Практика ООП",
	"/python/yazyk-python/tipy-dannykh/operatsii-so-strokami": "Операции со строками",
	"/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii": "Списки базовые операции",
	"/python/yazyk-python/tipy-dannykh/indeksy-i-srezy": "Индексы и срезы",
	"/python/yazyk-python/tipy-dannykh/kortezhi-tuple": "Кортежи tuple",
	"/python/yazyk-python/tipy-dannykh/slovari-dict": "Словари dict",
	"/python/yazyk-python/tipy-dannykh/bayty-bytes": "Байты bytes",
	"/python/yazyk-python/tipy-dannykh/mnozhestva-set": "Множества set",
	"/python/yazyk-python/iteratory-i-generatory/iteratory-i-generatory-glavnaya": "Обзор итераторов",
	"/python/yazyk-python/iteratory-i-generatory/iterable-i-iterator": "Iterable и iterator",
	"/python/yazyk-python/iteratory-i-generatory/sobstvennyy-iterator": "Свой итератор",
	"/python/yazyk-python/iteratory-i-generatory/generatory-i-yield": "Генераторы и yield",
	"/python/yazyk-python/iteratory-i-generatory/generatornye-vyrazheniya": "Генераторные выражения",
	"/python/yazyk-python/iteratory-i-generatory/yield-from-i-konveyery": "Конвейеры yield from",
	"/python/yazyk-python/iteratory-i-generatory/upravlenie-generatorom-send-throw-close": "Управление генератором",
	"/python/yazyk-python/iteratory-i-generatory/modul-itertools": "Модуль itertools",
	"/python/yazyk-python/iteratory-i-generatory/generatory-kak-mnogozadachnost": "Многозадачность",
};

const WEAK_HEADINGS = new Set([
	"краткое объяснение",
	"шпаргалка",
	"основы",
	"пример использования",
]);

const TITLE_REPLACEMENTS = [];

function compactTitle(title) {
	let value = title
		.replace(/[*_`]/g, "")
		.replace(/^[^\p{L}\p{N}]+/u, "")
		.replace(/[«»"“”]/g, " ")
		.replace(/[()]/g, " ")
		.replace(/[—–:;,!?+]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	for (const [pattern, replacement] of TITLE_REPLACEMENTS) {
		value = value.replace(pattern, replacement);
	}

	const words = value.split(" ").filter(Boolean);
	if (words.length > 3) {
		value = words.slice(0, 3).join(" ");
	}

	return value
		.replace(/\bHttp\b/g, "HTTP")
		.replace(/\bApi\b/g, "API")
		.replace(/\bMl\b/g, "ML")
		.replace(/\bMlops\b/g, "MLOps")
		.replace(/\bNumpy\b/g, "NumPy")
		.replace(/\bPandas\b/g, "Pandas")
		.trim();
}

const GROUP_TITLE_OVERRIDES = {
	"/python/algoritmy": "Алгоритмы",
	"/python/algoritmy/etap-1-osnovy": "Этап 1. Основы",
	"/python/algoritmy/etap-2-patterny": "Этап 2. Паттерны",
	"/python/algoritmy/etap-3-lineynye-struktury": "Этап 3. Структуры",
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy": "Этап 4. Обходы",
	"/python/algoritmy/etap-5-greedy-dp": "Этап 5. DP",
	"/python/algoritmy/etap-6-praktika-intervyu": "Этап 6. Интервью",
	"/python/yazyk-python": "Язык Python",
	"/python/yazyk-python/1-core": "Core",
	"/python/yazyk-python/1-core/tsikly-for-i-range": "For и range",
	"/python/yazyk-python/klassy": "Классы",
	"/python/yazyk-python/tipy-dannykh": "Типы данных",
	"/python/yazyk-python/iteratory-i-generatory": "Итераторы и генераторы",
	"/python/ekosistema-python": "Экосистема Python",
	"/vue/global-state": "Глобальное состояние",
};

const GROUP_ORDER_OVERRIDES = {
	"/python/algoritmy": -300,
	"/python/algoritmy/etap-1-osnovy": -600,
	"/python/algoritmy/etap-2-patterny": -500,
	"/python/algoritmy/etap-3-lineynye-struktury": -400,
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy": -300,
	"/python/algoritmy/etap-5-greedy-dp": -200,
	"/python/algoritmy/etap-6-praktika-intervyu": -100,
	"/python/yazyk-python": -200,
	"/python/yazyk-python/1-core": -200,
	"/python/yazyk-python/klassy": -150,
	"/python/yazyk-python/tipy-dannykh": -100,
	"/python/yazyk-python/iteratory-i-generatory": -50,
	"/python/ekosistema-python": -100,
};

const ITEM_ORDER_OVERRIDES = {
	"/python/roadmap-python-dlya-ml-inzhenera": -1000,
	"/python/roadmap-algoritmy-i-struktury-dannykh-na-python": -990,
	"/python/algoritmy/algoritmy-glavnaya": -100,
	"/python/algoritmy/etap-1-osnovy/glavnaya": -100,
	"/python/algoritmy/etap-1-osnovy/big-o-i-analiz-slozhnosti": -90,
	"/python/algoritmy/etap-1-osnovy/slozhnost-operatsiy-python": -80,
	"/python/algoritmy/etap-1-osnovy/massivy-i-stroki": -70,
	"/python/algoritmy/etap-1-osnovy/heshirovanie-i-sortirovka": -60,
	"/python/algoritmy/etap-2-patterny/glavnaya": -100,
	"/python/algoritmy/etap-2-patterny/nedelya-4-two-pointers": -90,
	"/python/algoritmy/etap-2-patterny/nedelya-5-sliding-window": -80,
	"/python/algoritmy/etap-2-patterny/nedelya-6-prefix-sum": -70,
	"/python/algoritmy/etap-2-patterny/nedelya-7-binary-search": -60,
	"/python/algoritmy/etap-2-patterny/nedelya-8-sorting-i-intervaly": -50,
	"/python/algoritmy/etap-3-lineynye-struktury/glavnaya": -100,
	"/python/algoritmy/etap-3-lineynye-struktury/nedelya-9-stack-i-monotonic-stack": -90,
	"/python/algoritmy/etap-3-lineynye-struktury/nedelya-10-queue-i-deque": -80,
	"/python/algoritmy/etap-3-lineynye-struktury/nedelya-11-linked-list": -70,
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/glavnaya": -100,
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-12-recursion": -90,
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-13-binary-trees": -80,
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-14-matritsy-i-grid-traversal": -70,
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-15-graphs": -60,
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-16-backtracking": -50,
	"/python/algoritmy/etap-4-rekursiya-derevya-grafy/nedelya-17-heap-i-priority-queue": -40,
	"/python/algoritmy/etap-5-greedy-dp/glavnaya": -100,
	"/python/algoritmy/etap-5-greedy-dp/nedelya-18-greedy": -90,
	"/python/algoritmy/etap-5-greedy-dp/nedelya-19-dynamic-programming-i": -80,
	"/python/algoritmy/etap-5-greedy-dp/nedelya-20-dynamic-programming-ii": -70,
	"/python/algoritmy/etap-5-greedy-dp/nedelya-21-prodvinutyy-trek": -60,
	"/python/algoritmy/etap-6-praktika-intervyu/glavnaya": -100,
	"/python/algoritmy/etap-6-praktika-intervyu/nedelya-22-mixed-problems": -90,
	"/python/algoritmy/etap-6-praktika-intervyu/nedelya-23-mock-interviews": -80,
	"/python/algoritmy/etap-6-praktika-intervyu/nedelya-24-finalnaya-diagnostika": -70,
	"/python/yazyk-python/vvedenie-v-python": -800,
	"/python/yazyk-python/isklyucheniya-context-managers-i-fayly": -700,
	"/python/yazyk-python/iteratory-generatory-i-comprehensions": -600,
	"/python/yazyk-python/asyncio-korutiny-i-taskgroup": -550,
	"/python/yazyk-python/typing-dlya-python-i-ml": -500,
	"/python/yazyk-python/datetime-i-timezone": -400,
	"/python/yazyk-python/1-core/python-core-funktsii-klassy-moduli-venv-i-pip": -900,
	"/python/yazyk-python/1-core/osnovy-sintaksisa-i-peremennye": -800,
	"/python/yazyk-python/1-core/osnovnye-funktsii": -750,
	"/python/yazyk-python/1-core/vse-operatory-python": -730,
	"/python/yazyk-python/1-core/arifmeticheskie-operatory": -725,
	"/python/yazyk-python/1-core/operatory-sravneniya": -720,
	"/python/yazyk-python/1-core/boolean-i-usloviya": -710,
	"/python/yazyk-python/1-core/tsikly-for-i-range": -705,
	"/python/yazyk-python/1-core/tsikly-for-i-range/zadacha-brilliantovyy-romb": -704,
	"/python/yazyk-python/1-core/tsikl-while": -704,
	"/python/yazyk-python/1-core/funktsii-v-python": -700,
	"/python/yazyk-python/1-core/prodvinutye-funktsii-args-kwargs": -698,
	"/python/yazyk-python/1-core/oblast-vidimosti-peremennyh": -695,
	"/python/yazyk-python/1-core/importy-i-moduli": -550,
	"/python/yazyk-python/1-core/moduli-venv-i-pip": -500,
	"/python/yazyk-python/1-core/comprehensions-v-python": -450,
	"/python/yazyk-python/1-core/sorted-i-filter": -440,
	"/python/yazyk-python/1-core/lambda-funktsii": -430,
	"/python/yazyk-python/1-core/obrabotka-isklyucheniy-try-except": -420,
	"/python/yazyk-python/1-core/dekoratory-v-python": -410,
	"/python/yazyk-python/1-core/fayly-v-python": -405,
	"/python/yazyk-python/1-core/logicheskie-i-pobitovye-operatory": -400,
	"/python/yazyk-python/klassy/klassy-glavnaya": -100,
	"/python/yazyk-python/klassy/klass-i-ekzemplyar": -90,
	"/python/yazyk-python/klassy/init-self-atributy-i-metody": -80,
	"/python/yazyk-python/klassy/nasledovanie-i-polimorfizm": -70,
	"/python/yazyk-python/klassy/property-super-i-pereopredelenie": -60,
	"/python/yazyk-python/klassy/praktika-igrovye-personazhi": -50,
	"/python/yazyk-python/tipy-dannykh/tipy-glavnaya": -100,
	"/python/yazyk-python/tipy-dannykh/operatsii-so-strokami": -90,
	"/python/yazyk-python/tipy-dannykh/spiski-bazovye-operatsii": -80,
	"/python/yazyk-python/tipy-dannykh/indeksy-i-srezy": -70,
	"/python/yazyk-python/tipy-dannykh/kortezhi-tuple": -60,
	"/python/yazyk-python/tipy-dannykh/slovari-dict": -50,
	"/python/yazyk-python/tipy-dannykh/bayty-bytes": -40,
	"/python/yazyk-python/tipy-dannykh/mnozhestva-set": -30,
	"/python/yazyk-python/iteratory-i-generatory/iteratory-i-generatory-glavnaya": -100,
	"/python/yazyk-python/iteratory-i-generatory/iterable-i-iterator": -90,
	"/python/yazyk-python/iteratory-i-generatory/sobstvennyy-iterator": -80,
	"/python/yazyk-python/iteratory-i-generatory/generatory-i-yield": -70,
	"/python/yazyk-python/iteratory-i-generatory/generatornye-vyrazheniya": -60,
	"/python/yazyk-python/iteratory-i-generatory/yield-from-i-konveyery": -50,
	"/python/yazyk-python/iteratory-i-generatory/upravlenie-generatorom-send-throw-close": -40,
	"/python/yazyk-python/iteratory-i-generatory/modul-itertools": -30,
	"/python/yazyk-python/iteratory-i-generatory/generatory-kak-mnogozadachnost": -20,
	"/python/ekosistema-python/json-i-serializatsiya": -1300,
	"/python/ekosistema-python/http-zaprosy-requests": -1250,
	"/python/ekosistema-python/dekorator-retry-i-api-pogody": -1240,
	"/python/ekosistema-python/zagruzka-dannykh-i-formaty": -1200,
	"/python/ekosistema-python/sql-iz-python": -1100,
	"/python/ekosistema-python/numpy-i-pandas-dlya-ml": -1000,
	"/python/ekosistema-python/eda-i-vizualizatsiya": -900,
	"/python/ekosistema-python/scikit-learn-i-pipeline": -800,
	"/python/ekosistema-python/prodvinutyy-preprocessing": -700,
	"/python/ekosistema-python/vosproizvodimost-ml-koda": -600,
	"/python/ekosistema-python/logging-i-cli-dlya-ml-skriptov": -500,
	"/python/ekosistema-python/jupyter-workflow": -400,
	"/python/ekosistema-python/experiment-tracking": -300,
	"/python/ekosistema-python/artefakty-modeli-i-inference": -200,
	"/python/ekosistema-python/testirovanie-i-validatsiya-dannykh": -100,
	"/python/ekosistema-python/pytorch-basics": 100,
};

function toPublicRoute(route) {
	if (route === "/index") {
		return "/";
	}
	if (route.endsWith("/index")) {
		return route.slice(0, -"/index".length);
	}
	return route;
}

function looksLikeLatinOnlyTitle(value) {
	return /^[A-Za-z0-9\s+:.(),'"`’!?\-_/&]+$/.test(value) && /[A-Za-z]/.test(value);
}

function hasCyrillic(value) {
	return /[А-Яа-яЁё]/.test(value);
}

function cleanHeadingText(value) {
	return value
		.replace(/\[[xX ]\]\s*/g, "")
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/[*_]/g, "")
		.replace(/<[^>]*>/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function isWeakHeading(text) {
	const normalized = text.toLowerCase();
	if (WEAK_HEADINGS.has(normalized)) {
		return true;
	}
	if (/^(\d+|[ivx]+)\s*[\).:-]/i.test(normalized)) {
		return true;
	}
	return false;
}

function extractBestCyrillicHeading(body) {
	const headings = [];
	for (const line of body.split(/\r?\n/)) {
		const match = line.match(/^(#{1,6})\s+(.+)$/);
		if (!match) {
			continue;
		}
		const level = match[1].length;
		const text = cleanHeadingText(match[2]);
		if (!text || !hasCyrillic(text)) {
			continue;
		}
		headings.push({ level, text });
	}

	for (const heading of headings) {
		if (heading.level === 1 && !isWeakHeading(heading.text)) {
			return heading.text;
		}
	}

	for (const heading of headings) {
		if (heading.level <= 2 && !isWeakHeading(heading.text)) {
			return heading.text;
		}
	}

	for (const heading of headings) {
		if (!isWeakHeading(heading.text)) {
			return heading.text;
		}
	}

	return "";
}

function resolveSection(route) {
	return route.replace(/^\//, "").split("/")[0];
}

function normalizeTitle(route, body, frontmatter) {
	const publicRoute = toPublicRoute(route);
	const override = TITLE_OVERRIDES[publicRoute] ?? TITLE_OVERRIDES[route];
	if (override) {
		return compactTitle(override);
	}

	if (typeof frontmatter.title === "string" && frontmatter.title.trim()) {
		const title = frontmatter.title.trim();
		if (looksLikeLatinOnlyTitle(title)) {
			const fallbackTitle = extractBestCyrillicHeading(body);
			if (fallbackTitle) {
				return compactTitle(fallbackTitle);
			}
		}
		return compactTitle(title);
	}
	return compactTitle(inferTitle(route, body));
}

function toGroupTitle(fullPath, segment) {
	const override = GROUP_TITLE_OVERRIDES[fullPath];
	if (override) {
		return override;
	}

	const normalized = segment.replace(/[-_]+/g, " ").trim();
	if (!normalized) {
		return "Раздел";
	}
	return normalized[0].toUpperCase() + normalized.slice(1);
}

function toSidebarItems(entries) {
	const section = entries[0]?.section ?? "";
	const sectionPrefix = `/${section}/`;

	/** @type {Array<{text: string, link: string}>} */
	const rootItems = [];
	/** @type {Array<{text: string, link: string}>} */
	const topLevelItems = [];
	/** @type {Map<string, { key: string, text: string, items: Array<{text: string, link: string}>, children: Map<string, any> }>} */
	const topLevelGroups = new Map();

	function ensureGroup(groupsMap, fullPath, segment) {
		let group = groupsMap.get(fullPath);
		if (!group) {
			group = {
				key: fullPath,
				text: toGroupTitle(fullPath, segment),
				items: [],
				children: new Map(),
			};
			groupsMap.set(fullPath, group);
		}
		return group;
	}

	for (const entry of entries) {
		const route = toPublicRoute(entry.route);
		const groupingRoute = entry.route.endsWith("/index") ? entry.route : route;
		const item = { text: entry.title, link: route };
		const isSectionRoot = route === `/${section}` || route === `/${section}/index`;

		if (isSectionRoot) {
			rootItems.push(item);
			continue;
		}

		if (!groupingRoute.startsWith(sectionPrefix)) {
			topLevelItems.push(item);
			continue;
		}

		const relativeSegments = groupingRoute
			.slice(sectionPrefix.length)
			.split("/")
			.filter(Boolean);
		if (relativeSegments.length <= 1) {
			topLevelItems.push(item);
			continue;
		}

		const folderSegments = relativeSegments.slice(0, -1);
		let currentGroups = topLevelGroups;
		let currentGroup = null;
		let currentPath = `/${section}`;

		for (const segment of folderSegments) {
			currentPath = `${currentPath}/${segment}`;
			currentGroup = ensureGroup(currentGroups, currentPath, segment);
			currentGroups = currentGroup.children;
		}

		if (currentGroup) {
			currentGroup.items.push(item);
		}
	}

	function sortLeafItems(items) {
		return items.sort((a, b) => {
			const aPriority = ITEM_ORDER_OVERRIDES[a.link] ?? 0;
			const bPriority = ITEM_ORDER_OVERRIDES[b.link] ?? 0;
			if (aPriority !== bPriority) {
				return aPriority - bPriority;
			}
			return a.text.localeCompare(b.text, "ru");
		});
	}

	function sortGroups(groups) {
		return groups.sort((a, b) => {
			const aPriority = GROUP_ORDER_OVERRIDES[a.key] ?? 0;
			const bPriority = GROUP_ORDER_OVERRIDES[b.key] ?? 0;
			if (aPriority !== bPriority) {
				return aPriority - bPriority;
			}
			return a.text.localeCompare(b.text, "ru");
		});
	}

	function renderGroup(group) {
		const childGroups = sortGroups(Array.from(group.children.values())).map(renderGroup);
		const leafItems = sortLeafItems(group.items).map((item) => ({
			text: item.text,
			link: item.link,
		}));

		return {
			text: group.text,
			collapsible: true,
			collapsed: true,
			items: [...leafItems, ...childGroups],
		};
	}

	const renderedGroups = sortGroups(Array.from(topLevelGroups.values())).map(renderGroup);

	const renderedRootItems = sortLeafItems(rootItems);
	const renderedTopLevelItems = sortLeafItems(topLevelItems);

	return [...renderedRootItems, ...renderedTopLevelItems, ...renderedGroups];
}

const files = collectMarkdownFiles();
const bySection = new Map();

for (const filePath of files) {
	const route = routeFromFilePath(filePath);
	if (route === "/index") {
		continue;
	}

	const source = fs.readFileSync(filePath, "utf8");
	const { frontmatter, body } = splitFrontmatter(source);

	const section = resolveSection(route);
	const title = normalizeTitle(route, body, frontmatter);

	const list = bySection.get(section) ?? [];
	list.push({ route, title, section });
	bySection.set(section, list);
}

const sections = Array.from(bySection.entries()).sort((a, b) => {
	const aIndex = SECTION_ORDER.indexOf(a[0]);
	const bIndex = SECTION_ORDER.indexOf(b[0]);
	if (aIndex !== -1 || bIndex !== -1) {
		if (aIndex === -1) {
			return 1;
		}
		if (bIndex === -1) {
			return -1;
		}
		return aIndex - bIndex;
	}
	return a[0].localeCompare(b[0], "ru");
});

function renderSidebarItem(item, level = 0) {
	const indent = "\t".repeat(level);
	if ("link" in item) {
		return `${indent}{ text: "${escapeTsString(item.text)}", link: "${escapeTsString(item.link)}" }`;
	}

	const childItems = item.items.map((child) => renderSidebarItem(child, level + 2)).join(",\n");
	return `${indent}{
${indent}\ttext: "${escapeTsString(item.text)}",
${indent}\tcollapsible: true,
${indent}\tcollapsed: true,
${indent}\titems: [
${childItems}
${indent}\t],
${indent}}`;
}

const sidebarSource = `import type { DefaultTheme } from "vitepress";

// This file is auto-generated by scripts/generate-sidebar.mjs.
// Do not edit manually.
type SidebarItemWithCollapsible = Omit<DefaultTheme.SidebarItem, "items"> & {
\tcollapsible?: boolean;
\titems?: SidebarItemWithCollapsible[];
};

export const sidebar: SidebarItemWithCollapsible[] = [
${sections
	.map(([section, entries]) => {
		const title = SECTION_TITLES[section] ?? section;
		const items = toSidebarItems(entries);
		return `\t{
\t\ttext: "${escapeTsString(title)}",
\t\tcollapsible: true,
\t\tcollapsed: true,
\t\titems: [
${items.map((item) => renderSidebarItem(item, 3)).join(",\n")}
\t\t],
\t}`;
	})
	.join(",\n")}
];
`;

fs.writeFileSync(outputPath, sidebarSource, "utf8");
console.log(`Sidebar generated: ${path.relative(cwd, outputPath)} (${sections.length} sections).`);
