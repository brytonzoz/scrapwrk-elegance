
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  console.log('Fetching products from Supabase...');
  
  // Fetch products from Supabase
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');
  
  if (productsError) {
    console.error('Error fetching products:', productsError);
    return [];
  }
  
  // Fetch images for each product
  const productsWithImages = await Promise.all(
    products.map(async (product) => {
      const { data: images, error: imagesError } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .order('display_order', { ascending: true });
      
      if (imagesError) {
        console.error(`Error fetching images for product ${product.id}:`, imagesError);
        return {
          ...product,
          features: product.features || [],
          images: []
        };
      }
      
      return {
        ...product,
        features: Array.isArray(product.features) ? product.features : 
                 (typeof product.features === 'object' ? Object.values(product.features) : []),
        images: images.map(img => img.image_url)
      };
    })
  );
  
  console.log('Products with images:', productsWithImages);
  return productsWithImages;
};

// Function to seed initial data if the DB is empty
export const seedInitialData = async () => {
  console.log('Checking if we need to seed initial data...');
  
  // Check if products exist
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error checking products count:', error);
    return;
  }
  
  // If no products exist, seed initial data
  if (count === 0) {
    console.log('No products found, seeding initial data...');
    
    const mockProducts = [
      {
        name: "SCRAPWRK 001: HOODIE",
        price: 499,
        description: "One-of-a-kind handcrafted hoodie made from premium recycled materials. Each piece represents the perfect fusion of sustainability and high fashion.",
        features: ['Handmade in limited quantities', 'Sustainable materials', 'Unique design - no two pieces are alike', 'Water-resistant outer layer']
      },
      {
        name: "SCRAPWRK 002: PANTS",
        price: 399,
        description: "Artisanal pants crafted from reclaimed textiles. Featuring unique patterns and textures, these pants offer comfort with sustainable style.",
        features: ['Ethically produced', 'Zero-waste manufacturing', 'Adjustable waistband', 'Reinforced stitching for durability']
      },
      {
        name: "SCRAPWRK 003: HAT",
        price: 199,
        description: "Minimalist hat designed with purpose. Featuring a unique silhouette and crafted from recovered materials, each hat tells its own story.",
        features: ['One size fits most', 'UV protection', 'Breathable material', 'Reversible design']
      }
    ];
    
    // Insert products
    for (const product of mockProducts) {
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      
      if (productError) {
        console.error('Error inserting product:', productError);
        continue;
      }
      
      // List files from the storage bucket to use as product images
      const { data: files, error: storageError } = await supabase
        .storage
        .from('images')
        .list();
      
      if (storageError || !files || files.length === 0) {
        console.error('Error listing files or no files found:', storageError);
        continue;
      }
      
      // Get 4 random images for each product
      const randomImages = files
        .filter(file => file.name.endsWith('.jpg') || file.name.endsWith('.png'))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      
      // Insert image references
      for (let i = 0; i < randomImages.length; i++) {
        const imageUrl = supabase.storage.from('images').getPublicUrl(randomImages[i].name).data.publicUrl;
        
        await supabase
          .from('product_images')
          .insert({
            product_id: newProduct.id,
            image_url: imageUrl,
            display_order: i
          });
      }
    }
    
    console.log('Initial data seeded successfully');
  } else {
    console.log(`Found ${count} existing products, no need to seed`);
  }
};
