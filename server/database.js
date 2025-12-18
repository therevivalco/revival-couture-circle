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
        .insert([auctionData])
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

export const getAuctionById = async (id) => {
    const { data, error } = await supabase
        .from('auction_items')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const placeBid = async (auctionId, bidData) => {
    // Start a transaction-like operation
    // First, insert the bid
    const { data: bidResult, error: bidError } = await supabase
        .from('bids')
        .insert([bidData])
        .select();

    if (bidError) {
        throw new Error(bidError.message);
    }

    // Then update the auction's current_bid
    const { data: auctionResult, error: auctionError } = await supabase
        .from('auction_items')
        .update({ current_bid: bidData.bid_amount })
        .eq('id', auctionId)
        .select();

    if (auctionError) {
        throw new Error(auctionError.message);
    }

    return { bid: bidResult[0], auction: auctionResult[0] };
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
