import { useEffect } from "react";

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (lock) {
      const scrollY = window.scrollY;
      
      if (document.body.style.position !== "fixed") {
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
      }
    }

    return () => {
      if (lock) {
        const hasOtherModals = 
          document.querySelector('.post-modal-overlay') ||
          document.querySelector('.confirm-modal-overlay') ||
          document.querySelector('.alert-modal-overlay');
        
        if (!hasOtherModals) {
          const scrollY = document.body.style.top;
          const scrollPosition = scrollY ? parseInt(scrollY) * -1 : 0;
          
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.width = "";
          
          if (scrollPosition) {
            window.scrollTo(0, scrollPosition);
          }
        }
      }
    };
  }, [lock]);
}

