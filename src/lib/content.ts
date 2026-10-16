import 'server-only';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export async function getCompany() {
  return reader.singletons.company.read();
}

export async function getImpressum() {
  return reader.singletons.legalImpressum.read();
}

export async function getDatenschutz() {
  return reader.singletons.legalDatenschutz.read();
}

export async function getConsentBanner() {
  return reader.singletons.consentBanner.read();
}
