export interface Trail {
  createdAt?: Date;
  updatedAt: Date;
  modifier: string;
  modifierAction: string;
  isActive?: boolean | null;
}
