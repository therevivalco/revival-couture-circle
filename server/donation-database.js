import { supabase } from './database.js';

// Generate unique coupon code
export const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'DONATE';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Create donation
export const createDonation = async (donationData) => {
    const { data: donation, error } = await supabase
        .from('donations')
        .insert([{
            ...donationData,
            status: 'approved' // Auto-approve all donations
        }])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    // Generate coupon for approved donation
    const couponCode = generateCouponCode();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 90); // Valid for 90 days

    const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .insert([{
            code: couponCode,
            user_email: donationData.user_email,
            discount_percentage: 10,
            valid_until: validUntil.toISOString(),
            donation_id: donation.id
        }])
        .select()
        .single();

    if (couponError) {
        throw new Error(couponError.message);
    }

    // Update donation with coupon code
    await supabase
        .from('donations')
        .update({ coupon_code: couponCode })
        .eq('id', donation.id);

    return { ...donation, coupon_code: couponCode };
};

// Get user donations
export const getUserDonations = async (userEmail) => {
    const { data, error } = await supabase
        .from('donations')
        .select(`
            *,
            addresses (
                id,
                address_line1,
                address_line2,
                city,
                state,
                pincode
            )
        `)
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Get user coupons
export const getCouponsByUser = async (userEmail) => {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

// Validate coupon
export const validateCoupon = async (code, userEmail) => {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('user_email', userEmail)
        .eq('used', false)
        .single();

    if (error || !data) {
        return { valid: false, message: 'Invalid or expired coupon' };
    }

    const now = new Date();
    const validUntil = new Date(data.valid_until);

    if (now > validUntil) {
        return { valid: false, message: 'Coupon has expired' };
    }

    return { valid: true, coupon: data };
};

// Mark coupon as used
export const useCoupon = async (couponId) => {
    const { data, error } = await supabase
        .from('coupons')
        .update({ used: true })
        .eq('id', couponId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};
