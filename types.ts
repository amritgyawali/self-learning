export type Package = {
    id: number;
    name: string;
    price: number;
    description?: string;
    image?: string;
    services?: { id: number; name: string; price: number; description?: string }[] | string[];
  };