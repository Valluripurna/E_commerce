export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type CustomerTabParamList = {
  Home: undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

export type CustomerStackParamList = {
  MainTabs: undefined;
  Checkout: undefined;
  OrderConfirmation: {order: import('../types/order').Order};
  OrderTracking: {
    orderId: number;
    order?: import('../types/order').Order;
  };
  OrderHistory: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Products: undefined;
  Users: undefined;
};

export type AgentTabParamList = {
  Deliveries: undefined;
  Profile: undefined;
};
