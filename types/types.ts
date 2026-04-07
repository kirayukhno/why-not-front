export interface User {
  id: string;
  _id?: string;
  name: string;
  avatarUrl: string;
  articlesCount: number;
}

export interface Region {
  _id: string;
  region: string;
  slug: string;
  level?: string;
  note?: string;
}

export interface LocationType {
  _id: string;
  type: string;
  slug: string;
  shortDescription?: string;
}

export interface Location {
  _id: string;
  name: string;
  description?: string;
  region: Region | string;
  type: LocationType | string;
  image?: string;
  rate?: number;
  locationType?: string;
  locationTypeName?: string;
  regionName?: string;
  images?: string[];
  rating?: number;
}

export interface LocationsResponse {
  items: Location[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Feedback {
  _id: string;
  id?: string;
  rate: number;
  description: string;
  userName: string;
  locationId?: string;
  locationType?: string;
}

export interface FeedbacksResponse {
  page: number;
  perPage: number;
  totalPages: number;
  totalFeedbacks: number;
  feedbacks: Feedback[];
}

