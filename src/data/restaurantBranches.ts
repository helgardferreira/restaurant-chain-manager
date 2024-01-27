interface RestaurantBranch {
  state: string;
  location: string;
  alias: string;
  id: string;
}
const restaurantBranches: RestaurantBranch[] = [
  {
    state: "Alabama",
    location: "Birmingham",
    alias: "The Magic City Grill",
    id: "the-magic-city-grill",
  },
  {
    state: "Alaska",
    location: "Anchorage",
    alias: "Northern Lights Diner",
    id: "northern-lights-diner",
  },
  {
    state: "Arizona",
    location: "Phoenix",
    alias: "Sun Valley Burger",
    id: "sun-valley-burger",
  },
  {
    state: "Arkansas",
    location: "Little Rock",
    alias: "Rock City Eatery",
    id: "rock-city-eatery",
  },
  {
    state: "California",
    location: "Los Angeles",
    alias: "Hollywood Bites",
    id: "hollywood-bites",
  },
  {
    state: "Colorado",
    location: "Denver",
    alias: "Mile High Burgers",
    id: "mile-high-burgers",
  },
  {
    state: "Connecticut",
    location: "Hartford",
    alias: "Constitution Grill",
    id: "constitution-grill",
  },
  {
    state: "Delaware",
    location: "Dover",
    alias: "First State Feast",
    id: "first-state-feast",
  },
  {
    state: "Florida",
    location: "Miami",
    alias: "Sunshine Grill",
    id: "sunshine-grill",
  },
  {
    state: "Georgia",
    location: "Atlanta",
    alias: "Peachtree Burgers",
    id: "peachtree-burgers",
  },
  {
    state: "Hawaii",
    location: "Honolulu",
    alias: "Aloha Burgers",
    id: "aloha-burgers",
  },
  {
    state: "Idaho",
    location: "Boise",
    alias: "Gem State Grill",
    id: "gem-state-grill",
  },
  {
    state: "Illinois",
    location: "Chicago",
    alias: "Windy City Eats",
    id: "windy-city-eats",
  },
  {
    state: "Indiana",
    location: "Indianapolis",
    alias: "Crossroads Kitchen",
    id: "crossroads-kitchen",
  },
  {
    state: "Iowa",
    location: "Des Moines",
    alias: "Hawkeye Haven",
    id: "hawkeye-haven",
  },
  {
    state: "Kansas",
    location: "Topeka",
    alias: "Sunflower Grill",
    id: "sunflower-grill",
  },
  {
    state: "Kentucky",
    location: "Frankfort",
    alias: "Bluegrass Bistro",
    id: "bluegrass-bistro",
  },
  {
    state: "Louisiana",
    location: "Baton Rouge",
    alias: "Bayou Burgers",
    id: "bayou-burgers",
  },
  {
    state: "Maine",
    location: "Augusta",
    alias: "Pine Tree Grill",
    id: "pine-tree-grill",
  },
  {
    state: "Maryland",
    location: "Annapolis",
    alias: "Old Line Diner",
    id: "old-line-diner",
  },
  {
    state: "Massachusetts",
    location: "Boston",
    alias: "Bay State Burgers",
    id: "bay-state-burgers",
  },
  {
    state: "Michigan",
    location: "Lansing",
    alias: "Great Lakes Grill",
    id: "great-lakes-grill",
  },
  {
    state: "Minnesota",
    location: "Saint Paul",
    alias: "North Star Burgers",
    id: "north-star-burgers",
  },
  {
    state: "Mississippi",
    location: "Jackson",
    alias: "Magnolia Meals",
    id: "magnolia-meals",
  },
  {
    state: "Missouri",
    location: "Jefferson City",
    alias: "Show Me Burgers",
    id: "show-me-burgers",
  },
  {
    state: "Montana",
    location: "Helena",
    alias: "Big Sky Bites",
    id: "big-sky-bites",
  },
  {
    state: "Nebraska",
    location: "Lincoln",
    alias: "Cornhusker Kitchen",
    id: "cornhusker-kitchen",
  },
  {
    state: "Nevada",
    location: "Carson City",
    alias: "Silver State Snacks",
    id: "silver-state-snacks",
  },
  {
    state: "New Hampshire",
    location: "Concord",
    alias: "Granite Grill",
    id: "granite-grill",
  },
  {
    state: "New Jersey",
    location: "Trenton",
    alias: "Garden State Grub",
    id: "garden-state-grub",
  },
  {
    state: "New Mexico",
    location: "Santa Fe",
    alias: "Enchantment Eats",
    id: "enchantment-eats",
  },
  {
    state: "New York",
    location: "New York City",
    alias: "Big Apple Burgers",
    id: "big-apple-burgers",
  },
  {
    state: "North Carolina",
    location: "Raleigh",
    alias: "Tar Heel Tastes",
    id: "tar-heel-tastes",
  },
  {
    state: "North Dakota",
    location: "Bismarck",
    alias: "Flickertail Flavors",
    id: "flickertail-flavors",
  },
  {
    state: "Ohio",
    location: "Columbus",
    alias: "Buckeye Bistro",
    id: "buckeye-bistro",
  },
  {
    state: "Oklahoma",
    location: "Oklahoma City",
    alias: "Sooner Sizzlers",
    id: "sooner-sizzlers",
  },
  {
    state: "Oregon",
    location: "Salem",
    alias: "Beaver State Burgers",
    id: "beaver-state-burgers",
  },
  {
    state: "Pennsylvania",
    location: "Harrisburg",
    alias: "Keystone Kitchen",
    id: "keystone-kitchen",
  },
  {
    state: "Rhode Island",
    location: "Providence",
    alias: "Ocean State Grill",
    id: "ocean-state-grill",
  },
  {
    state: "South Carolina",
    location: "Columbia",
    alias: "Palmetto Patties",
    id: "palmetto-patties",
  },
  {
    state: "South Dakota",
    location: "Pierre",
    alias: "Rushmore Burgers",
    id: "rushmore-burgers",
  },
  {
    state: "Tennessee",
    location: "Nashville",
    alias: "Volunteer Vittles",
    id: "volunteer-vittles",
  },
  {
    state: "Texas",
    location: "Austin",
    alias: "Lone Star Grill",
    id: "lone-star-grill",
  },
  {
    state: "Utah",
    location: "Salt Lake City",
    alias: "Beehive Burgers",
    id: "beehive-burgers",
  },
  {
    state: "Vermont",
    location: "Montpelier",
    alias: "Green Mountain Grill",
    id: "green-mountain-grill",
  },
  {
    state: "Virginia",
    location: "Richmond",
    alias: "Old Dominion Diner",
    id: "old-dominion-diner",
  },
  {
    state: "Washington",
    location: "Olympia",
    alias: "Evergreen Eatery",
    id: "evergreen-eatery",
  },
  {
    state: "West Virginia",
    location: "Charleston",
    alias: "Mountain State Munch",
    id: "mountain-state-munch",
  },
  {
    state: "Wisconsin",
    location: "Madison",
    alias: "Dairyland Delights",
    id: "dairyland-delights",
  },
  {
    state: "Wyoming",
    location: "Cheyenne",
    alias: "Cowboy Kitchen",
    id: "cowboy-kitchen",
  },
];

export type { RestaurantBranch };

export { restaurantBranches };
