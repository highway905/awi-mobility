export const successCodes = [
  { code: 1, message: 'Sign in successful.' },
  { code: 2, message: 'Password updated successfully.' },
  { code: 3, message: 'Activation link sent successfully.' },
  { code: 4, message: 'User has been logged out.' },
  // 200-299 box related codes
  { code: 200, message: 'Box has been added successfully.' },
  { code: 201, message: 'Changes have been saved successfully.' },
  { code: 202, message: 'Box has been deleted successfully.' },
  { code: 203, message: 'Boxes have been deleted successfully.' },
  // user-management related codes
  { code: 204, message: 'New user has been created successfully.' },
  { code: 205, message: 'Changes have been made successfully.' },
  { code: 206, message: 'User has been disabled successfully.' },
  { code: 207, message: 'User has been deleted successfully.' },
  { code: 208, message: 'User has been enabled successfully.' },
  { code: 209, message: 'Invitation mail has been send successfully.' },
  { code: 210, message: 'Reset password mail has been sent successfully.' },
  { code: 211, message: 'Users have been deleted successfully.' },
  // 300-399 user related codes
  { code: 301, message: 'Password updated successfully.' },
  { code: 302, message: 'Account details saved successfully.' },
  // 400-499 customer management related codes
  { code: 400, message: 'New customer has been created successfully.' },
  { code: 405, message: 'Changes have been made successfully.' },
  // 450-499 customer management: contact-details related codes
  { code: 450, message: 'New contact has been created successfully.' },
  { code: 451, message: 'Contact has been updated successfully.' },
  { code: 452, message: 'Contact has been disabled successfully.' },
  { code: 453, message: 'Contact has been enabled successfully.' },
  { code: 454, message: 'Contacts have been deleted successfully.' },
  { code: 455, message: 'Contact has been deleted successfully.' },
  { code: 456, message: 'Contact has been made Primary.' },
  { code: 457, message: 'Resend Activation mail has been send successfully.' },
  { code: 458, message: 'Contact has been made the System User.' },
  // 500-525 sku related codes
  { code: 500, message: 'SKU has been deleted successfully.' },
  { code: 501, message: 'New SKU item added successfully.' },
  { code: 502, message: 'SKU information updated successfully.' },
  { code: 503, message: 'Bundle information updated successfully.' },
  { code: 504, message: 'Non-SKU information updated successfully.' },

  // 600-
  { code: 600, message: 'Customer has been deleted successfully' },
  { code: 601, message: 'Customer has been disabled successfully' },
  { code: 602, message: 'Customer has been enabled successfully' },

  // 700
  { code: 700, message: 'Shopify Store Added successfully' },
  { code: 701, message: 'Store Disconnected' },
  { code: 702, message: 'Shopify Store Connection Successful' },
  { code: 703, message: 'Shopify Store Connection Successful' },
  // 800
  { code: 801, message: 'Attachments have been updated successfully' },
  // 850
  { code: 850, message: 'The shipment service selected successfully' },
  // 900
  { code: 900, message: 'Order has been created successfully.' },
  { code: 901, message: 'Order information updated successfully.' },
  { code: 902, message: 'SKU Split updated successfully.' },
  // 1000
  { code: 1002, message: 'SKU split details deleted successfully.' },
  { code: 1003, message: 'Order status has been successfully changed to Receiving.' },
  // 1100
  { code: 1100, message: 'Location has been deleted successfully.' },
  { code: 1102, message: 'Locations have been deleted successfully.' },
  { code: 1101, message: 'Split/ Move SKU updated successfully.' },

  // 1150-1200 Shipping Preference
  { code: 1150, message: 'New Preference added successfully' },
  { code: 1151, message: 'Shipping Preference updated successfully' },
  { code: 1152, message: 'Shipping Preference deleted successfully' },
  { code: 1153, message: 'Shipping Preference has been deleted successfully.' },
  { code: 1154, message: 'Shipping Preferences has been deleted successfully.' },
  { code: 1155, message: 'Shipping preference has been deleted successfully.' },
  { code: 1156, message: 'Shipping preferences have been deleted successfully.' },
  // packing 1200
  { code: 1200, message: 'Packing details saved successfully.' },
  { code: 1201, message: 'Packing has been canceled successfully.' },
  { code: 1202, message: 'Packing details has been saved successfully.' },
  { code: 1203, message: 'Order status has been successfully changed to Ready to Ship.' },

  // Invoice 1300
  { code: 1300, message: 'B2C Outbound Processing charges added successfully' },
  { code: 1301, message: 'B2C Outbound Processing charges deleted successfully' },
  { code: 1302, message: 'Transportation charges added successfully' },
  { code: 1303, message: 'Transportation charges deleted successfully' },
  { code: 1304, message: 'B2C Outbound Processing charges updated successfully' },
  { code: 1305, message: 'Transportation charges updated successfully' },
];
