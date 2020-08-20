export interface RenderData {
  gendar: RenderDataItem[];
  quantity: RenderDataItem[];
  weight: RenderDataItem[];
}
export interface RenderDataItem {
  selected?: boolean;
  disabled?: boolean;
  id: string;
  value: string;
}
