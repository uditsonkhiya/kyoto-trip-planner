# Kyoto Trip Planner

A chat page that answers questions about a Kyoto weekend with stay, experience and food cards.

![The three cards: a stay booking card, an experience ticket and a food menu card](docs/three-cards.png)

Run it locally with `npm install && npm run dev`, then open http://localhost:3000.

## Prototype session pass checklist

Live link: [kyoto-trip-planner.vercel.app](https://kyoto-trip-planner.vercel.app)

Tick each item yes or no during the session.

- [x] Guest message stays visible throughout
- [ ] Thinking dots show before every reply
- [x] Three cards appear (stay, Experience, food)
- [x] Typing `best places in USA` shows the broken mock
- [x] The error appears inside the assistant bubble with “We couldn’t put your plan together just now.” and “Your request is saved, and you can try again.”
- [x] Exactly one “Try again” button, inside the bubble
- [x] No red, no error codes, no alerts, toasts, modals or separate pages
- [x] All three broken shapes (bad type, missing data, plain string) are rejected by `toResponseItems`
- [ ] Try again removes the failed bubble, shows the dots, then the three cards, and never picks the broken mock
- [x] `aria-live="polite"`, visible focus ring, 44px tap target, AA contrast, icon hidden from screen readers (the bubble has no icon)
- [x] Works on phone and laptop
- [x] Public Vercel link opens with no login

## Tested on phone and laptop

Each step was run on the live Vercel link.

| Step | Laptop | Phone |
| --- | --- | --- |
| 1. Happy flow: any message shows the three cards | <img src="screenshots/Happy-flow.png" alt="Laptop: stay, experience and food cards after a normal message" width="420"> | <img src="screenshots/phone-happy-flow.PNG" alt="Phone: stay card after a normal message" width="200"> |
| 2. Error bubble: typing `best places in USA` | <img src="screenshots/error-bubble.png" alt="Laptop: error bubble with a Try again button" width="420"> | <img src="screenshots/phone-error-bubble.png" alt="Phone: error bubble with a Try again button" width="200"> |
| 3. After Try again: the three cards replace the error | <img src="screenshots/after-try_again-flow.png" alt="Laptop: stay, experience and food cards after Try again" width="420"> | <img src="screenshots/phone-after-try_again-flow.PNG" alt="Phone: stay card after Try again" width="200"> |

## Forced-failure state

To fire the forced failure, type `best places in USA` as the whole message (any case); `src/app/chat.tsx` then sends the broken mock from `src/data/mockResponse.ts`.

- [Error bubble](screenshots/error-bubble.png): the reply that can't become cards, with a Try again button.
- [Cards after retry](screenshots/cards-after-retry.png): Try again re-runs the happy-path mock and shows the stay, experience and food cards.

![The error bubble after typing the forced-failure phrase](screenshots/error-bubble.png)

![The stay, experience and food cards after clicking Try again](screenshots/cards-after-retry.png)

## Card fields that use filler

Every text field (name, neighbourhood, dates, price, highlight) comes from a real row in `Kyoto_weekend_workbook.xlsx`. The one filler field is:

- **Photo**, on all three cards (`StayCard`, `ExperienceCard`, `FoodCard`): a placeholder image icon labelled "Photo of … coming soon". The workbook has no photo column yet.
