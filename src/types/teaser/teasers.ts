export interface TeaserProps {
  id: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;


}

export interface TeaserListProps {
  teasers: TeaserProps[];
  customClass?: string;
}
