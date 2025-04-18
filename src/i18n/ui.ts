const tags = {
  en: {
    "tag.React": "React",
    "tag.Remix": "Remix",
    "tag.Next": "Next",
    "tag.Canvas": "Canvas",
    "tag.Chakra UI": "Chakra UI",
    "tag.Prisma": "Prisma",
    "tag.Fly": "Fly",
    "tag.Workers": "Workers",
    "tag.Three.js": "Three.js",
    "tag.Typescript": "Typescript",
    "tag.PostgreSQL": "PostgreSQL",
    "tag.GraphQL": "GraphQL",
    "tag.Node": "Node",
    "tag.Vue": "Vue",
    "tag.Python": "Python",
    "tag.Rust": "Rust",
    "tag.C++": "C++",
    "tag.Web": "Web",
    "tag.Database": "Database",
    "tag.Network": "Network",
    "tag.System": "System",
    "tag.DialogFlow": "DialogFlow",
    "tag.TensorFlow": "TensorFlow",
    "tag.Drone": "Drone",
    "tag.Apollo": "Apollo",
    "tag.Nest": "Nest",
    "tag.Shadcn UI": "Shadcn UI",
    "tag.Turborepo": "Turborepo",
    "tag.MikroOrm": "MikroOrm",
    "tag.Computer Science": "Computer Science",
    "tag.Information Systems": "Information Systems",
    "tag.not-defined": "{tag}",
    "tag.Music": "Music",
    "tag.Drawing": "Drawing",
    "tag.Gaming": "Gaming",
    "tag.Astro": "Astro",
    "tag.TailwindCSS": "TailwindCSS"
  },
  fr: {
    "tag.React": "React",
    "tag.Remix": "Remix",
    "tag.Chakra UI": "Chakra UI",
    "tag.Prisma": "Prisma",
    "tag.Fly": "Fly",
    "tag.Canvas": "Canvas",
    "tag.Workers": "Workers",
    "tag.Three.js": "Three.js",
    "tag.Typescript": "Typescript",
    "tag.PostgreSQL": "PostgreSQL",
    "tag.GraphQL": "GraphQL",
    "tag.Node": "Node",
    "tag.Vue": "Vue",
    "tag.Python": "Python",
    "tag.Rust": "Rust",
    "tag.C++": "C++",
    "tag.Web": "Web",
    "tag.Database": "Base de données",
    "tag.Network": "Réseau",
    "tag.System": "Système",
    "tag.DialogFlow": "DialogFlow",
    "tag.TensorFlow": "TensorFlow",
    "tag.Drone": "Drone",
    "tag.Apollo": "Apollo",
    "tag.Nest": "Nest",
    "tag.Shadcn UI": "Shadcn UI",
    "tag.Turborepo": "Turborepo",
    "tag.MikroOrm": "MikroOrm",
    "tag.Computer Science": "Informatique",
    "tag.Information Systems": "Systèmes d'Information",
    "tag.not-defined": "{tag}",
    "tag.Music": "Musique",
    "tag.Drawing": "Dessin",
    "tag.Gaming": "Jeux vidéo",
    "tag.Astro": "Astro",
    "tag.TailwindCSS": "TailwindCSS"
  }
} as const

export const en = {
  "nav.resume": "Resume",
  "nav.portfolio": "Portfolio",
  "home.greeting": "Hi, I'm Nicolas !",
  "home.role": "I'm a front end engineer.",
  "home.bio.1":
    "I'm passionate about web technologies and I love to learn new things. I'm always looking for new challenges and opportunities to grow. I'm currently working at",
  "home.bio.2":
    ", a platform to create, share, and play treasure hunt games with QR codes and geolocation.",
  "home.cta.resume": "Get my resume",
  "home.portfolio.title": "Portfolio",
  "home.portfolio.description":
    "Here are some of public or personal projects I've worked on.",
  "home.portoflio.cta": "Go to {portfolio} website",
  "resume.title": "Nicolas Coulonnier - CV",
  "resume.description":
    "Nicolas Coulonnier's resume, a frontend developer based in Nantes, France.",
  "resume.print": "Print",
  "resume.contact.email": "Email",
  "resume.contact.age": "years old",
  "resume.contact.location": "Location",
  "resume.bio":
    "I'm passionate about web development, with a keen focus on creating efficient, user-friendly websites. My approach is simple: prioritize performance, user experience, and accessibility in every project.",
  "resume.bio.opensource":
    "I pay special attention to open source and best practices. Because it's important to question one's work, I try every day to learn new things and improve my skills.",
  "resume.bio.tech":
    "I construct most of the times with React framework and Typescript like a Remix 🎔 or Next I thrive on using these cutting-edge technologies to deliver exceptional digital experiences.",
  "resume.experience": "Experience",
  "resume.schools": "Schools",
  "resume.skills": "Skills and competencies",
  "resume.skills.frontend": "Frontend",
  "resume.skills.backend": "Backend",
  "resume.skills.database": "Database",
  "resume.skills.system": "System",
  "resume.misc": "Miscellaneous",
  "resume.misc.hobbies": "Hobbies",
  "resume.footer": "Resume generated on my website at",
  "footer.copyright": "© 2024 - Nicolas Coulonnier",
  "theme.toggle": "Toggle between light and dark theme",
  "theme.switch": "Switch theme",
  "404.title": "404 - Page not found",
  "404.description": "The page you are looking for does not exist.",
  "404.link": "Go back to the homepage",
  "credits.title": "Credits",
  "credits.description":
    "Credits for the fonts and technologies used on this website.",
  "credits.fonts.title": "Fonts",
  "credits.fonts.basteleur":
    "Basteleur by Keussel. Distributed by velvetyne.fr.",
  "credits.fonts.noto-sans-variable":
    "https://fonts.google.com/specimen/Noto+Sans+Variable",
  "credits.technologies.title": "Technologies",
  "credits.technologies.description":
    "This website is built with these amazing technologies:",
  ...tags.en
} as const

const fr: Record<keyof typeof en, string> = {
  "nav.resume": "CV",
  "nav.portfolio": "Portfolio",
  "home.greeting": "Salut, je suis Nicolas !",
  "home.role": "Je suis développeur front-end.",
  "home.bio.1":
    "Je suis passionné par les technologies web et j'aime apprendre de nouvelles choses. Je suis toujours à la recherche de nouveaux défis et d'opportunités pour grandir. Je travaille actuellement chez",
  "home.bio.2":
    ", une plateforme pour créer, partager et jouer à des chasses au trésor avec des QR codes et la géolocalisation.",
  "home.cta.resume": "Voir mon CV",
  "home.portfolio.title": "Portfolio",
  "home.portfolio.description":
    "Voici quelques projets publics ou personnels que j'ai réalisés.",
  "home.portoflio.cta": "Aller sur le site web de {portfolio}",
  "resume.title": "Nicolas Coulonnier - CV",
  "resume.description":
    "CV de Nicolas Coulonnier, développeur frontend basé à Nantes, France.",
  "resume.print": "Imprimer",
  "resume.contact.email": "Email",
  "resume.contact.age": "ans",
  "resume.contact.location": "Localisation",
  "resume.bio":
    "Je suis passionné par le développement web, avec un accent particulier sur la création de sites web efficaces et conviviaux. Mon approche est simple : prioriser la performance, l'expérience utilisateur et l'accessibilité dans chaque projet.",
  "resume.bio.opensource":
    "Je porte une attention particulière à l'open source et aux bonnes pratiques. Parce qu'il est important de remettre en question son travail, j'essaie chaque jour d'apprendre de nouvelles choses et d'améliorer mes compétences.",
  "resume.bio.tech":
    "Je construis la plupart du temps avec le framework React et Typescript comme Remix 🎔 ou Next. J'aime utiliser ces technologies de pointe pour offrir des expériences numériques exceptionnelles.",
  "resume.experience": "Expérience",
  "resume.schools": "Formation",
  "resume.skills": "Compétences",
  "resume.skills.frontend": "Frontend",
  "resume.skills.backend": "Backend",
  "resume.skills.database": "Base de données",
  "resume.skills.system": "Système",
  "resume.misc": "Divers",
  "resume.misc.hobbies": "Loisirs",
  "resume.footer": "CV généré sur mon site web à",
  "footer.copyright": "© 2024 - Nicolas Coulonnier",
  "theme.toggle": "Basculer entre le thème clair et sombre",
  "theme.switch": "Changer de thème",
  "404.title": "404 - Page non trouvée",
  "404.description": "La page que vous cherchez n'existe pas.",
  "404.link": "Retour à la page d'accueil",
  "credits.title": "Crédits",
  "credits.description":
    "Crédits pour les polices et technologies utilisées sur ce site.",
  "credits.fonts.title": "Polices",
  "credits.fonts.basteleur":
    "Basteleur par Keussel. Distribué par velvetyne.fr.",
  "credits.fonts.noto-sans-variable":
    "https://fonts.google.com/specimen/Noto+Sans+Variable",
  "credits.technologies.title": "Technologies",
  "credits.technologies.description":
    "Ce site est construit avec ces technologies :",
  "tag.Next": "Next",
  ...tags.fr
} as const

export const ui: Record<string, Record<keyof typeof en, string>> = {
  en,
  fr
} as const

export const routes = {
  en: {
    resume: "resume",
    credits: "credits"
  },
  fr: {
    resume: "cv",
    credits: "credits"
  }
} as const

export const showDefaultLang = false
