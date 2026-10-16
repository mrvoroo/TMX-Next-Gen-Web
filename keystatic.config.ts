import { config, fields, singleton } from '@keystatic/core';

const PENDING_RULE =
  '"[[PENDING]]" = not provided yet (shown visibly on the site). Empty = does not apply (block hidden).';

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
  },
});
