export const errorCodes = [
  {
    code: 1,
    reason: 'Cant delete',
    message: 'Please unselect yourself to proceed.',
  },
  {
    code: 2,
    reason: 'Cant delete',
    message: 'Please unselect primary contact to proceed.',
  },
  {
    code: 3,
    reason: 'Category is missing.',
    message: 'Some files are missing attachment categories. Please update them.',
  },
  {
    code: 4,
    reason: 'File size limit exceeded.',
    message: 'File size limit exceeded. Please upload a file less than 10 MB.',
  },
  {
    code: 5,
    reason: 'Invalid file format.',
    message: 'Invalid file format please select a valid file.',
  },
  {
    code: 6,
    reason: 'File is being uploaded',
    message: 'Please wait until the files are uploaded.',
  },
  {
    code: 7,
    reason: 'Limit has been exceeded',
    message: 'The SKU splitting value should be greater than 1 and less than the total quality.',
  },
  {
    code: 10,
    reason: 'Mismatch split quantity',
    message: 'Mismatch in the split quantity.',
  },
  {
    code: 11,
    reason: 'Pallet ID exists.',
    message: 'Pallet ID exists.',
  },
  {
    code: 12,
    reason: 'Box ID exists.',
    message: 'Box ID exists.',
  },
  {
    code: 13,
    reason: 'Location need to create pallet',
    message: 'Please select a location to create a new pallet.',
  },
  {
    code: 14,
    reason: 'Pallet need to create box',
    message: 'Please select a pallet to create a new box.',
  },
  {
    code: 15,
    reason: 'Requirements are missing',
    message: 'Please fill all the mandatory fields.',
  },
  {
    code: 16,
    reason: 'Limit exceeded',
    message:
      'Limit exceeded. Please enter Pallet ID with  with minimum 1 character and maximum 30 character.',
  },
  {
    code: 17,
    reason: 'Limit exceeded',
    message:
      'Limit exceeded. Please enter Box ID with  with minimum 1 character and maximum 30 character.',
  },
  {
    code: 18,
    reason: 'Limit has been exceeded',
    message:
      'The SKU splitting value should be greater than 1 or less than/equal to available quantity.',
  },
  {
    code: 19,
    reason: 'Cant cancel',
    message:
      'The shipment is either picked up or in transit, please contact shipment provider to cancel the shipping.',
  },
  {
    code: 20,
    reason: 'Cant cancel',
    message: 'Packed quantity should be greater than zero.',
  },
  {
    code: 21,
    reason: 'Default box mandatory',
    message: 'Please select default box to continue.',
  },
  {
    code: 22,
    reason: 'Package label template mandatory',
    message: 'Please select Package label template to continue.',
  },
  {
    code: 23,
    reason: 'When different box is selected for items with same box #',
    message: 'Please select same Box Type for items with same Box #',
  },
  {
    code: 24,
    reason: 'All QTY for item has been scanned, and the user scans again',
    message: 'Duplicate item found',
  },
  {
    code: 25,
    reason: 'Warehouse associate scans the UPC in the picked item and selects the box',
    message: 'Item scanned is invalid',
  },
  {
    code: 26,
    reason: 'The same sku cannot be added multiple times.',
    message: 'The same sku cannot be added multiple times.',
  },
  {
    code: 27,
    reason: 'Outbound quantity cannot be greater than the Available quantity.',
    message: 'Outbound quantity cannot be greater than the Available quantity.',
  },
  {
    code: 28,
    reason: 'Available quantity must be greater than 0.',
    message: 'Available quantity must be greater than 0.',
  },
  {
    code: 29,
    reason: 'Limit has been exceeded in Packing',
    message: 'The SKU splitting value should be greater than 1 or less than/equal to order qty.',
  },
  {
    code: 30,
    reason: 'Default box Type mandatory',
    message: 'Please select Box Type to continue.',
  },
  {
    code: 31,
    reason: 'Default box# mandatory',
    message: 'Please select Box# to continue.',
  },
  {
    code: 32,
    reason: 'URL Updated: Status change has been detected in the order',
    message: 'URL Updated: Status change has been detected in the order',
  },
  {
    code: 33,
    reason: 'Location mandatory',
    message: 'Please select location to continue.',
  },
  {
    code: 34,
    reason: 'Pallet ID mandatory',
    message: 'Please select Pallet ID to continue.',
  },
];
