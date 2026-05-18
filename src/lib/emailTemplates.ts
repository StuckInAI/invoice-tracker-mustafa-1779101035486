export interface EmailTemplate {
  subject: string;
  body: string;
}

export const TEMPLATES: Record<string, EmailTemplate> = {
  'Interview Invite': {
    subject: 'Interview Invitation – {{jobTitle}}',
    body: 'Dear {{candidateName}},\n\nWe would like to invite you to an interview for the {{jobTitle}} position.\n\nPlease let us know your availability.\n\nBest regards,\nThe Hiring Team',
  },
  'Offer Letter': {
    subject: 'Job Offer – {{jobTitle}}',
    body: 'Dear {{candidateName}},\n\nWe are pleased to offer you the position of {{jobTitle}}.\n\nPlease review the attached offer and let us know if you have any questions.\n\nBest regards,\nThe Hiring Team',
  },
  'Rejection': {
    subject: 'Update on Your Application – {{jobTitle}}',
    body: 'Dear {{candidateName}},\n\nThank you for your interest in the {{jobTitle}} position. After careful consideration, we have decided to move forward with other candidates at this time.\n\nWe wish you the best in your search.\n\nBest regards,\nThe Hiring Team',
  },
  'Screening Call': {
    subject: 'Screening Call – {{jobTitle}}',
    body: 'Dear {{candidateName}},\n\nWe would like to schedule a brief screening call regarding your application for {{jobTitle}}.\n\nPlease reply with your preferred time.\n\nBest regards,\nThe Hiring Team',
  },
};

export function renderTemplate(
  template: EmailTemplate,
  vars: Record<string, string>,
): EmailTemplate {
  const replace = (str: string) =>
    str.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
  return {
    subject: replace(template.subject),
    body: replace(template.body),
  };
}
