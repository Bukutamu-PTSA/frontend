export interface NavLink {
  label: string;
  to: string;
}

export interface SocialLink {
  platform: string;
  label: string;
  href: string;
  icon: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface RatingOption {
  value: string;
  label: string;
}

export interface CategoryConfig {
  id: number;
  code: string;
  title: string;
}

export interface FormPlaceholders {
  pengaduan: Record<string, string>;
  survei: Record<string, string>;
  login: Record<string, string>;
}

export interface FormLabels {
  pengaduan: Record<string, string>;
  survei: Record<string, string>;
  login: Record<string, string>;
}

export interface ValidationMessages {
  required: string;
  email: string;
  nikLength: string;
  selectOption: string;
  selectOfficer: string;
  completeSurvey: string;
  loginFailed: string;
  submitFailed: string;
}

export interface SuccessMessages {
  login: string;
  surveiSubmitted: string;
  pengaduanDraftSaved: string;
}

export interface ErrorMessages {
  networkError: string;
  serverError: string;
  unauthorized: string;
  forbidden: string;
}

export interface PageTitles {
  home: string;
  pengaduan: string;
  survei: string;
  login: string;
  adminDashboard: string;
  adminCategories: string;
  adminSurvei: string;
  adminPengaduan: string;
  adminGrafik: string;
  adminWilayah: string;
  adminFAQ: string;
  adminSettings: string;
}

export interface PageDescriptions {
  home: string;
  pengaduan: string;
  survei: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface GenderOption {
  value: string;
  label: string;
}

export interface ItemsPerPage {
  wilayah: number;
  default: number;
}