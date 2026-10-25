# UX Research requirements: Kyoto trip planner chat

> Draft written by the prototype owner from the session brief. The original UX Research note was not available. Replace this file if it turns up.

## Why we're testing
In earlier sessions, most guests quit the search filter panel before they reached a listing. This session tests whether a trip planner chat is a better way in.

## Session
- When: Thursday
- Who: the researcher runs it with 8 test guests
- Devices: guests may use a phone or a laptop

## Who gets the link
- The researcher, to share with test guests during the session
- The product team and leadership, to try it before and after the session

## Link
- One public Vercel link: https://kyoto-trip-planner.vercel.app
- Opens with no login, on phone and laptop

## What guests type
- Happy path: any Kyoto trip question, e.g. "cheapest trip in kyoto". The guest sees the thinking dots, then the stay, Experience and food cards.
- Failure path: type "best places in USA". The guest sees the error bubble ("We couldn't put your plan together just now.") with one Try again button. Tapping it shows the dots, then the three cards.

## Must be true before the session
- The guest's own message stays visible the whole time
- A sample-data note is visible before the guest types: nothing is a real listing or booking
- The error stays inside the assistant bubble: no red, no error codes, no alerts or separate pages
- Try again never shows the broken reply again
- Every item on the README pass checklist is ticked on both phone and laptop, with a screenshot as proof
