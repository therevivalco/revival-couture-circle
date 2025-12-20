import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key is missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// ... [keeping all existing functions - products, auctions, orders, addresses] ...

// Rental management functions
export const createRentalItem = async (rentalData) => {
    const { data, error } = await supabase
        .from('rental_items')
        .insert([rentalData])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getAllRentalItems = async () => {
    const { data, error } = await supabase
        .from('rental_items')
        .select('*')
        .eq('status', 'available')
        .gte('available_till', new Date().toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getRentalItemById = async (rentalId) => {
    const { data, error } = await supabase
        .from('rental_items')
        .select('*')
        .eq('id', rentalId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getRentalsByOwner = async (ownerEmail) => {
    const { data, error } = await supabase
        .from('rental_items')
        .select('*')
        .eq('owner_email', ownerEmail)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const checkRentalAvailability = async (rentalId, startDate, endDate) => {
    // First, get the rental item details
    const rentalItem = await getRentalItemById(rentalId);

    if (!rentalItem) {
        return {
            available: false,
            message: 'Rental item not found'
        };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const availableFrom = new Date(rentalItem.available_from);
    const availableTill = new Date(rentalItem.available_till);

    // Calculate rental days
    const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Check if dates are within availability window
    if (start < availableFrom || end > availableTill) {
        return {
            available: false,
            message: `Item is only available from ${availableFrom.toLocaleDateString()} to ${availableTill.toLocaleDateString()}`
        };
    }

    // Check minimum rental days
    if (rentalDays < rentalItem.minimum_rental_days) {
        return {
            available: false,
            message: `Minimum rental period is ${rentalItem.minimum_rental_days} days`
        };
    }

    // Check maximum rental days
    if (rentalItem.maximum_rental_days && rentalDays > rentalItem.maximum_rental_days) {
        return {
            available: false,
            message: `Maximum rental period is ${rentalItem.maximum_rental_days} days. Can't rent for this long.`
        };
    }

    // Check if there are any overlapping bookings
    const { data, error } = await supabase
        .from('rental_availability')
        .select('*')
        .eq('rental_item_id', rentalId)
        .or(`and(blocked_from.lte.${endDate},blocked_till.gte.${startDate})`);

    if (error) {
        throw new Error(error.message);
    }

    // If data exists, dates are not available
    if (data && data.length > 0) {
        return {
            available: false,
            message: 'Selected dates are already booked',
            conflicts: data
        };
    }

    return {
        available: true,
        message: 'Available for selected dates'
    };
};

export const createRentalBooking = async (bookingData) => {
    // First check availability
    const availability = await checkRentalAvailability(
        bookingData.rental_item_id,
        bookingData.start_date,
        bookingData.end_date
    );

    if (!availability.available) {
        throw new Error('Selected dates are not available');
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
        .from('rental_bookings')
        .insert([bookingData])
        .select()
        .single();

    if (bookingError) {
        throw new Error(bookingError.message);
    }

    // Block the dates
    const { error: availabilityError } = await supabase
        .from('rental_availability')
        .insert([{
            rental_item_id: bookingData.rental_item_id,
            booking_id: booking.id,
            blocked_from: bookingData.start_date,
            blocked_till: bookingData.end_date,
            reason: 'booked'
        }]);

    if (availabilityError) {
        throw new Error(availabilityError.message);
    }

    // Update rental item status
    await supabase
        .from('rental_items')
        .update({ status: 'rented' })
        .eq('id', bookingData.rental_item_id);

    return booking;
};

export const getBookingsByRenter = async (renterEmail) => {
    const { data, error } = await supabase
        .from('rental_bookings')
        .select(`
            *,
            rental_items (
                id,
                name,
                brand,
                image,
                owner_email
            )
        `)
        .eq('renter_email', renterEmail)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const getBookingsForRentalItem = async (rentalItemId) => {
    const { data, error } = await supabase
        .from('rental_bookings')
        .select('*')
        .eq('rental_item_id', rentalItemId)
        .order('start_date', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const updateBookingStatus = async (bookingId, status, updates = {}) => {
    const { data, error } = await supabase
        .from('rental_bookings')
        .update({ status, ...updates, updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    // If booking is completed or cancelled, release the dates and update item status
    if (status === 'completed' || status === 'cancelled') {
        // Delete the availability block
        await supabase
            .from('rental_availability')
            .delete()
            .eq('booking_id', bookingId);

        // Get the rental item and check if there are other active bookings
        const booking = await supabase
            .from('rental_bookings')
            .select('rental_item_id')
            .eq('id', bookingId)
            .single();

        if (booking.data) {
            const { data: activeBookings } = await supabase
                .from('rental_bookings')
                .select('id')
                .eq('rental_item_id', booking.data.rental_item_id)
                .in('status', ['confirmed', 'active']);

            // If no active bookings, mark item as available
            if (!activeBookings || activeBookings.length === 0) {
                await supabase
                    .from('rental_items')
                    .update({ status: 'available' })
                    .eq('id', booking.data.rental_item_id);
            }
        }
    }

    return data;
};

export const updateRentalItem = async (rentalId, updates) => {
    const { data, error } = await supabase
        .from('rental_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', rentalId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};

export const deleteRentalItem = async (rentalId) => {
    // Check if there are any active bookings
    const { data: activeBookings } = await supabase
        .from('rental_bookings')
        .select('id')
        .eq('rental_item_id', rentalId)
        .in('status', ['confirmed', 'active']);

    if (activeBookings && activeBookings.length > 0) {
        throw new Error('Cannot delete rental item with active bookings');
    }

    const { data, error } = await supabase
        .from('rental_items')
        .delete()
        .eq('id', rentalId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};
