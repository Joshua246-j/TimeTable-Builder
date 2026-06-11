export type CellId = string;

export interface SelectedCell {
  id: CellId;
  day: string;
  startTime: string;
  endTime: string;
  rowIndex: number;
  subjectId?: string;
}

export interface MergedGroup {
  id: string;
  day: string;
  startPeriodId: string; // matches timeSlot.id or startTime
  endPeriodId: string; // matches timeSlot.id or endTime
  rowStart: number;
  rowEnd: number;
  rowSpan: number;
  subjectId?: string;
  locked: boolean;
}
