// Auction utility functions

/**
 * Calculate time remaining for an auction
 * @param startTime - ISO timestamp when auction started
 * @param duration - Duration in hours
 * @returns Milliseconds remaining, or 0 if expired
 */
export const calculateTimeRemaining = (startTime: string, duration: number): number => {
    const start = new Date(startTime).getTime();
    const end = start + duration * 60 * 60 * 1000; // Convert hours to milliseconds
    const now = Date.now();
    const remaining = end - now;
    return remaining > 0 ? remaining : 0;
};

/**
 * Format milliseconds into human-readable time string
 * @param milliseconds - Time in milliseconds
 * @returns Formatted string like "2d 5h 30m" or "5h 30m 15s"
 */
export const formatTimeRemaining = (milliseconds: number): string => {
    if (milliseconds <= 0) return "Ended";

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        return `${days}d ${remainingHours}h ${remainingMinutes}m`;
    } else if (hours > 0) {
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;
        return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    } else {
        return `${seconds}s`;
    }
};

/**
 * Check if auction is still active
 * @param startTime - ISO timestamp when auction started
 * @param duration - Duration in hours
 * @returns true if auction is still active
 */
export const isAuctionActive = (startTime: string, duration: number): boolean => {
    return calculateTimeRemaining(startTime, duration) > 0;
};

/**
 * Check if auction is ending soon (less than 1 hour remaining)
 * @param timeRemaining - Time remaining in milliseconds
 * @returns true if less than 1 hour remaining
 */
export const isAuctionEndingSoon = (timeRemaining: number): boolean => {
    const oneHour = 60 * 60 * 1000;
    return timeRemaining > 0 && timeRemaining < oneHour;
};

/**
 * Get the end time of an auction
 * @param startTime - ISO timestamp when auction started
 * @param duration - Duration in hours
 * @returns ISO timestamp of when auction ends
 */
export const getAuctionEndTime = (startTime: string, duration: number): string => {
    const start = new Date(startTime).getTime();
    const end = start + duration * 60 * 60 * 1000;
    return new Date(end).toISOString();
};
