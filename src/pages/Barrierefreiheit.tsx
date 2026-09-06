import { Link } from 'react-router-dom'
import { pageColors } from '../styles/colors'
import PageTitle from '../components/PageTitle'
import Skizze from '../components/Skizze'
import { useSprache } from '../context/LanguageContext'
import { ui, type Text } from '../texts'

// Der Bericht ueber die Barrierefreiheits-Arbeit an dieser Seite.
//
// Die Texte stehen hier und nicht in texts.ts: sie gehoeren nur zu
// dieser einen Seite, sind lang, und in texts.ts wuerden sie die
// kurzen Beschriftungen zuschuetten, die dort sonst stehen. Bei den
// Projekten in Projects.tsx ist es aus demselben Grund genauso.

const t2 = (de: string, en: string): Text => ({ de, en })

const EINLEITUNG = t2(
  'Ich habe diese Seite auf Barrierefreiheit geprüft und repariert. Der folgende Bericht sagt, was gemessen wurde, was dabei herauskam und was offen geblieben ist. Er ist bewusst nüchtern gehalten, auch dort, wo das Ergebnis unangenehm ist.',
  'I checked this site for accessibility and fixed what I found. This report says what was measured, what came out of it and what is still open. It stays plain, including where the result is uncomfortable.',
)

// Ein Abschnitt des Berichts.
function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="sniglet-bold text-sm text-gray-500 mb-1" style={{ letterSpacing: '0.12em' }}>
        {titel.toUpperCase()}
      </h2>
      <div style={{
        width: '52px',
        height: '3px',
        background: pageColors.projects,
        borderRadius: '2px',
        marginBottom: '1.2rem',
      }} />
      {children}
    </section>
  )
}

// Eine Zeile aus der Messtabelle.
function Messwert({ seite, vorher, nachher }: { seite: string; vorher: string; nachher: string }) {
  return (
    <tr>
      <td className="py-1 pr-6">{seite}</td>
      <td className="py-1 pr-6 text-gray-500" style={{ fontVariantNumeric: 'tabular-nums' }}>{vorher}</td>
      <td className="py-1" style={{ fontVariantNumeric: 'tabular-nums' }}>{nachher}</td>
    </tr>
  )
}

// Ein Stueck Code aus dem Projekt, vorher und nachher.
function Beispiel({ titel, vorher, nachher, erklaerung }: {
  titel: string
  vorher: string
  nachher: string
  erklaerung: string
}) {
  const { t } = useSprache()
  return (
    <div className="box p-4 mb-6" style={{ background: 'white' }}>
      <h3 className="sniglet-bold mb-3">{titel}</h3>

      <p className="text-xs text-gray-500 mb-1">{t(ui.a11yBefore)}</p>
      <pre className="text-xs mb-4" style={{
        overflowX: 'auto',
        background: '#f4f4f4',
        padding: '10px 12px',
        borderRadius: '6px',
      }}><code>{vorher}</code></pre>

      <p className="text-xs text-gray-500 mb-1">{t(ui.a11yAfter)}</p>
      <pre className="text-xs mb-4" style={{
        overflowX: 'auto',
        background: '#f4f4f4',
        padding: '10px 12px',
        borderRadius: '6px',
      }}><code>{nachher}</code></pre>

      <p className="text-sm text-gray-700">{erklaerung}</p>
    </div>
  )
}

function Barrierefreiheit() {
  const { t } = useSprache()

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-16 max-w-3xl mx-auto">
      <PageTitle title={t(ui.a11yTitle)} color={pageColors.projects} skizze="bildschirm" />

      <div className="flex items-start gap-5 mb-12">
        <p className="text-gray-700" style={{ maxWidth: '38rem' }}>{t(EINLEITUNG)}</p>
        <Skizze art="gluehbirne" farbe={pageColors.projects} groesse={64} />
      </div>

      <Abschnitt titel={t(ui.a11yStart)}>
        <p className="text-gray-700 mb-4">
          {t(t2(
            'Gemessen habe ich mit Lighthouse, der Prüfung, die in Chrome eingebaut ist. Sie lief gegen den fertig gebauten Stand, nicht gegen den Entwicklungsserver.',
            'I measured with Lighthouse, the audit built into Chrome. It ran against the built site, not against the development server.',
          ))}
        </p>
        <p className="text-gray-700 mb-4">
          {t(t2(
            'Der Ausgangswert war 95 von 100, auf jeder einzelnen Seite. Das klang nach wenig Arbeit. Es war das Gegenteil: die Projekte-Seite liess sich mit der Tastatur überhaupt nicht bedienen, und die Prüfung hatte davon nichts gemerkt.',
            'The starting score was 95 out of 100, on every single page. That sounded like little work. It was the opposite: the projects page could not be operated with a keyboard at all, and the audit had not noticed.',
          ))}
        </p>
        <p className="text-gray-700">
          {t(t2(
            'Zwei Sachen fand die Prüfung: zu blasse Graustufen und einen Knopf, dessen Name nicht zu seiner Aufschrift passte. Alles andere unten hat erst die Bedienung mit der Tastatur gezeigt.',
            'The audit found two things: greys that were too pale, and a button whose name did not match its visible label. Everything else below only showed up when operating the site by keyboard.',
          ))}
        </p>
      </Abschnitt>

      <Abschnitt titel={t(ui.a11yKeyboard)}>
        <p className="text-gray-700 mb-6">
          {t(t2(
            'Ich habe auf jeder Seite gezählt, was sich mit Tab erreichen lässt, und den Fokus dabei protokolliert. Zwei Befunde standen heraus.',
            'On every page I counted what Tab can reach and logged where the focus went. Two findings stood out.',
          ))}
        </p>

        <Beispiel
          titel={t(t2('Sechs Projekte, null erreichbar', 'Six projects, none reachable'))}
          vorher={`<div
  key={project.id}
  onClick={() => setOpenProject(project)}
  className="cursor-pointer"
>`}
          nachher={`<h2 className="sniglet-bold text-lg mb-2">
  <button
    type="button"
    onClick={() => setOpenProject(project)}
    className="karte-knopf"
  >
    {t(project.name)}
  </button>
</h2>`}
          erklaerung={t(t2(
            'Auf der Projekte-Seite waren zehn Dinge mit Tab erreichbar: die Navigation, die Sprachumschaltung, das Suchfeld, der Filter-Knopf. Kein einziges davon war ein Projekt. Die Karten waren div-Elemente mit onClick, und ein div kann der Browser nicht fokussieren. Wer keine Maus benutzt, kam an den Inhalt der Seite nicht heran. Jetzt sind es siebzehn Ziele, alle sechs Projekte dabei.',
            'On the projects page, ten things were reachable with Tab: the navigation, the language switch, the search field, the filter button. Not one of them was a project. The cards were div elements with onClick, and a browser cannot focus a div. Anyone not using a mouse could not reach the content of the page. It is now seventeen targets, all six projects among them.',
          ))}
        />

        <Beispiel
          titel={t(t2('Im Fenster gefangen', 'Trapped inside the dialog'))}
          vorher={`<div
  onClick={onClose}
  style={{ position: 'fixed', inset: 0, ... }}
>`}
          nachher={`<div
  ref={fenster}
  role="dialog"
  aria-modal="true"
  aria-labelledby="fenster-titel"
>`}
          erklaerung={t(t2(
            'Das Fenster mit den Projektdetails liess sich nur mit der Maus schliessen. Escape tat nichts, und der Fokus blieb hinter dem Fenster: die nächste Tab-Taste wanderte durch die Seite, die gerade verdeckt war. Man bediente etwas, das man nicht sehen konnte. Jetzt schliesst Escape, der Fokus wird im Fenster gehalten und landet danach wieder auf der Karte, von der man gekommen ist.',
            'The project detail dialog could only be closed with the mouse. Escape did nothing, and the focus stayed behind the dialog: the next Tab walked through the page that was currently covered. You were operating something you could not see. Escape now closes it, the focus is held inside the dialog, and afterwards it returns to the card you came from.',
          ))}
        />
      </Abschnitt>

      <Abschnitt titel={t(ui.a11yChanged)}>
        <ul className="mb-6" style={{ listStyle: 'disc', paddingLeft: '1.2rem' }}>
          {[
            t2('Klickbare div-Elemente sind Knöpfe geworden.', 'Clickable div elements became buttons.'),
            t2('Das Projektfenster hat role="dialog", Escape und einen Fokusfang.', 'The project dialog has role="dialog", Escape and a focus trap.'),
            t2('Landmarken ergänzt: vorher gab es nur nav, jetzt header, main, footer, section und article.', 'Landmarks added: there was only nav before, now header, main, footer, section and article.'),
            t2('Abschnittstitel waren fett gesetzte Absätze. Jetzt sind es echte h2 und h3, acht Stück.', 'Section titles were bold paragraphs. They are now real h2 and h3 elements, eight of them.'),
            t2('Ein Sprunglink ganz am Anfang springt zum Inhalt.', 'A skip link at the very start jumps to the content.'),
            t2('Ein eigener Fokusring, drei Pixel statt dem hauchdünnen des Browsers.', 'A focus ring of our own, three pixels instead of the browser hairline.'),
            t2('Jede Seite hat einen eigenen Titel im Tab, in der gewählten Sprache.', 'Every page has its own tab title, in the selected language.'),
            t2('Suchfeld und elf Felder im geschützten Bereich haben eine Beschriftung bekommen.', 'The search field and eleven fields in the protected area got labels.'),
            t2('Kontraste angehoben: 2.6:1 und 2.84:1 lagen unter der Grenze von 4.5:1.', 'Contrasts raised: 2.6:1 and 2.84:1 were below the required 4.5:1.'),
          ].map(satz => (
            <li key={satz.de} className="text-gray-700 mb-1">{t(satz)}</li>
          ))}
        </ul>

        <div className="box p-4" style={{ background: 'white', overflowX: 'auto' }}>
          <table className="text-sm" style={{ minWidth: '18rem' }}>
            <caption className="text-xs text-gray-500 text-left mb-2">
              {t(t2('Lighthouse, Bereich Barrierefreiheit', 'Lighthouse, accessibility category'))}
            </caption>
            <thead>
              <tr className="text-xs text-gray-500">
                <th className="text-left pr-6 pb-1">{t(ui.a11yPage)}</th>
                <th className="text-left pr-6 pb-1">{t(ui.a11yBefore)}</th>
                <th className="text-left pb-1">{t(ui.a11yAfter)}</th>
              </tr>
            </thead>
            <tbody>
              <Messwert seite={t(ui.navHome)} vorher="95" nachher="100" />
              <Messwert seite={t(ui.projectsTitle)} vorher="95" nachher="100" />
              <Messwert seite={t(ui.cvTitle)} vorher="95" nachher="100" />
              <Messwert seite={t(ui.personalTitle)} vorher="95" nachher="100" />
              <Messwert seite={t(ui.contactTitle)} vorher="95" nachher="100" />
              <Messwert seite={t(ui.loginTitle)} vorher="95" nachher="100" />
            </tbody>
          </table>
        </div>
      </Abschnitt>

      <Abschnitt titel={t(ui.a11yOpen)}>
        <p className="text-gray-700 mb-4">
          {t(t2(
            'Vier Sachen sind nicht gelöst. Sie stehen hier, weil ein Bericht ohne diesen Teil nichts wert ist.',
            'Four things are not solved. They are listed here because a report without this part is worth nothing.',
          ))}
        </p>

        {[
          {
            titel: t2('Ich habe keine Vorlesesoftware gehört', 'I did not listen to a screen reader'),
            text: t2(
              'Geprüft habe ich die Struktur: Rollen, Namen, Überschriften, Reihenfolge. Das ist nicht dasselbe wie zuhören. Ob die Seite vorgelesen verständlich ist, weiss ich nicht, und ich möchte nicht so tun als ob. Das wäre der nächste Schritt.',
              'I checked the structure: roles, names, headings, order. That is not the same as listening. Whether the site makes sense when read aloud I do not know, and I do not want to pretend otherwise. That would be the next step.',
            ),
          },
          {
            titel: t2('Gemessen wurde nur der abgemeldete Zustand', 'Only the signed-out state was measured'),
            text: t2(
              'Lighthouse kommt nicht durch die Anmeldung. Die Noten und der geschützte Bereich waren beim Messen also leer. Die 100 sagt über diese Seiten nichts aus. Die Felder dort habe ich von Hand nachgezogen, gemessen sind sie nicht.',
              'Lighthouse cannot get past the login. The grades and the protected area were therefore empty while measuring. The 100 says nothing about those pages. I fixed the fields there by hand, but they are not measured.',
            ),
          },
          {
            titel: t2('Beim Blättern liegen zwei Seiten übereinander', 'While flipping, two pages overlap'),
            text: t2(
              'Die Blätter-Animation hält für eine halbe Sekunde die alte und die neue Seite gleichzeitig im Dokument. Eine Vorlesesoftware sieht in dieser Zeit beide. Das zu lösen hiesse, in die Animation einzugreifen, und dabei würde vermutlich genau das kaputtgehen, was die Seite ausmacht. Ich habe es stehen lassen.',
              'The page-flip animation keeps the old and the new page in the document at the same time for half a second. A screen reader sees both during that time. Solving it would mean interfering with the animation, and that would probably break the very thing that makes the site what it is. I left it.',
            ),
          },
          {
            titel: t2('Text auf den Projektkarten lässt sich nicht mehr markieren', 'Text on project cards can no longer be selected'),
            text: t2(
              'Damit die ganze Karte anklickbar bleibt und der Titel trotzdem eine echte Überschrift ist, liegt eine unsichtbare Fläche über der Karte. Der Preis: man kann den Text darauf nicht mehr mit der Maus markieren. Ein bewusster Tausch, aber ein Verlust.',
              'To keep the whole card clickable while the title stays a real heading, an invisible surface lies over the card. The price: you can no longer select the text on it with the mouse. A deliberate trade, but a loss.',
            ),
          },
        ].map(punkt => (
          <div key={punkt.titel.de} className="mb-5">
            <h3 className="sniglet-bold mb-1">{t(punkt.titel)}</h3>
            <p className="text-gray-700 text-sm">{t(punkt.text)}</p>
          </div>
        ))}
      </Abschnitt>

      <Abschnitt titel={t(ui.a11yLearned)}>
        <p className="text-gray-700">
          {t(t2(
            'Der Messwert ist kein Ziel. 95 von 100 klang nach einer fast fertigen Seite, während sechs von sechs Projekten mit der Tastatur unerreichbar waren. Die Prüfung kann Farben rechnen und Attribute lesen. Ob man an den Inhalt herankommt, muss man selbst ausprobieren, und dafür braucht es nichts weiter als einmal die Maus wegzulegen.',
            'The score is not the goal. 95 out of 100 sounded like an almost finished site, while six out of six projects were unreachable by keyboard. The audit can compute colours and read attributes. Whether you can reach the content is something you have to try yourself, and all it takes is putting the mouse away once.',
          ))}
        </p>
      </Abschnitt>

      <p className="text-sm text-gray-500">
        <Link to="/projects" className="underline hover:text-gray-700">
          {t(ui.a11yBackToProjects)}
        </Link>
      </p>
    </div>
  )
}

export default Barrierefreiheit
