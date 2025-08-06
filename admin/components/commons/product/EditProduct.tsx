import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/productType";
import { PencilIcon } from "lucide-react";

interface Props {
  product: ProductType;
  onupdate: () => void;
}

const EditProduct = ({ product, onupdate }: Props) => {
  return (
    <div>
      <Button variant="outline" size="icon">
        <PencilIcon />
      </Button>
    </div>
  );
};

export default EditProduct;
