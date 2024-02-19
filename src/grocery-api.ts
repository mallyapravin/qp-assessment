import express, { Request, Response } from "express";

// Define types
interface GroceryItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItem {
  item_id: number;
  quantity: number;
}

interface Order {
  id: number;
  items: OrderItem[];
}

// Data storage
let groceryItems: GroceryItem[] = [];
let orders: Order[] = [];
let orderIdCounter: number = 1;

// Express app setup
const app = express();
app.use(express.json());

/*Admin Endpoints*/

// Admin endpoint to add a grocery item
app.post("/api/admin/grocery-items", (req: Request, res: Response) => {
  const {
    name,
    price,
    quantity,
  }: { name: string; price: number; quantity: number } = req.body;
  const newItem: GroceryItem = {
    id: groceryItems.length + 1,
    name,
    price,
    quantity,
  };
  groceryItems.push(newItem);
  res.status(201).json(newItem);
});

// Admin endpoint to get all the list of grocery items
app.get("/api/admin/grocery-items", (req: Request, res: Response) => {
  res.json({ messsage: "Grocery items retrieved", groceryItems });
});

// Admin endpoint to delete a grocery item
app.delete("/api/admin/grocery-items/:id", (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);

  if (groceryItems.find((item) => item.id === id)) {
    groceryItems = groceryItems.filter((item) => item.id !== id);
    res.status(200).json({ message: "Item deleted sucessfully", id });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// Admin endpoint to change attributes of a grocery item
app.put("/api/admin/grocery-items/:id", (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const {
    name,
    price,
    quantity,
  }: { name: string; price: number; quantity: number } = req.body;
  const index = groceryItems.findIndex((item) => item.id === id);
  if (index !== -1) {
    groceryItems[index] = { id, name, price, quantity };
    res.json(groceryItems[index]);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

/*User Endpoints*/

// Endpoint for User to get grocery items
app.get("/api/user/grocery-items", (req: Request, res: Response) => {
  res.json(groceryItems);
});

// Endpoint for User to create a new order
app.post("/api/user/orders", (req: Request, res: Response) => {
  const { items }: { items: OrderItem[] } = req.body;
  console.log(items);
  // Process order
  const orderId = orderIdCounter++;
  const newOrder: Order = {
    id: orderId,
    items,
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Endpoint for User to get all the orders

app.get("/api/user/orders", (req: Request, res: Response) => {
  res.status(201).json(orders);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
