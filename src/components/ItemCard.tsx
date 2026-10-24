import type { ResponseItem } from "@/data/mockResponse";
import ExperienceCard from "./ExperienceCard";
import FoodCard from "./FoodCard";
import StayCard from "./StayCard";

export default function ItemCard({ item }: { item: ResponseItem }) {
  switch (item.type) {
    case "stay":
      return <StayCard stay={item.data} />;
    case "experience":
      return <ExperienceCard experience={item.data} />;
    case "food":
      return <FoodCard food={item.data} />;
  }
}
