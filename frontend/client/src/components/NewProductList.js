import React, { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import axiosInstance from './axiosInstance';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { storeSearch, getSearchHistory } from '../utils/search';
import { useIsMobile } from '../utils/mobilecheck';
import './styles/NewProductList.css';

const NewProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageIndexes, setImageIndexes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const PRODUCTS_PER_PAGE = 32;
  const CATEGORIES_PER_PAGE = isMobile ? 3 : 7; // Number of categories to show per page

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  const categories = [
    { id: 'electronics', name: 'Electronics', subCategories: ['Phones', 'Laptops', 'Tablets', 'Headphones', 'Cameras', 'Accessories', 'Wearables', 'Smart Home', 'Gaming Consoles', 'Home Audio', 'Smartwatches', 'Virtual Reality'] },
    { id: 'clothing', name: 'Clothing', subCategories: ['Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Activewear', 'Outerwear', 'Swimwear', 'Suits', 'Athleisure', 'Plus Size', 'Maternity'] },
    { id: 'home', name: 'Home', subCategories: ['Furniture', 'Kitchen', 'Decor', 'Bedding', 'Lighting', 'Storage', 'Appliances', 'Cleaning', 'Outdoor Furniture', 'Rugs', 'Curtains', 'Wall Art'] },
    { id: 'beauty', name: 'Beauty', subCategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Nail Care', 'Tools', 'Bath & Body', 'Men\'s Grooming', 'Anti-Aging', 'Sun Care', 'Cosmetics', 'Personal Hygiene'] },
    { id: 'health', name: 'Health', subCategories: ['Supplements', 'Vitamins', 'Personal Care', 'Fitness', 'Medical Supplies', 'Wellness', 'First Aid', 'Health Monitoring', 'Weight Management', 'Sleep Aids', 'Sports Medicine', 'Herbal Remedies'] },
    { id: 'toys', name: 'Toys', subCategories: ['Action Figures', 'Dolls', 'Educational', 'Outdoor Toys', 'Puzzles', 'Games', 'Building Sets', 'Ride-Ons', 'Arts & Crafts', 'Electronic Toys', 'Remote Control', 'Stuffed Animals'] },
    { id: 'sports', name: 'Sports', subCategories: ['Fitness Equipment', 'Outdoor Gear', 'Team Sports', 'Cycling', 'Swimming', 'Athletic Wear', 'Camping', 'Sports Nutrition', 'Yoga', 'Martial Arts', 'Running', 'Fishing'] },
    { id: 'automotive', name: 'Automotive', subCategories: ['Car Parts', 'Accessories', 'Tools', 'Maintenance', 'Tires', 'Electronics', 'Car Care', 'Interior Accessories', 'Vehicle Covers', 'Audio Systems', 'GPS Devices', 'Car Wash Supplies'] },
    { id: 'books', name: 'Books', subCategories: ['Fiction', 'Non-Fiction', 'Science', 'Biography', 'Children\'s Books', 'Textbooks', 'Cookbooks', 'Graphic Novels', 'Self-Help', 'Historical', 'Romance', 'Mystery'] },
    { id: 'food', name: 'Food & Beverage', subCategories: ['Snacks', 'Beverages', 'Groceries', 'Organic', 'Gourmet', 'Frozen Foods', 'Specialty Foods', 'Pantry Staples', 'Meal Kits', 'Diet Foods', 'International Foods', 'Canned Goods'] },
    { id: 'office', name: 'Office Supplies', subCategories: ['Furniture', 'Stationery', 'Electronics', 'Organizers', 'Printing', 'Accessories', 'Office Décor', 'Ergonomics', 'Writing Instruments', 'Binding & Laminating', 'Office Chairs', 'Desks'] },
    { id: 'pet', name: 'Pet Supplies', subCategories: ['Food', 'Toys', 'Grooming', 'Health', 'Accessories', 'Furniture', 'Training', 'Travel', 'Pet Clothing', 'Aquarium Supplies', 'Bird Supplies', 'Small Animal Supplies'] },
    { id: 'music', name: 'Music', subCategories: ['Instruments', 'Sheet Music', 'Recordings', 'Accessories', 'Equipment', 'Vinyl', 'Digital Music', 'Merchandise', 'DJ Gear', 'Recording Studio', 'Music Theory', 'Music Software'] },
    { id: 'jewelry', name: 'Jewelry', subCategories: ['Necklaces', 'Bracelets', 'Earrings', 'Rings', 'Watches', 'Accessories', 'Fine Jewelry', 'Costume Jewelry', 'Men\'s Jewelry', 'Engagement & Wedding', 'Custom Jewelry', 'Vintage Jewelry'] },
    { id: 'crafts', name: 'Crafts', subCategories: ['Art Supplies', 'DIY Kits', 'Fabric', 'Beading', 'Scrapbooking', 'Knitting', 'Painting', 'Woodworking', 'Sewing', 'Ceramics', 'Jewelry Making', 'Card Making'] },
    { id: 'travel', name: 'Travel', subCategories: ['Luggage', 'Travel Accessories', 'Outdoor Gear', 'Travel Guides', 'Apparel', 'Footwear', 'Travel Comfort', 'Travel Safety', 'Camping Gear', 'Travel Electronics', 'Travel Bedding', 'Travel Gadgets'] },
    { id: 'gardening', name: 'Gardening', subCategories: ['Plants', 'Tools', 'Soil', 'Pots', 'Outdoor Furniture', 'Decor', 'Seeds', 'Garden Care', 'Greenhouses', 'Irrigation', 'Compost', 'Gardening Kits'] },
    { id: 'baby', name: 'Baby Products', subCategories: ['Clothing', 'Toys', 'Feeding', 'Diapers', 'Furniture', 'Health', 'Safety', 'Bath', 'Travel', 'Nursery', 'Baby Gear', 'Baby Monitors'] },
    { id: 'gaming', name: 'Gaming', subCategories: ['Consoles', 'Games', 'Accessories', 'PC Gaming', 'Merchandise', 'Peripherals', 'Virtual Reality', 'Gaming Chairs', 'Game Collectibles', 'Streaming Equipment', 'Game Consoles Accessories', 'Gaming Laptops'] },
    { id: 'furniture', name: 'Furniture', subCategories: ['Living Room', 'Bedroom', 'Dining Room', 'Office', 'Outdoor', 'Storage', 'Lighting', 'Kids', 'Patio', 'Mattresses', 'Home Office', 'Recliners'] },
    { id: 'appliances', name: 'Appliances', subCategories: ['Kitchen Appliances', 'Laundry Appliances', 'Small Appliances', 'Heating & Cooling', 'Home Care', 'Vacuum Cleaners', 'Water Filters', 'Microwaves', 'Dishwashers', 'Air Purifiers', 'Dehumidifiers', 'Coffee Makers'] },
    { id: 'hardware', name: 'Hardware', subCategories: ['Tools', 'Fasteners', 'Paint', 'Electrical', 'Plumbing', 'Outdoor', 'Storage', 'Safety', 'Hand Tools', 'Power Tools', 'Building Materials', 'Locksmith'] },
    { id: 'party', name: 'Party Supplies', subCategories: ['Decorations', 'Tableware', 'Party Favors', 'Balloons', 'Costumes', 'Games', 'Invitations', 'Themed Supplies', 'Cake Decorations', 'Disposable Tableware', 'Party Lighting', 'Photo Booth Props'] },
    { id: 'healthcare', name: 'Healthcare', subCategories: ['Medical Devices', 'Personal Care', 'Fitness Tracking', 'Wellness Products', 'Health Monitors', 'Emergency Supplies', 'Rehabilitation', 'Therapy', 'Health Supplements', 'Incontinence', 'Mobility Aids', 'Hearing Aids'] },
    { id: 'hobbies', name: 'Hobbies', subCategories: ['Collectibles', 'Model Kits', 'Photography', 'Bird Watching', 'Fishing', 'Cycling', 'Motorcycling', 'RC Vehicles', 'Astronomy', 'Antiquing', 'Drones', 'Hiking'] },
    { id: 'subscriptions', name: 'Subscriptions', subCategories: ['Streaming Services', 'Magazine Subscriptions', 'Box Subscriptions', 'Software', 'Digital Content', 'Fitness Programs', 'Food & Beverage', 'Books', 'Beauty Boxes', 'Gaming', 'Educational', 'Music'] },
    { id: 'educational', name: 'Educational', subCategories: ['Learning Resources', 'STEM Kits', 'Online Courses', 'Textbooks', 'Tutoring Services', 'Educational Toys', 'Classroom Supplies', 'E-Learning', 'Study Aids', 'Language Learning'] },
    { id: 'safety', name: 'Safety & Security', subCategories: ['Home Security', 'Personal Safety', 'Fire Safety', 'Surveillance Cameras', 'Alarm Systems', 'Safety Gear', 'Emergency Kits', 'Security Lighting', 'First Aid Kits', 'Home Monitoring', 'Access Control'] },
    { id: 'outdoor', name: 'Outdoor & Recreation', subCategories: ['Camping Gear', 'Hiking Gear', 'Fishing Equipment', 'Outdoor Furniture', 'Grills & Outdoor Cooking', 'Sports & Fitness', 'Garden Tools', 'Travel Gear', 'Water Sports', 'Climbing Gear'] },
    { id: 'home-improvement', name: 'Home Improvement', subCategories: ['Building Materials', 'Paint & Wallpaper', 'Hardware', 'Plumbing', 'Electrical', 'Flooring', 'Storage Solutions', 'DIY Kits', 'Insulation', 'Roofing', 'Renovation Tools', 'Window Treatments'] },
    { id: 'technology', name: 'Technology', subCategories: ['Computers', 'Software', 'Networking', 'Cloud Services', 'Tech Gadgets', 'Wearables', 'Smart Devices', 'Home Automation', 'Tech Accessories', 'Data Storage', 'Security Software', 'Tech Support'] },
    { id: 'services', name: 'Services', subCategories: ['Consulting', 'Repair', 'Maintenance', 'Professional Services', 'Cleaning', 'Tutoring', 'Health & Wellness', 'Legal Services', 'Financial Services', 'Real Estate', 'Event Planning', 'Marketing Services'] },
    { id: 'luxury', name: 'Luxury', subCategories: ['High-End Fashion', 'Luxury Watches', 'Designer Jewelry', 'Fine Art', 'Luxury Vehicles', 'High-End Electronics', 'Exclusive Travel', 'Luxury Home Goods', 'Rare Collectibles', 'Premium Beauty Products', 'Luxury Experiences', 'Fine Dining'] },
    { id: 'art', name: 'Art', subCategories: ['Paintings', 'Sculptures', 'Prints', 'Photography', 'Drawings', 'Digital Art', 'Crafts', 'Art Supplies', 'Art Collectibles', 'Art Books', 'Gallery Art', 'Decorative Art'] },
    { id: 'antiques', name: 'Antiques', subCategories: ['Furniture', 'Jewelry', 'Collectibles', 'Art', 'Ceramics', 'Glassware', 'Silverware', 'Clocks', 'Books', 'Textiles', 'Toys', 'Coins'] },
    { id: 'weddings', name: 'Weddings', subCategories: ['Bridal Gowns', 'Bridesmaids Dresses', 'Groomswear', 'Wedding Rings', 'Invitations', 'Decor', 'Photography', 'Flowers', 'Catering', 'Venues', 'Favors', 'Accessories'] },
    { id: 'fitness', name: 'Fitness', subCategories: ['Workout Equipment', 'Yoga', 'Running', 'Strength Training', 'Cardio', 'Sports Nutrition', 'Fitness Apparel', 'Gym Accessories', 'Home Gym', 'Personal Training', 'Fitness Trackers', 'Rehabilitation'] },
    { id: 'baby-care', name: 'Baby Care', subCategories: ['Diapers', 'Wipes', 'Feeding Bottles', 'Baby Food', 'Nursing', 'Health & Safety', 'Diaper Bags', 'Baby Clothing', 'Bathing', 'Changing Tables', 'Baby Monitors', 'Pacifiers'] },
    { id: 'fishing', name: 'Fishing', subCategories: ['Rods', 'Reels', 'Tackle', 'Bait', 'Fishing Apparel', 'Boats', 'Accessories', 'Fish Finders', 'Fishing Lines', 'Lures', 'Fishing Bags', 'Ice Fishing'] },
    { id: 'cycling', name: 'Cycling', subCategories: ['Bikes', 'Helmets', 'Apparel', 'Accessories', 'Cycling Shoes', 'Maintenance Tools', 'Bike Racks', 'Cycling Computers', 'Water Bottles', 'Bike Lights', 'Bike Locks', 'Cycling Gloves'] },
    { id: 'outdoor-adventure', name: 'Outdoor Adventure', subCategories: ['Camping Gear', 'Hiking Gear', 'Climbing Gear', 'Water Sports', 'Outdoor Apparel', 'Navigation Tools', 'Survival Gear', 'Binoculars', 'Camping Cooking Equipment', 'Shelters', 'Outdoor Furniture', 'Backpacking'] },
    { id: 'collectibles', name: 'Collectibles', subCategories: ['Coins', 'Stamps', 'Sports Memorabilia', 'Vintage Toys', 'Action Figures', 'Autographs', 'Comic Books', 'Antique Jewelry', 'Historical Artifacts', 'Vintage Magazines', 'Rare Books', 'Music Memorabilia'] },
    { id: 'home-office', name: 'Home Office', subCategories: ['Desks', 'Chairs', 'Lighting', 'Storage Solutions', 'Office Supplies', 'Ergonomics', 'Computers', 'Printers', 'Accessories', 'Organization', 'Office Decor', 'Networking Equipment'] },
    { id: 'kitchen', name: 'Kitchen', subCategories: ['Cookware', 'Bakeware', 'Utensils', 'Small Appliances', 'Storage Containers', 'Tableware', 'Kitchen Gadgets', 'Cutlery', 'Kitchen Decor', 'Barware', 'Food Preparation', 'Cleaning Supplies'] },
    { id: 'bathroom', name: 'Bathroom', subCategories: ['Bath Accessories', 'Towels', 'Shower Curtains', 'Storage Solutions', 'Vanity', 'Toilets', 'Sinks', 'Mirrors', 'Bath Mats', 'Bathroom Decor', 'Plumbing Fixtures', 'Showerheads'] },
    { id: 'gardening-tools', name: 'Gardening Tools', subCategories: ['Hand Tools', 'Power Tools', 'Watering Equipment', 'Soil & Fertilizers', 'Pruners', 'Shovels', 'Rakes', 'Hoes', 'Trowels', 'Garden Gloves', 'Planters', 'Composters'] },
    { id: 'crafting', name: 'Crafting', subCategories: ['Scrapbooking', 'Card Making', 'Knitting & Crochet', 'Sewing', 'Painting', 'Drawing', 'Beading', 'Model Building', 'Embroidery', 'Woodworking', 'Pottery', 'Decoupage'] },
    { id: 'technology-services', name: 'Technology Services', subCategories: ['IT Support', 'Software Development', 'Cloud Computing', 'Cybersecurity', 'Network Setup', 'Data Recovery', 'Tech Consulting', 'Web Development', 'Mobile App Development', 'Tech Training', 'SEO Services', 'Database Management'] },
    { id: 'home-decor', name: 'Home Decor', subCategories: ['Rugs', 'Curtains', 'Wall Art', 'Lighting', 'Furniture', 'Bedding', 'Cushions', 'Throws', 'Decorative Accessories', 'Vases', 'Mirrors', 'Wall Clocks'] },
    { id: 'personal-care', name: 'Personal Care', subCategories: ['Haircare', 'Skincare', 'Oral Care', 'Body Care', 'Men\'s Grooming', 'Shaving', 'Deodorants', 'Moisturizers', 'Face Masks', 'Body Wash', 'Sunscreen', 'Hand Cream'] },
    { id: 'baby-gear', name: 'Baby Gear', subCategories: ['Strollers', 'Car Seats', 'Baby Carriers', 'Playpens', 'High Chairs', 'Bouncers', 'Swings', 'Cribs', 'Changing Tables', 'Baby Monitors', 'Baby Bedding', 'Travel Gear'] },
    { id: 'digital-content', name: 'Digital Content', subCategories: ['E-Books', 'Online Courses', 'Music Downloads', 'Software', 'Subscriptions', 'Digital Magazines', 'Stock Photos', 'Templates', 'Audio Files', 'Video Content', 'Digital Art', 'Webinars'] },
    { id: 'holiday', name: 'Holiday', subCategories: ['Christmas', 'Halloween', 'Thanksgiving', 'Easter', 'Valentine\'s Day', 'Fourth of July', 'Hanukkah', 'New Year', 'Birthday', 'Party Supplies', 'Holiday Decorations', 'Seasonal Gifts'] },
    { id: 'watches', name: 'Watches', subCategories: ['Men\'s Watches', 'Women\'s Watches', 'Luxury Watches', 'Smartwatches', 'Sports Watches', 'Analog Watches', 'Digital Watches', 'Watch Accessories', 'Watch Repair', 'Vintage Watches', 'Limited Editions', 'Watch Bands'] },
    { id: 'kitchen-appliances', name: 'Kitchen Appliances', subCategories: ['Refrigerators', 'Ovens', 'Microwaves', 'Dishwashers', 'Coffee Makers', 'Toasters', 'Blenders', 'Mixers', 'Cooktops', 'Garbage Disposals', 'Range Hoods', 'Ice Makers'] },
    { id: 'childrens-books', name: 'Children\'s Books', subCategories: ['Picture Books', 'Early Readers', 'Chapter Books', 'Middle Grade', 'Young Adult', 'Activity Books', 'Educational Books', 'Fairy Tales', 'Classics', 'Bedtime Stories', 'Comics', 'Series'] },
    { id: 'vintage', name: 'Vintage', subCategories: ['Vintage Clothing', 'Vintage Furniture', 'Vintage Jewelry', 'Vintage Collectibles', 'Vintage Art', 'Vintage Electronics', 'Vintage Toys', 'Vintage Books', 'Vintage Accessories', 'Vintage Records', 'Vintage Linens', 'Vintage Cameras'] },
    { id: 'lawn-care', name: 'Lawn Care', subCategories: ['Lawn Mowers', 'Trimmers', 'Edgers', 'Fertilizers', 'Pesticides', 'Seeds', 'Grass Tools', 'Watering Systems', 'Lawn Decorations', 'Soil Amendments', 'Lawn Care Equipment', 'Garden Sprayers'] },
    { id: 'automotive-accessories', name: 'Automotive Accessories', subCategories: ['Floor Mats', 'Seat Covers', 'Sunshades', 'Car Chargers', 'Steering Wheel Covers', 'Organizers', 'Car Covers', 'Air Fresheners', 'Phone Mounts', 'GPS Holders', 'Back Seat Protectors', 'Cargo Liners'] },
    { id: 'bedding', name: 'Bedding', subCategories: ['Sheets', 'Pillows', 'Mattresses', 'Comforters', 'Duvets', 'Bed Frames', 'Mattress Protectors', 'Bed Skirts', 'Shams', 'Bedspreads', 'Blankets', 'Bedding Sets'] },
    { id: 'textiles', name: 'Textiles', subCategories: ['Fabrics', 'Thread', 'Yarns', 'Textile Art', 'Crafting Materials', 'Upholstery', 'Curtains', 'Rugs', 'Table Linens', 'Quilting Supplies', 'Sewing Patterns', 'Textile Care'] },
    { id: 'smart-home', name: 'Smart Home', subCategories: ['Smart Lights', 'Smart Thermostats', 'Smart Locks', 'Home Security Systems', 'Smart Speakers', 'Smart Plugs', 'Smart Cameras', 'Home Automation Systems', 'Voice Assistants', 'Smart Appliances', 'Smart Blinds', 'Home Hubs'] },
    { id: 'pools', name: 'Pools', subCategories: ['Pool Equipment', 'Pool Chemicals', 'Pool Accessories', 'Pool Furniture', 'Pool Toys', 'Pool Maintenance', 'Inflatable Pools', 'Heating Systems', 'Pool Covers', 'Pool Lighting', 'Pool Safety', 'Cleaning Tools'] },
    { id: 'home-improvement', name: 'Home Improvement', subCategories: ['Renovation', 'Painting', 'Flooring', 'Kitchen Remodel', 'Bathroom Remodel', 'Roofing', 'Windows', 'Doors', 'Insulation', 'Fencing', 'Siding', 'Landscaping'] },
    { id: 'eco-friendly', name: 'Eco-Friendly', subCategories: ['Reusable Products', 'Sustainable Goods', 'Organic Products', 'Eco-Friendly Packaging', 'Green Energy', 'Recycled Materials', 'Zero Waste', 'Biodegradable Products', 'Eco-Friendly Home Goods', 'Eco-Friendly Beauty Products', 'Sustainable Fashion', 'Green Cleaning'] },
    { id: 'lingerie', name: 'Lingerie', subCategories: ['Bras', 'Panties', 'Sleepwear', 'Shapewear', 'Lingerie Sets', 'Corsets', 'Robes', 'Bodysuits', 'Maternity Lingerie', 'Plus Size Lingerie', 'Sexy Lingerie', 'Sports Bras'] },
    { id: 'digital-goods', name: 'Digital Goods', subCategories: ['Software', 'E-books', 'Digital Music', 'Online Courses', 'Subscription Services', 'Digital Art', 'Templates', 'Stock Photos', 'Digital Magazines', 'Web Apps', 'Mobile Apps', 'Digital Downloads'] },
    { id: 'maternity', name: 'Maternity', subCategories: ['Maternity Clothing', 'Nursing Bras', 'Maternity Sleepwear', 'Belly Bands', 'Maternity Support', 'Pregnancy Books', 'Nursing Covers', 'Maternity Accessories', 'Pregnancy Pillows', 'Postpartum Products', 'Baby Bump Cream', 'Maternity Shoes'] },
    { id: 'education', name: 'Education', subCategories: ['Textbooks', 'Workbooks', 'Educational Games', 'Learning Toys', 'Online Courses', 'Tutoring Services', 'Classroom Supplies', 'Educational Software', 'Study Guides', 'Language Learning', 'Homeschooling Resources', 'School Supplies'] },
    { id: 'craft-supplies', name: 'Craft Supplies', subCategories: ['Scrapbooking', 'Beading', 'Painting', 'Drawing', 'Knitting & Crochet', 'Sewing', 'Craft Kits', 'Model Kits', 'Jewelry Making', 'Fabric', 'Craft Tools', 'Embroidery'] },
    { id: 'hardware-tools', name: 'Hardware & Tools', subCategories: ['Hand Tools', 'Power Tools', 'Fasteners', 'Paint Supplies', 'Plumbing Tools', 'Electrical Tools', 'Safety Gear', 'Tool Storage', 'Measuring Tools', 'Gardening Tools', 'Workshop Equipment', 'Tool Accessories'] },
    { id: 'automotive-parts', name: 'Automotive Parts', subCategories: ['Engine Parts', 'Transmission Parts', 'Brake Parts', 'Suspension Parts', 'Electrical Parts', 'Body Parts', 'Cooling System Parts', 'Fuel System Parts', 'Exhaust System Parts', 'Interior Parts', 'Exterior Parts', 'OEM Parts'] },
    { id: 'marine', name: 'Marine', subCategories: ['Boats', 'Marine Electronics', 'Fishing Gear', 'Safety Equipment', 'Docking', 'Marine Maintenance', 'Boat Covers', 'Marine Clothing', 'Marine Accessories', 'Boat Parts', 'Marine Audio', 'Navigation Equipment'] },
    { id: 'watches', name: 'Watches', subCategories: ['Luxury Watches', 'Smartwatches', 'Sport Watches', 'Analog Watches', 'Digital Watches', 'Fashion Watches', 'Men\'s Watches', 'Women\'s Watches', 'Children\'s Watches', 'Watch Accessories', 'Watch Bands', 'Watch Repair'] },
    { id: 'photography', name: 'Photography', subCategories: ['Cameras', 'Lenses', 'Tripods', 'Camera Bags', 'Lighting Equipment', 'Photography Accessories', 'Editing Software', 'Drones', 'Photography Prints', 'Photo Albums', 'Studio Equipment', 'Camera Straps'] },
    { id: 'vape', name: 'Vape', subCategories: ['Vape Pens', 'E-Liquids', 'Vape Mods', 'Coils', 'Vape Tanks', 'Accessories', 'Nicotine Salts', 'CBD Vapes', 'Starter Kits', 'Replacement Parts', 'Vape Juice', 'Cartridges'] },
    { id: 'music-instruments', name: 'Music Instruments', subCategories: ['Guitars', 'Drums', 'Pianos', 'Violins', 'Wind Instruments', 'String Instruments', 'Percussion Instruments', 'Keyboard Instruments', 'Brass Instruments', 'Electronic Instruments', 'Sheet Music', 'Music Stands'] },
    { id: 'home-security', name: 'Home Security', subCategories: ['Alarm Systems', 'Security Cameras', 'Motion Sensors', 'Smart Locks', 'Security Lighting', 'Home Safes', 'Video Doorbells', 'Access Control', 'Security Systems', 'Home Automation', 'Intercom Systems', 'Monitoring Services'] },
    { id: 'fitness-equipment', name: 'Fitness Equipment', subCategories: ['Treadmills', 'Ellipticals', 'Exercise Bikes', 'Strength Training Equipment', 'Free Weights', 'Resistance Bands', 'Yoga Mats', 'Dumbbells', 'Kettlebells', 'Rowing Machines', 'Fitness Trackers', 'Cardio Machines'] },
    { id: 'art-supplies', name: 'Art Supplies', subCategories: ['Paints', 'Brushes', 'Canvas', 'Easels', 'Sketchbooks', 'Markers', 'Charcoal', 'Pastels', 'Watercolors', 'Acrylics', 'Art Paper', 'Artist Tools'] },
    { id: 'clothing-accessories', name: 'Clothing Accessories', subCategories: ['Hats', 'Scarves', 'Gloves', 'Belts', 'Sunglasses', 'Jewelry', 'Ties', 'Handbags', 'Wallets', 'Bags', 'Shoes', 'Socks'] },
    { id: 'home-furnishings', name: 'Home Furnishings', subCategories: ['Sofas', 'Chairs', 'Tables', 'Bed Frames', 'Dressers', 'Nightstands', 'Ottomans', 'Cabinets', 'Shelves', 'Benches', 'Sectionals', 'Recliners'] },
    { id: 'kitchenware', name: 'Kitchenware', subCategories: ['Cookware', 'Bakeware', 'Utensils', 'Cutlery', 'Tableware', 'Small Appliances', 'Storage Containers', 'Kitchen Tools', 'Servingware', 'Coffee Makers', 'Blenders', 'Microwaves'] },
    { id: 'luxury-items', name: 'Luxury Items', subCategories: ['Designer Clothing', 'High-End Watches', 'Fine Jewelry', 'Luxury Cars', 'Exclusive Travel', 'Luxury Home Goods', 'Rare Collectibles', 'High-End Electronics', 'Fine Art', 'Premium Beauty Products', 'Luxury Experiences', 'Gourmet Foods'] },
    { id: 'personalized-gifts', name: 'Personalized Gifts', subCategories: ['Custom Jewelry', 'Engraved Items', 'Personalized Apparel', 'Custom Home Décor', 'Photo Gifts', 'Monogrammed Items', 'Custom Artwork', 'Personalized Stationery', 'Customized Toys', 'Engraved Glassware', 'Photo Books', 'Custom Calendars'] },
    { id: 'specialty-foods', name: 'Specialty Foods', subCategories: ['Gourmet Snacks', 'International Foods', 'Organic Foods', 'Gluten-Free Foods', 'Artisanal Foods', 'Ethnic Cuisine', 'Specialty Beverages', 'Organic Produce', 'Healthy Snacks', 'Craft Foods', 'Baking Supplies', 'Unique Spices'] },
    { id: 'fashion', name: 'Fashion', subCategories: ['Casual Wear', 'Formal Wear', 'Sportswear', 'Activewear', 'Outerwear', 'Seasonal Fashion', 'Designer Fashion', 'Streetwear', 'Vintage Fashion', 'Sustainable Fashion', 'Accessories', 'Footwear'] },
    { id: 'jewelry-accessories', name: 'Jewelry & Accessories', subCategories: ['Necklaces', 'Bracelets', 'Earrings', 'Rings', 'Watches', 'Brooches', 'Cufflinks', 'Hair Accessories', 'Anklets', 'Jewelry Boxes', 'Jewelry Cleaning Supplies', 'Jewelry Making Kits'] },
    { id: 'recreational-vehicles', name: 'Recreational Vehicles', subCategories: ['Motorhomes', 'Travel Trailers', 'Fifth Wheels', 'Campers', 'ATVs', 'Jet Skis', 'Boats', 'RV Accessories', 'Camping Gear', 'Recreational Vehicle Parts', 'Outdoor Equipment', 'Bicycles'] },
    { id: 'toys', name: 'Toys', subCategories: ['Action Figures', 'Dolls', 'Educational Toys', 'Outdoor Toys', 'Puzzles', 'Building Sets', 'Board Games', 'Arts & Crafts', 'Remote Control Toys', 'Stuffed Animals', 'Electronic Toys', 'Learning Toys'] },
    { id: 'baby-products', name: 'Baby Products', subCategories: ['Diapers', 'Baby Food', 'Feeding Bottles', 'Baby Clothing', 'Health & Safety', 'Nursery Furniture', 'Baby Gear', 'Maternity Products', 'Toys', 'Bath Time', 'Sleeping Aids', 'Travel Gear'] },
    { id: 'digital-products', name: 'Digital Products', subCategories: ['E-books', 'Digital Music', 'Software', 'Online Courses', 'Video Games', 'Subscription Services', 'Digital Art', 'Templates', 'Stock Photos', 'Audio Files', 'Digital Magazines', 'Web Apps'] },
    { id: 'hobby', name: 'Hobby', subCategories: ['Model Building', 'Collecting', 'Gardening', 'Cooking', 'Crafting', 'Fishing', 'Photography', 'Travel', 'Bird Watching', 'Writing', 'Music', 'DIY Projects'] },
    { id: 'home-services', name: 'Home Services', subCategories: ['Cleaning', 'Maintenance', 'Landscaping', 'Pest Control', 'Handyman Services', 'Home Security', 'Plumbing', 'Electrical', 'HVAC', 'Painting', 'Roofing', 'Gutter Cleaning'] },
    { id: 'appliances', name: 'Appliances', subCategories: ['Refrigerators', 'Washing Machines', 'Dryers', 'Dishwashers', 'Ovens', 'Microwaves', 'Vacuum Cleaners', 'Air Conditioners', 'Heaters', 'Coffee Makers', 'Blenders', 'Toasters'] },
    { id: 'spas', name: 'Spas', subCategories: ['Massage', 'Facials', 'Body Treatments', 'Manicures', 'Pedicures', 'Saunas', 'Steam Rooms', 'Spa Packages', 'Spa Products', 'Wellness Programs', 'Aromatherapy', 'Hydrotherapy'] },
    { id: 'cooking', name: 'Cooking', subCategories: ['Cookware', 'Bakeware', 'Kitchen Tools', 'Small Appliances', 'Cookbooks', 'Cooking Classes', 'Recipe Ingredients', 'Food Storage', 'Cooking Gadgets', 'Cookware Sets', 'Kitchen Utensils', 'Cooking Equipment'] },
    { id: 'fine-dining', name: 'Fine Dining', subCategories: ['Restaurants', 'Gourmet Foods', 'Wine', 'Specialty Ingredients', 'Chef Services', 'Catering', 'Dining Experiences', 'Tableware', 'Cookbooks', 'Food & Wine Events', 'Gourmet Gift Baskets', 'High-End Dining Equipment'] },
    { id: 'specialty-products', name: 'Specialty Products', subCategories: ['Unique Gifts', 'Custom Products', 'Limited Editions', 'Exclusive Items', 'Artisan Goods', 'Handmade Items', 'Luxury Goods', 'One-of-a-Kind Items', 'Rare Finds', 'Specialty Food Items', 'Custom Apparel', 'Unique Home Décor'] },
    { id: 'heating-cooling', name: 'Heating & Cooling', subCategories: ['Air Conditioners', 'Heaters', 'Fans', 'Humidifiers', 'Dehumidifiers', 'Thermostats', 'Air Purifiers', 'HVAC Systems', 'Heating Pads', 'Cooling Vests', 'Portable Heaters', 'Evaporative Coolers'] },
    { id: 'event-planning', name: 'Event Planning', subCategories: ['Weddings', 'Corporate Events', 'Parties', 'Conferences', 'Expos', 'Trade Shows', 'Fundraisers', 'Social Gatherings', 'Ceremonies', 'Event Decor', 'Catering Services', 'Entertainment'] },
    { id: 'beauty-products', name: 'Beauty Products', subCategories: ['Skincare', 'Haircare', 'Makeup', 'Nail Care', 'Fragrances', 'Body Care', 'Men\'s Grooming', 'Cosmetics', 'Anti-Aging', 'Hair Styling', 'Beauty Tools', 'Personal Hygiene'] },
    { id: 'sustainable-products', name: 'Sustainable Products', subCategories: ['Eco-Friendly Goods', 'Organic Products', 'Reusable Items', 'Zero Waste Products', 'Sustainable Fashion', 'Green Technology', 'Biodegradable Products', 'Recycled Materials', 'Energy-Efficient Products', 'Sustainable Packaging', 'Eco-Friendly Home Goods', 'Green Cleaning Products'] }
  
  ];

  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products');
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const updateImageIndexes = () => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        products.forEach((product) => {
          if (product.images && product.images.length > 1) {
            const currentIndex = prevIndexes[product._id] || 0;
            newIndexes[product._id] = (currentIndex + 1) % product.images.length;
          }
        });
        return newIndexes;
      });
    };

    const intervalId = setInterval(updateImageIndexes, 4000);

    return () => clearInterval(intervalId);
  }, [products]);



  const handleProductClick = (product) => {
    setSelectedProduct(product);
    storeSearch(product.category , product.subCategory)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };



  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleShowMoreCategories = () => {
    setShowMoreCategories(!showMoreCategories);
  };

  const handleCategoryPageChange = (direction) => {
    setCurrentCategoryPage((prevPage) => {
      const newPage = prevPage + direction;
      if (newPage < 1) return 1;
      const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
      if (newPage > totalPages) return totalPages;
      return newPage;
    });
  };

  const filterAndSortProducts = () => {
    return products
      .filter((product) => {
        const matchesCategory = selectedCategory
          ? product.category.toLowerCase() === selectedCategory.toLowerCase()
          : true;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const aMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
        const bMatch = b.name.toLowerCase().includes(searchTerm.toLowerCase());
        return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
      });
  };
  

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const calculateDiscountedPrice = (product) => {
    const discountAmount = product.discount
      ? (product.price * product.discountpersentage) / 100
      : 0;
    const discountedPrice = product.discount ? product.price - discountAmount : product.price;
    return {
      discountedPrice: discountedPrice.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
    };
  };

  
  const filteredProducts = filterAndSortProducts();
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const currentProducts = isMobile
    ? filteredProducts
    : filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);


      // Get categories for the current page
  const startIdx = (currentCategoryPage - 1) * CATEGORIES_PER_PAGE;
  const endIdx = startIdx + CATEGORIES_PER_PAGE;
  const currentCategories = categories.slice(startIdx, endIdx);


  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      <header className="product-list-header">
        <input
          type="text"
          placeholder="Search for products or categories..."
          value={searchTerm}
          onChange={handleSearch}
          className="product-search"
        />
      </header>

          {/* Categories Section */}
          <div className="categories">

          <button className="category-btnn" onClick={() => handleCategoryPageChange(-1)} disabled={currentCategoryPage === 1}><AiFillCaretLeft/></button>
          <div className="category-container">
            <button
                className={`category-btn ${selectedCategory === " " ? 'active' : ''}`}
                onClick={() => handleCategoryClick(null)}
              >
                {"ALL"}
            </button>
          </div>

            {currentCategories.map((category) => (
              <div key={category.id} className="category-container">
                <button
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </button>
              </div>
            ))}

          <button className="category-btnn"  onClick={() => handleCategoryPageChange(1)} disabled={currentCategoryPage * CATEGORIES_PER_PAGE >= categories.length}><AiFillCaretRight/></button>
          </div>



      <div className="product-cards">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            const currentImageIndex = imageIndexes[product._id] || 0;
            const imageSrc = product.images ? product.images[currentImageIndex] : product.image;
            const { discountedPrice, discountAmount } = calculateDiscountedPrice(product);

            return (
              <div
                key={product._id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className="product-image-wrapper">
                  <img src={imageSrc} alt={product.name} className="product-image" />
                  {product.isNew && <span className="product-badge new-badge">New</span>}
                  {product.isOnSale && <span className="product-badge sale-badge">Sale</span>}
                </div>
                <h3>{product.name}</h3>
                {product.lable && <span className={`product-badge label-badge`}>{product.lable}</span>}
                <div className="product-prices">
                  {product.discount ? (
                    <>
                      <h4 className="old-price">
                        <s>Ksh {product.price.toFixed(2)}</s>
                      </h4>
                      <h4 className="new-price">Ksh {discountedPrice}</h4>
                      <p className="discount-amount">
                        Save Ksh {discountAmount} ({product.discountpersentage}% off)
                      </p>
                    </>
                  ) : (
                    <h4>Ksh {product.price.toFixed(2)}</h4>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No products found</p>
        )}
      </div>

      {!isMobile && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="Go to first page"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Go to last page"
          >
            Last
          </button>
        </div>


      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          show={isModalOpen}
          handleClose={closeModal}
        />
      )}
    </div>
  );
};

export default NewProductList;
