import { useEffect } from 'react';

export const useDocumentTitle = (title: string): void => {
  useEffect(() => {
    const oldTitle = document.title;

    if (title) {
      document.title = title;
    }

    return () => {
      document.title = oldTitle;
    };
  }, [title]);
};
