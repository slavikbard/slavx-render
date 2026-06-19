export interface NewsItem {
	id: string;
	headline: string;
	subheadline: string;
	bodyLines: string[];
	category: string;
	sourceDate: string;
	commentaryLine: string;
	imagePrompt: string;
	originalHebrew: string;
}

export interface RussianNewsReelProps {
	news: NewsItem;
	brandName?: string;
	accentColor?: string;
}

export const EXAMPLE_NEWS: NewsItem = {
	id: 'knesset-budget-2026',
	headline: 'Кнессет утвердил оборонный бюджет',
	subheadline: 'Рекордное финансирование безопасности на фоне региональных угроз',
	bodyLines: [
		'Кнессет проголосовал за увеличение оборонного бюджета на 12%.',
		'Новый бюджет включает средства на ПВО и кибербезопасность.',
		'Оппозиция критикует расходы, коалиция настаивает на необходимости.',
		'Министр обороны: «Безопасность Израиля — не предмет торга».',
	],
	category: 'ПОЛИТИКА',
	sourceDate: '2026-06-19',
	commentaryLine: 'Решение Кнессета подтверждает приоритет безопасности — единственный разумный курс в нестабильном регионе.',
	imagePrompt: 'Interior of Israeli Knesset parliament during an important vote, dramatic overhead lighting, politicians at their desks, editorial photography, dramatic lighting, 16:9 aspect ratio',
	originalHebrew: 'הכנסת אישרה את תקציב הביטחון עם גידול של 12 אחוז',
};

export const EXAMPLE_NEWS_2: NewsItem = {
	id: 'iron-dome-upgrade',
	headline: 'Железный купол получил новое обновление',
	subheadline: 'Система ПВО теперь способна перехватывать гиперзвуковые ракеты',
	bodyLines: [
		'ЦАХАЛ представил модернизированную версию «Железного купола».',
		'Новая система перехватывает цели на скорости свыше 5 Махов.',
		'Испытания прошли успешно в пустыне Негев.',
		'Израиль остаётся мировым лидером в технологиях ПВО.',
	],
	category: 'БЕЗОПАСНОСТЬ',
	sourceDate: '2026-06-18',
	commentaryLine: 'Технологическое превосходство Израиля — главный гарант безопасности граждан на Ближнем Востоке.',
	imagePrompt: 'Iron Dome missile defense system launching interceptor rockets against dark sky at dusk, dramatic orange trails, Israeli desert landscape, photojournalism style, dramatic lighting, 16:9 aspect ratio',
	originalHebrew: 'כיפת ברזל קיבלה שדרוג חדש - יירוט טילים היפרסוניים',
};
