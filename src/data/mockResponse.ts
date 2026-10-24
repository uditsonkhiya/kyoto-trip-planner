import type { Experience } from "@/components/ExperienceCard";
import type { Food } from "@/components/FoodCard";
import type { Stay } from "@/components/StayCard";

export type ResponseItem =
  | { type: "stay"; data: Stay }
  | { type: "experience"; data: Experience }
  | { type: "food"; data: Food };

// One sample row from each sheet of Kyoto_weekend_workbook.xlsx.
export const mockResponse: ResponseItem[] = [
  {
    type: "stay",
    data: {
      listingTitle: "Kamo Riverside Loft",
      neighbourhood: "Pontocho",
      checkIn: "2025-04-12",
      checkOut: "2025-04-14",
      pricePerNight: 142,
      highlight: "River view balcony",
    },
  },
  {
    type: "experience",
    data: {
      activityName: "Kiyomizu Pottery Class",
      neighbourhood: "Higashiyama",
      date: "2025-04-12",
      durationHours: 2.0,
      pricePerPerson: 55,
      highlight: "Take home your own cup",
    },
  },
  {
    type: "food",
    data: {
      restaurantName: "Arashiyama Tofu House",
      neighbourhood: "Arashiyama",
      mealType: "Lunch",
      priceRange: "$$",
      pricePerPerson: 30,
      highlight: "Yudofu set menu",
    },
  },
];
