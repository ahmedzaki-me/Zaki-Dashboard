import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { MinusIcon, PlusIcon, ShoppingCart, CircleX } from "lucide-react";

import * as React from "react";
import { useLoaderData } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Cart from "./cartActions";
import { handlePlaceOrder } from "./ordersActions";

export default function NewOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openCart, setOpenCart] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState("all");
  const { items, categories } = useLoaderData();
  const { user } = useAuth();
  const {
    cartItems,
    setCartItems,
    countOfItems,
    subTotal,
    increaseCount,
    decreaseCount,
    removeFromCart,
  } = Cart();

  const filteredItems = React.useMemo(() => {
    return activeCategoryId === "all"
      ? items
      : items.filter((item) => item.category_id === activeCategoryId);
  }, [items, activeCategoryId]);

  const cartMap = React.useMemo(() => {
    return new Map(cartItems.map((i) => [i.id, i]));
  }, [cartItems]);

  const itemIsExist = (item) => cartMap.has(item.id);
  const getItemFromLS = (id) => cartMap.get(id);

  const handleOrder = async () => {
    if (cartItems.length < 1) {
      toast.error("Your Cart is Empty");
    } else {
      setIsSubmitting(true);
      const { success, data } = await handlePlaceOrder(
        user.id,
        cartItems,
        subTotal,
      );
      setIsSubmitting(false);
      if (success) {
        // toast.success("successfully");
        setCartItems([]);
        openCart && setOpenCart(false);
      } else {
        toast.error("Failed to handle Place Order");
      }
    }
  };

  return (
    <React.Fragment>
      <button
        onClick={() => {
          setOpenCart(!openCart);
        }}
        className="lg:hidden cursor-pointer bg-primary/80 text-primary-foreground z-150 fixed top-2 right-3 p-3 rounded-full"
      >
        {countOfItems > 0 && (
          <span className="px-2.5 py-1 bg-red-800/95 absolute -top-2 -right-2 rounded-full text-[13px]">
            {countOfItems}
          </span>
        )}
        <ShoppingCart size={20} />
      </button>

      <Tabs
        defaultValue="all"
        onValueChange={setActiveCategoryId}
        className="min-h-full h-full relative"
      >
        {/*  categories */}
        <TabsList className="flex w-full justify-start overflow-x-auto overflow-y-hidden whitespace-nowrap rounded-lg bg-muted p-1 scrollbar-hide">
          <TabsTrigger value="all" className="shrink-0 cursor-pointer">
            All
          </TabsTrigger>

          {categories.map((category) => {
            return (
              <TabsTrigger
                value={category.id}
                key={category.id}
                className="shrink-0 cursor-pointer"
              >
                {category.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* items */}
        <div className="flex my-3 gap-3">
          <TabsContent value={activeCategoryId}>
            {filteredItems.length > 0 ? (
              <>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 ">
                  {filteredItems.map((item) => {
                    return (
                      <Card
                        className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden items-between"
                        key={item.id}
                      >
                        {/* <div className="absolute inset-0 z-30 aspect-video bg-black/25 " /> */}
                        <img
                          src={item.image_url}
                          alt={item.name}
                          loading="lazy"
                          className="relative z-20 aspect-video w-[50%] object-cover rounded-br-xl"
                        />
                        <Badge
                          variant="secondary"
                          className={`absolute top-3 end-3 z-40 font-bold text-sm
                                  ${
                                    item.stock_quantity == 0
                                      ? "text-[#888]"
                                      : item.stock_quantity > 10
                                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                        : item.stock_quantity < 5
                                          ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                                  }
                      `}
                        >
                          Stock: {item.stock_quantity}
                        </Badge>

                        <Badge
                          variant="secondary"
                          className="absolute top-11 end-3 z-40 font-extrabold text-xl"
                        >
                          ${item.price}
                        </Badge>

                        <CardHeader className="flex-1 ">
                          {/* <CardAction></CardAction> */}
                          <CardTitle className="text-xl">{item.name}</CardTitle>
                          {/* <CardDescription>{item.description}</CardDescription> */}
                        </CardHeader>

                        <CardFooter className="flex justify-between items-center">
                          {itemIsExist(item) ? (
                            <ButtonGroup
                              aria-label="Media controls"
                              className="flex gap-1 justify-between items-center"
                            >
                              <Button
                                size="icon"
                                className="rounded-full"
                                onClick={() => decreaseCount(item.id)}
                              >
                                <MinusIcon />
                              </Button>

                              <span className="font-bold text-xl">
                                {getItemFromLS(item.id)?.count ?? 1}
                              </span>

                              <Button
                                size="icon"
                                className="rounded-full"
                                onClick={() => increaseCount(item.id)}
                              >
                                <PlusIcon />
                              </Button>
                            </ButtonGroup>
                          ) : (
                            <Button
                              className="w-full uppercase "
                              disabled={item.stock_quantity == 0}
                              onClick={() => {
                                setCartItems((prev) => [
                                  ...prev,
                                  { ...item, count: 1 },
                                ]);
                              }}
                            >
                              {item.stock_quantity == 0 ? (
                                "out Of stock"
                              ) : (
                                <>
                                  <ShoppingCart />
                                  Add
                                </>
                              )}
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-muted-foreground">
                No Items
              </div>
            )}
          </TabsContent>

          <div
            onClick={() => setOpenCart(!openCart)}
            className={`${openCart ? "bg-black/40 max-lg:fixed! top-0 left-0 z-49 w-full h-full" : "max-lg:hidden "} lg:hidden`}
          ></div>
          <div
            className={`${openCart ? "max-lg:fixed top-0 left-0 z-50 h-170 w-80! rounded-[5px]" : "max-lg:hidden "}  
                      lg:h-[calc(100vh-1rem)] w-90 bg-sidebar shadow-sm flex flex-col sticky lg:top-2`}
          >
            <div className="mb-3 p-2">
              <h1 className="font-bold text-xl">Ordered Menus</h1>
              <span className="font-semibold">
                Total Menus : {countOfItems}
              </span>
            </div>

            <Separator />

            <div className="w-full scrollbar-thin flex-1 p-1 overflow-y-auto overscroll-none">
              {cartItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 bg-card overflow-hidden
                              text-card-foreground rounded-xl border shadow-sm p-3 relative my-2 "
                  >
                    <div>
                      <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        className="w-13 h-10 rounded-[3px] mb-1.5"
                      />
                      <span className="text-xl font-semibold">{item.name}</span>
                    </div>

                    <div className="self-end font-semibold">
                      Sup Total: {item.price * item.count}
                    </div>

                    <div className="flex items-center gap-3 absolute top-3 right-1">
                      <ButtonGroup
                        aria-label="Media controls"
                        className="flex gap-1 justify-center items-center"
                      >
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="rounded-full h-6.5"
                          onClick={() => decreaseCount(item.id)}
                        >
                          <MinusIcon />
                        </Button>

                        <span className="font-bold">{item.count || 1} </span>

                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="rounded-full h-6.5"
                          onClick={() => increaseCount(item.id)}
                        >
                          <PlusIcon />
                        </Button>
                      </ButtonGroup>

                      <Button size="x" variant="outline" className="py-1 px-2">
                        Add Nots
                      </Button>

                      <CircleX
                        size={18}
                        className="cursor-pointer hover:text-destructive duration-300"
                        onClick={() => removeFromCart(item.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sticky bottom-0 left-0 bg-sidebar mt-2 text-2xl font-bold">
              <Separator />
              <div className="flex justify-between py-6 px-5">
                <div>Total: </div>
                <div>${subTotal}</div>
              </div>
              {/* 
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button> */}

              <Button
                disabled={isSubmitting}
                className="w-full text-xl font-semibold py-5 rounded-1!"
                onClick={() => handleOrder()}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Placing...
                  </>
                ) : (
                  "Place an Order"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </React.Fragment>
  );
}
