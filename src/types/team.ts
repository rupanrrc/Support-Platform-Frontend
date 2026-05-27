export interface Team {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  managerId?: string | null;
  members?: string[];
  isDefault?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
