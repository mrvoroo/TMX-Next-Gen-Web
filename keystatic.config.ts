import { collection, config, fields, singleton } from '@keystatic/core';
import { SERVICE_ICON_NAMES } from './src/config/service-icons';

/* ── Localized fields ─────────────────────────────────────────────────────
 * Every translatable value is ONE block: English on top, German directly
 * below. Stored as { en, de }. Read with pick() from src/lib/localized.ts.
 */

type LocalizedKind = 'legal' | 'official' | 'normal';

const DE_DESCRIPTION: Record<LocalizedKind, string> = {
  legal:
    'German = legally binding text. Do NOT change without lawyer review. Changing English does NOT update German.',
  official:
    'Official term from the business registration. Do not change.',
  normal:
    'German version. Changing English does NOT update German — update both.',
};

const localized = (
  label: string,
  options: {
    multiline?: boolean;
    kind?: LocalizedKind;
    description?: string;
  } = {},
) => {
  const { multiline = false, kind = 'normal', description } = options;
  return fields.object(
    {
      en: fields.text({ label: 'English', multiline }),
      de: fields.text({
        label: 'German',
        multiline,
        description: DE_DESCRIPTION[kind],
      }),
    },
    { label, description },
  );
};

const SLUG_RULE = 'Do not change after launch';

const PENDING_RULE =
  '"[[PENDING]]" = not provided yet (shown visibly on the site). Empty = does not apply (block hidden).';

const LEGAL_RULE = 'Legally binding text. Any change requires lawyer review.';

const servicePillarFields = () => ({
  title: localized('Title'),
  sub: localized('Subtitle'),
});

const servicesSectionFields = () => ({
  heading: localized('Heading'),
  sub: localized('Subheading'),
  dev: fields.object(servicePillarFields(), { label: 'Pillar · Development' }),
  ai: fields.object(servicePillarFields(), {
    label: 'Pillar · Artificial Intelligence',
  }),
  marketing: fields.object(servicePillarFields(), {
    label: 'Pillar · Digital Marketing',
  }),
  it: fields.object(servicePillarFields(), {
    label: 'Pillar · IT & Consulting',
  }),
});

const legal = (label: string, multiline = false) =>
  localized(label, { multiline, kind: 'legal' });

const englishDisclaimer = () =>
  fields.text({
    label: 'English disclaimer (EN page only)',
    description: LEGAL_RULE,
    multiline: true,
  });

const impressumFields = () => ({
  disclaimer: englishDisclaimer(),
  title: legal('Title'),
  intro: legal('Intro (§ 5 line)'),
  addressBlock: legal('Address block', true),
  representedBy: legal('Represented by', true),
  contactHeading: legal('Contact heading'),
  phoneLabel: legal('Phone label'),
  emailLabel: legal('E-mail label'),
  registerLine: legal('Register line', true),
  vatLine: legal('VAT line', true),
  mstvLine: legal('MStV line', true),
  consumerDispute: legal('Consumer dispute', true),
  externalLinks: legal('External links', true),
  copyright: legal('Copyright', true),
  metaDescription: legal('Meta description', true),
});

const datenschutzFields = () => ({
  disclaimer: englishDisclaimer(),
  title: legal('Title'),
  lastUpdatedLine: legal('Last updated line'),
  sections: fields.array(
    fields.object({
      title: legal('Section title (without number)'),
      body: legal('Section body', true),
      showIf: fields.select({
        label: 'Show if',
        description: LEGAL_RULE,
        options: [
          { label: 'Always', value: 'always' },
          { label: 'Company has social profiles', value: 'hasSocialProfiles' },
        ],
        defaultValue: 'always',
      }),
      highlight: fields.checkbox({
        label: 'Highlighted box (e.g. Art. 21 objection notice)',
        description: LEGAL_RULE,
        defaultValue: false,
      }),
    }),
    {
      label: 'Sections',
      description: LEGAL_RULE,
      itemLabel: (props) => props.fields.title.fields.en.value || 'Section',
    },
  ),
  metaDescription: legal('Meta description', true),
});

/* Order = order of appearance: first layer, then settings layer. */
const consentFields = () => ({
  headline: legal('Headline'),
  body: localized('Body', {
    multiline: true,
    kind: 'legal',
    description: '{{privacyLink}} = link to the privacy policy page.',
  }),
  rejectAll: legal('Reject all button'),
  settings: legal('Settings button'),
  acceptAll: legal('Accept all button'),
  privacyLinkText: legal('Privacy policy link text'),
  impressumLinkText: legal('Legal notice link text'),
  settingsHeading: legal('Settings heading'),
  necessaryTitle: legal('Necessary · title'),
  necessaryBadge: legal('Necessary · badge'),
  necessaryText: legal('Necessary · text', true),
  analyticsTitle: legal('Analytics · title'),
  analyticsText: legal('Analytics · text', true),
  marketingTitle: legal('Marketing · title'),
  marketingText: legal('Marketing · text', true),
  saveSelection: legal('Save selection button'),
});

export default config({
  storage: { kind: 'local' },
  singletons: {
    company: singleton({
      label: 'Company',
      path: 'content/settings/company',
      format: 'json',
      schema: {
        brand: fields.text({ label: 'Brand', defaultValue: 'TMX' }),
        name: fields.text({ label: 'Company name' }),
        legalForm: fields.text({ label: 'Legal form' }),
        street: fields.text({ label: 'Street' }),
        zip: fields.text({ label: 'ZIP code' }),
        city: fields.text({ label: 'City' }),
        representative: fields.text({
          label: 'Authorised representative',
          description: PENDING_RULE,
        }),
        email: fields.text({ label: 'E-mail address' }),
        phone: fields.text({ label: 'Phone number' }),
        registerCourt: fields.text({
          label: 'Register court',
          description: PENDING_RULE,
        }),
        registerNumber: fields.text({
          label: 'Register number',
          description: PENDING_RULE,
        }),
        vatId: fields.text({
          label: 'VAT ID',
          description: PENDING_RULE,
        }),
        emailProvider: fields.text({ label: 'E-mail provider' }),
        supervisoryAuthority: fields.text({ label: 'Supervisory authority' }),
        logRetention: fields.text({ label: 'Server log retention period' }),
        lastUpdated: fields.text({
          label: 'Privacy policy last updated',
          description: 'Inserted where the texts use {{lastUpdated}}.',
        }),
        socialLinkedin: fields.text({ label: 'LinkedIn URL' }),
        socialInstagram: fields.text({ label: 'Instagram URL' }),
        socialXing: fields.text({ label: 'Xing URL' }),
        showMstvResponsible: fields.checkbox({
          label: 'Show MStV responsible person',
          description: 'Shows the MStV line on the legal notice page.',
          defaultValue: true,
        }),
        showConsumerDispute: fields.checkbox({
          label: 'Show consumer dispute notice',
          description: 'Shows the consumer dispute line on the legal notice page.',
          defaultValue: false,
        }),
        hasSocialProfiles: fields.checkbox({
          label: 'Has social profiles',
          description:
            'Shows the privacy policy sections marked "Company has social profiles".',
          defaultValue: false,
        }),
      },
    }),
    legalImpressum: singleton({
      label: 'Legal · Legal notice (Impressum)',
      path: 'content/legal/impressum',
      format: 'json',
      schema: impressumFields(),
    }),
    legalDatenschutz: singleton({
      label: 'Legal · Privacy policy (Datenschutz)',
      path: 'content/legal/datenschutz',
      format: 'json',
      schema: datenschutzFields(),
    }),
    consentBanner: singleton({
      label: 'Legal · Consent banner',
      path: 'content/legal/consent-banner',
      format: 'json',
      schema: consentFields(),
    }),
    servicesSection: singleton({
      label: 'Home · Services',
      path: 'content/home/services',
      format: 'json',
      schema: servicesSectionFields(),
    }),
  },
  collections: {
    services: collection({
      label: 'Services',
      path: 'content/services/*',
      format: 'json',
      slugField: 'slug',
      schema: {
        slug: fields.slug({
          name: {
            label: 'Slug',
            description: `Stable ID, lowercase, used as URL anchor. ${SLUG_RULE}.`,
            validation: {
              isRequired: true,
              pattern: {
                regex: /^[a-z0-9]+(-[a-z0-9]+)*$/,
                message: 'Lowercase letters, digits and hyphens only.',
              },
            },
          },
          slug: {
            label: 'Slug (file name)',
            description: SLUG_RULE,
          },
        }),
        pillar: fields.select({
          label: 'Pillar',
          options: [
            { label: 'Development', value: 'entwicklung' },
            { label: 'Artificial Intelligence', value: 'ki' },
            { label: 'Digital Marketing', value: 'digitales-marketing' },
            { label: 'IT & Consulting', value: 'it-beratung' },
          ],
          defaultValue: 'entwicklung',
        }),
        order: fields.integer({
          label: 'Order (within pillar)',
          defaultValue: 1,
        }),
        visible: fields.checkbox({ label: 'Visible', defaultValue: true }),
        name: localized('Name', { kind: 'official' }),
        icon: fields.select({
          label: 'Icon (lucide)',
          options: SERVICE_ICON_NAMES.map((name) => ({
            label: name,
            value: name,
          })),
          defaultValue: 'Globe',
        }),
      },
    }),
  },
});
