import type { FieldCategory, FieldType } from './constant';

export const chartMap: Record<
  string,
  {
    category: FieldCategory;
    fieldType: FieldType;
    props: Record<string, any>;
  }
> = {};
