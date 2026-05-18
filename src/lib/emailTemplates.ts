export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'ack',
    name: 'Application Acknowledgement',
    subject: 'We received your application',
    body: 'Dear {{name}},\n\nThank you for applying to {{jobTitle}}. We will be in touch shortly.\n\nBest regards,\nThe Hiring Team',
  },
  {
    id: 'interview',
    name: 'Interview Invitation',
    subject: 'Interview Invitation – {{jobTitle}}',
    body: 'Dear {{name}},\n\nWe would like to invite you for an interview for the {{jobTitle}} position. Please let us know your availability.\n\nBest regards,\nThe Hiring Team',
  },
  {
    id: 'offer',
    name: 'Offer Letter',
    subject: 'Job Offer – {{jobTitle}}',
    body: 'Dear {{name}},\n\nWe are pleased to offer you the position of {{jobTitle}}. Please find the details attached.\n\nBest regards,\nThe Hiring Team',
  },
  {
    id: 'reject',
    name: 'Rejection',
    subject: 'Update on your application',
    body: 'Dear {{name}},\n\nThank you for your interest in {{jobTitle}}. After careful consideration, we will not be moving forward with your application at this time.\n\nBest regards,\nThe Hiring Team',
  },
];
