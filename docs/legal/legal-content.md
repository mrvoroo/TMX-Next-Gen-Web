# TMX — Legal & Contact Page Content (v2, replaces the earlier Impressum/Datenschutz drafts)

> I am not a lawyer. This is a careful template built from currently published German
> guidance (DDG, TDDDG, DSGVO, VSBG). Have an IT-law lawyer review it before launch.
> German = legally binding version. English = convenience translation only.

## HOW THE AGENT MUST USE THIS FILE
- Copy German and English texts VERBATIM into translations/pages. Do not rephrase.
- Every `[[...]]` is a placeholder that must come from ONE config file
  (`src/config/company.ts`). Never invent values. If a value is missing, leave the
  `[[...]]` marker visible so `npm run check:legal` fails until it is filled.
- Blocks marked `[[ONLY IF ...]]` are rendered only when the matching config flag is true.

## CORRECTIONS vs. my earlier draft (important)
1. REMOVED the EU "OS-Plattform" link and text from the Impressum. The platform was shut
   down on 20 July 2025; keeping the link is now treated as misleading (§ 5 UWG).
2. REMOVED "Steuernummer" from the Impressum. It is NOT a required item and should not be
   published. Only the USt-IdNr. (or Wirtschafts-Identifikationsnummer) is required, and
   only if the company has one.
3. REMOVED the generic "Haftung für Inhalte" text that cited specific DDG paragraph
   numbers I could not verify. Replaced by a short neutral notice (optional anyway).
4. Datenschutz now names the real recipients (Netlify hosting, Web3Forms, e-mail provider),
   lists the exact browser-storage keys, and adds a separate, clearly visible Art. 21
   objection notice.

---

## A. COMPANY DATA NEEDED (config: src/config/company.ts)

| Key | Meaning |
|---|---|
| name | Exact name as in the Gewerbeanmeldung (sole proprietor: first + last name) |
| legalForm | e.g. Einzelunternehmen / GmbH / UG (haftungsbeschränkt) |
| street, zip, city | Postal address where mail can be received (no P.O. box) |
| representative | Managing director (ONLY for legal entities) |
| email, phone | Both shown as visible text (a bare mailto link is not enough) |
| registerCourt, registerNumber | ONLY if registered in the Handelsregister |
| vatId | USt-IdNr. — ONLY if the company has one |
| showMstvResponsible | true/false — "verantwortlich nach § 18 Abs. 2 MStV" (customary, optional) |
| showConsumerDispute | true/false — see Impressum block E |
| emailProvider | Provider of the mailbox that receives inquiries (e.g. Google Workspace, IONOS) |
| supervisoryAuthority | State data-protection authority for the company's federal state |
| logRetention | Netlify log retention (verify) |
| hasSocialProfiles | true/false |
| lastUpdated | Date shown as "Stand" |

---

## B. IMPRESSUM

### DE (binding)
Impressum

Angaben gemäß § 5 DDG

[[name]]
[[legalForm]]
[[street]]
[[zip]] [[city]]
Deutschland

[[ONLY IF legal entity]] Vertreten durch: [[representative]]

Kontakt
Telefon: [[phone]]
E-Mail: [[email]]

[[ONLY IF registered]] Registergericht: [[registerCourt]] · Registernummer: [[registerNumber]]

[[ONLY IF vatId]] Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: [[vatId]]

[[ONLY IF showMstvResponsible]] Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV: [[name]], Anschrift wie oben.

[[ONLY IF showConsumerDispute]] Verbraucherstreitbeilegung: Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.

Hinweis zu externen Links: Für die Inhalte verlinkter externer Seiten sind ausschließlich deren Betreiber verantwortlich. Bei Bekanntwerden von Rechtsverletzungen entfernen wir entsprechende Links umgehend.

Urheberrecht: Die von uns erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen Urheberrecht. Eine Verwendung außerhalb der Grenzen des Urheberrechts bedarf unserer vorherigen schriftlichen Zustimmung.

### EN (convenience translation)
This English translation is provided for convenience only. The German version is legally binding.

Legal Notice (Impressum)

Information pursuant to § 5 DDG (German Digital Services Act)

[[name]] / [[legalForm]] / [[street]] / [[zip]] [[city]] / Germany

[[ONLY IF legal entity]] Represented by: [[representative]]

Contact — Phone: [[phone]] · E-mail: [[email]]

[[ONLY IF registered]] Register court: [[registerCourt]] · Register number: [[registerNumber]]

[[ONLY IF vatId]] VAT identification number pursuant to § 27a German VAT Act: [[vatId]]

[[ONLY IF showMstvResponsible]] Responsible for content pursuant to § 18 (2) MStV: [[name]], address as above.

[[ONLY IF showConsumerDispute]] Consumer dispute resolution: We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.

External links: The operators of linked external sites are solely responsible for their content. We will remove such links promptly upon becoming aware of any legal violation.

Copyright: The content and works created by us on this website are subject to German copyright law. Any use beyond the limits of copyright law requires our prior written consent.

### Notes (not for publishing)
- Reachable within max. 2 clicks from every page (footer link on all pages).
- Provide a phone number: e-mail plus a second direct channel is the safe standard.
- Block E only if consumers are addressed. Companies with ≤ 10 employees on 31 Dec of the previous year are exempt from the general § 36 VSBG statement; the statement, if published, must be true.
- Company social profiles (LinkedIn/Instagram) need their own Impressum link/info.

---

## C. DATENSCHUTZERKLÄRUNG

### DE (binding)
Datenschutzerklärung — Stand: [[lastUpdated]]

1. Verantwortlicher und Kontakt
Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist: [[name]], [[street]], [[zip]] [[city]], Deutschland. E-Mail: [[email]], Telefon: [[phone]].

2. Überblick
Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung dieser Website, zur Bearbeitung Ihrer Anfragen und zur Gewährleistung der Sicherheit erforderlich ist. Nachfolgend informieren wir Sie gemäß Art. 13 DSGVO darüber, welche Daten wir zu welchem Zweck und auf welcher Rechtsgrundlage verarbeiten.

3. Hosting und Server-Logfiles (Netlify)
Diese Website wird bei Netlify, Inc., [[Anschrift laut Netlify-Datenschutzerklärung eintragen]], USA („Netlify“) gehostet. Beim Aufruf der Website verarbeitet Netlify in unserem Auftrag technisch erforderliche Daten, insbesondere: IP-Adresse, Datum und Uhrzeit des Abrufs, aufgerufene Seite bzw. Datei, übertragene Datenmenge, HTTP-Statuscode, Referrer-URL sowie Browser- und Betriebssysteminformationen (Server-Logfiles).
Zweck: Auslieferung der Website, Gewährleistung von Stabilität und Sicherheit, Abwehr von Angriffen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und funktionsfähigen Webauftritt). Speicherdauer: [[logRetention — laut Netlify prüfen]].
Mit Netlify besteht [[ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO — Abschluss bestätigen]]. Da Netlify seinen Sitz in den USA hat, kann eine Übermittlung personenbezogener Daten in die USA stattfinden. Grundlage hierfür ist [[Angemessenheitsbeschluss (EU-US Data Privacy Framework), sofern Netlify, Inc. dort zertifiziert ist — auf dataprivacyframework.gov prüfen — ODER Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO]]. Eine Kopie der Garantien erhalten Sie auf Anfrage über die Kontaktdaten in Ziffer 1.

4. Kontaktaufnahme per E-Mail oder Telefon
Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir Ihre Angaben (z. B. Name, E-Mail-Adresse, Telefonnummer, Inhalt der Anfrage) zur Bearbeitung Ihres Anliegens. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage mit einem Vertrag oder vorvertraglichen Maßnahmen zusammenhängt, ansonsten Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der effektiven Bearbeitung von Anfragen). Wir löschen die Daten, sobald sie für den Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten (z. B. nach Handels- und Steuerrecht) entgegenstehen. Unser Postfach wird bei [[emailProvider]] betrieben, der für uns als Auftragsverarbeiter tätig ist. [[AVV und ggf. Drittlandübermittlung dieses Anbieters bestätigen]]

5. Kontaktformular (Web3Forms)
Auf unserer Kontaktseite bieten wir ein Formular an. Verarbeitet werden die von Ihnen eingegebenen Daten: Name, E-Mail-Adresse, [[ggf. gewünschte Leistung]] und Ihre Nachricht [[prüfen, welche technischen Metadaten Web3Forms zusätzlich verarbeitet, z. B. IP-Adresse, und hier ergänzen]].
Zur Übermittlung nutzen wir den Formular-Dienst Web3Forms ([[Betreiber und Anschrift laut Web3Forms-Datenschutzerklärung eintragen]]). Beim Absenden werden die Formulardaten an Web3Forms übertragen und von dort per E-Mail an uns weitergeleitet. [[Serverstandort, Auftragsverarbeitungsvertrag und Rechtsgrundlage der Drittlandübermittlung laut Web3Forms prüfen und hier konkret eintragen — ohne diese Angaben ist dieser Abschnitt unvollständig.]]
Zweck: Bearbeitung Ihrer Anfrage. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO bzw. Art. 6 Abs. 1 lit. f DSGVO; soweit Sie das Häkchen zur Datenschutzerklärung gesetzt haben, zusätzlich Art. 6 Abs. 1 lit. a DSGVO. Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Kontakt siehe Ziffer 1). Name, E-Mail-Adresse und Nachricht sind erforderlich, damit wir Ihre Anfrage beantworten können; ohne diese Angaben ist eine Bearbeitung nicht möglich. Speicherdauer: siehe Ziffer 4.

6. Lokale Speicherung im Browser
Wir setzen keine Cookies zu Analyse- oder Marketingzwecken. In dem lokalen Speicher (Local Storage) Ihres Browsers speichern wir ausschließlich:
– „tmx-locale“: Ihre gewählte Sprache (Deutsch/Englisch), nur wenn Sie die Sprache aktiv auswählen.
– „tmx-cookie-consent“: Ihre Entscheidung im Einwilligungsbanner samt Zeitpunkt, damit die Abfrage nicht bei jedem Besuch erneut erscheint.
Diese Speicherung ist technisch unbedingt erforderlich, um eine von Ihnen ausdrücklich gewünschte Funktion bereitzustellen bzw. Ihre Entscheidung umzusetzen, und bedarf daher nach § 25 Abs. 2 Nr. 2 TDDDG keiner Einwilligung. Soweit dabei personenbezogene Daten verarbeitet werden, erfolgt dies auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Die Daten verbleiben in Ihrem Browser, bis Sie sie löschen; sie werden nicht an uns oder Dritte übertragen. Sie können Ihre Auswahl jederzeit über „Cookie-Einstellungen“ im Footer ändern.

7. Keine Analyse-, Marketing- oder Tracking-Dienste, keine Drittinhalte
Aktuell setzen wir keine Analyse-, Tracking- oder Marketing-Dienste ein und binden keine Inhalte von Drittservern (z. B. Schriftarten, Karten, Videos) ein. Schriftarten werden lokal von unserem eigenen Server bereitgestellt. Sollten wir künftig solche Dienste einsetzen, holen wir vorher Ihre Einwilligung über das Einwilligungsbanner ein und aktualisieren diese Erklärung.

8. Links zu externen Angeboten
[[ONLY IF hasSocialProfiles]] Diese Website enthält Links zu unseren Profilen bei [[LinkedIn / Instagram — nur tatsächlich vorhandene Profile nennen]]. Es werden keine Plug-ins eingebunden; erst durch Anklicken verlassen Sie unsere Website. Für die Datenverarbeitung dort ist der jeweilige Anbieter verantwortlich.

9. Empfänger
Empfänger Ihrer Daten sind ausschließlich die oben genannten Dienstleister (Netlify, Web3Forms, [[emailProvider]]), soweit für den jeweiligen Zweck erforderlich. Im Übrigen geben wir Daten nicht an Dritte weiter, es sei denn, wir sind gesetzlich dazu verpflichtet.

10. Ihre Rechte
Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie auf Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3). Zur Ausübung Ihrer Rechte genügt eine Nachricht an die Kontaktdaten in Ziffer 1. Außerdem haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zuständig für uns ist: [[supervisoryAuthority]].

11. WIDERSPRUCHSRECHT (Art. 21 DSGVO)   [render as a visually separate, highlighted box]
Soweit wir Ihre Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, haben Sie das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit Widerspruch gegen diese Verarbeitung einzulegen. Wir verarbeiten die Daten dann nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.

12. Keine automatisierte Entscheidungsfindung
Eine ausschließlich automatisierte Entscheidungsfindung einschließlich Profiling im Sinne von Art. 22 DSGVO findet nicht statt.

13. Änderungen dieser Erklärung
Wir passen diese Datenschutzerklärung an, wenn sich unsere Datenverarbeitung oder die Rechtslage ändert. Es gilt die jeweils hier veröffentlichte Fassung. Stand: [[lastUpdated]].

### EN (convenience translation)
This English translation is provided for convenience only. The German version is legally binding.

Privacy Policy — Last updated: [[lastUpdated]]

1. Controller and contact
The controller responsible for processing personal data on this website under the General Data Protection Regulation (GDPR) is: [[name]], [[street]], [[zip]] [[city]], Germany. E-mail: [[email]], phone: [[phone]].

2. Overview
We process personal data only as far as necessary to provide this website, to handle your inquiries and to ensure security. Below we inform you under Art. 13 GDPR which data we process, for what purpose and on which legal basis.

3. Hosting and server log files (Netlify)
This website is hosted by Netlify, Inc., [[address per Netlify privacy policy]], USA ("Netlify"). When you access the website, Netlify processes technically necessary data on our behalf, in particular: IP address, date and time of the request, requested page or file, amount of data transferred, HTTP status code, referrer URL, and browser and operating-system information (server log files).
Purpose: delivering the website, ensuring stability and security, defending against attacks. Legal basis: Art. 6(1)(f) GDPR (legitimate interest in a secure and functional website). Retention: [[logRetention — verify with Netlify]].
We have [[a data processing agreement under Art. 28 GDPR with Netlify — confirm]]. Because Netlify is based in the USA, personal data may be transferred to the USA. The basis for this is [[adequacy decision (EU-US Data Privacy Framework) if Netlify, Inc. is certified — verify at dataprivacyframework.gov — OR standard contractual clauses under Art. 46(2)(c) GDPR]]. You can obtain a copy of the safeguards on request via the contact details in section 1.

4. Contact by e-mail or phone
If you contact us by e-mail or phone, we process your details (e.g. name, e-mail address, phone number, content of the inquiry) to handle your request. Legal basis: Art. 6(1)(b) GDPR where the inquiry relates to a contract or pre-contractual measures, otherwise Art. 6(1)(f) GDPR (legitimate interest in effectively handling inquiries). We delete the data once it is no longer needed for its purpose and no statutory retention obligations (e.g. commercial and tax law) apply. Our mailbox is operated by [[emailProvider]], which acts as our processor. [[confirm DPA and any third-country transfer of this provider]]

5. Contact form (Web3Forms)
Our contact page offers a form. The data you enter is processed: name, e-mail address, [[selected service, if any]] and your message [[verify which technical metadata Web3Forms also processes, e.g. IP address, and add it here]].
To transmit the form we use the form service Web3Forms ([[operator and address per Web3Forms privacy policy]]). When you submit the form, the data is sent to Web3Forms and forwarded by e-mail to us. [[Verify server location, data processing agreement and legal basis for third-country transfer per Web3Forms and enter them here — this section is incomplete without them.]]
Purpose: handling your inquiry. Legal basis: Art. 6(1)(b) GDPR or Art. 6(1)(f) GDPR; where you ticked the privacy-policy checkbox, additionally Art. 6(1)(a) GDPR. You may withdraw any consent at any time with effect for the future (contact: see section 1). Name, e-mail address and message are required so that we can answer your inquiry; without them we cannot process it. Retention: see section 4.

6. Local storage in your browser
We do not set cookies for analytics or marketing. In your browser's local storage we store only:
– "tmx-locale": your selected language (German/English), only if you actively choose a language.
– "tmx-cookie-consent": your choice in the consent banner including the time, so the prompt does not reappear at every visit.
This storage is strictly necessary to provide a function you explicitly requested or to apply your choice, and therefore requires no consent under § 25(2) No. 2 TDDDG. Where personal data is processed in the process, the legal basis is Art. 6(1)(f) GDPR. The data stays in your browser until you delete it; it is not transmitted to us or to third parties. You can change your choice at any time via "Cookie settings" in the footer.

7. No analytics, marketing or tracking services, no third-party content
We currently use no analytics, tracking or marketing services and embed no content from third-party servers (e.g. fonts, maps, videos). Fonts are served locally from our own server. Should we use such services in the future, we will obtain your consent beforehand via the consent banner and update this policy.

8. Links to external services
[[ONLY IF hasSocialProfiles]] This website contains links to our profiles on [[LinkedIn / Instagram — only profiles that exist]]. No plug-ins are embedded; you only leave our website by clicking. The respective provider is responsible for data processing there.

9. Recipients
Recipients of your data are exclusively the service providers named above (Netlify, Web3Forms, [[emailProvider]]) as far as necessary for the respective purpose. We do not otherwise disclose data to third parties unless legally obliged.

10. Your rights
You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to withdraw consent with effect for the future (Art. 7(3)). To exercise your rights, a message to the contact details in section 1 is sufficient. You also have the right to lodge a complaint with a data-protection supervisory authority (Art. 77 GDPR). The authority responsible for us is: [[supervisoryAuthority]].

11. RIGHT TO OBJECT (Art. 21 GDPR)   [render as a visually separate, highlighted box]
Where we process your data on the basis of Art. 6(1)(f) GDPR, you have the right to object at any time, on grounds relating to your particular situation, to this processing. We will then no longer process the data unless we demonstrate compelling legitimate grounds that override your interests, rights and freedoms, or the processing serves the establishment, exercise or defence of legal claims.

12. No automated decision-making
No decision based solely on automated processing, including profiling, within the meaning of Art. 22 GDPR takes place.

13. Changes to this policy
We update this privacy policy when our data processing or the legal situation changes. The version published here applies. Last updated: [[lastUpdated]].

---

## D. KONTAKT PAGE (/kontakt)

### DE
Title: Kontakt
Intro: Erzählen Sie uns von Ihrem Vorhaben – wir melden uns bei Ihnen.
Direct contact block labels: E-Mail · Telefon · Anschrift (values from config)
Note: Pflichtfelder sind mit * gekennzeichnet.
Fields: Name * · E-Mail-Adresse * · Gewünschte Leistung (optional; default option "Bitte wählen", last option "Allgemeine Anfrage"; other options generated from the services data) · Nachricht *
Checkbox (required, unchecked by default): Ich habe die Datenschutzerklärung gelesen und stimme zu   (link text "Datenschutzerklärung" → /datenschutz)
Hint under button: Ihre Angaben werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet. Mehr dazu in der Datenschutzerklärung.
Button: Nachricht senden · while sending: Wird gesendet …
Success: Vielen Dank! Ihre Nachricht wurde gesendet.
Error: Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut oder schreiben Sie uns direkt an [[email]].
Validation: Bitte füllen Sie dieses Pflichtfeld aus. · Bitte geben Sie eine gültige E-Mail-Adresse ein. · Bitte bestätigen Sie die Datenschutzerklärung.

### EN
Title: Contact
Intro: Tell us about your project – we will get back to you.
Direct contact block labels: E-mail · Phone · Address
Note: Required fields are marked with *.
Fields: Name * · E-mail address * · Service of interest (optional; default "Please select", last option "General inquiry") · Message *
Checkbox: I have read the privacy policy and agree
Hint under button: Your details are used solely to process your inquiry. More in the privacy policy.
Button: Send message · while sending: Sending …
Success: Thank you! Your message has been sent.
Error: Your message could not be sent. Please try again later or write to us directly at [[email]].
Validation: Please fill in this required field. · Please enter a valid e-mail address. · Please confirm the privacy policy.

Technical notes: use the Web3Forms honeypot field (per Web3Forms docs) against spam; no
extra tracking fields; submit over HTTPS only; do not log form content in the console.

---

## E. VERIFY BEFORE LAUNCH (owner + lawyer)
1. Fill every `[[...]]` in company.ts; run `npm run check:legal` (must report 0).
2. Netlify: confirm the DPA (AVV) is accepted in your account, confirm data-transfer basis
   (DPF certification of Netlify, Inc. on dataprivacyframework.gov, or SCCs), log retention,
   registered address for section 3.
3. Web3Forms: confirm operator/address, server location, DPA, transfer basis, which
   metadata is stored. If the answers are unsatisfactory, consider replacing it (e.g. a
   form service hosted in the EU, or Netlify Forms so that fewer providers are involved).
4. E-mail provider: confirm DPA and transfer basis.
5. Decision for the lawyer: wording of the form checkbox ("gelesen und stimme zu") together
   with the legal bases named in section 5 (some practitioners prefer a pure
   acknowledgement wording and Art. 6(1)(b)/(f) only).
6. Decide showConsumerDispute (only if consumers are addressed; statement must be true).
7. Network audit: confirm the live site makes ZERO requests to third-party domains on
   page load (only Web3Forms on submit), otherwise section 7 would be untrue.
8. Do not publish invented company facts anywhere (statistics, references, awards).
