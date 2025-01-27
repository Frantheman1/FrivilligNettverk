import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_a1ptbod';
const EMAILJS_NEW_APPLICATION_TEMPLATE_ID = 'template_36g467l';  // Template for new applications
const EMAILJS_APPROVED_TEMPLATE_ID = 'template_3k2gqva';  // Replace with your approved template ID
const EMAILJS_PUBLIC_KEY = 'tjDXGM6JfWrxF7Ssx';

export async function sendApplicationNotificationEmail(applicantEmail, creatorEmail, opportunityTitle, type) {
  try {
    console.log('Starting email send process:', { type, applicantEmail, creatorEmail });

    // Don't send email for rejections
    if (type === 'application_rejected') {
      console.log('Skipping rejected application email');
      return true;
    }

    let templateId;
    let toEmail;

    if (type === 'new_application') {
      console.log('Preparing NEW APPLICATION email');
      templateId = EMAILJS_NEW_APPLICATION_TEMPLATE_ID;
      toEmail = creatorEmail; // Send to opportunity creator
    } else if (type === 'application_approved') {
      console.log('Preparing APPROVAL email');
      templateId = EMAILJS_APPROVED_TEMPLATE_ID;
      toEmail = applicantEmail; // Send to applicant
    } else {
      console.error('Unknown email type:', type);
      return false;
    }

    const templateParams = {
      to_email: toEmail,
      opportunity_title: opportunityTitle,
      subject: getEmailSubject(type, opportunityTitle),
    };

    console.log('Sending email with params:', {
      templateId,
      toEmail,
      type,
      subject: templateParams.subject
    });

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

function getEmailSubject(type, opportunityTitle) {
  switch (type) {
    case 'new_application':
      return `Ny søknad på "${opportunityTitle}"`;
    case 'application_approved':
      return `Din søknad på "${opportunityTitle}" er godkjent!`;
    default:
      return 'Oppdatering på din søknad';
  }
} 