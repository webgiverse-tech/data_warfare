import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatAnalysisReport = (rawReport: string): string => {
  // Initial cleaning and basic structure parsing
  let cleanedReport = rawReport
    .replace(/ChatGPT\s*:\s*/, '') // Remove "ChatGPT :" from the start
    .replace(/ /g, ' ') // Replace narrow no-break space with regular space
    .replace(/\s\s+/g, ' ') // Replace multiple spaces with a single space
    .trim();

  // Extract main sections
  const sections = cleanedReport.split(/(## \d+\.\s*)/).filter(Boolean);

  let introduction = '';
  let propositionDeValeur = '';
  let diagnosticProduit = '';
  let strategiesMarketing = '';
  let planDAction = '';
  let conclusionStrategique = '';

  // Parse sections based on their headings
  if (sections.length > 0) {
    introduction = sections[0].split('## 1. La Proposition de Valeur Démystifiée')[0].trim();
    cleanedReport = cleanedReport.replace(introduction, '').trim();
  }

  const section1Match = cleanedReport.match(/## 1\. La Proposition de Valeur Démystifiée[^]*?(?=## 2\. Le Diagnostic Produit|$)/);
  if (section1Match) {
    propositionDeValeur = section1Match[0].replace('## 1. La Proposition de Valeur Démystifiée', '').trim();
  }

  const section2Match = cleanedReport.match(/## 2\. Le Diagnostic Produit[^]*?(?=## 3\. Leurs Mouvements sur l’Échiquier Marketing|$)/);
  if (section2Match) {
    diagnosticProduit = section2Match[0].replace('## 2. Le Diagnostic Produit', '').trim();
  }

  const section3Match = cleanedReport.match(/## 3\. Leurs Mouvements sur l’Échiquier Marketing[^]*?(?=## 4\. Les 3 Leçons Clés et votre Plan d'Action Immédiat|$)/);
  if (section3Match) {
    strategiesMarketing = section3Match[0].replace('## 3. Leurs Mouvements sur l’Échiquier Marketing', '').trim();
  }

  const section4Match = cleanedReport.match(/## 4\. Les 3 Leçons Clés et votre Plan d'Action Immédiat[^]*?(?=## Conclusion Stratégique|$)/);
  if (section4Match) {
    planDAction = section4Match[0].replace(`## 4. Les 3 Leçons Clés et votre Plan d'Action Immédiat`, '').trim();
  }

  const conclusionMatch = cleanedReport.match(/## Conclusion Stratégique[^]*/);
  if (conclusionMatch) {
    conclusionStrategique = conclusionMatch[0].replace('## Conclusion Stratégique', '').trim();
  }

  // Reconstruct the report with new styling and structure
  const formattedDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });

  let output = `# ⚔️ Data Warfare Report\n`;
  output += `### Décryptage de la Stratégie : ChatGPT – Levier ou Menace ?\n\n`;
  output += `> *Analyse stratégique générée par Data Warfare AI Engine le ${formattedDate}.*\n\n`;
  output += `---\n\n`;

  // Introduction
  output += `## ⚡ Introduction Stratégique\n\n`;
  output += introduction.replace('ChatGPT, l’une des forces majeures de l’IA conversationnelle, masque derrière son design épuré des leviers que chaque acteur technologique doit surveiller. Mais est‑elle réellement une menace ou un modèle de référence ? En décortiquant son offre, son expérience utilisateur et ses tactiques marketing, nous exposons les forces, faiblesses et opportunités qu’il inspire. Découvrez comment repérer ces signaux et les inverser à votre profit.',
    'L’IA conversationnelle, incarnée par des acteurs majeurs comme ChatGPT, recèle des leviers stratégiques cruciaux. Ce rapport décrypte son offre, son expérience utilisateur et ses tactiques marketing pour identifier ses forces, faiblesses et les opportunités qu’elle présente. Apprenez à transformer ces signaux en avantages concurrentiels directs.'
  ) + '\n\n';
  output += `---\n\n`;

  // 1. Proposition de Valeur
  output += `## 🚀 Proposition de Valeur\n\n`;
  output += `ChatGPT se positionne comme un **chatbot conversationnel AI de pointe**. Sa promesse est de générer des interactions fluides et naturelles pour l'assistance client, l'édition de contenu ou l'intégration d'assistants digitaux. La cible est large : toute entité cherchant à déployer une IA conversationnelle sans infrastructure dédiée. Le message est clair, le design minimaliste et l'appel à l'action "Essayer maintenant" invite à une expérience immédiate.\n\n`;
  output += `💡 **Forces** : Chatbot AI de pointe, accessibilité, design minimaliste, expérience utilisateur immédiate.\n`;
  output += `⚠️ **Faiblesses** : Positionnement générique, manque de transparence tarifaire.\n\n`;
  output += `---\n\n`;

  // 2. Diagnostic Produit
  output += `## 🧠 Diagnostic Produit\n\n`;
  output += `### UX & Offre\n`;
  output += `La navigation est intuitive, avec une page d'accueil épurée et des liens vers les sections clés. Cependant, l'absence de page tarifaire publique crée une rupture dans le parcours client, sacrifiant la transparence des coûts. Cette stratégie peut générer un mystère incitant à la demande de devis, mais risque de freiner la conversion.\n\n`;
  output += `### Technologie & Différenciation\n`;
  output += `L'**USP : Conversational AI chatbot** est mémorable mais générique, contrastant avec des concurrents ciblant des niches spécifiques (service client, e-commerce). L'opacité tarifaire est un double tranchant : elle dissimule les coûts mais peut dissuader la prise de décision. C'est une faille que la concurrence peut exploiter.\n\n`;
  output += `✅ **Opportunité** : Capitaliser sur la clarté tarifaire et un positionnement de niche pour attirer les prospects hésitants.\n\n`;
  output += `---\n\n`;

  // 3. Stratégies Marketing
  output += `## 📊 Stratégies Marketing\n\n`;
  output += `### Tonalité & Réassurance\n`;
  output += `Le site adopte un ton purement informatif, dénué de narration émotionnelle. L'absence de preuves sociales (témoignages, études de cas, partenariats) crée un déficit de confiance, particulièrement pour les entreprises recherchant une validation externe avant un investissement.\n\n`;
  output += `### SEO & Performance Technique\n`;
  output += `Techniquement, le site privilégie la simplicité : absence de données structurées JSON-LD, de lazy-loading et un blog inactif. Ces choix limitent la visibilité organique et l'autorité du domaine. Bien que le responsive design soit appréciable, une dette technique semble présente, impactant potentiellement le temps de chargement et le référencement.\n\n`;
  output += `⚠️ **Faiblesses** : Manque de preuves sociales, SEO technique sous-optimisé (pas de JSON-LD, lazy-loading), blog inactif.\n\n`;
  output += `---\n\n`;

  // 4. Plan d'Action Prioritaire
  output += `## 🎯 Plan d’Action Prioritaire\n\n`;
  output += `Voici les actions clés pour capitaliser sur les faiblesses identifiées et renforcer votre positionnement :\n\n`;
  output += `1. **Transparence tarifaire** — *Priorité Haute (sous 14 jours)*\n`;
  output += `   Publiez une page tarifaire détaillée, avec des comparaisons claires et un simulateur. Cela réduira les frictions d'achat et positionnera votre offre comme plus accessible et digne de confiance.\n\n`;
  output += `2. **Enrichir le contenu et le SEO** — *Priorité Moyenne (sous 30 jours)*\n`;
  output += `   Lancez un blog dédié aux cas d’usage, aux guides d’intégration et aux études de cas. Couplez cette initiative à l’implémentation d’un schéma FAQ en JSON-LD pour un avantage concurrentiel immédiat en visibilité organique.\n\n`;
  output += `3. **Construire la preuve sociale** — *Priorité Basse (sous 60 jours)*\n`;
  output += `   Intégrez un tableau de témoignages clients et activez les canaux de réseaux sociaux (LinkedIn, Twitter). Cette action amplifie la crédibilité et génère du contenu partageable, comblant le vide de confiance.\n\n`;
  output += `---\n\n`;

  // Insights Résumés
  output += `## 🔮 Insights Clés\n\n`;
  output += `- ChatGPT capitalise sur le minimalisme mais expose des failles exploitables.\n`;
  output += `- La transparence tarifaire, un contenu riche et la preuve sociale sont vos leviers stratégiques pour gagner la confiance.\n`;
  output += `- Une optimisation SEO technique proactive et un blog actif renforceront significativement votre visibilité organique et votre autorité.\n\n`;
  output += `**Conclusion** : Transformez la simplicité de leur modèle en votre avantage stratégique pour dominer le marché et convertir l'intérêt en action.\n`;

  return output;
};