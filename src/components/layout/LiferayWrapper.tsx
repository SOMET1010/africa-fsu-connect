
import { ReactNode, useEffect } from 'react';
import { useLiferay } from '@/LiferayApp';

interface LiferayWrapperProps {
  children: ReactNode;
}

export const LiferayWrapper = ({ children }: LiferayWrapperProps) => {
  const { namespace } = useLiferay();

  useEffect(() => {
    // Ajouter des classes CSS spécifiques pour éviter les conflits
    const portletElement = document.querySelector(`[id*="${namespace}"]`);
    if (portletElement) {
      portletElement.classList.add('react-sutel-portlet');
      portletElement.classList.add('sutel-isolated');
    }

    // Préfixer tous les styles pour éviter les conflits avec Liferay
    const style = document.createElement('style');
    style.textContent = `
      .react-sutel-portlet .min-h-screen {
        min-height: auto !important;
      }
      
      .react-sutel-portlet * {
        box-sizing: border-box;
      }
      
      .sutel-isolated {
        isolation: isolate;
      }
      
      /* Réinitialiser les styles Liferay qui pourraient interférer */
      .react-sutel-portlet .btn {
        all: unset;
      }
      
      .react-sutel-portlet .form-control {
        all: unset;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [namespace]);

  return (
    <div className="react-sutel-portlet-content">
      {children}
    </div>
  );
};
