import { useTranslation } from 'react-i18next';

function Help() {
  const { t } = useTranslation();
  const faqs = [
    ['help.faqs.info.question', 'help.faqs.info.answer'],
    ['help.faqs.official.question', 'help.faqs.official.answer'],
    ['help.faqs.save.question', 'help.faqs.save.answer'],
    ['help.faqs.empty.question', 'help.faqs.empty.answer'],
    ['help.faqs.language.question', 'help.faqs.language.answer']
  ];

  return <main className="content help-page">
    <section className="intro"><h1>{t('help.title', 'Help and FAQs')}</h1><p>{t('help.subtitle', 'Quick answers for finding, saving, and applying to government schemes.')}</p></section>
    <div className="faq-list">
      {faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{t(question)}</summary><p>{t(answer)}</p></details>)}
    </div>
  </main>;
}

export default Help;