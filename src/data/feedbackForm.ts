export const feedbackForm = {
  ja: 'https://forms.gle/VgwrCWLcr9svjZg58',
  enUS: 'https://forms.gle/SnngkaDSqXVqoLch8', 
  ar: 'https://forms.gle/SnngkaDSqXVqoLch8', 
};

declare global {
  type FeedbackLanguage = keyof typeof feedbackForm;
}
