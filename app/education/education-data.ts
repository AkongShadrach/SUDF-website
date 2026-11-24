export type EducationSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type EducationArticle = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  readingTime: string;
  sections: EducationSection[];
  sources: { label: string; url: string }[];
};

export const educationArticles: EducationArticle[] = [
  {
    slug: "understanding-diabetes",
    category: "DIABETES BASICS",
    title: "Understanding diabetes",
    summary: "Learn what diabetes is, how blood glucose is affected and why ongoing care matters.",
    readingTime: "5 min read",
    sections: [
      {
        heading: "What is diabetes?",
        paragraphs: [
          "Diabetes is a chronic condition that occurs when the body does not produce enough insulin or cannot use the insulin it produces effectively. Insulin is a hormone that helps glucose move from the bloodstream into the body's cells for energy.",
          "When insulin does not work properly, glucose can build up in the blood. Over time, persistently high blood glucose can damage different parts of the body."
        ]
      },
      {
        heading: "Why does it matter?",
        paragraphs: [
          "Diabetes can affect the heart, blood vessels, eyes, kidneys and nerves. With appropriate care, treatment and follow-up, many people living with diabetes can reduce the risk of complications and maintain their quality of life."
        ]
      },
      {
        heading: "The important first step",
        paragraphs: [
          "A blood glucose test arranged by a qualified health professional is needed to diagnose diabetes. Symptoms alone cannot confirm or rule it out. If you are concerned about your health or risk, speak with a health professional about whether testing is appropriate."
        ]
      }
    ],
    sources: [
      { label: "World Health Organization — Diabetes", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" },
      { label: "World Health Organization — Diabetes questions and answers", url: "https://www.who.int/news-room/questions-and-answers/item/diabetes" }
    ]
  },
  {
    slug: "types-of-diabetes",
    category: "DIABETES BASICS",
    title: "Types of diabetes",
    summary: "Understand the main forms of diabetes and why the type matters for treatment.",
    readingTime: "6 min read",
    sections: [
      {
        heading: "Type 1 diabetes",
        paragraphs: [
          "Type 1 diabetes is an autoimmune condition in which the body's immune system attacks the insulin-producing cells in the pancreas. The body then produces little or no insulin. People with type 1 diabetes need insulin every day to stay alive.",
          "Type 1 diabetes is not caused by eating too much sugar, and it cannot currently be prevented through lifestyle changes."
        ]
      },
      {
        heading: "Type 2 diabetes",
        paragraphs: [
          "Type 2 diabetes is the most common form. It develops when the body does not use insulin effectively and, over time, may not make enough insulin to keep blood glucose within a healthy range.",
          "A combination of factors can contribute, including family history, age, body weight, physical activity, diet and other health or social factors. Type 2 diabetes can sometimes be prevented or delayed."
        ]
      },
      {
        heading: "Gestational diabetes",
        paragraphs: [
          "Gestational diabetes is high blood glucose first recognised during pregnancy. It requires proper antenatal assessment and care. A health professional can explain testing, monitoring and treatment during pregnancy and follow-up after delivery."
        ]
      },
      {
        heading: "Why the type matters",
        paragraphs: [
          "The types of diabetes are not interchangeable. Testing and clinical assessment help a qualified professional identify the type and recommend suitable care. Do not start, stop or change diabetes medication based on an online article."
        ]
      }
    ],
    sources: [
      { label: "World Health Organization — Diabetes", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" },
      { label: "World Health Organization — Diabetes questions and answers", url: "https://www.who.int/news-room/questions-and-answers/item/diabetes" }
    ]
  },
  {
    slug: "signs-and-symptoms",
    category: "RECOGNITION & EARLY DETECTION",
    title: "Signs and symptoms of diabetes",
    summary: "Know some common warning signs and understand why testing is important.",
    readingTime: "5 min read",
    sections: [
      {
        heading: "Common symptoms",
        paragraphs: [
          "Diabetes symptoms can develop gradually and may be easy to overlook. Some people, particularly those with type 2 diabetes, may have no obvious symptoms for a long time."
        ],
        bullets: [
          "Passing urine more often than usual.",
          "Feeling unusually thirsty.",
          "Unexplained weight loss.",
          "Feeling tired or lacking energy.",
          "Blurred vision.",
          "Slow-healing wounds or recurring infections."
        ]
      },
      {
        heading: "Symptoms are not a diagnosis",
        paragraphs: [
          "These symptoms can also occur with other conditions. Having one or more does not automatically mean a person has diabetes, and having no symptoms does not guarantee that blood glucose is normal.",
          "A blood glucose test and clinical assessment are needed. Contact a health professional if you notice symptoms or have concerns about your risk."
        ]
      },
      {
        heading: "When to seek urgent help",
        paragraphs: [
          "Severe weakness, vomiting, abdominal pain, deep or difficult breathing, confusion or reduced consciousness in someone who may have diabetes can signal a medical emergency. Seek urgent medical care rather than waiting for an online response."
        ]
      }
    ],
    sources: [
      { label: "World Health Organization — Diabetes", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" },
      { label: "NHS — Diabetes symptoms", url: "https://www.nhs.uk/conditions/diabetes/symptoms/" }
    ]
  },
  {
    slug: "risk-factors-and-prevention",
    category: "PREVENTION & HEALTHY LIVING",
    title: "Risk factors and prevention",
    summary: "Explore factors associated with type 2 diabetes and practical ways to support better health.",
    readingTime: "7 min read",
    sections: [
      {
        heading: "What can increase the risk?",
        paragraphs: [
          "The risk of type 2 diabetes is influenced by several factors. These may include family history, increasing age, overweight or obesity, low levels of physical activity and a history of high blood glucose during pregnancy. Risk is also shaped by wider social and environmental conditions.",
          "Risk factors do not mean that a person will definitely develop diabetes. People can have type 2 diabetes without fitting a single stereotype or having an obvious risk factor."
        ]
      },
      {
        heading: "Practical steps that can help",
        paragraphs: [
          "For many people, sustainable lifestyle changes can help prevent or delay type 2 diabetes. Choose realistic changes that can be maintained and seek advice from a qualified professional when planning changes around an existing health condition."
        ],
        bullets: [
          "Be physically active regularly in ways that are safe and suitable for you.",
          "Choose a varied eating pattern with vegetables, fruits, beans, whole grains and other nourishing foods.",
          "Limit frequent consumption of sugary drinks and foods high in excess sugar, salt or unhealthy fats.",
          "Avoid tobacco.",
          "Discuss personal risk and appropriate screening with a health professional."
        ]
      },
      {
        heading: "Prevention is not blame",
        paragraphs: [
          "Type 2 diabetes is influenced by more than personal choices. Access to healthy food, safe places to be active, health services, income and other circumstances also matter. People living with diabetes deserve respect and support, not judgement."
        ]
      }
    ],
    sources: [
      { label: "World Health Organization — Diabetes questions and answers", url: "https://www.who.int/news-room/questions-and-answers/item/diabetes" },
      { label: "World Health Organization — Diabetes", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" }
    ]
  },
  {
    slug: "diabetes-screening-and-diagnosis",
    category: "RECOGNITION & EARLY DETECTION",
    title: "Diabetes screening and diagnosis",
    summary: "Find out what screening can tell you, what a result means and why follow-up matters.",
    readingTime: "6 min read",
    sections: [
      {
        heading: "Why screening matters",
        paragraphs: [
          "Some people with diabetes have no noticeable symptoms. Testing can identify high blood glucose and help people access assessment and care earlier.",
          "Screening may be offered during a community health activity or at a health facility. The test used and the next steps depend on the person's circumstances and the service available."
        ]
      },
      {
        heading: "A screening result is not always a diagnosis",
        paragraphs: [
          "A screening test can indicate that follow-up is needed, but one community screening result should not be treated as a complete medical assessment. A qualified health professional can explain the result and determine whether repeat or additional laboratory testing is required."
        ]
      },
      {
        heading: "Questions you can ask",
        bullets: [
          "What test was performed and what does the result mean?",
          "Do I need another test or a clinical appointment?",
          "Should I prepare in any way before a follow-up test?",
          "When and where should I return for my result or further assessment?",
          "What should I do if I develop symptoms before my follow-up?"
        ],
        paragraphs: [
          "Keep a record of your result and any instructions you receive. Do not use a screening result to start or stop medication without professional advice."
        ]
      }
    ],
    sources: [
      { label: "World Health Organization — Diabetes", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" },
      { label: "World Health Organization — Diabetes questions and answers", url: "https://www.who.int/news-room/questions-and-answers/item/diabetes" }
    ]
  },
  {
    slug: "living-well-with-diabetes",
    category: "CARE & EVERYDAY WELLBEING",
    title: "Living well with diabetes",
    summary: "Understand the role of ongoing care, treatment, monitoring and support.",
    readingTime: "7 min read",
    sections: [
      {
        heading: "Diabetes care is ongoing",
        paragraphs: [
          "Diabetes management is individual. Care may involve healthy eating, physical activity, blood glucose monitoring, medicines and regular appointments. The right plan depends on the type of diabetes, health history, treatment and personal circumstances.",
          "People with type 1 diabetes need insulin. Some people with type 2 diabetes also need medicines, including insulin. Medication decisions should be made with a qualified health professional."
        ]
      },
      {
        heading: "Keep up with recommended checks",
        paragraphs: [
          "Regular follow-up helps a care team review blood glucose and other health needs. Depending on the person's situation, checks may include blood pressure, kidney health, eye health, foot health and cardiovascular risk."
        ]
      },
      {
        heading: "Food, movement and support",
        paragraphs: [
          "There is no single meal plan that is right for everyone. A health professional or qualified dietitian can help adapt food choices to health needs, culture, availability and budget. Regular physical activity that is appropriate for the individual can also support health.",
          "Family members and friends can help by listening, offering practical support and avoiding blame. Ask the person what support would be useful to them."
        ]
      },
      {
        heading: "Do not change treatment on your own",
        paragraphs: [
          "Do not stop prescribed medicines, change insulin doses or use unverified remedies because of information found online. If treatment is difficult to afford, causes side effects or is not working as expected, discuss this with a health professional."
        ]
      }
    ],
    sources: [
      { label: "World Health Organization — Diabetes questions and answers", url: "https://www.who.int/news-room/questions-and-answers/item/diabetes" },
      { label: "World Health Organization — Diabetes", url: "https://www.who.int/news-room/fact-sheets/detail/diabetes" }
    ]
  }
];

export function getEducationArticle(slug: string) {
  return educationArticles.find((article) => article.slug === slug);
}
