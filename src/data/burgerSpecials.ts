type BurgerSpecial = {
  id: string;
  name: string;
  description: string;
  drinkPairing: string;
  side: string;
  ingredients: Ingredient[];
  imageSrc: string;
};

type Ingredient = {
  id: string;
  name: string;
};

const burgerSpecials: BurgerSpecial[] = [
  {
    id: "blue-burger",
    name: "The Blue Burger",
    description:
      "A juicy beef patty topped with crumbled blue cheese, caramelized onions, and arugula, served on a toasted brioche bun.",
    drinkPairing: "Craft IPA or Blueberry Iced Tea",
    side: "Garlic-parmesan fries",
    ingredients: [
      { id: "arugula", name: "Arugula" },
      { id: "beef", name: "Beef" },
      { id: "bun", name: "Bun" },
      { id: "cheese", name: "Cheese" },
      { id: "garlic", name: "Garlic" },
      { id: "onions", name: "Onions" },
      { id: "potatoes", name: "Potatoes" },
    ],
    imageSrc: new URL("@/assets/burgers/blue-burger.png", import.meta.url).href,
  },
  {
    id: "taco-burger-fiesta",
    name: "Taco Burger Fiesta",
    description:
      "A blend of seasoned ground beef and chorizo, topped with pepper jack cheese, avocado, and pico de gallo, served on a ciabatta roll.",
    drinkPairing: "Margarita or Mexican-style lager",
    side: "Spicy sweet potato wedges",
    ingredients: [
      { id: "potatoes", name: "Potatoes" },
      { id: "bun", name: "Bun" },
      { id: "peppers", name: "Peppers" },
      { id: "onions", name: "Onions" },
      { id: "lemon", name: "Lemon" },
      { id: "tomatoes", name: "Tomatoes" },
      { id: "avocado", name: "Avocado" },
      { id: "cheese", name: "Cheese" },
      { id: "chorizo", name: "Chorizo" },
      { id: "beef", name: "Beef" },
    ],
    imageSrc: new URL(
      "@/assets/burgers/taco-burger-fiesta.png",
      import.meta.url
    ).href,
  },
  {
    id: "mushroom-melt",
    name: "The Mushroom Melt",
    description:
      "Grilled portobello mushroom cap topped with Swiss cheese, sautéed mushrooms, and thyme mayo, served on a whole wheat bun. (Vegetarian)",
    drinkPairing: "Chardonnay or Cream Soda",
    side: "Truffle oil and parmesan dusted shoestring fries",
    ingredients: [
      { id: "truffle-oil", name: "Truffle Oil" },
      { id: "potatoes", name: "Potatoes" },
      { id: "bun", name: "Bun" },
      { id: "mayonnaise", name: "Mayonnaise" },
      { id: "cheese", name: "Cheese" },
      { id: "mushrooms", name: "Mushrooms" },
    ],
    imageSrc: new URL("@/assets/burgers/mushroom-melt.png", import.meta.url)
      .href,
  },
  {
    id: "bbq-bacon-bonanza",
    name: "BBQ Bacon Bonanza",
    description:
      "Smoked beef patty, crispy bacon, cheddar cheese, and onion rings, drizzled with BBQ sauce, on a pretzel bun.",
    drinkPairing: "Bourbon-based cocktail or Root Beer",
    side: "Coleslaw and classic fries",
    ingredients: [
      { id: "potatoes", name: "Potatoes" },
      { id: "mayonnaise", name: "Mayonnaise" },
      { id: "carrots", name: "Carrots" },
      { id: "cabbage", name: "Cabbage" },
      { id: "bbq-sauce", name: "BBQ Sauce" },
      { id: "bun", name: "Bun" },
      { id: "onions", name: "Onions" },
      { id: "cheese", name: "Cheese" },
      { id: "beef", name: "Beef" },
      { id: "bacon", name: "Bacon" },
    ],
    imageSrc: new URL("@/assets/burgers/bbq-bacon-bonanza.png", import.meta.url)
      .href,
  },
  {
    id: "frisky-fish-burger",
    name: "The Frisky Fish Burger",
    description:
      "Lightly breaded cod fillet with tartar sauce, pickled cucumbers, and lettuce, on a sesame seed bun.",
    drinkPairing: "Pilsner or Sparkling Lemonade",
    side: "Lemon-herb seasoned potato wedges",
    ingredients: [
      { id: "lemon", name: "Lemon" },
      { id: "potatoes", name: "Potatoes" },
      { id: "bun", name: "Bun" },
      { id: "lettuce", name: "Lettuce" },
      { id: "cucumbers", name: "Cucumbers" },
      { id: "tartar-sauce", name: "Tartar Sauce" },
      { id: "cod", name: "Cod" },
    ],
    imageSrc: new URL(
      "@/assets/burgers/frisky-fish-burger.png",
      import.meta.url
    ).href,
  },
  {
    id: "spicy-sriracha-slam",
    name: "Spicy Sriracha Slam",
    description:
      "Beef patty with sriracha sauce, jalapeños, pepper jack cheese, and crispy onions, on a jalapeño-cheddar bun.",
    drinkPairing: "Dark stout or Spicy Ginger Beer",
    side: "Chili cheese fries",
    ingredients: [
      { id: "chili", name: "Chili" },
      { id: "potatoes", name: "Potatoes" },
      { id: "bun", name: "Bun" },
      { id: "onions", name: "Onions" },
      { id: "cheese", name: "Cheese" },
      { id: "jalapenos", name: "Jalapeños" },
      { id: "sriracha-sauce", name: "Sriracha Sauce" },
      { id: "beef", name: "Beef" },
    ],
    imageSrc: new URL(
      "@/assets/burgers/spicy-sriracha-slam.png",
      import.meta.url
    ).href,
  },
  {
    id: "ultimate-umami-burger",
    name: "The Ultimate Umami Burger",
    description:
      "Beef patty mixed with finely chopped mushrooms, topped with Gruyère cheese, sun-dried tomatoes, and umami ketchup, on a soft potato roll.",
    drinkPairing: "Pinot Noir or Iced Green Tea",
    side: "Rosemary and sea salt roasted baby potatoes",
    ingredients: [
      { id: "rosemary", name: "Rosemary" },
      { id: "potatoes", name: "Potatoes" },
      { id: "bun", name: "Bun" },
      { id: "ketchup", name: "Ketchup" },
      { id: "tomatoes", name: "Tomatoes" },
      { id: "cheese", name: "Cheese" },
      { id: "mushrooms", name: "Mushrooms" },
      { id: "beef", name: "Beef" },
    ],
    imageSrc: new URL(
      "@/assets/burgers/ultimate-umami-burger.png",
      import.meta.url
    ).href,
  },
];

const ingredients: Ingredient[] = [
  { id: "arugula", name: "Arugula" },
  { id: "avocado", name: "Avocado" },
  { id: "bacon", name: "Bacon" },
  { id: "bbq-sauce", name: "BBQ Sauce" },
  { id: "beef", name: "Beef" },
  { id: "bun", name: "Bun" },
  { id: "cabbage", name: "Cabbage" },
  { id: "carrots", name: "Carrots" },
  { id: "cheese", name: "Cheese" },
  { id: "chili", name: "Chili" },
  { id: "chorizo", name: "Chorizo" },
  { id: "cod", name: "Cod" },
  { id: "cucumbers", name: "Cucumbers" },
  { id: "garlic", name: "Garlic" },
  { id: "jalapenos", name: "Jalapeños" },
  { id: "ketchup", name: "Ketchup" },
  { id: "lemon", name: "Lemon" },
  { id: "lettuce", name: "Lettuce" },
  { id: "mayonnaise", name: "Mayonnaise" },
  { id: "mushrooms", name: "Mushrooms" },
  { id: "onions", name: "Onions" },
  { id: "peppers", name: "Peppers" },
  { id: "potatoes", name: "Potatoes" },
  { id: "rosemary", name: "Rosemary" },
  { id: "sriracha-sauce", name: "Sriracha Sauce" },
  { id: "tartar-sauce", name: "Tartar Sauce" },
  { id: "tomatoes", name: "Tomatoes" },
  { id: "truffle-oil", name: "Truffle Oil" },
];

export type { BurgerSpecial, Ingredient };

export { ingredients, burgerSpecials };
