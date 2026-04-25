/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DegreeLevel = 'BS' | 'MPhil' | 'MS' | 'PhD';
export type ClassMode = 'Regular' | 'Online';
export type ClassSchedule = 'Weekdays' | 'Weekend' | 'DistanceLearning';

export interface University {
  id: string;
  name: string;
  nameUrdu: string;
  location: string;
  locationUrdu: string;
  description: string;
}

export interface Program {
  id: string;
  universityId: string;
  name: string;
  level: DegreeLevel;
  feePerSemester: number;
  eligibilityCriteria: string;
  minPercentage: number;
  classMode: ClassMode;
  classSchedule: ClassSchedule;
  description: string;
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: any;
}
