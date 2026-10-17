import { collection, config, fields, singleton } from '@keystatic/core';
import { SERVICE_ICON_NAMES } from './src/config/service-icons';

const servicePillarFields = () => ({
  title: fields.text({ label: 'Title' }),
  sub: fields.text({ label: 'Subtitle' }),
});

const servicesSectionFields = () => ({
  heading: fields.text({ label: 'Heading' }),
  sub: fields.text({ label: 'Subheading' }),
  dev: fields.object(servicePillarFields(), { label: 'Pillar · Entwicklung' }),
  ai: fields.object(servicePillarFields(), { label: 'Pillar · KI' }),
  marketing: fields.object(servicePillarFields(), {
    label: 'Pillar · Digitales Marketing',
  }),
  it: fields.object(servicePillarFields(), { label: 'Pillar · IT-Beratung' }),
});

const SLUG_RULE = 'Do not change after launch';

const PENDING_RULE =
  '"[[PENDING]]" = not provided yet (shown visibly on the site). Empty = does not apply (block hidden).';

const LEGAL_RULE = 'Legally binding text. Any change requires lawyer review.';

const legalText = (label: string, multiline = false) =>
  fields.text({ label, description: LEGAL_RULE, multiline });

const impressumFields = () => ({
  title: legalText('Title'),
  intro: legalText('Intro (§ 5 line)'),
  addressBlock: legalText('Address block', true),
  representedBy: legalText('Represented by', true),
  contactHeading: legalText('Contact heading'),
  phoneLabel: legalText('Phone label'),
  emailLabel: legalText('E-mail label'),
  registerLine: legalText('Register line', true),
  vatLine: legalText('VAT line', true),
  mstvLine: legalText('MStV line', true),
  consumerDispute: legalText('Consumer dispute', true),
  externalLinks: legalText('External links', true),
  copyright: legalText('Copyright', true),
  metaDescription: legalText('Meta description', true),
});

const datenschutzFields = () => ({
  title: legalText('Title'),
  lastUpdatedLine: legalText('Last updated line'),
  sections: fields.array(
    fields.object({
      title: legalText('Section title (without number)'),
      body: legalText('Section body', true),
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
      itemLabel: (props) => props.fields.title.value || 'Section',
    },
  ),
  metaDescription: legalText('Meta description', true),
});

const CONSENT_RULE =
  'Legally relevant text. Any change requires lawyer review.';

const consentText = (label: string, multiline = false) =>
  fields.text({ label, description: CONSENT_RULE, multiline });

const consentFields = () => ({
  headline: consentText('Headline'),
  body: consentText('Body ({{privacyLink}} = link to privacy page)', true),
  rejectAll: consentText('Reject all'),
  settings: consentText('Settings'),
  acceptAll: consentText('Accept all'),
  settingsHeading: consentText('Settings heading'),
  necessaryTitle: consentText('Necessary · title'),
  necessaryBadge: consentText('Necessary · badge'),
  necessaryText: consentText('Necessary · text', true),
  analyticsTitle: consentText('Analytics · title'),
  analyticsText: consentText('Analytics · text', true),
  marketingTitle: consentText('Marketing · title'),
  marketingText: consentText('Marketing · text', true),
  saveSelection: consentText('Save selection'),
  privacyLinkText: consentText('Privacy link text'),
  impressumLinkText: consentText('Legal notice link text'),
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
        name: fields.text({ label: 'Name' }),
        legalForm: fields.text({ label: 'Legal form' }),
        street: fields.text({ label: 'Street' }),
        zip: fields.text({ label: 'ZIP' }),
        city: fields.text({ label: 'City' }),
        representative: fields.text({
          label: 'Representative',
          description: PENDING_RULE,
        }),
        email: fields.text({ label: 'Email' }),
        phone: fields.text({ label: 'Phone' }),
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
        emailProvider: fields.text({ label: 'Email provider' }),
        supervisoryAuthority: fields.text({ label: 'Supervisory authority' }),
        logRetention: fields.text({ label: 'Log retention' }),
        lastUpdated: fields.text({ label: 'Last updated' }),
        socialLinkedin: fields.text({ label: 'LinkedIn URL' }),
        socialInstagram: fields.text({ label: 'Instagram URL' }),
        socialXing: fields.text({ label: 'Xing URL' }),
        showMstvResponsible: fields.checkbox({
          label: 'Show MStV responsible person',
          defaultValue: true,
        }),
        showConsumerDispute: fields.checkbox({
          label: 'Show consumer dispute notice',
          defaultValue: false,
        }),
        hasSocialProfiles: fields.checkbox({
          label: 'Has social profiles',
          defaultValue: false,
        }),
      },
    }),
    legalImpressum: singleton({
      label: 'Legal · Impressum',
      path: 'content/legal/impressum',
      format: 'json',
      schema: {
        de: fields.object(impressumFields(), { label: 'DE (binding)' }),
        en: fields.object(
          { disclaimer: legalText('Disclaimer', true), ...impressumFields() },
          { label: 'EN (convenience translation)' },
        ),
      },
    }),
    legalDatenschutz: singleton({
      label: 'Legal · Datenschutz',
      path: 'content/legal/datenschutz',
      format: 'json',
      schema: {
        de: fields.object(datenschutzFields(), { label: 'DE (binding)' }),
        en: fields.object(
          { disclaimer: legalText('Disclaimer', true), ...datenschutzFields() },
          { label: 'EN (convenience translation)' },
        ),
      },
    }),
    consentBanner: singleton({
      label: 'Legal · Consent banner',
      path: 'content/legal/consent-banner',
      format: 'json',
      schema: {
        de: fields.object(consentFields(), { label: 'DE' }),
        en: fields.object(consentFields(), { label: 'EN' }),
      },
    }),
    servicesSection: singleton({
      label: 'Home · Services',
      path: 'content/home/services',
      format: 'json',
      schema: {
        de: fields.object(servicesSectionFields(), { label: 'DE' }),
        en: fields.object(servicesSectionFields(), { label: 'EN' }),
      },
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
            { label: 'Entwicklung', value: 'entwicklung' },
            { label: 'KI', value: 'ki' },
            { label: 'Digitales Marketing', value: 'digitales-marketing' },
            { label: 'IT-Beratung', value: 'it-beratung' },
          ],
          defaultValue: 'entwicklung',
        }),
        order: fields.integer({
          label: 'Order (within pillar)',
          defaultValue: 1,
        }),
        visible: fields.checkbox({ label: 'Visible', defaultValue: true }),
        nameDe: fields.text({
          label: 'Name (DE)',
          description:
            'OFFICIAL term from the Gewerbeanmeldung. Must stay verbatim. Changes need owner + lawyer check.',
        }),
        nameEn: fields.text({ label: 'Name (EN)' }),
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
