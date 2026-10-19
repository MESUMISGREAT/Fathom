import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignupForm } from '@/components/forms/AuthForms';
import { getSessionUser } from '@/server/auth/session';

export const metadata: Metadata = { title: 'Create account' };

export default async function SignupPage() {
  if (await getSessionUser()) redirect('/');
  return <SignupForm />;
}
