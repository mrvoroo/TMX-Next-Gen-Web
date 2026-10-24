# KI-Potenzial-Check – Datenschutz & Hinweise (ENTWURF)

> **Status: ENTWURF – nicht veröffentlicht.** Vor der Nutzung des Live-Modus
> von einer Anwältin / einem Anwalt prüfen lassen. Erst danach in die
> Datenschutzerklärung (Keystatic → Legal → Datenschutz) übernehmen und
> `AI_PRIVACY_APPROVED=true` setzen.
>
> *English note for the owner:* This is a **draft** for your lawyer. Nothing
> here is live on the website. Section A describes demo mode (what runs now),
> section B describes live mode (real AI via Mistral AI), which must stay off
> until the lawyer has approved the text and you have signed the provider's
> data processing agreement (DPA / AVV). An English summary is at the end.

---

## A. Demo-Modus (aktueller Stand, `AI_TOOL_MODE=demo`)

**Vorschlag für die Datenschutzerklärung:**

> **KI-Potenzial-Check (Demo)**
> Auf der Seite „KI“ können Sie einen KI-Potenzial-Check nutzen. Im aktuellen
> Demo-Modus wählen Sie Branche, Unternehmensgröße und bis zu fünf Aufgaben aus
> festen Antwortmöglichkeiten aus. Diese Auswahl wird an unseren Server
> übermittelt und dort aus vorformulierten Textbausteinen zu einer
> Beispiel-Einschätzung zusammengesetzt. Es wird kein KI-System eingesetzt,
> es werden keine Freitexte übertragen und die Auswahl wird nicht gespeichert.
> Zum Schutz vor Missbrauch wird Ihre IP-Adresse kurzzeitig (höchstens
> 10 Minuten) im Arbeitsspeicher des Servers verarbeitet, um die Anzahl der
> Anfragen zu begrenzen. Rechtsgrundlage ist unser berechtigtes Interesse an
> einem sicheren Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO).

## B. Live-Modus (später, `AI_TOOL_MODE=live`)

**Voraussetzungen vor dem Einschalten:**

1. Auftragsverarbeitungsvertrag (Art. 28 DSGVO) mit dem KI-Anbieter
   (vorgesehen: Mistral AI SAS, Paris, Frankreich) abschließen.
2. Prüfen: Speicherdauer beim Anbieter, Nutzung der Daten für Training
   (muss ausgeschlossen sein), Serverstandort (EU).
3. Diesen Text anwaltlich prüfen lassen und in die Datenschutzerklärung
   übernehmen.
4. Dauerhafte Rate-Limit-Lösung einrichten (siehe `src/lib/ai-check/rate-limit.ts`).

**Vorschlag für die Datenschutzerklärung:**

> **KI-Potenzial-Check (mit KI)**
> Wenn Sie den KI-Potenzial-Check nutzen, werden Ihre Auswahl (Branche,
> Unternehmensgröße, Aufgaben) und – falls angegeben – Ihr optionaler Freitext
> (maximal 300 Zeichen) an [Mistral AI SAS, Paris, Frankreich – vollständige
> Anschrift aus dem Anbietervertrag übernehmen] übermittelt, um daraus automatisch eine Einschätzung zu erstellen.
> Die Übermittlung erfolgt nur, wenn Sie vorher aktiv zugestimmt haben
> (Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Einwilligung jederzeit mit
> Wirkung für die Zukunft widerrufen, indem Sie den Check nicht weiter nutzen.
> Wir speichern weder Ihre Angaben noch das Ergebnis. Der Anbieter verarbeitet
> die Daten in unserem Auftrag auf Grundlage eines Auftragsverarbeitungsvertrags
> [Speicherdauer beim Anbieter: … – vom Anwalt/Anbieter-Vertrag ergänzen].
> Bitte geben Sie im Freitext keine personenbezogenen Daten, Kundendaten oder
> Geschäftsgeheimnisse ein. Zum Schutz vor Missbrauch wird Ihre IP-Adresse
> kurzzeitig (höchstens 10 Minuten) zur Begrenzung der Anfragen verarbeitet
> (Art. 6 Abs. 1 lit. f DSGVO).

## C. Texte im Tool (Entwürfe, im Code: `src/lib/ai-check/texts.ts`)

| Stelle | Deutsch (Entwurf) |
|---|---|
| Hinweis Demo | Demo-Modus: Die Einschätzung wird aus vorformulierten Bausteinen zusammengestellt. Es wird keine KI genutzt, und Ihre Auswahl wird nicht gespeichert. |
| Hinweis Live (KI-Transparenz, Art. 50 KI-VO) | Hinweis: Die Einschätzung wird von einem KI-System erstellt. Sie kann Fehler enthalten und ersetzt keine persönliche Beratung. |
| Einwilligung Live | Ich bin damit einverstanden, dass meine Angaben zur Erstellung der Einschätzung an einen KI-Anbieter übermittelt und dort verarbeitet werden. Es wird nichts gespeichert. |
| Freitext-Hinweis Live | Bitte keine Namen, Kontaktdaten, Kundendaten oder Geschäftsgeheimnisse eingeben. |
| Kennzeichnung Ergebnis Demo | Beispiel-Einschätzung aus vorformulierten Bausteinen – keine KI-Auswertung |
| Kennzeichnung Ergebnis Live | Von einer KI erstellt – bitte kritisch prüfen |

**Fragen an die Anwältin / den Anwalt:**

- Reicht der Hinweis „Von einer KI erstellt“ für Art. 50 KI-VO, oder soll der
  Anbieter im Tool namentlich genannt werden?
- Soll in der Einwilligung der Anbieter (Mistral AI, Frankreich) direkt
  genannt werden?
- „Es wird nichts gespeichert“ – erst nach Prüfung der Anbieter-Bedingungen
  (Logs, Missbrauchskontrolle) so stehen lassen.

---

## English summary (for the owner)

- **Now (demo):** visitors pick fixed options; our own server builds the
  answer from pre-written text. No AI, no free text, nothing stored. The IP
  address is kept in memory for max. 10 minutes for the rate limit.
- **Later (live):** the choices + an optional 300-character note go to
  Mistral AI (France) **only after the visitor ticks the consent box**. Before
  switching on: sign Mistral's DPA, let the lawyer approve sections B and C,
  add the text to the privacy policy, set up a durable rate limit, then set
  `AI_TOOL_MODE=live`, `AI_PRIVACY_APPROVED=true` and `MISTRAL_API_KEY` and
  redeploy.
