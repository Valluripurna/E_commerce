import {OrderStatus} from '../types/order';

export const ORDER_STATUS_STEPS: {key: OrderStatus; label: string}[] = [
  {key: 'pending', label: 'Pending'},
  {key: 'processing', label: 'Processing'},
  {key: 'shipped', label: 'Shipped'},
  {key: 'delivered', label: 'Delivered'},
];

export function getStatusProgress(status: OrderStatus): number {
  const index = ORDER_STATUS_STEPS.findIndex(step => step.key === status);
  if (status === 'cancelled') {
    return 0;
  }
  if (index === -1) {
    return 0;
  }
  return ((index + 1) / ORDER_STATUS_STEPS.length) * 100;
}

export function isStepComplete(step: OrderStatus, current: OrderStatus): boolean {
  if (current === 'cancelled') {
    return false;
  }
  const stepIndex = ORDER_STATUS_STEPS.findIndex(s => s.key === step);
  const currentIndex = ORDER_STATUS_STEPS.findIndex(s => s.key === current);
  return currentIndex >= stepIndex;
}
