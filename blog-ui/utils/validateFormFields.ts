// import { z } from 'zod';

export const validateBlogInput = (
    title: string,
    content: string,
    setUserErrors: React.Dispatch<React.SetStateAction<string[]>>
): boolean => {
    let errors: string[] = [];

    if (!title.trim()) {
        errors.push("Title is required!");
    }

    if (!content.trim()) {
        errors.push("Content is required!");
    }

    if (errors.length > 0) {
        setUserErrors(prev => {
            // merge without duplicates
            const merged = new Set([...prev, ...errors]);
            return Array.from(merged);
        });
        return false;
    }
    return true;
}