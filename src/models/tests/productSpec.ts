import { Product, ProductServices } from "../product";

let productId: number;

describe("Product model", () => {
  const productService = new ProductServices();
  it("should create a new product", async () => {
    const product: Product = (await productService.createProduct({
      name: "Macbook",
      price: 1200,
      category: "computers",
    })) as Product;
    productId = product.id as number;
    expect(product.name).toBe("Macbook");
    expect(product.category).toBe("computers");
  });

  it("should get all products", async () => {
    const res: Product[] = (await productService.getAllProducts()) as Product[];
    expect(res.length).toBeGreaterThan(0);
  });

  it("should get a specific product by ID", async () => {
    const res: Product = (await productService.getProductById(
      productId,
    )) as Product;
    expect(res.name).toBe("Macbook");
  });

  it("should show there is a product of category computers", async () => {
    const res: Product[] = (await productService.getProductByCategory(
      "computers",
    )) as Product[];
    expect(res.length).toBe(1); //the one we have just created
  });

  it("should show there is no product of category drinks", async () => {
    const res: Product[] = (await productService.getProductByCategory(
      "drinks",
    )) as Product[];
    expect(res.length).toBe(0);
  });

  it("should delete a product by ID", async () => {
    const res: Product = (await productService.deleteProduct(
      productId,
    )) as Product;
    expect(res.name).toBe("Macbook");
  });
});
