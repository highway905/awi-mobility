export type TabType = 'order-details' | 'tasks' | 'attachments' | 'transportation' | 
  'shipping' | 'picking' | 'pricing' | 'log' | 'warehouse';

export const tabs = [
  { id: "order-details", label: "Order Details" },
  { id: "tasks", label: "Tasks" },
  { id: "attachments", label: "Attachments" },
  { id: "transportation", label: "Transportation Details" },
  { id: "shipping", label: "Shipping & Tracking" },
  { id: "picking", label: "Picking & Packing" },
  // { id: "pricing", label: "Pricing" },
  { id: "log", label: "Log" },
  { id: "warehouse", label: "Warehouse Action" },
];
