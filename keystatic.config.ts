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
    defaults?: { en: string; de: string };
  } = {},
) => {
  const { multiline = false, kind = 'normal', description, defaults } = options;
  return fields.object(
    {
      en: fields.text({
        label: 'English',
        multiline,
        defaultValue: defaults?.en,
      }),
      de: fields.text({
        label: 'German',
        multiline,
        description: DE_DESCRIPTION[kind],
        defaultValue: defaults?.de,
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

const portfolioPageFields = () => ({
  eyebrow: localized('Eyebrow', {
    defaults: { en: 'Portfolio', de: 'Portfolio' },
  }),
  heading: localized('Heading', {
    defaults: { en: 'Work you can see.', de: 'Arbeit, die man sieht.' },
  }),
  sub: localized('Subheading', {
    defaults: {
      en: 'Selected websites and applications – up close.',
      de: 'Ausgewählte Websites und Anwendungen – im Detail.',
    },
  }),
  ctaHeading: localized('CTA heading', {
    defaults: { en: 'Your project next?', de: 'Ihr Projekt als nächstes?' },
  }),
  ctaButton: localized('CTA button', {
    defaults: { en: 'Start a project', de: 'Projekt anfragen' },
  }),
  linkLabel: localized('Project link label', {
    defaults: { en: 'View project', de: 'Projekt ansehen' },
  }),
  founderBadge: localized('Founder badge', {
    defaults: { en: "Founder's project", de: 'Projekt des Gründers' },
  }),
  metaTitle: localized('Meta title', {
    defaults: { en: 'Portfolio – TMX', de: 'Portfolio – TMX' },
  }),
  metaDescription: localized('Meta description', {
    multiline: true,
    defaults: {
      en: 'Selected projects by TMX.',
      de: 'Ausgewählte Projekte von TMX.',
    },
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

const contactFields = () => ({
  title: localized('Title'),
  intro: localized('Intro', { multiline: true }),
  labelEmail: localized('Direct contact · E-mail label'),
  labelPhone: localized('Direct contact · Phone label'),
  labelAddress: localized('Direct contact · Address label'),
  requiredNote: localized('Required fields note'),
  fieldName: localized('Field · Name'),
  fieldEmail: localized('Field · E-mail'),
  fieldService: localized('Field · Service'),
  serviceDefault: localized('Service · default option'),
  serviceGeneral: localized('Service · general inquiry option'),
  fieldMessage: localized('Field · Message'),
  checkbox: localized('Checkbox', {
    multiline: true,
    kind: 'legal',
    description: '{{privacyLink}} = link to the privacy policy page.',
  }),
  privacyLinkText: localized('Privacy link text'),
  hint: localized('Hint under button', {
    multiline: true,
    kind: 'legal',
    description: '{{privacyLink}} = link to the privacy policy page.',
  }),
  button: localized('Button'),
  sending: localized('Button while sending'),
  success: localized('Success message', { multiline: true }),
  error: localized('Error message', {
    multiline: true,
    kind: 'legal',
    description: '{{email}} = company e-mail address.',
  }),
  valRequired: localized('Validation · required'),
  valEmail: localized('Validation · e-mail'),
  valCheckbox: localized('Validation · checkbox'),
  metaDescription: localized('Meta description', { multiline: true }),
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
    contactPage: singleton({
      label: 'Kontakt page',
      path: 'content/pages/contact',
      format: 'json',
      schema: contactFields(),
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
    portfolioPage: singleton({
      label: 'Portfolio page',
      path: 'content/pages/portfolio',
      format: 'json',
      schema: portfolioPageFields(),
    }),
  },
  collections: {
    projects: collection({
      label: 'Portfolio projects',
      path: 'content/projects/*',
      format: 'json',
      slugField: 'slug',
      schema: {
        slug: fields.slug({
          name: {
            label: 'Slug',
            description: `Stable ID, lowercase. ${SLUG_RULE}.`,
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
        title: localized('Title'),
        description: localized('Description', {
          multiline: true,
          description:
            'Max. ~160 characters. Facts only, no invented results.',
        }),
        image: fields.image({
          label: 'Screenshot',
          directory: 'public/images/portfolio',
          publicPath: '/images/portfolio/',
          validation: { isRequired: true },
        }),
        imageAlt: localized('Image alt text'),
        url: fields.text({
          label: 'Project URL (optional)',
          description: 'Must start with https://',
          validation: {
            pattern: {
              regex: /^(https:\/\/\S+)?$/,
              message: 'Must start with https://',
            },
          },
        }),
        techTags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tech tags',
          description: 'e.g. "Next.js"',
          itemLabel: (props) => props.value || 'Tag',
        }),
        origin: fields.select({
          label: 'Origin',
          options: [
            { label: 'TMX project', value: 'tmx' },
            { label: 'Founder project (before TMX)', value: 'founder' },
          ],
          defaultValue: 'tmx',
        }),
        clientPermission: fields.checkbox({
          label: 'Client permission',
          description: "Show only with the client's (written) permission.",
          defaultValue: false,
        }),
        visible: fields.checkbox({ label: 'Visible', defaultValue: true }),
        order: fields.integer({ label: 'Order', defaultValue: 1 }),
        year: fields.integer({ label: 'Year (optional)' }),
        accent: fields.select({
          label: 'Accent',
          options: [
            { label: 'Violet', value: 'violet' },
            { label: 'Cyan', value: 'cyan' },
            { label: 'Mixed', value: 'mixed' },
          ],
          defaultValue: 'mixed',
        }),
      },
    }),
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
