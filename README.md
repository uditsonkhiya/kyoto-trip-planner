# Kyoto Trip Planner

A chat page that answers questions about a Kyoto weekend with stay, experience and food cards.

![The three cards: a stay booking card, an experience ticket and a food menu card](docs/three-cards.png)

Run it locally with `npm install && npm run dev`, then open http://localhost:3000.

## Card fields that use filler

Every text field (name, neighbourhood, dates, price, highlight) comes from a real row in `Kyoto_weekend_workbook.xlsx`. The one filler field is:

- **Photo**, on all three cards (`StayCard`, `ExperienceCard`, `FoodCard`): a placeholder image icon labelled "Photo of … coming soon". The workbook has no photo column yet.
