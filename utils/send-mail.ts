import { FormData } from '@/app/(public)/contact/_components/ContactForm';

export function sendEmail(data: FormData): Promise<void> {
  const apiEndpoint = '/api/email';

  return fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          throw new Error(error.error || 'Failed to send email');
        });
      }
      return res.json();
    })
    .then((response) => {
      if (response.error) {
        throw new Error(response.error);
      }
    });
}
