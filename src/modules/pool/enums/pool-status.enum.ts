/**
 * Pool Status Enum
 * Represents the different states a pool can be in during its lifecycle
 */
export enum PoolStatus {
  CREATED = 'Created',
  FUNDING = 'Funding',
  TARGET_REACHED = 'Target Reached',
  SENT_TO_LAB = 'Sent to Lab',
  RESULTS_READY = 'Results Ready',
}
