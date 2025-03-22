
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  images: string[];
  created_at?: string;
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
          features: convertToStringArray(product.features),
          images: []
        };
      }
      
      return {
        ...product,
        features: convertToStringArray(product.features),
        images: images.map(img => img.image_url)
      };
    })
  );
  
  console.log('Products with images:', productsWithImages);
  return productsWithImages as Product[];
};

// Helper function to ensure features is always a string array
const convertToStringArray = (features: unknown): string[] => {
  if (Array.isArray(features)) {
    return features.map(item => String(item));
  } else if (typeof features === 'object' && features !== null) {
    return Object.values(features).map(item => String(item));
  } else if (features) {
    return [String(features)];
  }
  return [];
};

// Function to seed initial data if the DB is empty
export const seedInitialData = async () => {
  console.log('Checking if we need to seed initial data...');
  
  // Ensure storage bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(bucket => bucket.name === 'images')) {
    console.log('Creating images bucket...');
    await supabase.storage.createBucket('images', { public: true });
  }
  
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
    
    // Upload sample images to storage if needed
    const sampleImages = [
      '/images/product-1.jpg',
      '/images/product-2.jpg',
      '/images/product-3.jpg',
      '/images/product-4.jpg'
    ];
    
    // Upload images to storage bucket
    let uploadedImageUrls: string[] = [];
    for (let i = 0; i < sampleImages.length; i++) {
      const imagePath = sampleImages[i];
      const imageName = `product-${i + 1}.jpg`;
      
      try {
        // Check if image already exists in storage
        const { data: exists } = await supabase.storage.from('images').list('', {
          search: imageName
        });
        
        if (!exists || exists.length === 0) {
          // Fetch the image from public folder
          const response = await fetch(imagePath);
          const blob = await response.blob();
          
          // Upload to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(imageName, blob, { upsert: true });
          
          if (uploadError) {
            console.error(`Error uploading image ${imageName}:`, uploadError);
            continue;
          }
        }
        
        // Get public URL for the image
        const { data: urlData } = supabase.storage.from('images').getPublicUrl(imageName);
        uploadedImageUrls.push(urlData.publicUrl);
      } catch (err) {
        console.error(`Error processing image ${imageName}:`, err);
      }
    }
    
    // If no images were uploaded, use placeholders
    if (uploadedImageUrls.length === 0) {
      uploadedImageUrls = [
        '/placeholder.svg',
        '/placeholder.svg',
        '/placeholder.svg',
        '/placeholder.svg'
      ];
    }
    
    // Define mock products
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
      
      // Assign 4 random images for each product
      for (let i = 0; i < Math.min(4, uploadedImageUrls.length); i++) {
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: newProduct.id,
            image_url: uploadedImageUrls[i % uploadedImageUrls.length],
            display_order: i
          });
          
        if (imageError) {
          console.error(`Error inserting product image for product ${newProduct.id}:`, imageError);
        }
      }
    }
    
    console.log('Initial data seeded successfully');
  } else {
    console.log(`Found ${count} existing products, no need to seed`);
  }
};
