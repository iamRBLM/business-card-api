/**
 * Initial mock users for seeding the database (includes an admin user, a business user, and a regular user).
 */
export const InitialUsers = [
  {
    name: {
      first: "Daniel",
      middle: "",
      last: "Levi",
    },
    address: {
      street: "Rothschild Blvd",
      city: "Tel Aviv",
      country: "Israel",
      state: "Central",
      houseNumber: 45,
      zip: 6578401,
    },
    image: {
      alt: "user-profile",
      url: "https://picsum.photos/200/300",
    },
    phone: "0501234567",
    email: "dan@lev.co",
    isBusiness: true,
    password: "Aa123456!",
    isAdmin: true,
  },
  {
    name: {
      first: "Maya",
      middle: "",
      last: "Cohen",
    },
    address: {
      street: "Jaffa St",
      city: "Jerusalem",
      country: "Israel",
      state: "Jerusalem",
      houseNumber: 12,
      zip: 9422105,
    },
    image: {
      alt: "user-profile",
      url: "https://picsum.photos/200/300",
    },
    phone: "0529876543",
    email: "may@coh.co",
    isBusiness: true,
    password: "Aa123456!",
    isAdmin: false,
  },
  {
    name: {
      first: "Yoni",
      middle: "",
      last: "Barak",
    },
    address: {
      street: "HaNassi Blvd",
      city: "Haifa",
      country: "Israel",
      state: "North",
      houseNumber: 88,
      zip: 3464201,
    },
    image: {
      alt: "user-profile",
      url: "https://picsum.photos/200/300",
    },
    phone: "0545554321",
    email: "yon@bar.co",
    isBusiness: false,
    password: "Aa123456!",
    isAdmin: false,
  },
];
