export const chatLobbyDate = (date: string): string => {
  const currentTime = new Date();
  const messageTime = new Date(date);
  const diff = +currentTime - +messageTime;

  const minutes = Math.floor(diff / 1000 / 60);
  if (minutes === 0) return 'just now';
  if (minutes === 1) return minutes + ' minute ago';
  if (minutes > 1 && minutes < 60) {
    return minutes + ' minutes ago';
  }

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return hours + ' hour ago';
  if (hours > 1 && hours < 24) return hours + ' hours ago';

  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';

  const thisYear = currentTime.getFullYear(); // 2024
  const messageYear = messageTime.getFullYear();
  // somehow month -1
  // const messageMonth = messageTime.getMonth() + 1;
  // https://stackoverflow.com/questions/2388115/get-locale-short-date-format-using-javascript
  if (thisYear === messageYear)
    return messageTime.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit',
      // omitted = not show
    });
  return messageTime.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const chatDate = (date: string): string => {
  const currentTime = new Date();
  const messageTime = new Date(date);
  // Mon Sep 30 2024
  const currentDate = currentTime.toDateString();
  const messageDate = messageTime.toDateString();
  if (currentDate === messageDate) return messageTime.toLocaleTimeString();
  return messageTime.toLocaleString();
};
