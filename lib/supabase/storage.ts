import { supabase } from './client';

const BUCKET_NAME = 'swimmer-photos';

/**
 * Upload a swimmer photo to Supabase Storage
 * @param file - The image file to upload
 * @param swimmerId - The swimmer's ID (used for file naming)
 * @returns The public URL of the uploaded photo or error
 */
export async function uploadSwimmerPhoto(
    file: File,
    swimmerId: string
): Promise<{ data: string | null; error: Error | null }> {
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            return {
                data: null,
                error: new Error('Sadece resim dosyaları yüklenebilir'),
            };
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return {
                data: null,
                error: new Error('Dosya boyutu 5MB\'dan küçük olmalıdır'),
            };
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${swimmerId}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload file
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (uploadError) {
            return {
                data: null,
                error: new Error(uploadError.message),
            };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return {
            data: urlData.publicUrl,
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error : new Error('Fotoğraf yüklenirken bir hata oluştu'),
        };
    }
}

/**
 * Delete a swimmer photo from Supabase Storage
 * @param photoUrl - The public URL of the photo to delete
 * @returns Success status or error
 */
export async function deleteSwimmerPhoto(
    photoUrl: string
): Promise<{ error: Error | null }> {
    try {
        // Extract file path from URL
        const url = new URL(photoUrl);
        const pathParts = url.pathname.split('/');
        const filePath = pathParts[pathParts.length - 1];

        const { error: deleteError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (deleteError) {
            return {
                error: new Error(deleteError.message),
            };
        }

        return { error: null };
    } catch (error) {
        return {
            error: error instanceof Error ? error : new Error('Fotoğraf silinirken bir hata oluştu'),
        };
    }
}

/**
 * Get placeholder image URL based on gender
 * @param gender - Swimmer's gender
 * @returns Data URL for placeholder image
 */
export function getPlaceholderImage(gender: 'Erkek' | 'Kadın'): string {
    // Simple SVG placeholder with gender-based colors
    const color = gender === 'Erkek' ? '#3B82F6' : '#EC4899'; // blue or pink
    const bgColor = gender === 'Erkek' ? '#DBEAFE' : '#FCE7F3';

    const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${bgColor}"/>
      <circle cx="100" cy="80" r="35" fill="${color}" opacity="0.3"/>
      <path d="M 60 140 Q 100 110, 140 140" fill="${color}" opacity="0.3" stroke="${color}" stroke-width="2"/>
    </svg>
  `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
