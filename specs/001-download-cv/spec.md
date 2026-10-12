# Spec: Download CV in English or Spanish

## Problem / Why

The home page offers a single résumé download, in one language only. Martin
applies to companies in both Spanish and English, so recruiters and hiring
managers should be able to get the CV in the language of the application,
straight from the home page, without contacting him first. The current download
also points to a CV that is no longer published, so it does not work at all.

## Users & scenarios

- **English-speaking recruiter** opens the portfolio and clicks the main
  download action → gets the English CV right away.
- **Spanish-speaking recruiter** opens the language options and chooses
  "Español" → gets the Spanish CV.
- **Keyboard / screen-reader user** reaches the download control with the
  keyboard, opens the language options, moves between them and picks one,
  without a mouse.
- **Visitor on a broken connection or with a missing file** tries to download →
  is told it failed and given another way to get the CV.

## Requirements

- REQ-001: WHEN the home page is displayed, THE SYSTEM SHALL show a single
  download control, labeled "Download CV", made of a main action and an
  adjacent language-options toggle.
  - AC1: The home page shows exactly one CV download control, in the same place
    as the current résumé action (next to "View Projects").
  - AC2: The main action is labeled "Download CV".
  - AC3: The toggle is visually attached to the main action and has an
    accessible name that says it chooses the CV language.

- REQ-002: WHEN the visitor activates the main action, THE SYSTEM SHALL download
  the English CV.
  - AC1: Activating the main action delivers the English CV.
  - AC2: The language menu does not need to be opened to get the English CV.

- REQ-003: WHEN the visitor activates the language toggle, THE SYSTEM SHALL show
  a menu with the options "English" and "Español".
  - AC1: The menu contains exactly two options, "English" and "Español", in that
    order.
  - AC2: The menu is hidden until the toggle is activated.
  - AC3: Activating the toggle again closes the menu.

- REQ-004: WHEN the visitor selects a language option, THE SYSTEM SHALL download
  the CV in that language and close the menu.
  - AC1: Choosing "English" delivers the English CV.
  - AC2: Choosing "Español" delivers the Spanish CV.
  - AC3: The menu closes after a choice.

- REQ-005: WHEN a CV is downloaded, THE SYSTEM SHALL have the browser save it as
  a file (not open it in the page) with a name that contains Martin's full name
  and a language tag.
  - AC1: The English CV is saved as `Martin-Moreno-Jara-CV-EN.pdf`.
  - AC2: The Spanish CV is saved as `Martin-Moreno-Jara-CV-ES.pdf`.
  - AC3: The download does not replace the portfolio in the current tab.

- REQ-006: WHEN the language menu is open AND the visitor presses Escape, clicks
  or taps outside the menu, or moves focus out of it, THE SYSTEM SHALL close
  the menu.
  - AC1: Escape closes the menu and puts focus back on the toggle.
  - AC2: A click or tap outside the control closes the menu without starting
    a download.
  - AC3: Tabbing away from the menu closes it.

- REQ-007: WHEN the control is used with the keyboard, THE SYSTEM SHALL let the
  visitor complete any download without a pointer.
  - AC1: The main action and the toggle can each be reached with Tab and
    activated with Enter or Space.
  - AC2: When the menu opens from the keyboard, focus moves to the first option.
  - AC3: Up/Down arrow keys move focus between the options. Enter or Space
    selects the focused option.

- REQ-008: WHEN assistive technology inspects the control, THE SYSTEM SHALL
  expose the toggle as something that opens a menu, along with its current
  expanded or collapsed state, and expose the options as menu items.
  - AC1: The toggle says it opens a menu and reports "expanded" when open and
    "collapsed" when closed.
  - AC2: Each option is exposed as a menu item with its visible name.

- REQ-009: WHEN a CV download cannot be completed (e.g. the file is unavailable
  or the request fails), THE SYSTEM SHALL show the visitor a short, visible
  message saying the download failed and giving Martin's contact email as an
  alternative.
  - AC1: If the requested CV is unavailable, a message appears that names the
    failure and shows the contact email.
  - AC2: The message is announced to assistive technology.
  - AC3: The visitor can dismiss the message, and the rest of the home page
    keeps working.
  - AC4: No message is shown when the download succeeds.

## Non-functional

- **Accessibility:** The control meets WCAG 2.1 AA, including focus visibility,
  contrast, and a 44×44 px minimum touch target for the toggle.
- **Responsiveness:** The control and its menu work and stay fully visible on
  mobile and desktop widths, matching the existing home-page actions.
- **Consistency:** The control looks like the existing secondary action style on
  the home page.
- **Performance:** The CV files are not downloaded until the visitor asks for one.
  The feature does not noticeably slow the home page down.
- **Integrity:** Both CV files must be present when the site is published. A
  missing CV is a release defect, not only a runtime case.

## Out of scope

- Translating the rest of the portfolio into Spanish, or adding a site-wide
  language switch.
- Choosing the default language automatically from the browser or location.
- Remembering the visitor's last chosen language.
- Previewing the CV in the page.
- Download analytics or tracking.
- Languages other than English and Spanish.
- Editing the CV documents themselves.

## Open questions

- None. All clarifications resolved (see Changelog).

## Changelog

- 2026-10-10 — Draft created. Clarifications resolved with Martin:
  Q1 one English and one Spanish CV are the source documents;
  Q2 split-button interaction; Q3 default language is always English;
  Q4 saved file name = name + language tag; Q5 fully accessible menu
  (keyboard, Escape, outside click, screen reader); Q6 always save as file, plus
  a runtime failure message with contact email.
