import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key is missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getAllProducts = async (callback) => {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        throw new Error(error.message);
    }

    callback(data);
};

export const createProduct = async (productData) => {
    const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

// Auction functions
export const createAuction = async (auctionData) => {
    const { data, error } = await supabase
        .from('auction_items')
        .insert([{
            ...auctionData,
            current_bid: auctionData.minimum_bid,
            status: 'active'
        }])
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

export const getAllActiveAuctions = async () => {
    const { data, error } = await supabase
        .from('auction_items')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getAuctionById = async (auctionId) => {
    const { data, error } = await supabase
        .from('auction_items')
        .select('*')
        .eq('id', auctionId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const placeBid = async (auctionId, bidData) => {
    // First, get current auction
    const auction = await getAuctionById(auctionId);

    if (bidData.bid_amount <= auction.current_bid) {
        throw new Error('Bid must be higher than current bid');
    }

    // Insert bid
    const { error: bidError } = await supabase
        .from('bids')
        .insert([{
            auction_id: auctionId,
            ...bidData
        }]);

    if (bidError) {
        throw new Error(bidError.message);
    }

    // Update auction current_bid
    const { error: updateError } = await supabase
        .from('auction_items')
        .update({ current_bid: bidData.bid_amount })
        .eq('id', auctionId);

    if (updateError) {
        throw new Error(updateError.message);
    }

    return { success: true };
};

export const getAuctionBids = async (auctionId) => {
    const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('auction_id', auctionId)
        .order('bid_time', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getAuctionsByUser = async (userEmail) => {
    const { data, error } = await supabase
        .from('auction_items')
        .select(`
            *,
            bids (count)
        `)
        .eq('seller_id', userEmail)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    // Transform data to include bid count
    const transformedData = data.map(auction => ({
        ...auction,
        bid_count: auction.bids?.[0]?.count || 0
    }));

    return transformedData;
};

export const getBidsByUser = async (userEmail) => {
    const { data, error } = await supabase
        .from('bids')
        .select(`
            *,
            auction_items (
                id,
                name,
                brand,
                image,
                current_bid,
                start_time,
                duration,
                status
            )
        `)
        .eq('bidder_id', userEmail)
        .order('bid_time', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    // Return empty array if no data
    if (!data || data.length === 0) {
        return [];
    }

    // Transform data to include auction details at top level
    const transformedData = data.map(bid => {
        const auctionItem = bid.auction_items;
        // Calculate end_time from start_time and duration
        let endTime = null;
        if (auctionItem?.start_time && auctionItem?.duration) {
            const startDate = new Date(auctionItem.start_time);
            endTime = new Date(startDate.getTime() + auctionItem.duration * 24 * 60 * 60 * 1000).toISOString();
        }

        return {
            auction_id: bid.auction_id,
            your_bid: bid.bid_amount,
            bid_time: bid.bid_time,
            auction_title: auctionItem?.name,
            auction_brand: auctionItem?.brand,
            auction_image: auctionItem?.image,
            current_bid: auctionItem?.current_bid,
            end_time: endTime,
            has_ended: auctionItem?.status !== 'active',
            is_winning: bid.bid_amount >= (auctionItem?.current_bid || 0)
        };
    });

    return transformedData;
};

// Product management functions
export const getProductsBySeller = async (sellerId) => {
    try {
        console.log('Querying products for seller_id:', sellerId);

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .ilike('seller_id', sellerId);

        console.log('Query result - data:', data, 'error:', error);

        if (error) {
            // If seller_id column doesn't exist, return empty array
            if (error.message.includes('seller_id') || error.code === '42703') {
                console.warn('seller_id column does not exist in products table. Please add it with: ALTER TABLE products ADD COLUMN seller_id TEXT;');
                return [];
            }
            throw new Error(error.message);
        }

        return data || [];
    } catch (err) {
        console.error('Error fetching products by seller:', err);
        return [];
    }
};

export const updateProduct = async (productId, productData) => {
    const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

export const deleteProduct = async (productId) => {
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    return data[0];
};

// Order management functions
export const createOrder = async (orderData) => {
    const { orderItems, ...orderDetails } = orderData;

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
            ...orderDetails,
            order_number: orderNumber,
        }])
        .select()
        .single();

    if (orderError) {
        throw new Error(orderError.message);
    }

    // Create order items
    const itemsToInsert = orderItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        product_brand: item.brand,
        quantity: item.quantity,
        price: item.price,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

    if (itemsError) {
        throw new Error(itemsError.message);
    }

    return order;
};

export const getOrdersByUser = async (userEmail) => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                id,
                product_name,
                product_image,
                product_brand,
                quantity,
                price
            )
        `)
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getOrderById = async (orderId) => {
    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                id,
                product_id,
                product_name,
                product_image,
                product_brand,
                quantity,
                price
            )
        `)
        .eq('id', orderId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Address management functions
export const getAddressesByUser = async (userEmail) => {
    const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_email', userEmail)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const createAddress = async (addressData) => {
    // If this address is set as default, unset all other default addresses for this user
    if (addressData.is_default) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_email', addressData.user_email);
    }

    const { data, error } = await supabase
        .from('addresses')
        .insert([addressData])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const updateAddress = async (addressId, addressData) => {
    // If this address is being set as default, unset all other default addresses for this user
    if (addressData.is_default && addressData.user_email) {
        await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_email', addressData.user_email)
            .neq('id', addressId);
    }

    const { data, error } = await supabase
        .from('addresses')
        .update(addressData)
        .eq('id', addressId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const deleteAddress = async (addressId) => {
    const { data, error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const setDefaultAddress = async (addressId, userEmail) => {
    // First, unset all default addresses for this user
    await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_email', userEmail);

    // Then set this address as default
    const { data, error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

