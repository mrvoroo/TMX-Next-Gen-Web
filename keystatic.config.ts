import { config, fields, singleton } from '@keystatic/core';

const PENDING_RULE =
  '"[[PENDING]]" = not provided yet (shown visibly on the site). Empty = does not apply (block hidden).';

const LEGAL_RULE = 'Legally binding text. Any change requires lawyer review.';

const legalText = (label: string, multiline = false) =>
  fields.text({ label, description: LEGAL_RULE, multiline });

const impressumFields = () => ({
  title: legalText('Title'),
  intro: legalText('Intro (ÃÂÃÂ§ 5 line)'),
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
      label: 'Legal ÃÂÃÂ· Impressum',
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
      label: 'Legal Â· Datenschutz',
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
  },
});
