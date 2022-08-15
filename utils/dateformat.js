const convertToFullDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" });
}

const convertToXTimeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const mins = Math.floor(seconds / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} ${years === 1 ? "yr" : "yrs"} ago`;
  }
  if (months > 0) {
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  if (days > 0) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }
  if (hours > 0) {
    return `${hours} ${hours === 1 ? "hr" : "hrs"} ago`;
  }
  if (mins > 0) {
    return `${mins} ${mins === 1 ? "min" : "mins"} ago`;
  }
  return "just now";
}

export { convertToFullDate as convertToAbsoluteDate, convertToXTimeAgo }