// extract epoch timestamp to ready-to-use string format  (output eg. `${nbr} day${"" : "s"} ago`)
export default function getReadableTimeAgo(timestamp) {
    const now = Math.floor(Date.now() / 1000);
    const rawSeconds = now - timestamp;

    if (rawSeconds < 60)
        return `${rawSeconds} second${rawSeconds === 1 ? "" : "s"} ago`;

    if (rawSeconds < 3600) {
        const minutes = Math.floor(rawSeconds / 60);
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    if (rawSeconds < 86400) {
        const hours = Math.floor(rawSeconds / 3600);
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(rawSeconds / 86400);
    return `${days} day${days === 1 ? "" : "s"} ago`;
};
