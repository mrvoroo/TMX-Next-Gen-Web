# Cookie Consent Banner + Datenschutzerklärung Addendum

> ⚠️ Same disclaimer as before: I'm not a lawyer. This content follows current
> documented requirements (§ 25 TDDDG, GDPR/DSGVO, BGH "Cookie-Einwilligung II"
> ruling) as thoroughly as possible, but have a German IT/data protection lawyer do a
> final review before launch — especially once you confirm Web3Forms' exact data
> processing terms (see note at the bottom).

---

## PART 1: Cookie Consent Banner (on-load popup)

### Design requirements (non-negotiable — legally required, not optional styling):
- Must appear on first page load, before any non-essential storage/script runs
- "Reject All" and "Accept All" buttons must be equally sized, equally colored/
  prominent, and both on the FIRST layer of the banner (not one visible, one hidden
  behind "Settings")
- No pre-checked boxes for anything except "Necessary" (which can't be unchecked)
- Must include a "Settings/Customize" option showing categories individually
- Choice must persist (so it doesn't reappear every visit) and must be easy to change
  later (e.g. a small "Cookie Settings" link in the footer)
- Since this site currently has NO analytics/marketing trackers, the "Optional"
  category will simply have nothing active in it yet — this is honest and future-
  proofs the system for when/if you add analytics later, without ever falsely
  implying tracking exists today

### 🇩🇪 German (banner text)

```
Headline: Ihre Privatsphäre ist uns wichtig

Body: Wir verwenden nur technisch notwendige Speicherung (z. B. Ihre gewählte
Sprache), um diese Website ordnungsgemäß bereitzustellen. Optionale Kategorien wie
Analyse oder Marketing sind derzeit nicht aktiv. Mehr Informationen finden Sie in
unserer Datenschutzerklärung.

Buttons:
[ Alle ablehnen ]   [ Einstellungen ]   [ Alle akzeptieren ]

--- Settings/Customize panel ---

Heading: Cookie-Einstellungen

Category 1 (toggle, locked ON, non-removable):
Notwendig — Immer aktiv
Erforderlich für grundlegende Funktionen der Website, z. B. das Speichern Ihrer
Spracheinstellung (Deutsch/Englisch). Diese Speicherung erfolgt nur, wenn Sie sie
aktiv auswählen, und ist gemäß § 25 Abs. 2 TDDDG von der Einwilligungspflicht
ausgenommen.

Category 2 (toggle, OFF by default):
Analyse
Würde uns helfen zu verstehen, wie Besucher unsere Website nutzen. Derzeit setzen wir
keine Analyse-Tools ein — diese Kategorie ist vorbereitet für den Fall, dass wir in
Zukunft ein Analyse-Tool hinzufügen, und wird Sie dann erneut um Zustimmung bitten.

Category 3 (toggle, OFF by default):
Marketing
Würde für personalisierte Werbung oder Retargeting verwendet. Derzeit nicht aktiv.

Buttons: [ Auswahl speichern ]   [ Alle akzeptieren ]
```

### 🇬🇧 English (banner text)

```
Headline: Your privacy matters to us

Body: We only use technically necessary storage (e.g. your selected language) to
provide this website properly. Optional categories such as analytics or marketing
are not currently active. See our Privacy Policy for details.

Buttons:
[ Reject All ]   [ Settings ]   [ Accept All ]

--- Settings/Customize panel ---

Heading: Cookie Settings

Category 1 (toggle, locked ON, non-removable):
Necessary — Always Active
Required for basic website functionality, e.g. storing your language preference
(German/English). This storage only occurs when you actively select it, and is
exempt from consent requirements.

Category 2 (toggle, OFF by default):
Analytics
Would help us understand how visitors use our website. We currently do not use any
analytics tools — this category is prepared in case we add one in the future, at
which point we will ask for your consent again.

Category 3 (toggle, OFF by default):
Marketing
Would be used for personalized advertising or retargeting. Not currently active.

Buttons: [ Save Selection ]   [ Accept All ]
```

---

## PART 2: Datenschutzerklärung — sections to ADD to the existing privacy policy

Add these as new numbered sections (adjust numbering to fit into the existing
document from the previous Impressum/Datenschutz file).

### 🇩🇪 German

```
Cookies und lokale Speicherung

Diese Website verwendet ausschließlich technisch notwendige lokale Speicherung
(Local Storage), namentlich zur Speicherung Ihrer gewählten Anzeigesprache (Deutsch/
Englisch). Diese Speicherung erfolgt nur, wenn Sie die Sprache aktiv auswählen, und
ist gemäß § 25 Abs. 2 TDDDG von der Einwilligungspflicht ausgenommen, da sie
technisch zwingend erforderlich ist, um die von Ihnen gewünschte Funktion
bereitzustellen.

Aktuell setzen wir keine Analyse-, Marketing- oder Tracking-Cookies ein. Sollten wir
in Zukunft solche Dienste hinzufügen, werden wir Sie vorab über unseren Cookie-
Banner um Ihre ausdrückliche Einwilligung bitten und diese Datenschutzerklärung
entsprechend aktualisieren.

Sie können Ihre Cookie-Einstellungen jederzeit über den Link "Cookie-Einstellungen"
im Footer dieser Website ändern oder widerrufen.

Kontaktformular — Drittanbieter (Web3Forms)

Zur technischen Verarbeitung von Anfragen über unser Kontaktformular nutzen wir den
Dienst Web3Forms. Wenn Sie das Kontaktformular ausfüllen und absenden, werden die von
Ihnen eingegebenen Daten (Name, E-Mail-Adresse, Nachricht) an die Server von Web3Forms
übermittelt, um die E-Mail-Zustellung an uns zu ermöglichen.

[ZU PRÜFEN UND ZU ERGÄNZEN, bevor die Seite live geht: Bitte prüfen Sie auf
web3forms.com die aktuellen Angaben zu Serverstandort und Rechtsgrundlage der
Datenübermittlung (z. B. EU-US Data Privacy Framework oder Standardvertragsklauseln
gemäß Art. 46 DSGVO) und ergänzen Sie diese hier konkret. Ohne diese Angabe ist der
Abschnitt unvollständig.]

Die Verarbeitung erfolgt auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1
lit. f DSGVO) an einer zuverlässigen technischen Bereitstellung des Kontaktformulars,
sowie auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) durch das
Absenden des Formulars nach Bestätigung der Datenschutzerklärung.
```

### 🇬🇧 English

```
Cookies and Local Storage

This website uses only technically necessary local storage, specifically to store
your selected display language (German/English). This storage only occurs when you
actively select a language, and is exempt from consent requirements as it is
technically necessary to provide the function you requested.

We currently do not use any analytics, marketing, or tracking cookies. Should we add
such services in the future, we will request your explicit consent in advance via
our cookie banner and update this privacy policy accordingly.

You can change or withdraw your cookie preferences at any time via the "Cookie
Settings" link in this website's footer.

Contact Form — Third-Party Provider (Web3Forms)

To technically process inquiries submitted via our contact form, we use the Web3Forms
service. When you fill out and submit the contact form, the data you enter (name,
email address, message) is transmitted to Web3Forms' servers to enable email delivery
to us.

[TO BE VERIFIED AND COMPLETED before going live: Please check web3forms.com for
current information on server location and the legal basis for data transfer (e.g.
EU-US Data Privacy Framework or Standard Contractual Clauses under Art. 46 GDPR) and
add the specifics here. This section is incomplete without that detail.]

Processing is based on our legitimate interest (Art. 6(1)(f) GDPR) in reliably
providing the contact form, and on your consent (Art. 6(1)(a) GDPR) given by
submitting the form after confirming the privacy policy.
```

---

## Placeholder to fill before launch

- [ ] Verify Web3Forms' actual server location and data transfer legal basis on
      web3forms.com, then complete the bracketed section above
- [ ] If any analytics/marketing tool is added later, update both the banner's
      "Optional" categories AND this privacy policy section before activating it
