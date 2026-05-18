export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tmpl_interview',
    name: 'Interview Invitation',
    subject: 'Interview Invitation — {{jobTitle}}',
    body: `Hi {{candidateName}},\n\nThanks for your interest in the {{jobTitle}} role. We'd love to schedule an interview with you. Please reply with a few times that work this week.\n\nBest,\n{{recruiterName}}`,
  },
  {
    id: 'tmpl_offer',
    name: 'Offer Letter',
    subject: 'Your Offer for {{jobTitle}}',
    body: `Hi {{candidateName}},\n\nWe're thrilled to extend you an offer for the {{jobTitle}} role. Details are attached. Please let us know if you have any questions.\n\nWelcome aboard,\n{{recruiterName}}`,
  },
  {
    id: 'tmpl_rejection',
    name: 'Rejection',
    subject: 'Update on your application',
    body: `Hi {{candidateName}},\n\nThank you for your time and interest in the {{jobTitle}} position. After careful consideration, we've decided to move forward with other candidates. We wish you all the best.\n\nRegards,\n{{recruiterName}}`,
  },
];

export function applyTemplate(
  body: string,
  vars: { candidateName: string; jobTitle: string; recruiterName: string },
): string {
  return body
    .replace(/{{candidateName}}/g, vars.candidateName)
    .replace(/{{jobTitle}}/g, vars.jobTitle)
    .replace(/{{recruiterName}}/g, vars.recruiterName);
}
