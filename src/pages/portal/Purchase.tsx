import { ShoppingCart } from "lucide-react";
import EmptyState from "@/components/EmptyState";

const Purchase = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <EmptyState icon={ShoppingCart} message="No hay extras para comprar." />
    </div>
  );
};

export default Purchase;
