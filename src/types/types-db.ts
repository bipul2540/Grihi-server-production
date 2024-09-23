export type CategoryType = {
  id: string;
  category: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SubCategoryType = {
  id: string;
  name: string;
};

export type ProductMetadata = {
  manufacturer?: string; //done
  delivery_time: string; //done
  color_variants?: string[]; //done
  weight?: number; //done
  warrenty: string; //done
  seo_title: string; //done
  publish: string; //done
};
export type Product = {
  _id?: string; //used for csv files
  id?: string; //done
  storeId: string; //done
  userId?: string; //done
  title: string; //done
  description: string; //done
  productType?: string; //done
  images: { value: string }[]; //done
  price?: number; //done
  discountPrice?: number; //done
  stock?: number; //done
  category: CategoryType;
  tags: string[]; //done
  dimensions?: string; //done
  certifications?: string; //done
  metadata: ProductMetadata; //done
  sub_category: SubCategoryType;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AddresssDataType = {
  id?: string;
  address_type: string;
  city: string;
  country?: string;
  isDefault: boolean;
  landmark: string;
  local_address: string;
  mobile: string;
  name: string;
  pincode: string;
  state: string;
  alternate_mobile: string;
};
