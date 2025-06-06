/**
 * Hook personalizado para manejo de localStorage
 * Persistencia offline para usuarios no registrados
 */

import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
    // Estado para almacenar el valor
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Obtener del localStorage
            const item = window.localStorage.getItem(`economilenial_${key}`);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    // Función para actualizar el estado y localStorage
    const setValue = (value) => {
        try {
            // Permitir que value sea una función como en useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            
            // Guardar en localStorage
            window.localStorage.setItem(`economilenial_${key}`, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
