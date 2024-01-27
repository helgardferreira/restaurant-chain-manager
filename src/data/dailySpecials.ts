interface DailySpecial {
  id: string;
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  name: string;
  description: string;
  drinkPairing: string;
  side: string;
  ingredients: Ingredients;
  imageSrc: string;
}

interface Ingredients {
  burger: string[];
  side: string[];
}

const dailySpecials: DailySpecial[] = [
  {
    id: "blue-monday-burger",
    day: "Monday",
    name: "The Blue Monday Burger",
    description:
      "A juicy beef patty topped with crumbled blue cheese, caramelized onions, and arugula, served on a toasted brioche bun.",
    drinkPairing: "Craft IPA or Blueberry Iced Tea",
    side: "Garlic-parmesan fries",
    ingredients: {
      burger: ["beef", "cheese", "onions", "arugula", "bun"],
      side: ["potatoes", "garlic", "cheese"],
    },
    imageSrc: new URL(
      "@/assets/burgers/blue-monday-burger.png",
      import.meta.url
    ).href,
  },
  {
    id: "taco-burger-fiesta",
    day: "Tuesday",
    name: "Taco Burger Fiesta",
    description:
      "A blend of seasoned ground beef and chorizo, topped with pepper jack cheese, avocado, and pico de gallo, served on a ciabatta roll.",
    drinkPairing: "Margarita or Mexican-style lager",
    side: "Spicy sweet potato wedges",
    ingredients: {
      burger: [
        "beef",
        "chorizo",
        "cheese",
        "avocado",
        "tomatoes",
        "lemon",
        "onions",
        "peppers",
        "bun",
      ],
      side: ["potatoes"],
    },
    imageSrc: new URL(
      "@/assets/burgers/taco-burger-fiesta.png",
      import.meta.url
    ).href,
  },
  {
    id: "midweek-mushroom-melt",
    day: "Wednesday",
    name: "The Midweek Mushroom Melt",
    description:
      "Grilled portobello mushroom cap topped with Swiss cheese, sautéed mushrooms, and thyme mayo, served on a whole wheat bun. (Vegetarian)",
    drinkPairing: "Chardonnay or Cream Soda",
    side: "Truffle oil and parmesan dusted shoestring fries",
    ingredients: {
      burger: ["mushrooms", "cheese", "mayonnaise", "bun"],
      side: ["potatoes", "truffle oil", "cheese"],
    },
    imageSrc: new URL(
      "@/assets/burgers/midweek-mushroom-melt.png",
      import.meta.url
    ).href,
  },
  {
    id: "bbq-bacon-bonanza",
    day: "Thursday",
    name: "BBQ Bacon Bonanza",
    description:
      "Smoked beef patty, crispy bacon, cheddar cheese, and onion rings, drizzled with BBQ sauce, on a pretzel bun.",
    drinkPairing: "Bourbon-based cocktail or Root Beer",
    side: "Coleslaw and classic fries",
    ingredients: {
      burger: ["beef", "bacon", "cheese", "onions", "bun", "BBQ sauce"],
      side: ["cabbage", "carrots", "mayonnaise", "potatoes"],
    },
    imageSrc: new URL("@/assets/burgers/bbq-bacon-bonanza.png", import.meta.url)
      .href,
  },
  {
    id: "frisky-fish-burger",
    day: "Friday",
    name: "The Frisky Fish Burger",
    description:
      "Lightly breaded cod fillet with tartar sauce, pickled cucumbers, and lettuce, on a sesame seed bun.",
    drinkPairing: "Pilsner or Sparkling Lemonade",
    side: "Lemon-herb seasoned potato wedges",
    ingredients: {
      burger: ["cod", "tartar sauce", "cucumbers", "lettuce", "bun"],
      side: ["potatoes", "lemon", "herbs"],
    },
    imageSrc: new URL(
      "@/assets/burgers/frisky-fish-burger.png",
      import.meta.url
    ).href,
  },
  {
    id: "spicy-sriracha-slam",
    day: "Saturday",
    name: "Spicy Sriracha Slam",
    description:
      "Beef patty with sriracha sauce, jalapeños, pepper jack cheese, and crispy onions, on a jalapeño-cheddar bun.",
    drinkPairing: "Dark stout or Spicy Ginger Beer",
    side: "Chili cheese fries",
    ingredients: {
      burger: [
        "beef",
        "sriracha sauce",
        "jalapeños",
        "cheese",
        "onions",
        "bun",
      ],
      side: ["potatoes", "chili", "cheese"],
    },
    imageSrc: new URL(
      "@/assets/burgers/spicy-sriracha-slam.png",
      import.meta.url
    ).href,
  },
  {
    id: "ultimate-umami-burger",
    day: "Sunday",
    name: "The Ultimate Umami Burger",
    description:
      "Beef patty mixed with finely chopped mushrooms, topped with Gruyère cheese, sun-dried tomatoes, and umami ketchup, on a soft potato roll.",
    drinkPairing: "Pinot Noir or Iced Green Tea",
    side: "Rosemary and sea salt roasted baby potatoes",
    ingredients: {
      burger: ["beef", "mushrooms", "cheese", "tomatoes", "ketchup", "bun"],
      side: ["potatoes", "rosemary"],
    },
    imageSrc: new URL(
      "@/assets/burgers/ultimate-umami-burger.png",
      import.meta.url
    ).href,
  },
];

export type { DailySpecial, Ingredients };

export { dailySpecials };
