// IELTS Academic Reading mock tests — embedded from official Authentic-Style PDF.
// 10 tests · 40 questions each · 60 minutes.

export type QuestionType = "tfng" | "fill" | "match";

export type BaseQuestion = {
  number: number;
  prompt: string;
  answer: string; // canonical answer; for "fill" we lowercase compare
};

export type TFNGQuestion = BaseQuestion & {
  type: "tfng";
  // answer ∈ {"TRUE","FALSE","NOT GIVEN"}
};

export type FillQuestion = BaseQuestion & {
  type: "fill";
  // answer is a single phrase (NO MORE THAN TWO WORDS); accept case-insensitive
};

export type MatchQuestion = BaseQuestion & {
  type: "match";
  options: { key: string; label: string }[]; // shared per group, repeated for simplicity
  // answer is a key from options (e.g. "A")
};

export type Question = TFNGQuestion | FillQuestion | MatchQuestion;

export type Passage = {
  title: string;
  body: string; // paragraphs separated by \n\n
};

export type Section = {
  number: 1 | 2 | 3;
  passage: Passage;
  questions: Question[];
};

export type IeltsTest = {
  id: number; // 1-10
  title: string;
  durationMinutes: number;
  sections: Section[];
};

// Helper: build TFNG questions
const T = (number: number, prompt: string, answer: "TRUE" | "FALSE" | "NOT GIVEN"): TFNGQuestion => ({
  type: "tfng", number, prompt, answer,
});

// Helper: build fill-in question
const F = (number: number, prompt: string, answer: string): FillQuestion => ({
  type: "fill", number, prompt, answer,
});

// Helper: build matching question
const M = (
  number: number,
  prompt: string,
  options: { key: string; label: string }[],
  answer: string,
): MatchQuestion => ({ type: "match", number, prompt, options, answer });

// Reusable matching option groups
const headings1 = [
  { key: "A", label: "Technological transformation" },
  { key: "B", label: "Public accessibility" },
  { key: "C", label: "Exclusive beginnings" },
  { key: "D", label: "Changing cultural values" },
  { key: "E", label: "Expansion of educational roles" },
  { key: "F", label: "Challenges of representation" },
  { key: "G", label: "Industrial-era reform" },
];

// =============== TEST 1 ===============
const TEST_1: IeltsTest = {
  id: 1,
  title: "Mock Test 1 — Authentic Style",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Development of Bio-Inspired Robotics",
        body:
          "The field of robotics has increasingly turned to nature for inspiration. Engineers and scientists study biological organisms in order to design machines capable of navigating complex environments with greater efficiency. This interdisciplinary field, known as bio-inspired robotics, seeks to replicate the adaptive strategies of animals and plants.\n\n" +
          "One of the earliest examples was the development of robotic arms modeled on the flexibility of octopus tentacles. Unlike rigid mechanical limbs, these designs allowed for smoother and more precise movement. Similarly, researchers studying insect locomotion created six-legged robots capable of maintaining stability across uneven terrain.\n\n" +
          "Bio-inspired robotics has proven especially valuable in search-and-rescue missions. Snake-like robots, for instance, can enter collapsed buildings where human access is impossible. Their segmented structures allow them to maneuver through debris while transmitting real-time data.\n\n" +
          "However, replicating biological systems remains technically challenging. Living organisms possess sensory and neural networks of extraordinary complexity. Translating these into artificial systems requires advanced materials, computing power, and design innovation.\n\n" +
          "Despite these obstacles, advocates argue that nature provides the most efficient models for solving engineering problems. As technology evolves, bio-inspired machines are expected to play a growing role in medicine, industry, and environmental monitoring.",
      },
      questions: [
        T(1, "Bio-inspired robotics relies exclusively on animal behavior.", "FALSE"),
        T(2, "Octopus-inspired robotic arms improved movement precision.", "TRUE"),
        T(3, "Six-legged robots were created to replace human workers in factories.", "FALSE"),
        T(4, "Snake-like robots are useful in disaster zones.", "TRUE"),
        T(5, "Biological organisms have simpler sensory systems than robots.", "FALSE"),
        T(6, "Advanced materials are necessary in artificial systems.", "TRUE"),
        T(7, "Bio-inspired machines are unlikely to influence medicine.", "FALSE"),
        F(8, "Bio-inspired robotics is an ________ field.", "interdisciplinary"),
        F(9, "Robotic arms were modeled on octopus ________.", "tentacles"),
        F(10, "Insect-based robots maintain ________ on uneven surfaces.", "stability"),
        F(11, "Snake-like robots send ________ data.", "real-time"),
        F(12, "Biological systems contain complex ________ networks.", "sensory"),
        F(13, "Nature offers efficient ________ for engineering challenges.", "models"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "The Social Evolution of Museums",
        body:
          "Museums were once regarded primarily as repositories of rare objects, designed for preservation rather than public interaction. Early institutions emphasized exclusivity, with collections often accessible only to scholars or elite patrons.\n\n" +
          "During the 19th century, museums underwent a transformation. Industrialization and urbanization created a demand for public education, prompting governments to open cultural institutions to wider audiences. Exhibitions increasingly incorporated interpretive materials to guide visitors' understanding.\n\n" +
          "In the 20th century, museums expanded their missions further. Educational programs, community outreach, and interactive displays became central features. Rather than merely displaying artifacts, institutions sought to foster dialogue and engagement.\n\n" +
          "Today, digital technologies have reshaped museum practices once again. Virtual tours, online archives, and augmented reality tools enable access beyond physical walls. At the same time, museums face questions about representation, restitution, and inclusivity.\n\n" +
          "This evolution reflects a broader shift in how societies define cultural value—not as static preservation, but as active participation in collective memory.",
      },
      questions: [
        M(14, "Paragraph 1", headings1, "C"),
        M(15, "Paragraph 2", headings1, "G"),
        M(16, "Paragraph 3", headings1, "E"),
        M(17, "Paragraph 4", headings1, "A"),
        M(18, "Early museum philosophy", headings1, "C"),
        M(19, "Interactive developments", headings1, "E"),
        M(20, "Modern debates", headings1, "F"),
        T(21, "Museums were originally designed mainly for public entertainment.", "FALSE"),
        T(22, "Industrialization contributed to wider museum access.", "TRUE"),
        T(23, "Interactive displays became important in the 20th century.", "TRUE"),
        T(24, "Digital tools reduced museum accessibility.", "FALSE"),
        F(25, "Early collections were often limited to ________ patrons.", "elite"),
        F(26, "Museums introduced ________ materials for visitors.", "interpretive"),
        F(27, "Augmented reality supports access beyond ________ walls.", "physical"),
      ],
    },
    {
      number: 3,
      passage: {
        title: "The Dynamics of Collective Intelligence",
        body:
          "Collective intelligence refers to the enhanced problem-solving capacity that emerges when individuals collaborate effectively. Unlike individual expertise, which depends on personal knowledge, collective intelligence arises from interaction, diversity, and coordination.\n\n" +
          "Research suggests that groups with varied perspectives outperform homogeneous teams, particularly in complex tasks. Diversity reduces the likelihood of shared blind spots and encourages creative approaches. However, diversity alone is insufficient; communication structures must enable equal participation.\n\n" +
          "One influential factor is social sensitivity—the ability of members to perceive and respond to one another's emotions and perspectives. Teams with higher social sensitivity tend to coordinate more efficiently and resolve conflicts constructively.\n\n" +
          "Digital platforms have amplified collective intelligence on a global scale. Open-source communities, online forums, and citizen science initiatives allow dispersed participants to contribute toward shared objectives.\n\n" +
          "Yet collective intelligence is vulnerable to misinformation, groupthink, and unequal influence. Poorly managed collaboration can reinforce errors rather than correct them. Thus, effective systems require both openness and critical evaluation.",
      },
      questions: [
        F(28, "Collective intelligence depends on ________ and coordination.", "interaction"),
        F(29, "Groups with varied perspectives avoid shared ________.", "blind spots"),
        F(30, "A key factor is ________ sensitivity, which improves conflict resolution.", "social"),
        F(31, "Digital platforms enable ________ participation.", "dispersed"),
        F(32, "However, poorly managed systems may reinforce ________.", "errors"),
        ...(() => {
          const roles = [
            { key: "A", label: "Increase emotional awareness" },
            { key: "B", label: "Encourage global collaboration" },
            { key: "C", label: "Reinforce incorrect assumptions" },
            { key: "D", label: "Reduce blind spots" },
          ];
          return [
            M(33, "Diverse teams", roles, "D"),
            M(34, "Socially sensitive members", roles, "A"),
            M(35, "Digital platforms", roles, "B"),
            M(36, "Poorly managed groups", roles, "C"),
          ];
        })(),
        ...(() => {
          const desc = [
            { key: "A", label: "Awareness of others' perspectives" },
            { key: "B", label: "Tendency toward conformity" },
            { key: "C", label: "Enhanced group problem-solving" },
            { key: "D", label: "Variety of viewpoints" },
          ];
          return [
            M(37, "Collective intelligence", desc, "C"),
            M(38, "Groupthink", desc, "B"),
            M(39, "Social sensitivity", desc, "A"),
            M(40, "Diversity", desc, "D"),
          ];
        })(),
      ],
    },
  ],
};

// =============== TEST 2 ===============
const TEST_2: IeltsTest = {
  id: 2,
  title: "Mock Test 2 — Advanced Variation",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Hidden Costs of Fast Fashion",
        body:
          "The global fast fashion industry has transformed the way consumers purchase clothing. By producing inexpensive garments at remarkable speed, retailers are able to respond rapidly to shifting trends. This model has democratized access to style, allowing wider populations to participate in contemporary fashion culture.\n\n" +
          "Yet beneath its commercial success lies a complex network of environmental and social costs. Textile manufacturing is resource-intensive, requiring substantial quantities of water, chemicals, and energy. Synthetic fibers, while inexpensive, contribute significantly to microplastic pollution when washed.\n\n" +
          "Labour practices have also come under scrutiny. To minimize production expenses, many companies outsource manufacturing to regions with lower wages and weaker labour protections. Reports of unsafe working conditions and excessive hours have raised ethical concerns among advocacy groups.\n\n" +
          "Some brands have introduced recycling initiatives and sustainable collections in response to criticism. However, scholars argue that these measures often represent incremental adjustments rather than systemic change. The fundamental business model—based on high turnover and frequent consumption—remains largely intact.\n\n" +
          "As awareness grows, consumer attitudes are gradually shifting. Nevertheless, meaningful reform may require coordinated action involving governments, corporations, and individuals.",
      },
      questions: [
        T(1, "Fast fashion has reduced access to modern clothing styles.", "FALSE"),
        T(2, "Synthetic fibers are linked to environmental pollution.", "TRUE"),
        T(3, "All fast fashion companies manufacture garments domestically.", "FALSE"),
        T(4, "Some sustainability programs may be more symbolic than transformative.", "TRUE"),
        T(5, "Governments have already solved the ethical issues in fashion supply chains.", "FALSE"),
        T(6, "Consumer awareness of fashion's impacts is increasing.", "TRUE"),
        T(7, "The writer suggests that individual action alone is sufficient.", "FALSE"),
        F(8, "Fast fashion retailers respond rapidly to changing ________.", "trends"),
        F(9, "Textile production requires large amounts of ________ and energy.", "water"),
        F(10, "Synthetic materials contribute to ________ pollution.", "microplastic"),
        F(11, "Companies often outsource to areas with lower ________.", "wages"),
        F(12, "Sustainable collections may only be ________ adjustments.", "incremental"),
        F(13, "Reform requires cooperation among multiple ________.", "stakeholders"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "Mapping the Human Genome",
        body:
          "The completion of the Human Genome Project marked a turning point in biological science. By identifying the sequence of approximately three billion DNA base pairs, researchers created a foundational reference for understanding human genetics.\n\n" +
          "Initially, scientists anticipated that decoding the genome would immediately revolutionize medicine. While progress has indeed been substantial, the reality proved more complex. Many diseases are influenced not by a single gene, but by intricate interactions among multiple genes and environmental conditions.\n\n" +
          "Nevertheless, genomic research has transformed diagnostics. Genetic screening can identify predispositions to inherited disorders, enabling earlier interventions. Personalized medicine—where treatment is tailored to an individual's genetic profile—has emerged as a promising field.\n\n" +
          "Ethical debates, however, accompany these advances. Concerns include privacy, discrimination, and unequal access to genomic technologies. Critics warn that without regulatory safeguards, benefits may be distributed unevenly across societies.\n\n" +
          "Despite challenges, genome science continues to expand. Its greatest contribution may lie not in deterministic prediction, but in revealing the extraordinary complexity of human biology.",
      },
      questions: (() => {
        const heads = [
          { key: "A", label: "Ethical implications" },
          { key: "B", label: "Early expectations" },
          { key: "C", label: "Diagnostic transformation" },
          { key: "D", label: "Scientific milestone" },
          { key: "E", label: "Limits of prediction" },
          { key: "F", label: "Genetic complexity" },
          { key: "G", label: "Future expansion" },
        ];
        return [
          M(14, "Paragraph 1", heads, "D"),
          M(15, "Paragraph 2", heads, "B"),
          M(16, "Paragraph 3", heads, "C"),
          M(17, "Paragraph 4", heads, "A"),
          M(18, "Initial optimism", heads, "B"),
          M(19, "Medical applications", heads, "C"),
          M(20, "Broader significance", heads, "E"),
          T(21, "The Human Genome Project mapped three million DNA pairs.", "FALSE"),
          T(22, "Some diseases involve multiple genetic factors.", "TRUE"),
          T(23, "Personalized medicine ignores genetic differences.", "FALSE"),
          T(24, "Ethical concerns include unequal access.", "TRUE"),
          F(25, "Genetic screening identifies ________ to inherited disorders.", "predispositions"),
          F(26, "Critics emphasize the need for ________ safeguards.", "regulatory"),
          F(27, "Genome science highlights biological ________.", "complexity"),
        ];
      })(),
    },
    {
      number: 3,
      passage: {
        title: "Collective Memory and Historical Narratives",
        body:
          "Collective memory refers to the shared understanding of the past within a social group. Unlike formal history, which seeks evidence-based reconstruction, collective memory is shaped by identity, emotion, and cultural transmission.\n\n" +
          "National commemorations, monuments, and textbooks often reinforce particular narratives. These narratives may unify societies, but they can also marginalize alternative perspectives. What is remembered—and what is omitted—frequently reflects power structures rather than objective truth.\n\n" +
          "Historians argue that collective memory is dynamic rather than fixed. As social values evolve, interpretations of past events may be revised. Public debates over monuments or historical anniversaries illustrate this process.\n\n" +
          "Digital media has further complicated collective memory. Online platforms enable broader participation in historical discourse, yet they also accelerate misinformation and polarization.\n\n" +
          "Ultimately, collective memory is not merely about preserving the past; it shapes present identities and future political choices.",
      },
      questions: (() => {
        const fn = [
          { key: "A", label: "Reassess interpretations" },
          { key: "B", label: "Preserve selected narratives" },
          { key: "C", label: "Expand public discourse" },
          { key: "D", label: "Shape educational memory" },
        ];
        const desc = [
          { key: "A", label: "Division of opinion" },
          { key: "B", label: "Evidence-based reconstruction" },
          { key: "C", label: "Shared understanding of the past" },
          { key: "D", label: "Influence over dominant narratives" },
        ];
        return [
          F(28, "Collective memory differs from formal history because it is influenced by ________ and identity.", "emotion"),
          F(29, "National institutions often reinforce specific ________.", "narratives"),
          F(30, "These may exclude alternative ________.", "perspectives"),
          F(31, "Digital media broadens participation but may increase ________.", "misinformation"),
          F(32, "Collective memory influences future ________ choices.", "political"),
          M(33, "Monuments", fn, "B"),
          M(34, "Textbooks", fn, "D"),
          M(35, "Online platforms", fn, "C"),
          M(36, "Historians", fn, "A"),
          M(37, "Collective memory", desc, "C"),
          M(38, "Formal history", desc, "B"),
          M(39, "Power structures", desc, "D"),
          M(40, "Polarization", desc, "A"),
        ];
      })(),
    },
  ],
};

// =============== TEST 3 ===============
const TEST_3: IeltsTest = {
  id: 3,
  title: "Mock Test 3 — Advanced Level",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Commercialization of Space Exploration",
        body:
          "For much of the 20th century, space exploration was dominated by national governments, driven largely by political rivalry and scientific ambition. Programs such as the Apollo missions symbolized technological prestige and geopolitical competition. However, the 21st century has witnessed a profound transformation: the rise of private enterprises in space-related activities.\n\n" +
          "Commercial firms now play a significant role in satellite deployment, cargo transport, and even human spaceflight. Advocates argue that private-sector involvement accelerates innovation, reduces costs, and expands access to space technologies. Reusable rocket systems, for instance, have substantially lowered launch expenses.\n\n" +
          "Yet commercialization introduces new concerns. Critics question whether profit motives align with long-term scientific objectives. There are also legal uncertainties regarding resource extraction on celestial bodies, as international treaties remain ambiguous on private ownership claims.\n\n" +
          "Environmental issues further complicate the debate. The growing number of launches contributes to atmospheric emissions, while increasing satellite constellations raise the risk of orbital debris. Such debris can endanger spacecraft and disrupt essential communication systems.\n\n" +
          "Despite these challenges, supporters contend that public-private collaboration offers the most sustainable path forward. They argue that exploration beyond Earth will increasingly depend on partnerships rather than government monopolies.",
      },
      questions: [
        T(1, "Government agencies remain the only participants in space exploration.", "FALSE"),
        T(2, "The Apollo missions reflected geopolitical competition.", "TRUE"),
        T(3, "Reusable rockets have increased launch expenses.", "FALSE"),
        T(4, "Private firms contribute to human spaceflight.", "TRUE"),
        T(5, "International treaties clearly define private ownership in space.", "FALSE"),
        T(6, "Orbital debris poses risks to spacecraft.", "TRUE"),
        T(7, "The passage suggests that partnerships may shape future exploration.", "TRUE"),
        F(8, "Earlier space programs were driven by political rivalry and ________.", "scientific ambition"),
        F(9, "Private-sector involvement can reduce ________.", "costs"),
        F(10, "Reusable rockets lower ________ expenses.", "launch"),
        F(11, "Resource extraction creates ________ uncertainties.", "legal"),
        F(12, "Satellite constellations increase the risk of ________ debris.", "orbital"),
        F(13, "Future progress may depend on ________ collaboration.", "public-private"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "Urban Noise and Cognitive Performance",
        body:
          "Urban environments are characterized by constant sensory stimulation, of which noise is among the most pervasive. While moderate sound levels may be manageable, chronic exposure to excessive noise has been linked to impaired cognitive performance.\n\n" +
          "Studies show that prolonged noise disrupts concentration, reduces working memory capacity, and increases mental fatigue. Children in noisy school environments, for example, often demonstrate lower reading comprehension compared to peers in quieter settings.\n\n" +
          "The effects are not solely academic. In workplaces, persistent background noise may reduce productivity and increase error rates. Certain professions requiring sustained attention—such as air traffic control—are particularly vulnerable.\n\n" +
          "Researchers also highlight the physiological consequences of urban noise. Elevated stress hormones, sleep disturbance, and cardiovascular strain have all been associated with excessive exposure.\n\n" +
          "Efforts to mitigate urban noise include soundproofing, zoning regulations, and green infrastructure. However, effective intervention requires balancing economic development with public wellbeing.",
      },
      questions: (() => {
        const heads = [
          { key: "A", label: "Educational consequences" },
          { key: "B", label: "Workplace vulnerability" },
          { key: "C", label: "Health-related effects" },
          { key: "D", label: "Solutions and policies" },
          { key: "E", label: "Sources of stimulation" },
          { key: "F", label: "Economic considerations" },
          { key: "G", label: "Cognitive disruption" },
        ];
        return [
          M(14, "Paragraph 1", heads, "E"),
          M(15, "Paragraph 2", heads, "G"),
          M(16, "Paragraph 3", heads, "B"),
          M(17, "Paragraph 4", heads, "C"),
          M(18, "Preventive measures", heads, "D"),
          M(19, "School performance", heads, "A"),
          M(20, "Long-term stress impact", heads, "C"),
          T(21, "Urban noise has no measurable impact on memory.", "FALSE"),
          T(22, "Children in quieter schools may perform better academically.", "TRUE"),
          T(23, "Air traffic control is unaffected by background sound.", "FALSE"),
          T(24, "Green infrastructure may help reduce noise.", "TRUE"),
          F(25, "Persistent noise can increase ________ rates.", "error"),
          F(26, "Excessive exposure affects ________ hormones.", "stress"),
          F(27, "Intervention requires balancing development with ________ wellbeing.", "public"),
        ];
      })(),
    },
    {
      number: 3,
      passage: {
        title: "The Anthropology of Ritual",
        body:
          "Rituals are structured actions performed within social or cultural contexts, often carrying symbolic significance. Anthropologists study rituals not merely as traditions, but as mechanisms for reinforcing group identity and shared values.\n\n" +
          "Some rituals mark life transitions, such as birth, marriage, or death. Others function as collective expressions of belief, solidarity, or resistance. Through repetition, rituals establish continuity between past and present generations.\n\n" +
          "Scholars note that rituals may appear irrational to outsiders, yet within their cultural frameworks they hold profound meaning. Even modern secular societies engage in ritualized behaviors, from graduation ceremonies to national commemorations.\n\n" +
          "Rituals also adapt over time. Globalization, migration, and technological change reshape how traditions are practiced and interpreted. In some cases, rituals are revived as symbols of heritage; in others, they are transformed into public performances for broader audiences.\n\n" +
          "Thus, ritual is not a relic of the past, but an evolving expression of human social life.",
      },
      questions: (() => {
        const purp = [
          { key: "A", label: "Celebration for wider audiences" },
          { key: "B", label: "Preservation of heritage" },
          { key: "C", label: "Marking life stages" },
          { key: "D", label: "Collective remembrance" },
        ];
        const desc = [
          { key: "A", label: "Shared social unity" },
          { key: "B", label: "Meaning beyond literal action" },
          { key: "C", label: "Cross-border cultural influence" },
          { key: "D", label: "Structured social practice" },
        ];
        return [
          F(28, "Anthropologists view rituals as tools for strengthening ________ identity.", "group"),
          F(29, "Some rituals mark important ________ transitions.", "life"),
          F(30, "Though they may seem irrational to outsiders, rituals hold deep ________.", "meaning"),
          F(31, "Modern societies also display ________ behaviors.", "ritualized"),
          F(32, "Rituals continue to evolve due to globalization and ________ change.", "technological"),
          M(33, "Marriage ceremonies", purp, "C"),
          M(34, "National commemorations", purp, "D"),
          M(35, "Revived traditions", purp, "B"),
          M(36, "Public performances", purp, "A"),
          M(37, "Ritual", desc, "D"),
          M(38, "Solidarity", desc, "A"),
          M(39, "Globalization", desc, "C"),
          M(40, "Symbolism", desc, "B"),
        ];
      })(),
    },
  ],
};

// =============== TEST 4 ===============
const TEST_4: IeltsTest = {
  id: 4,
  title: "Mock Test 4 — Authentic Style",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Ethics of Artificial Intelligence in Decision-Making",
        body:
          "Artificial intelligence (AI) has moved beyond experimental laboratories into domains that directly affect human lives. From medical diagnosis to financial lending and judicial risk assessment, algorithmic systems increasingly influence decisions once reserved for trained professionals.\n\n" +
          "Supporters of AI emphasize its efficiency, consistency, and capacity to process vast datasets. In healthcare, for instance, machine-learning systems can identify patterns in medical imaging that may escape human observation. Similarly, in finance, automated systems can assess creditworthiness more rapidly than traditional methods.\n\n" +
          "However, reliance on algorithmic decision-making raises ethical concerns. One issue is transparency: many advanced models function as \"black boxes,\" producing outputs without clear explanations. This opacity makes it difficult to determine accountability when errors occur.\n\n" +
          "Bias is another major challenge. AI systems trained on historical data may reproduce existing inequalities, disadvantaging certain demographic groups. In hiring processes, for example, algorithms may inadvertently favor applicants whose profiles resemble past successful candidates, thereby reinforcing systemic exclusion.\n\n" +
          "To address these risks, policymakers advocate for regulatory frameworks emphasizing fairness, explainability, and human oversight. Yet balancing innovation with ethical safeguards remains a complex and evolving task.",
      },
      questions: [
        T(1, "AI systems are used only in scientific research institutions.", "FALSE"),
        T(2, "Machine-learning tools can detect patterns in medical images.", "TRUE"),
        T(3, "Financial institutions rely exclusively on traditional credit assessment methods.", "FALSE"),
        T(4, "Some AI models provide results without clear explanations.", "TRUE"),
        T(5, "Bias in AI can arise from historical datasets.", "TRUE"),
        T(6, "Policymakers oppose the use of AI in decision-making.", "FALSE"),
        T(7, "Ethical safeguards are fully established worldwide.", "FALSE"),
        F(8, "AI influences decisions once made by trained ________.", "professionals"),
        F(9, "In healthcare, AI analyzes ________ imaging.", "medical"),
        F(10, "A lack of ________ makes accountability difficult.", "transparency"),
        F(11, "Historical data may reproduce existing ________.", "inequalities"),
        F(12, "Hiring algorithms can reinforce systemic ________.", "exclusion"),
        F(13, "Regulation should ensure fairness and ________.", "explainability"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "The Evolution of Scientific Collaboration",
        body:
          "Scientific research was once largely an individual pursuit, with scholars working independently or in small local groups. Today, however, large-scale collaboration has become the defining feature of many disciplines.\n\n" +
          "The rise of global communication networks has enabled researchers to share findings instantly across continents. International projects such as particle physics experiments and genome sequencing initiatives rely on coordinated efforts among hundreds—or even thousands—of scientists.\n\n" +
          "This collaborative model offers clear advantages. It allows expertise to be pooled, resources to be shared, and complex questions to be addressed more effectively. At the same time, collaboration introduces challenges related to authorship, intellectual property, and coordination.\n\n" +
          "Technological tools have further transformed the nature of teamwork. Digital platforms support real-time data exchange, remote experimentation, and virtual conferences. Such innovations proved especially valuable during periods of travel restriction.\n\n" +
          "Nevertheless, critics argue that excessive collaboration can dilute individual creativity and obscure personal contributions. The future of science may therefore depend on striking a balance between collective enterprise and independent inquiry.",
      },
      questions: (() => {
        const heads = [
          { key: "A", label: "Risks of teamwork" },
          { key: "B", label: "Advantages of cooperation" },
          { key: "C", label: "Historical shift" },
          { key: "D", label: "Technology as facilitator" },
          { key: "E", label: "Concerns over recognition" },
          { key: "F", label: "Global projects" },
          { key: "G", label: "Future balance" },
        ];
        return [
          M(14, "Paragraph 1", heads, "C"),
          M(15, "Paragraph 2", heads, "F"),
          M(16, "Paragraph 3", heads, "B"),
          M(17, "Paragraph 4", heads, "D"),
          M(18, "Paragraph 5", heads, "G"),
          M(19, "International initiatives", heads, "F"),
          M(20, "Individual creativity debate", heads, "E"),
          T(21, "Scientific collaboration is a recent phenomenon.", "TRUE"),
          T(22, "Genome sequencing requires coordinated efforts.", "TRUE"),
          T(23, "Collaboration eliminates all issues of authorship.", "FALSE"),
          T(24, "Virtual conferences became valuable during travel restrictions.", "TRUE"),
          F(25, "Researchers can share findings across ________.", "continents"),
          F(26, "Collaboration enables ________ to be pooled.", "expertise"),
          F(27, "Science must balance teamwork with ________ inquiry.", "independent"),
        ];
      })(),
    },
    {
      number: 3,
      passage: {
        title: "Memory and the Construction of Identity",
        body:
          "Human memory is not a passive storage system but an active, reconstructive process. Each recollection is shaped by present circumstances, emotional states, and cultural expectations. As a result, memory is often less about exact preservation and more about interpretation.\n\n" +
          "Psychologists distinguish between episodic memory, which relates to personal experiences, and semantic memory, which concerns general knowledge. Both contribute to an individual's sense of identity, though in different ways.\n\n" +
          "Autobiographical memory is particularly significant because it forms the narrative through which individuals understand their lives. These narratives are not fixed; they are revised over time as people reinterpret past events.\n\n" +
          "Collective memory operates at the social level. Communities preserve shared histories through monuments, ceremonies, and education. Such memories can unify groups, but they may also exclude alternative perspectives.\n\n" +
          "Recent research suggests that digital technologies are reshaping how memory functions. External storage systems—such as smartphones and cloud archives—reduce reliance on internal recall, altering the relationship between memory and cognition.\n\n" +
          "Thus, memory is both a personal and cultural phenomenon, central to how humans define themselves and their societies.",
      },
      questions: (() => {
        const fn = [
          { key: "A", label: "Shared social history" },
          { key: "B", label: "Personal life events" },
          { key: "C", label: "General knowledge" },
          { key: "D", label: "Self-narrative formation" },
        ];
        const desc = [
          { key: "A", label: "Use of digital archives" },
          { key: "B", label: "Omission of certain perspectives" },
          { key: "C", label: "Process of reinterpretation" },
          { key: "D", label: "Sense of self" },
        ];
        return [
          F(28, "Memory is an active ________ process rather than simple storage.", "reconstructive"),
          F(29, "________ memory relates to personal experiences, while semantic memory concerns knowledge.", "Episodic"),
          F(30, "________ memory helps individuals form life narratives.", "Autobiographical"),
          F(31, "At the social level, ________ memory preserves shared histories.", "collective"),
          F(32, "Digital technologies reduce reliance on ________ recall.", "internal"),
          M(33, "Episodic memory", fn, "B"),
          M(34, "Semantic memory", fn, "C"),
          M(35, "Autobiographical memory", fn, "D"),
          M(36, "Collective memory", fn, "A"),
          M(37, "Reconstruction", desc, "C"),
          M(38, "Identity", desc, "D"),
          M(39, "External storage", desc, "A"),
          M(40, "Exclusion", desc, "B"),
        ];
      })(),
    },
  ],
};

// =============== TEST 5 ===============
const TEST_5: IeltsTest = {
  id: 5,
  title: "Mock Test 5 — Authentic Difficulty",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Economics of Attention in the Digital Age",
        body:
          "In traditional economic theory, scarcity was primarily associated with physical resources such as land, labor, and capital. In the digital age, however, a different resource has emerged as increasingly scarce: human attention. As information proliferates across platforms, the ability to capture and retain audience focus has become central to economic competition.\n\n" +
          "Technology companies design interfaces intended to maximize engagement. Notifications, algorithmically curated feeds, and autoplay features encourage prolonged interaction. These mechanisms are not incidental; they are strategically engineered to increase time spent on platforms, thereby generating advertising revenue.\n\n" +
          "Critics argue that the monetization of attention creates incentives misaligned with user wellbeing. Rather than prioritizing meaningful engagement, systems often reward sensationalism and emotional provocation. Content optimized for clicks may overshadow material of greater social value.\n\n" +
          "The consequences extend beyond individual distraction. Scholars have linked fragmented attention to reduced productivity, diminished capacity for deep thinking, and increased susceptibility to misinformation. Political discourse may also suffer when complex issues are reduced to simplified, emotionally charged narratives.\n\n" +
          "In response, some experts advocate for \"attention ethics,\" a framework encouraging responsible design and digital literacy. Such approaches seek to balance commercial interests with the preservation of cognitive autonomy.",
      },
      questions: [
        T(1, "Traditional economics recognized attention as the scarcest resource.", "FALSE"),
        T(2, "Digital platforms use design strategies to increase engagement.", "TRUE"),
        T(3, "Notifications and autoplay are accidental features.", "FALSE"),
        T(4, "Monetization of attention may conflict with user wellbeing.", "TRUE"),
        T(5, "Scholars believe fragmented attention improves productivity.", "FALSE"),
        T(6, "Political discussions may become oversimplified online.", "TRUE"),
        T(7, "Attention ethics aims to eliminate advertising entirely.", "FALSE"),
        F(8, "In the digital era, ________ attention has become scarce.", "human"),
        F(9, "Technology firms maximize user ________.", "engagement"),
        F(10, "Longer interaction increases ________ revenue.", "advertising"),
        F(11, "Systems often reward ________ and emotional provocation.", "sensationalism"),
        F(12, "Fragmented attention reduces capacity for ________ thinking.", "deep"),
        F(13, "Responsible design helps preserve cognitive ________.", "autonomy"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "The Archaeology of Climate Adaptation",
        body:
          "Archaeological evidence provides valuable insight into how past societies responded to environmental change. Rather than viewing ancient civilizations as passive victims of climate shifts, researchers increasingly emphasize their adaptive capacities.\n\n" +
          "In arid regions, communities developed sophisticated irrigation systems to manage scarce water supplies. Terracing techniques allowed agriculture on steep slopes, reducing soil erosion and maximizing cultivable land. These innovations demonstrate proactive responses to ecological challenges.\n\n" +
          "However, adaptation had limits. Prolonged droughts, resource depletion, and political instability sometimes combined to overwhelm resilience strategies. The decline of certain civilizations cannot be attributed solely to climate, but environmental stress often intensified existing vulnerabilities.\n\n" +
          "Modern scholars use archaeological findings to inform contemporary climate policy. By examining long-term patterns of adaptation and collapse, they seek lessons applicable to present-day sustainability planning.\n\n" +
          "Yet caution is necessary. Historical analogies may oversimplify complex realities, and direct comparisons between ancient and modern societies are not always valid.",
      },
      questions: (() => {
        const heads = [
          { key: "A", label: "Limits of resilience" },
          { key: "B", label: "Lessons for policymakers" },
          { key: "C", label: "Ancient innovations" },
          { key: "D", label: "Risks of comparison" },
          { key: "E", label: "Active adaptation" },
          { key: "F", label: "Environmental stressors" },
          { key: "G", label: "Agricultural solutions" },
        ];
        return [
          M(14, "Paragraph 1", heads, "E"),
          M(15, "Paragraph 2", heads, "C"),
          M(16, "Paragraph 3", heads, "A"),
          M(17, "Paragraph 4", heads, "B"),
          M(18, "Paragraph 5", heads, "D"),
          M(19, "Irrigation systems", heads, "G"),
          M(20, "Historical caution", heads, "D"),
          T(21, "Ancient societies were always passive victims of climate change.", "FALSE"),
          T(22, "Terracing reduced soil erosion.", "TRUE"),
          T(23, "Political instability could intensify environmental challenges.", "TRUE"),
          T(24, "Historical analogies are always reliable.", "FALSE"),
          F(25, "Archaeology highlights societies' ________ capacities.", "adaptive"),
          F(26, "Environmental stress intensified existing ________.", "vulnerabilities"),
          F(27, "Findings contribute to modern ________ planning.", "sustainability"),
        ];
      })(),
    },
    {
      number: 3,
      passage: {
        title: "The Psychology of Expertise",
        body:
          "Expertise is often assumed to result simply from prolonged practice, yet psychologists argue that experience alone is insufficient. What distinguishes experts from novices is not merely the quantity of time invested, but the quality and structure of their learning processes.\n\n" +
          "Research on deliberate practice emphasizes targeted improvement. Experts engage in activities designed to challenge weaknesses, receive immediate feedback, and refine performance incrementally. Such practice is mentally demanding and rarely inherently enjoyable.\n\n" +
          "Cognitive structures also differ. Experts develop sophisticated mental models that allow them to recognize patterns rapidly and make efficient decisions. In domains such as medicine or chess, this capacity enables faster and more accurate judgments.\n\n" +
          "However, expertise can create blind spots. Overconfidence, reliance on habitual strategies, and resistance to novel perspectives may hinder adaptation. In rapidly changing environments, excessive dependence on prior knowledge can become a liability.\n\n" +
          "Thus, expertise is both an achievement and a dynamic process requiring continual reassessment.",
      },
      questions: (() => {
        const desc = [
          { key: "A", label: "Internal frameworks for recognizing patterns" },
          { key: "B", label: "Structured improvement process" },
          { key: "C", label: "Risk of excessive certainty" },
          { key: "D", label: "Ongoing achievement requiring reassessment" },
        ];
        const fn = [
          { key: "A", label: "Challenging established assumptions" },
          { key: "B", label: "Improving performance accuracy" },
          { key: "C", label: "Domain requiring rapid recognition" },
          { key: "D", label: "Mechanism for refinement" },
        ];
        return [
          F(28, "Experts differ from novices in the ________ of learning.", "quality"),
          F(29, "Deliberate practice focuses on ________ improvement and immediate feedback.", "targeted"),
          F(30, "Experts build advanced ________ models for decision-making.", "mental"),
          F(31, "However, expertise may produce ________ blind spots.", "cognitive"),
          F(32, "In changing environments, prior knowledge can become a ________.", "liability"),
          M(33, "Deliberate practice", desc, "B"),
          M(34, "Mental models", desc, "A"),
          M(35, "Overconfidence", desc, "C"),
          M(36, "Expertise", desc, "D"),
          M(37, "Chess", fn, "C"),
          M(38, "Medicine", fn, "C"),
          M(39, "Feedback", fn, "D"),
          M(40, "Novel perspectives", fn, "A"),
        ];
      })(),
    },
  ],
};

// =============== TEST 6 ===============
const TEST_6: IeltsTest = {
  id: 6,
  title: "Mock Test 6 — Authentic Difficulty",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Transformation of Work in the Automation Era",
        body:
          "The integration of automation into the workplace has altered the structure of labor across industries. While mechanization has existed for centuries, recent advances in artificial intelligence and robotics have accelerated the replacement of routine tasks traditionally performed by humans.\n\n" +
          "Advocates argue that automation increases efficiency, reduces operational costs, and improves workplace safety. In manufacturing, robotic systems can perform repetitive actions with greater precision and consistency than human workers. Similarly, in logistics, automated systems streamline inventory management and distribution processes.\n\n" +
          "However, concerns persist regarding employment displacement. Jobs involving predictable procedures are particularly vulnerable, while roles requiring creativity, emotional intelligence, and complex decision-making remain less susceptible. Economists suggest that rather than eliminating work entirely, automation reshapes labor demand toward new skill sets.\n\n" +
          "The transition is not without challenges. Workers displaced by technology may face barriers in retraining, especially when educational systems fail to adapt quickly. Moreover, regional inequalities may intensify if certain communities depend heavily on automatable industries.\n\n" +
          "To address these concerns, policymakers emphasize lifelong learning, workforce flexibility, and social protections. The future of work may depend less on resisting automation and more on preparing societies to coexist with it.",
      },
      questions: [
        T(1, "Automation in the workplace is a completely new phenomenon.", "FALSE"),
        T(2, "Robotic systems can improve precision in manufacturing.", "TRUE"),
        T(3, "Jobs requiring emotional intelligence are highly vulnerable to automation.", "FALSE"),
        T(4, "Automation may alter labor demand rather than remove work entirely.", "TRUE"),
        T(5, "Educational systems always adapt quickly to technological change.", "FALSE"),
        T(6, "Regional inequalities may worsen due to automation.", "TRUE"),
        T(7, "Policymakers recommend resisting automation at all costs.", "FALSE"),
        F(8, "Advances in AI and ________ have accelerated automation.", "robotics"),
        F(9, "Automation can reduce operational ________.", "costs"),
        F(10, "Roles involving ________ remain less susceptible.", "creativity"),
        F(11, "Workers may face barriers in ________.", "retraining"),
        F(12, "Communities reliant on automatable industries may suffer ________ inequalities.", "regional"),
        F(13, "Governments promote ________ learning.", "lifelong"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "The Science of Habit Formation",
        body:
          "Habits are behaviors performed automatically in response to specific cues. Psychologists describe them as energy-saving mechanisms that allow the brain to operate efficiently without conscious deliberation.\n\n" +
          "Habit formation typically follows a loop consisting of cue, routine, and reward. When repeated consistently, the association between cue and behavior strengthens, eventually making the action automatic. This process explains why habits can be difficult to break.\n\n" +
          "Neuroscientific research has identified the basal ganglia as a key brain region involved in habit storage. Unlike deliberate decision-making, which relies on active cognitive engagement, habitual actions require minimal conscious effort.\n\n" +
          "While habits can promote productivity and wellbeing, maladaptive habits—such as procrastination or unhealthy eating—can be equally persistent. Effective behavior change often involves altering cues and replacing routines rather than relying solely on willpower.\n\n" +
          "Recent studies suggest that identity-based approaches may be particularly effective. When individuals align habits with their self-concept, long-term adherence improves significantly.",
      },
      questions: (() => {
        const heads = [
          { key: "A", label: "Identity and behavior" },
          { key: "B", label: "Neurological mechanisms" },
          { key: "C", label: "The structure of habits" },
          { key: "D", label: "Advantages and risks" },
          { key: "E", label: "Efficiency of automation" },
          { key: "F", label: "Breaking bad patterns" },
          { key: "G", label: "Definition of habits" },
        ];
        return [
          M(14, "Paragraph 1", heads, "G"),
          M(15, "Paragraph 2", heads, "C"),
          M(16, "Paragraph 3", heads, "B"),
          M(17, "Paragraph 4", heads, "D"),
          M(18, "Paragraph 5", heads, "A"),
          M(19, "Habit loop explanation", heads, "C"),
          M(20, "Long-term adherence", heads, "A"),
          T(21, "Habits always require conscious thought.", "FALSE"),
          T(22, "The basal ganglia is involved in habit storage.", "TRUE"),
          T(23, "Willpower alone is usually sufficient for lasting change.", "FALSE"),
          T(24, "Identity-based strategies may improve adherence.", "TRUE"),
          F(25, "Habits act as ________ mechanisms.", "energy-saving"),
          F(26, "Repetition strengthens the cue-behavior ________.", "association"),
          F(27, "Maladaptive habits can be equally ________.", "persistent"),
        ];
      })(),
    },
    {
      number: 3,
      passage: {
        title: "The Cultural History of Maps",
        body:
          "Maps are often perceived as objective representations of geography, yet historians argue that they are cultural artifacts shaped by the values and assumptions of their creators.\n\n" +
          "Early maps frequently blended empirical observation with mythology, reflecting limited knowledge and symbolic worldviews. Medieval European cartography, for instance, often placed religious significance above spatial accuracy.\n\n" +
          "The development of navigation technologies during the Age of Exploration transformed mapping practices. Precision became essential for trade, territorial claims, and military strategy. Cartography evolved into both a scientific discipline and a political instrument.\n\n" +
          "Modern scholars emphasize that maps can reinforce power structures. Choices about scale, boundaries, and labeling influence perceptions of space and identity. Colonial administrations often used maps to legitimize territorial control.\n\n" +
          "Digital mapping technologies have democratized access to cartographic tools, yet concerns remain regarding data privacy, algorithmic bias, and unequal representation. Thus, maps continue to shape—not merely reflect—the world.",
      },
      questions: (() => {
        const desc = [
          { key: "A", label: "Territorial legitimization" },
          { key: "B", label: "Religious emphasis over accuracy" },
          { key: "C", label: "Expanded public access" },
          { key: "D", label: "Precision for exploration" },
        ];
        const fn = [
          { key: "A", label: "Influencing perceptions of identity" },
          { key: "B", label: "Concern in digital systems" },
          { key: "C", label: "Representation of territory" },
          { key: "D", label: "Spatial proportion choice" },
        ];
        return [
          F(28, "Historians view maps as ________ artifacts.", "cultural"),
          F(29, "Early maps combined observation with ________.", "mythology"),
          F(30, "During the Age of Exploration, ________ became crucial.", "precision"),
          F(31, "Maps can reinforce ________ structures.", "power"),
          F(32, "Digital mapping raises concerns about privacy and ________ bias.", "algorithmic"),
          M(33, "Medieval cartography", desc, "B"),
          M(34, "Navigation technologies", desc, "D"),
          M(35, "Colonial mapping", desc, "A"),
          M(36, "Digital mapping", desc, "C"),
          M(37, "Scale", fn, "D"),
          M(38, "Boundaries", fn, "C"),
          M(39, "Labeling", fn, "A"),
          M(40, "Data privacy", fn, "B"),
        ];
      })(),
    },
  ],
};

// =============== TEST 7 ===============
const TEST_7: IeltsTest = {
  id: 7,
  title: "Mock Test 7 — Authentic Difficulty",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Global Challenge of Water Scarcity",
        body:
          "Water scarcity has emerged as one of the defining environmental challenges of the 21st century. Although the planet possesses abundant water resources, only a small fraction is accessible as freshwater suitable for human use. Population growth, industrial expansion, and climate change have intensified pressure on these limited supplies.\n\n" +
          "In many regions, agriculture accounts for the majority of freshwater consumption. Inefficient irrigation practices often result in substantial waste, while over-extraction from rivers and aquifers threatens long-term sustainability. Urbanization further increases demand, particularly in rapidly developing economies.\n\n" +
          "Technological solutions such as desalination and wastewater recycling offer potential relief. Desalination converts seawater into potable water, while advanced treatment systems enable the reuse of wastewater for agriculture and industry. However, these methods can be energy-intensive and financially costly.\n\n" +
          "Policy measures also play a critical role. Pricing reforms, conservation incentives, and international cooperation are essential for equitable allocation. Yet political tensions frequently arise when transboundary water sources are shared among competing states.\n\n" +
          "Ultimately, experts argue that addressing water scarcity requires integrating technology, governance, and behavioral change.",
      },
      questions: [
        T(1, "Most of Earth's water is immediately usable as freshwater.", "FALSE"),
        T(2, "Agriculture consumes a large share of freshwater resources.", "TRUE"),
        T(3, "Over-extraction can threaten sustainability.", "TRUE"),
        T(4, "Desalination is inexpensive and requires little energy.", "FALSE"),
        T(5, "International cooperation is unnecessary for water allocation.", "FALSE"),
        T(6, "Shared water sources can lead to political tensions.", "TRUE"),
        T(7, "Behavioral change is part of the proposed solution.", "TRUE"),
        F(8, "Only a small fraction of water is accessible as ________.", "freshwater"),
        F(9, "Population growth and ________ change intensify pressure.", "climate"),
        F(10, "Inefficient ________ practices waste water.", "irrigation"),
        F(11, "Wastewater can be reused for agriculture and ________.", "industry"),
        F(12, "Pricing reforms support ________ allocation.", "equitable"),
        F(13, "Solutions require governance and ________ change.", "behavioral"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "The Sociology of Remote Work",
        body:
          "Remote work has shifted from a niche arrangement to a mainstream employment model. Advances in communication technology, coupled with global disruptions, accelerated its adoption across industries.\n\n" +
          "Proponents highlight benefits such as flexibility, reduced commuting time, and access to broader talent pools. Employees often report improved work-life balance, while organizations can reduce overhead costs associated with physical office spaces.\n\n" +
          "However, remote work also introduces challenges. Social isolation, blurred boundaries between professional and personal life, and reduced opportunities for informal collaboration can affect wellbeing and innovation.\n\n" +
          "Managers face difficulties in performance evaluation and team cohesion when face-to-face interaction is limited. Consequently, leadership strategies must adapt, emphasizing trust, communication, and outcome-based assessment.\n\n" +
          "Sociologists note that remote work may reshape urban structures, transportation patterns, and even cultural norms surrounding employment.",
      },
      questions: (() => {
        const heads = [
          { key: "A", label: "Organizational adaptation" },
          { key: "B", label: "Mainstream adoption" },
          { key: "C", label: "Personal drawbacks" },
          { key: "D", label: "Economic benefits" },
          { key: "E", label: "Wider social implications" },
          { key: "F", label: "Technology as catalyst" },
          { key: "G", label: "Leadership transformation" },
        ];
        return [
          M(14, "Paragraph 1", heads, "B"),
          M(15, "Paragraph 2", heads, "D"),
          M(16, "Paragraph 3", heads, "C"),
          M(17, "Paragraph 4", heads, "G"),
          M(18, "Paragraph 5", heads, "E"),
          M(19, "Communication advances", heads, "F"),
          M(20, "Urban restructuring", heads, "E"),
          T(21, "Remote work was always the dominant employment model.", "FALSE"),
          T(22, "Employees may experience improved work-life balance.", "TRUE"),
          T(23, "Informal collaboration is unaffected by remote work.", "FALSE"),
          T(24, "Leadership must emphasize trust.", "TRUE"),
          F(25, "Remote work reduces ________ time.", "commuting"),
          F(26, "Performance evaluation becomes more ________.", "difficult"),
          F(27, "Employment norms may undergo ________ change.", "cultural"),
        ];
      })(),
    },
    {
      number: 3,
      passage: {
        title: "The Philosophy of Scientific Revolutions",
        body:
          "Scientific progress is often portrayed as a steady accumulation of knowledge. However, philosopher Thomas Kuhn argued that science advances through periodic revolutions rather than continuous development.\n\n" +
          "According to Kuhn, normal science operates within a prevailing paradigm—a framework of assumptions, methods, and accepted explanations. Researchers solve problems that fit within this structure, refining rather than challenging it.\n\n" +
          "Over time, anomalies accumulate: observations that existing theories cannot adequately explain. Initially, these discrepancies may be dismissed or minimized. Yet when anomalies become too significant, confidence in the paradigm weakens.\n\n" +
          "A scientific revolution occurs when a new paradigm emerges, offering a more coherent explanation of evidence. Such shifts are transformative, altering not only theories but also the standards by which science evaluates truth.\n\n" +
          "Critics of Kuhn argue that his model overstates discontinuity and underestimates the cumulative aspects of scientific inquiry. Nonetheless, his framework remains influential in understanding the dynamics of knowledge.",
      },
      questions: (() => {
        const desc = [
          { key: "A", label: "Framework of assumptions" },
          { key: "B", label: "Problem-solving within accepted theory" },
          { key: "C", label: "Observations that challenge theory" },
          { key: "D", label: "Transformative shift in explanation" },
        ];
        const fn = [
          { key: "A", label: "Evidence of continuity" },
          { key: "B", label: "Early anomalies" },
          { key: "C", label: "Dominant explanation" },
          { key: "D", label: "Replacement system" },
        ];
        return [
          F(28, "Kuhn claimed that science progresses through ________ rather than gradual accumulation.", "revolutions"),
          F(29, "A prevailing ________ guides normal science.", "paradigm"),
          F(30, "Unexplained observations create ________.", "anomalies"),
          F(31, "When these become significant, a scientific ________ may occur.", "revolution"),
          F(32, "Critics argue that Kuhn underestimated ________ aspects of inquiry.", "cumulative"),
          M(33, "Normal science", desc, "B"),
          M(34, "Paradigm", desc, "A"),
          M(35, "Anomalies", desc, "C"),
          M(36, "Scientific revolution", desc, "D"),
          M(37, "Existing theory", fn, "C"),
          M(38, "New framework", fn, "D"),
          M(39, "Dismissed discrepancies", fn, "B"),
          M(40, "Cumulative inquiry", fn, "A"),
        ];
      })(),
    },
  ],
};

// =============== TEST 8 ===============
const TEST_8: IeltsTest = {
  id: 8,
  title: "Mock Test 8 — Authentic Difficulty",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Future of Food Security",
        body:
          "Ensuring global food security is one of the most pressing challenges of the modern era. Rising populations, shifting dietary patterns, and environmental degradation place increasing strain on agricultural systems. At the same time, climate variability threatens crop yields through droughts, floods, and temperature extremes.\n\n" +
          "Traditional agricultural expansion is constrained by limited arable land and ecological concerns. Consequently, attention has turned toward sustainable intensification—producing more food from existing farmland while minimizing environmental harm.\n\n" +
          "Technological innovation plays a central role in this transition. Precision agriculture employs sensors, satellite imaging, and data analytics to optimize irrigation, fertilization, and pest management. Meanwhile, advances in biotechnology have enabled the development of crops with improved resilience to adverse conditions.\n\n" +
          "However, technology alone cannot resolve food insecurity. Distribution inefficiencies, political instability, and economic inequality often determine whether populations have reliable access to food. Reducing post-harvest losses and strengthening supply chains are equally critical.\n\n" +
          "Experts emphasize that food security depends on integrating science, policy, and social equity. Without coordinated global action, progress may remain uneven.",
      },
      questions: [
        T(1, "Population growth increases pressure on agricultural systems.", "TRUE"),
        T(2, "Climate variability has no effect on crop yields.", "FALSE"),
        T(3, "Sustainable intensification focuses on using existing farmland efficiently.", "TRUE"),
        T(4, "Precision agriculture relies only on manual observation.", "FALSE"),
        T(5, "Biotechnology can improve crop resilience.", "TRUE"),
        T(6, "Political instability can influence food access.", "TRUE"),
        T(7, "Science alone is sufficient to ensure food security.", "FALSE"),
        F(8, "Environmental ________ places strain on agriculture.", "degradation"),
        F(9, "Traditional expansion is limited by ________ land.", "arable"),
        F(10, "Precision agriculture uses ________ imaging.", "satellite"),
        F(11, "Biotechnology improves resilience to ________ conditions.", "adverse"),
        F(12, "Reducing ________ losses is essential.", "post-harvest"),
        F(13, "Progress requires coordinated ________ action.", "global"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "The Cultural Impact of Translation",
        body:
          "Translation has long served as a bridge between societies, enabling the movement of ideas across linguistic boundaries. Far from being a neutral act, translation shapes how cultures understand one another.\n\n" +
          "Historically, the translation of religious, philosophical, and scientific texts played a decisive role in intellectual exchange. The preservation and transmission of ancient knowledge often depended on multilingual scholars.\n\n" +
          "Yet translation involves interpretation. Word choices, stylistic decisions, and cultural references can subtly alter meaning. As a result, translators wield considerable influence over how works are received.\n\n" +
          "In literature, translation raises questions of fidelity and creativity. Some argue that translators should remain as faithful as possible to the source text, while others contend that adaptation is necessary to preserve spirit over literal form.\n\n" +
          "Digital tools and machine translation have expanded access, but concerns remain regarding nuance and contextual understanding. Human expertise continues to be valued where cultural sensitivity is essential.",
      },
      questions: (() => {
        const heads = [
          { key: "A", label: "Debates over fidelity" },
          { key: "B", label: "Technology and accessibility" },
          { key: "C", label: "Historical significance" },
          { key: "D", label: "Translation as interpretation" },
          { key: "E", label: "Intellectual preservation" },
          { key: "F", label: "Cultural mediation" },
          { key: "G", label: "Human expertise" },
        ];
        return [
          M(14, "Paragraph 1", heads, "F"),
          M(15, "Paragraph 2", heads, "C"),
          M(16, "Paragraph 3", heads, "D"),
          M(17, "Paragraph 4", heads, "A"),
          M(18, "Paragraph 5", heads, "B"),
          M(19, "Literary challenges", heads, "A"),
          M(20, "Contextual nuance", heads, "G"),
          T(21, "Translation is entirely neutral.", "FALSE"),
          T(22, "Ancient knowledge was often preserved through translation.", "TRUE"),
          T(23, "Translators have little influence on reception.", "FALSE"),
          T(24, "Machine translation fully replaces human expertise.", "FALSE"),
          F(25, "Translation enables movement of ________.", "ideas"),
          F(26, "Translators make ________ decisions.", "stylistic"),
          F(27, "Cultural sensitivity often requires ________ expertise.", "human"),
        ];
      })(),
    },
    {
      number: 3,
      passage: {
        title: "The Science of Resilience",
        body:
          "Resilience refers to the capacity of individuals, communities, or systems to adapt to adversity while maintaining essential functions. Researchers increasingly view resilience not as a fixed trait, but as a dynamic process shaped by interactions between internal and external factors.\n\n" +
          "In psychology, resilience involves coping strategies, emotional regulation, and social support networks. People facing hardship often draw upon these resources to recover and even grow from challenging experiences.\n\n" +
          "At the societal level, resilience is linked to infrastructure, governance, and collective trust. Communities that invest in preparedness and maintain strong institutions are better equipped to respond to crises.\n\n" +
          "Ecologists apply the concept to ecosystems, examining how biological communities recover after disturbance. Diversity is considered crucial, as systems with varied species are less vulnerable to collapse.\n\n" +
          "Across disciplines, resilience highlights adaptability rather than invulnerability. The ability to transform in response to disruption is often more important than resisting change altogether.",
      },
      questions: (() => {
        const desc = [
          { key: "A", label: "Infrastructure and governance" },
          { key: "B", label: "Recovery through diversity" },
          { key: "C", label: "Emotional and social resources" },
          { key: "D", label: "Transformation in response to disruption" },
        ];
        const fn = [
          { key: "A", label: "Resource in personal recovery" },
          { key: "B", label: "Institutional readiness" },
          { key: "C", label: "Ecological stability" },
          { key: "D", label: "Social cohesion factor" },
        ];
        return [
          F(28, "Resilience is a ________ process rather than a fixed trait.", "dynamic"),
          F(29, "In psychology, it involves coping strategies and ________ support.", "social"),
          F(30, "Societal resilience depends on institutions and ________ trust.", "collective"),
          F(31, "In ecology, ________ is essential for recovery.", "diversity"),
          F(32, "Resilience emphasizes ________ over invulnerability.", "adaptability"),
          M(33, "Psychological resilience", desc, "C"),
          M(34, "Societal resilience", desc, "A"),
          M(35, "Ecological resilience", desc, "B"),
          M(36, "Adaptability", desc, "D"),
          M(37, "Emotional regulation", fn, "A"),
          M(38, "Collective trust", fn, "D"),
          M(39, "Species diversity", fn, "C"),
          M(40, "Crisis preparedness", fn, "B"),
        ];
      })(),
    },
  ],
};

// =============== TEST 9 ===============
const TEST_9: IeltsTest = {
  id: 9,
  title: "Mock Test 9 — Authentic Difficulty",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Economics of Renewable Energy Transition",
        body:
          "The global transition toward renewable energy represents not only an environmental imperative but also a profound economic transformation. As nations seek to reduce carbon emissions, investments in solar, wind, and other low-carbon technologies have accelerated.\n\n" +
          "Historically, fossil fuels dominated energy systems due to established infrastructure and relatively low extraction costs. However, technological advances and economies of scale have significantly reduced the cost of renewable generation. In many regions, solar and wind are now competitive with conventional sources.\n\n" +
          "The shift creates both opportunities and disruptions. New industries generate employment in manufacturing, installation, and maintenance, while traditional sectors tied to coal and oil may experience decline. Policymakers face the challenge of managing this transition equitably.\n\n" +
          "Energy storage remains a critical issue. Since renewable sources such as solar and wind are intermittent, advances in battery technology and grid management are essential for reliable supply.\n\n" +
          "Economists argue that long-term benefits include energy security, reduced health costs from pollution, and resilience against volatile fossil fuel markets.",
      },
      questions: [
        T(1, "Renewable energy transition is solely an environmental issue.", "FALSE"),
        T(2, "Fossil fuels historically benefited from established infrastructure.", "TRUE"),
        T(3, "Renewable generation costs have decreased.", "TRUE"),
        T(4, "Coal and oil sectors are unaffected by the transition.", "FALSE"),
        T(5, "Battery technology is important for renewable reliability.", "TRUE"),
        T(6, "Pollution-related health costs may decline.", "TRUE"),
        T(7, "Renewable energy eliminates all market volatility.", "FALSE"),
        F(8, "Investments in ________ technologies have accelerated.", "low-carbon"),
        F(9, "Renewable energy benefits from ________ of scale.", "economies"),
        F(10, "Policymakers must manage the transition ________.", "equitably"),
        F(11, "Solar and wind are considered ________ sources.", "intermittent"),
        F(12, "Advances in ________ technology are essential.", "battery"),
        F(13, "Long-term benefits include greater ________ security.", "energy"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "The Linguistics of Language Preservation",
        body:
          "Thousands of languages are spoken worldwide, yet many face extinction within the coming century. Linguists warn that language loss represents not only the disappearance of words, but also the erosion of cultural identity and knowledge systems.\n\n" +
          "Minority languages often decline under pressure from dominant national or global languages. Economic incentives, migration, and educational policies may encourage younger generations to adopt majority tongues.\n\n" +
          "Preservation efforts include documentation, community-based education, and digital revitalization projects. Recording oral traditions and developing written resources are central strategies.\n\n" +
          "Technology has created new possibilities for language maintenance. Mobile applications, online dictionaries, and social media platforms allow communities to engage with endangered languages in innovative ways.\n\n" +
          "However, preservation depends ultimately on intergenerational transmission. Without active use in daily life, revitalization efforts may remain symbolic rather than transformative.",
      },
      questions: (() => {
        const heads = [
          { key: "A", label: "Causes of decline" },
          { key: "B", label: "Technology and revitalization" },
          { key: "C", label: "Cultural significance" },
          { key: "D", label: "Educational strategies" },
          { key: "E", label: "Documentation efforts" },
          { key: "F", label: "Limits of preservation" },
          { key: "G", label: "Community engagement" },
        ];
        return [
          M(14, "Paragraph 1", heads, "C"),
          M(15, "Paragraph 2", heads, "A"),
          M(16, "Paragraph 3", heads, "E"),
          M(17, "Paragraph 4", heads, "B"),
          M(18, "Paragraph 5", heads, "F"),
          M(19, "Oral tradition recording", heads, "E"),
          M(20, "Daily language use", heads, "F"),
          T(21, "Language loss affects cultural identity.", "TRUE"),
          T(22, "Economic incentives may encourage language shift.", "TRUE"),
          T(23, "Social media has no role in preservation.", "FALSE"),
          T(24, "Daily use is essential for revitalization.", "TRUE"),
          F(25, "Many languages face possible ________.", "extinction"),
          F(26, "Younger generations may adopt ________ tongues.", "majority"),
          F(27, "Preservation relies on ________ transmission.", "intergenerational"),
        ];
      })(),
    },
    {
      number: 3,
      passage: {
        title: "The Neuroscience of Creativity",
        body:
          "Creativity has long been associated with artistic talent, yet neuroscientists view it as a broader cognitive capacity involving the generation of novel and useful ideas.\n\n" +
          "Research suggests that creativity emerges from interactions among multiple brain networks. The default mode network supports spontaneous thought and imagination, while executive control systems evaluate and refine ideas. Effective creativity depends on balancing these processes.\n\n" +
          "Contrary to popular belief, creativity is not purely innate. Training, exposure to diverse experiences, and deliberate practice can strengthen creative abilities over time.\n\n" +
          "Environmental conditions also matter. Psychological safety, collaboration, and opportunities for experimentation foster innovation. Conversely, excessive pressure or rigid structures may inhibit original thinking.\n\n" +
          "Recent studies indicate that creativity plays a role in problem-solving across disciplines, from engineering to medicine. It is therefore increasingly recognized as essential in education and professional development.",
      },
      questions: (() => {
        const desc = [
          { key: "A", label: "Refinement of ideas" },
          { key: "B", label: "Encourages experimentation" },
          { key: "C", label: "Structured improvement" },
          { key: "D", label: "Supports imagination" },
        ];
        const fn = [
          { key: "A", label: "Broadening perspective" },
          { key: "B", label: "Barrier to innovation" },
          { key: "C", label: "Discipline requiring creativity" },
          { key: "D", label: "Supportive condition" },
        ];
        return [
          F(28, "Creativity involves producing ________ and useful ideas.", "novel"),
          F(29, "It depends on interactions among multiple ________ networks.", "brain"),
          F(30, "The default mode network supports ________ thought.", "spontaneous"),
          F(31, "Creativity can be improved through ________ practice.", "deliberate"),
          F(32, "Rigid structures may ________ original thinking.", "inhibit"),
          M(33, "Default mode network", desc, "D"),
          M(34, "Executive control", desc, "A"),
          M(35, "Psychological safety", desc, "B"),
          M(36, "Deliberate practice", desc, "C"),
          M(37, "Engineering", fn, "C"),
          M(38, "Collaboration", fn, "D"),
          M(39, "Diverse experiences", fn, "A"),
          M(40, "Excessive pressure", fn, "B"),
        ];
      })(),
    },
  ],
};

// =============== TEST 10 ===============
const TEST_10: IeltsTest = {
  id: 10,
  title: "Mock Test 10 — Authentic Difficulty",
  durationMinutes: 60,
  sections: [
    {
      number: 1,
      passage: {
        title: "The Rise of Circular Economies",
        body:
          "Traditional economic systems have largely followed a linear model: resources are extracted, transformed into products, consumed, and ultimately discarded as waste. This approach has generated significant environmental pressures, including resource depletion and pollution.\n\n" +
          "In response, the concept of the circular economy has gained prominence. Rather than emphasizing disposal, circular systems prioritize reuse, repair, remanufacturing, and recycling. The objective is to maintain the value of materials for as long as possible.\n\n" +
          "Businesses adopting circular strategies often redesign products to improve durability and ease of disassembly. Such innovations reduce waste generation while creating new economic opportunities in service-based models.\n\n" +
          "However, transitioning to circularity requires systemic change. Consumer behavior, regulatory frameworks, and supply chain coordination all influence success. Without supportive policies and market incentives, implementation may remain limited.\n\n" +
          "Advocates argue that circular economies can enhance sustainability, strengthen resilience, and reduce dependence on finite resources.",
      },
      questions: [
        T(1, "Linear economies prioritize repair over disposal.", "FALSE"),
        T(2, "Circular economies seek to preserve material value.", "TRUE"),
        T(3, "Product redesign can improve durability.", "TRUE"),
        T(4, "Circular systems eliminate the need for regulation.", "FALSE"),
        T(5, "Consumer behavior affects implementation success.", "TRUE"),
        T(6, "Circularity can reduce dependence on finite resources.", "TRUE"),
        T(7, "Recycling is excluded from circular strategies.", "FALSE"),
        F(8, "Linear systems result in resource ________ and pollution.", "depletion"),
        F(9, "Circular systems prioritize ________ and repair.", "reuse"),
        F(10, "Businesses redesign products for easier ________.", "disassembly"),
        F(11, "Success depends on ________ chain coordination.", "supply"),
        F(12, "Supportive policies and market ________ are needed.", "incentives"),
        F(13, "Circularity may improve long-term ________.", "resilience"),
      ],
    },
    {
      number: 2,
      passage: {
        title: "The Anthropology of Urban Space",
        body:
          "Cities are not merely physical environments; they are cultural landscapes shaped by social interaction, historical memory, and symbolic meaning. Anthropologists study urban spaces to understand how people construct identities and communities within them.\n\n" +
          "Public spaces such as markets, parks, and transit hubs function as arenas of exchange and negotiation. These sites reveal patterns of inclusion, exclusion, and informal governance.\n\n" +
          "Urban development often reflects power relations. Decisions about zoning, architecture, and infrastructure can privilege certain groups while marginalizing others. Consequently, cities become contested spaces where competing visions of progress emerge.\n\n" +
          "Migration further transforms urban life. New populations introduce cultural practices, languages, and networks that reshape neighborhoods. Such diversity may foster innovation, but it can also generate tensions over belonging and access.\n\n" +
          "Anthropological perspectives highlight that cities are dynamic social processes rather than static built environments.",
      },
      questions: (() => {
        const heads = [
          { key: "A", label: "Public interaction zones" },
          { key: "B", label: "Power and planning" },
          { key: "C", label: "Migration and diversity" },
          { key: "D", label: "Cities as cultural systems" },
          { key: "E", label: "Conflict over belonging" },
          { key: "F", label: "Informal governance" },
          { key: "G", label: "Dynamic urban processes" },
        ];
        return [
          M(14, "Paragraph 1", heads, "D"),
          M(15, "Paragraph 2", heads, "A"),
          M(16, "Paragraph 3", heads, "B"),
          M(17, "Paragraph 4", heads, "C"),
          M(18, "Paragraph 5", heads, "G"),
          M(19, "Social negotiation sites", heads, "A"),
          M(20, "Urban transformation", heads, "G"),
          T(21, "Anthropologists see cities only as physical structures.", "FALSE"),
          T(22, "Public spaces can reveal exclusion patterns.", "TRUE"),
          T(23, "Infrastructure decisions may marginalize groups.", "TRUE"),
          T(24, "Migration has no impact on neighborhoods.", "FALSE"),
          F(25, "Cities are shaped by historical ________.", "memory"),
          F(26, "Urban development reflects ________ relations.", "power"),
          F(27, "Diversity may encourage ________.", "innovation"),
        ];
      })(),
    },
    {
      number: 3,
      passage: {
        title: "Decision-Making Under Uncertainty",
        body:
          "Human decision-making is frequently challenged by uncertainty. Whether in finance, medicine, or everyday life, individuals must often act without complete information.\n\n" +
          "Classical economic theory assumes rational actors who maximize utility through logical evaluation. Behavioral research, however, demonstrates that real decisions are influenced by heuristics—mental shortcuts that simplify complexity.\n\n" +
          "While heuristics can be efficient, they may also produce systematic biases. For example, availability bias leads individuals to overestimate the likelihood of events that are easily recalled, while confirmation bias reinforces existing beliefs.\n\n" +
          "Experts in high-stakes environments develop strategies to mitigate uncertainty. Scenario planning, probabilistic reasoning, and structured reflection can improve judgment under pressure.\n\n" +
          "Importantly, uncertainty cannot be eliminated entirely. Effective decision-making depends not on certainty, but on adaptability and awareness of cognitive limitations.",
      },
      questions: (() => {
        const desc = [
          { key: "A", label: "Estimating likelihood through recall" },
          { key: "B", label: "Structured thinking with uncertainty" },
          { key: "C", label: "Simplified decision shortcuts" },
          { key: "D", label: "Preference for supporting beliefs" },
        ];
        const fn = [
          { key: "A", label: "Strategy for uncertainty" },
          { key: "B", label: "Field requiring judgment" },
          { key: "C", label: "Essential quality" },
          { key: "D", label: "Domain of incomplete information" },
        ];
        return [
          F(28, "Decision-making often occurs without ________ information.", "complete"),
          F(29, "Behavioral research highlights the role of ________ shortcuts.", "mental"),
          F(30, "These can create systematic ________.", "biases"),
          F(31, "Experts use ________ planning to improve judgment.", "scenario"),
          F(32, "Effective decisions require awareness of ________ limitations.", "cognitive"),
          M(33, "Heuristics", desc, "C"),
          M(34, "Availability bias", desc, "A"),
          M(35, "Confirmation bias", desc, "D"),
          M(36, "Probabilistic reasoning", desc, "B"),
          M(37, "Finance", fn, "D"),
          M(38, "Medicine", fn, "B"),
          M(39, "Scenario planning", fn, "A"),
          M(40, "Adaptability", fn, "C"),
        ];
      })(),
    },
  ],
};

export const ieltsTests: IeltsTest[] = [
  TEST_1, TEST_2, TEST_3, TEST_4, TEST_5,
  TEST_6, TEST_7, TEST_8, TEST_9, TEST_10,
];

export function getTestById(id: number): IeltsTest | undefined {
  return ieltsTests.find((t) => t.id === id);
}

// IELTS Academic Reading band score conversion (40-question test).
// Standard British Council / IDP table.
export function rawScoreToBand(raw: number): number {
  if (raw >= 39) return 9.0;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8.0;
  if (raw >= 33) return 7.5;
  if (raw >= 30) return 7.0;
  if (raw >= 27) return 6.5;
  if (raw >= 23) return 6.0;
  if (raw >= 19) return 5.5;
  if (raw >= 15) return 5.0;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4.0;
  if (raw >= 8) return 3.5;
  if (raw >= 6) return 3.0;
  if (raw >= 4) return 2.5;
  return 2.0;
}

// Compare a fill-in answer leniently (case + whitespace + simple plural).
export function isFillCorrect(given: string, expected: string): boolean {
  const norm = (s: string) =>
    s.toLowerCase().trim().replace(/[.,;:!?"']/g, "").replace(/\s+/g, " ");
  const a = norm(given);
  const b = norm(expected);
  if (!a) return false;
  if (a === b) return true;
  // Allow trailing 's' tolerance
  if (a === b + "s" || b === a + "s") return true;
  return false;
}

export function isMatchCorrect(given: string, expected: string): boolean {
  return given.trim().toUpperCase() === expected.trim().toUpperCase();
}

export function isTfngCorrect(given: string, expected: string): boolean {
  return given.trim().toUpperCase() === expected.trim().toUpperCase();
}
