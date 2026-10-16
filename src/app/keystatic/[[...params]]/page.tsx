import { notFound } from 'next/navigation';
import KeystaticApp from '../keystatic-app';

export default function Page() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <KeystaticApp />;
}
