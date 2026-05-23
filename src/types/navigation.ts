export interface NavigationLink {
  name: string;
  path: string;
}

export interface NavigationDropdown {
  name: string;
  children: NavigationLink[];
}

export type MenuItem = NavigationLink | NavigationDropdown;

export interface FooterColumn {
  title: string;
  links: NavigationLink[];
}