// Utility function for sharing or copying a URL
export const onShare = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: url,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('Link copied to clipboard');
        })
        .catch((error) => {
          console.error('Error copying link', error);
        });
    }
  };
  