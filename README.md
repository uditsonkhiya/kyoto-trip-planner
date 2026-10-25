# Kyoto Trip Planner

A chat page that answers questions about a Kyoto weekend with stay, experience and food cards.

![The three cards: a stay booking card, an experience ticket and a food menu card](docs/three-cards.png)

Run it locally with `npm install && npm run dev`, then open http://localhost:3000.

## Prototype session pass checklist

Live link: [kyoto-trip-planner.vercel.app](https://kyoto-trip-planner.vercel.app)

Tick each item yes or no during the session.

- [ ] Guest message stays visible throughout
- [ ] Thinking dots show before every reply
- [ ] Three cards appear (stay, Experience, food)
- [ ] Typing `best places in USA` shows the broken mock
- [ ] The error appears inside the assistant bubble with “We couldn’t put your plan together just now.” and “Your request is saved, and you can try again.”
- [ ] Exactly one “Try again” button, inside the bubble
- [ ] No red, no error codes, no alerts, toasts, modals or separate pages
- [ ] All three broken shapes (bad type, missing data, plain string) are rejected by `toResponseItems`
- [ ] Try again removes the failed bubble, shows the dots, then the three cards, and never picks the broken mock
- [ ] `aria-live="polite"`, visible focus ring, 44px tap target, AA contrast, icon hidden from screen readers
- [ ] Works on phone and laptop
- [ ] Public Vercel link opens with no login

## Forced-failure state

To fire the forced failure, type `best places in USA` as the whole message (any case); `src/app/chat.tsx` then sends the broken mock from `src/data/mockResponse.ts`.

- [Error bubble](screenshots/error-bubble.png): the reply that can't become cards, with a Try again button.
- [Cards after retry](screenshots/cards-after-retry.png): Try again re-runs the happy-path mock and shows the stay, experience and food cards.

![The error bubble after typing the forced-failure phrase](screenshots/error-bubble.png)

![The stay, experience and food cards after clicking Try again](screenshots/cards-after-retry.png)

## Card fields that use filler

Every text field (name, neighbourhood, dates, price, highlight) comes from a real row in `Kyoto_weekend_workbook.xlsx`. The one filler field is:

- **Photo**, on all three cards (`StayCard`, `ExperienceCard`, `FoodCard`): a placeholder image icon labelled "Photo of … coming soon". The workbook has no photo column yet.
