import bcrypt from 'bcryptjs'
import db from './database.js'
import { initSchema } from './schema.js'

// ── Novel content generation templates ──

const OPENINGS = [
  '天地初开，混沌未分。',
  '夜色如墨，万籁俱寂。',
  '阳光穿透云层，洒落大地。',
  '风雨交加，雷电轰鸣。',
  '星辰璀璨，银河倒挂。',
  '大雪纷飞，寒风如刀。',
  '一轮红日从东方升起。',
  '山谷中雾气弥漫。',
  '海浪拍打着礁石，激起千层浪花。',
  '古老的城门缓缓打开。',
]

const MIDDLES = [
  '{name}站在山巅，俯瞰芸芸众生。',
  '忽然间，一道金光从天而降。',
  '{name}心中一动，似乎感应到了什么。',
  '周围的空气开始剧烈波动。',
  '一股强大的气息从远处传来。',
  '{name}的手掌微微抬起，掌心凝聚着灵力。',
  '天地间的灵气如潮水般汇聚而来。',
  '刹那间，天地变色，风云变幻。',
  '{name}的眼中闪过一道精芒。',
  '万道霞光同时亮起，照亮了整个天空。',
  '巨大的轰鸣声震耳欲聋。',
  '{name}的衣袍在风中猎猎作响。',
  '一股无形的威压向四面八方扩散。',
  '时空仿佛在这一刻凝固了。',
  '无数符文在空中浮现，闪烁着神秘的光芒。',
  '{name}深吸一口气，周身气息陡然暴涨。',
  '剑光如匹练般划破长空。',
  '大地开始剧烈颤动。',
  '一道身影如流星般掠过天际。',
  '远古的力量正在苏醒。',
]

const ACTIONS = [
  '{name}缓缓睁开双眼，目光如电。',
  '他一掌拍出，掌风呼啸而去。',
  '{name}身形一动，化作一道残影。',
  '他口中念念有词，手中掐诀。',
  '{name}大喝一声，声震四野。',
  '他双指并拢，一剑挥出。',
  '{name}脚踏七星，身形飘忽不定。',
  '他双手结印，周身光芒大盛。',
  '{name}嘴角露出一丝淡淡的笑意。',
  '他眉头微皱，露出凝重之色。',
  '{name}袖袍一挥，一股劲风席卷而出。',
  '他仰天长啸，气势如虹。',
  '{name}身形暴退，避开致命一击。',
  '他身形一转，反手一剑刺出。',
  '{name}双手一合，天地灵气疯狂涌入体内。',
  '他凌空而立，俯瞰下方。',
  '{name}目光如炬，洞察一切。',
  '他微微一笑，脚下轻点，飞身而起。',
]

const ENDINGS = [
  '天地恢复平静，仿佛一切从未发生。',
  '一道身影消失在茫茫夜色中。',
  '微风拂过，只留下一片寂静。',
  '新的征程才刚刚开始。',
  '远方的天际露出一抹鱼肚白。',
  '一切都还在继续。',
  '天空中留下一道淡淡的痕迹。',
  '只留下一声悠长的叹息。',
]

const NAMES = ['叶凡', '林枫', '苏铭', '萧炎', '陈默', '龙尘', '秦昊', '林逸', '唐玄', '韩立', '方寒', '孟浩']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateParagraph(): string {
  const template = pick([...OPENINGS, ...MIDDLES, ...ACTIONS, ...ENDINGS])
  return template.replace(/\{name\}/g, pick(NAMES))
}

function generateChapterTitle(chapterNumber: number): string {
  const titles = [
    `第${chapterNumber}章 初入江湖`,
    `第${chapterNumber}章 风云突变`,
    `第${chapterNumber}章 秘境探险`,
    `第${chapterNumber}章 突破瓶颈`,
    `第${chapterNumber}章 意外收获`,
    `第${chapterNumber}章 强敌来袭`,
    `第${chapterNumber}章 绝处逢生`,
    `第${chapterNumber}章 卷土重来`,
    `第${chapterNumber}章 真相浮现`,
    `第${chapterNumber}章 巅峰对决`,
    `第${chapterNumber}章 新的危机`,
    `第${chapterNumber}章 苦修岁月`,
    `第${chapterNumber}章 天材地宝`,
    `第${chapterNumber}章 龙争虎斗`,
    `第${chapterNumber}章 剑指苍穹`,
    `第${chapterNumber}章 归途漫漫`,
    `第${chapterNumber}章 破而后立`,
    `第${chapterNumber}章 雷霆之势`,
  ]
  return pick(titles)
}

function generateChapterContent(): string {
  const count = 10 + Math.floor(Math.random() * 20)
  const paragraphs: string[] = []
  for (let i = 0; i < count; i++) {
    paragraphs.push('　　' + generateParagraph())
  }
  return paragraphs.join('\n\n')
}

// ── Seed data ──

const CATEGORIES = [
  { name: '玄幻', icon: '🔥', sort_order: 1 },
  { name: '都市', icon: '🏙️', sort_order: 2 },
  { name: '武侠', icon: '⚔️', sort_order: 3 },
  { name: '言情', icon: '💕', sort_order: 4 },
  { name: '科幻', icon: '🚀', sort_order: 5 },
  { name: '历史', icon: '📜', sort_order: 6 },
  { name: '悬疑', icon: '🔍', sort_order: 7 },
  { name: '游戏', icon: '🎮', sort_order: 8 },
  { name: '轻小说', icon: '📖', sort_order: 9 },
  { name: '现实', icon: '🌏', sort_order: 10 },
]

const NOVELS = [
  // 玄幻 x4
  { title: '九天星辰诀', author: '天蚕土豆', category: '玄幻', status: 1, summary: '少年叶凡偶得星辰诀，从此踏上逆天修行之路。诸天万界，星辰为引，且看他如何以凡人之躯，撼动九天星辰，成就无上传奇！', rating: 9.2, readCount: 1280000, tags: ['热血', '修炼', '逆袭', '爽文'] },
  { title: '万古神帝', author: '飞天鱼', category: '玄幻', status: 0, summary: '神帝重生，归来时却发现故土已面目全非。昔日挚爱化为黄土，昔日仇敌称霸九天。重修一世，他要夺回属于自己的一切！', rating: 8.8, readCount: 960000, tags: ['重生', '强者回归', '杀伐果断'] },
  { title: '绝世武神', author: '净无痕', category: '玄幻', status: 1, summary: '武魂觉醒，八方云动。一个被家族驱逐的少年，凭借不屈意志和逆天武魂，一步步登临武道巅峰。', rating: 9.0, readCount: 1050000, tags: ['武魂', '热血', '学院流'] },
  { title: '完美世界', author: '辰东', category: '玄幻', status: 1, summary: '一粒尘可填海，一根草斩尽日月星辰。他以少年之躯，于乱世中崛起，横推万敌，独断万古。', rating: 9.5, readCount: 2100000, tags: ['热血', '史诗', '独断万古'] },
  // 都市 x2
  { title: '都市超级医圣', author: '断桥残雪', category: '都市', status: 1, summary: '落魄少年偶得太古医道传承，一手银针可定生死，一身医术冠绝天下。且看他如何在这繁华都市中，以医入道，搅动风云！', rating: 8.5, readCount: 750000, tags: ['医术', '逆袭', '爽文'] },
  { title: '最强弃少', author: '月关', category: '都市', status: 0, summary: '他是被家族抛弃的弃子，也是令敌人闻风丧胆的兵王。回归都市，他只想守护心中所爱，却发现一个巨大的阴谋正在酝酿。', rating: 8.3, readCount: 620000, tags: ['兵王', '都市', '守护'] },
  // 武侠 x1
  { title: '剑来', author: '烽火戏诸侯', category: '武侠', status: 0, summary: '我有一剑，可搬山、倒海、降妖、镇魔、敕神。少年陈平安背负长剑，行走江湖，所见所闻皆是江湖，所遇所感皆为剑道。', rating: 9.3, readCount: 1800000, tags: ['剑道', '江湖', '侠义'] },
  // 言情 x2
  { title: '知否知否应是绿肥红瘦', author: '关心则乱', category: '言情', status: 1, summary: '现代白领穿越到古代官宦人家，成为不受宠的庶女。她决定低调做人，偏偏命运一次次将她推到风口浪尖。', rating: 9.1, readCount: 1500000, tags: ['穿越', '宅斗', '甜宠'] },
  { title: '倾城之恋', author: '匪我思存', category: '言情', status: 1, summary: '一见钟情是见色起意，日久生情是权衡利弊。而她偏要在这乱世之中，谈一场轰轰烈烈的倾城之恋。', rating: 8.6, readCount: 890000, tags: ['民国', '虐恋', '情深'] },
  // 科幻 x2
  { title: '星际纪元', author: '我吃西红柿', category: '科幻', status: 0, summary: '公元3024年，人类进入星际大航海时代。少年罗峰得到一枚神秘金属球，从此开启了一段波澜壮阔的星际征程。', rating: 8.9, readCount: 1100000, tags: ['星际', '机甲', '进化'] },
  { title: '深空之下', author: '天瑞说符', category: '科幻', status: 1, summary: '人类在深空中发现了一个巨大的未知结构体。一支科考队深入其中，发现了一个足以颠覆人类认知的秘密。', rating: 9.0, readCount: 670000, tags: ['硬科幻', '探险', '文明'] },
  // 历史 x1
  { title: '赘婿', author: '愤怒的香蕉', category: '历史', status: 1, summary: '金融巨头穿越到古代成为赘婿，本想躺平度日，却被时代洪流裹挟着，一步步走上改变天下格局的道路。', rating: 9.4, readCount: 2000000, tags: ['穿越', '权谋', '经商'] },
  // 悬疑 x1
  { title: '心理罪', author: '雷米', category: '悬疑', status: 1, summary: '天才犯罪心理侧写师方木，凭借惊人的洞察力屡破奇案。然而这一次，他面对的是一个和他一样了解人心的对手。', rating: 9.0, readCount: 850000, tags: ['推理', '犯罪心理', '悬疑'] },
  // 游戏 x1
  { title: '全职高手', author: '蝴蝶蓝', category: '游戏', status: 1, summary: '被俱乐部驱逐的顶尖电竞选手叶修，在一家小网吧里重新开始。他带着一把自制武器，重返荣耀之巅。', rating: 9.6, readCount: 2500000, tags: ['电竞', '热血', '竞技'] },
  // 轻小说 x1
  { title: '转生成为魔剑', author: '棚架悠', category: '轻小说', status: 0, summary: '意外转生成为一把魔剑，被可爱的猫耳少女捡到。从此一人一剑开始了一段温馨又刺激的冒险之旅。', rating: 8.2, readCount: 450000, tags: ['转生', '异世界', '冒险'] },
]

const BANNERS = [
  { title: '九天星辰诀', image_url: 'https://picsum.photos/seed/banner1/750/350', link_type: 'novel', link_value: '1', sort_order: 1 },
  { title: '全职高手', image_url: 'https://picsum.photos/seed/banner2/750/350', link_type: 'novel', link_value: '14', sort_order: 2 },
  { title: '剑来', image_url: 'https://picsum.photos/seed/banner3/750/350', link_type: 'novel', link_value: '7', sort_order: 3 },
  { title: '热门玄幻', image_url: 'https://picsum.photos/seed/banner4/750/350', link_type: 'category', link_value: '1', sort_order: 4 },
]

export function seed() {
  initSchema()

  const existing = db.prepare('SELECT COUNT(*) as c FROM novels').get() as { c: number }
  if (existing.c > 0) {
    console.log('Database already seeded, skipping.')
    return
  }

  console.log('Seeding database...')

  // Insert categories
  const insertCat = db.prepare('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)')
  for (const c of CATEGORIES) {
    insertCat.run(c.name, c.icon, c.sort_order)
  }

  // Insert demo users
  const hash1 = bcrypt.hashSync('123456', 10)
  const hash2 = bcrypt.hashSync('admin123', 10)
  db.prepare('INSERT INTO users (username, password, nickname, avatar) VALUES (?, ?, ?, ?)').run('testuser', hash1, '书虫小明', 'https://api.dicebear.com/9.x/avataaars/svg?seed=reader1')
  db.prepare('INSERT INTO users (username, password, nickname, avatar) VALUES (?, ?, ?, ?)').run('admin', hash2, '管理员', 'https://api.dicebear.com/9.x/avataaars/svg?seed=admin')

  // Insert novels, tags, and chapters
  const insertNovel = db.prepare('INSERT INTO novels (title, author, cover_url, summary, status, rating, read_count, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  const insertTag = db.prepare('INSERT INTO novel_tags (novel_id, tag_name) VALUES (?, ?)')
  const insertChapter = db.prepare('INSERT INTO chapters (novel_id, chapter_number, title, content, word_count, is_free) VALUES (?, ?, ?, ?, ?, ?)')

  const insertMany = db.transaction(() => {
    for (let i = 0; i < NOVELS.length; i++) {
      const n = NOVELS[i]
      const novelId = i + 1
      const catId = CATEGORIES.findIndex(c => c.name === n.category) + 1
      const coverUrl = `https://picsum.photos/seed/novel${novelId}/200/280`

      insertNovel.run(n.title, n.author, coverUrl, n.summary, n.status, 0, n.readCount, catId)

      for (const tag of n.tags) {
        insertTag.run(novelId, tag)
      }

      // Generate 30-80 chapters per novel
      const chapterCount = 30 + Math.floor(Math.random() * 51)
      let totalWords = 0

      for (let ch = 1; ch <= chapterCount; ch++) {
        const content = generateChapterContent()
        const wordCount = content.length
        totalWords += wordCount
        const title = generateChapterTitle(ch)
        const isFree = ch <= 20 ? 1 : (Math.random() > 0.3 ? 1 : 0)
        insertChapter.run(novelId, ch, title, content, wordCount, isFree)
      }

      // Update total word count
      db.prepare('UPDATE novels SET total_words = ? WHERE id = ?').run(totalWords, novelId)
    }
  })

  insertMany()
  console.log(`  Inserted ${NOVELS.length} novels with chapters`)

  // Insert banners
  const insertBanner = db.prepare('INSERT INTO banners (title, image_url, link_type, link_value, sort_order) VALUES (?, ?, ?, ?, ?)')
  for (const b of BANNERS) {
    insertBanner.run(b.title, b.image_url, b.link_type, b.link_value, b.sort_order)
  }

  // Default reading settings for demo user
  db.prepare('INSERT INTO reading_settings (user_id) VALUES (1)').run()

  // Add some novels to demo user's bookshelf
  db.prepare('INSERT INTO bookshelf (user_id, novel_id) VALUES (1, 1)').run()
  db.prepare('INSERT INTO bookshelf (user_id, novel_id) VALUES (1, 7)').run()
  db.prepare('INSERT INTO bookshelf (user_id, novel_id) VALUES (1, 14)').run()

  // Add some reading history
  db.prepare('INSERT INTO reading_history (user_id, novel_id, chapter_id, chapter_number, progress) VALUES (1, 1, 5, 5, 0.6)').run()
  db.prepare('INSERT INTO reading_history (user_id, novel_id, chapter_id, chapter_number, progress) VALUES (1, 7, 12, 12, 0.3)').run()
  db.prepare('INSERT INTO reading_history (user_id, novel_id, chapter_id, chapter_number, progress) VALUES (1, 14, 28, 28, 0.85)').run()

  console.log('Seeding complete!')
  console.log('  Demo accounts: testuser/123456, admin/admin123')
}

// Run directly
seed()
