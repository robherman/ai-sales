"use client";

import moment from "moment";
import { getShoppingCartById } from "../../lib/apis/shopping-carts";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../loading-spinner";

export const ChatShoppingCart = ({ id }: { id?: string | null }) => {
  const [shoppingCart, setShoppingCart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCart = async () => {
    try {
      if (!id) {
        return;
      }
      setLoading(true);
      const shoppingCart = await getShoppingCartById(id);
      if (!shoppingCart) {
        throw new Error(`No cart`);
      }
      setShoppingCart(shoppingCart);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shoppingCart) {
      fetchCart();
    }
  }, [id, shoppingCart]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Carrito de compras</h3>
      {(shoppingCart && (
        <div className="grid grid-cols-1 gap-2 text-sm">
          <InfoItem label="ID" value={shoppingCart.id} />
          <InfoItem
            label="Actualizado"
            value={moment(shoppingCart.orderDate).format("MMMM D, YYYY")}
          />
          <InfoItem label="Productos" value={shoppingCart.itemsCount} />
          <div>
            <ul className="list-inside list-disc">
              {shoppingCart.items.map((item: any, index: number) => (
                <li key={index}>
                  {item.name} (x{item.quantity})
                </li>
              ))}
            </ul>
          </div>
          <InfoItem
            label="Descuento"
            value={`$${Number(shoppingCart.discountAmount || 0).toFixed(2)}`}
          />
          <InfoItem
            label="Subtotal"
            value={`$${Number(shoppingCart.subtotal || 0).toFixed(2)}`}
          />
          <InfoItem
            label="Total"
            value={`$${Number(shoppingCart.Total || 0).toFixed(2)}`}
          />
        </div>
      )) || (
        <div>
          <p>No hay carrito vigente.</p>
        </div>
      )}
    </div>
  );
};

function InfoItem({ label, value }: any) {
  return (
    <div>
      <span className="font-semibold text-gray-800">{label}: </span>
      <span>{value}</span>
    </div>
  );
}
