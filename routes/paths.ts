// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
  newPasswordExpired: path(ROOTS_AUTH, '/new-password/expired'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  fileManager: path(ROOTS_DASHBOARD, '/files-manager'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  blank: path(ROOTS_DASHBOARD, '/blank'),
  crossBorderTransload: {
    root: path(ROOTS_DASHBOARD, '/crossBorderTransload'),
    list: path(ROOTS_DASHBOARD, '/crossBorderTransload/list'),
  },
  shippingLabelGeneration: {
    root: path(ROOTS_DASHBOARD, '/shipping-label-generation'),
    list: path(ROOTS_DASHBOARD, '/shipping-label-generation/list'),
    singleUpload: path(ROOTS_DASHBOARD, '/shipping-label-generation/single-upload'),
    batchUpload: path(ROOTS_DASHBOARD, '/shipping-label-generation/batch-upload/'),
  },
  userManagement: {
    root: path(ROOTS_DASHBOARD, '/user-management'),
    list: path(ROOTS_DASHBOARD, '/user-management/list'),
  },
  profile: {
    root: path(ROOTS_DASHBOARD, '/profile'),
    view: path(ROOTS_DASHBOARD, '/profile/view'),
  },
  search: {
    root: path(ROOTS_DASHBOARD, '/search'),
  },
  customerManagement: {
    root: path(ROOTS_DASHBOARD, '/customer-management'),
    list: path(ROOTS_DASHBOARD, '/customer-management/list'),
    addSKU: path(ROOTS_DASHBOARD, '/customer-management/customer-details/add-sku/'),
    details: path(ROOTS_DASHBOARD, '/customer-management/customer-details/'),
    contactDetails: path(ROOTS_DASHBOARD, '/customer-management/customer-details/contact-details/'),
    createBundle: path(ROOTS_DASHBOARD, '/customer-management/customer-details/create-bundle/'),
  },
  orderManagement: {
    root: path(ROOTS_DASHBOARD, '/order-management'),
    list: path(ROOTS_DASHBOARD, '/order-management/list'),
    timeStamp: path(ROOTS_DASHBOARD, '/order-management/time-stamp'),
    create: path(ROOTS_DASHBOARD, '/order-management/create'),
    outbound: path(ROOTS_DASHBOARD, '/order-management/outbound'),
    outboundDetails: path(ROOTS_DASHBOARD, '/order-management/outbound-detail'),
    b2bPacking: path(ROOTS_DASHBOARD, '/order-management/b2b-packing/'),
    b2cPacking: path(ROOTS_DASHBOARD, '/order-management/b2c-packing/'),
    detail: path(ROOTS_DASHBOARD, '/order-management/order-detail'),
    package: path(ROOTS_DASHBOARD, '/order-management/package-label'),
    print: path(ROOTS_DASHBOARD, '/order-management/print-label'),
    task: path(ROOTS_DASHBOARD, '/order-management/task-list'),
    taskDetail: path(ROOTS_DASHBOARD, '/order-management/task-detail'),
    createInboundTransload: path(ROOTS_DASHBOARD, '/order-management/transload/inbound/create'),
    createOutboundTransload: path(ROOTS_DASHBOARD, '/order-management/transload/outbound/create'),
    outboundDetailsTransload: path(ROOTS_DASHBOARD, '/order-management/transload/outbound/detail'),
    inboundDetailsTransload: path(ROOTS_DASHBOARD, '/order-management/transload/inbound/detail'),
    transloadPacking: path(ROOTS_DASHBOARD, '/order-management/transload/outbound/packing/'),
    transloadInboundPackage: path(
      ROOTS_DASHBOARD,
      '/order-management/transload/inbound/package-label'
    ),
    transloadInboundPrint: path(ROOTS_DASHBOARD, '/order-management/transload/inbound/print-label'),
  },
  master: {
    root: path(ROOTS_DASHBOARD, '/master'),
    boxMasterList: path(ROOTS_DASHBOARD, '/master/box-master'),
    locationList: path(ROOTS_DASHBOARD, '/master/location-master'),
    carrierConfiguration: path(ROOTS_DASHBOARD, '/master/carrier-configuration'),
    shippingPreferenceList: path(ROOTS_DASHBOARD, '/master/shipping-preferences'),
    invoiceSettings: path(ROOTS_DASHBOARD, '/master/invoice-settings'),
    duplicateShippingPreference: path(ROOTS_DASHBOARD, '/master/duplicate-shipping-preference'),
  },
  inventoryManagement: {
    root: path(ROOTS_DASHBOARD, '/inventory-management'),
    list: path(ROOTS_DASHBOARD, '/inventory-management/list'),
    detail: path(ROOTS_DASHBOARD, '/inventory-management/inventory-detail'),
    skuTransaction: path(ROOTS_DASHBOARD, '/inventory-management/sku-transaction-history'),
    consolidatedDetail: path(ROOTS_DASHBOARD, '/inventory-management/consolidated-detail'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
  },
  invoiceSettings: {
    root: path(ROOTS_DASHBOARD, '/invoice-settings'),
    list: path(ROOTS_DASHBOARD, '/invoice-settings/list'),
  },
  notification: {
    root: path(ROOTS_DASHBOARD, '/notification'),
    list: path(ROOTS_DASHBOARD, '/notification/list'),
  },
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    file: path(ROOTS_DASHBOARD, '/file'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  multipleOrderUploadAttachments: {
    multipleOrders: path(ROOTS_DASHBOARD, '/multiple-order-upload-attachments'),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title: string) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};
