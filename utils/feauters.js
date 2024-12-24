export function getPublicIdFromUrl(photoUrl) {
    const publicIdMatch = /\/v\d+\/(.*\/)?(.+?)\.[a-zA-Z]+(#.*)?$/.exec(photoUrl);
    return publicIdMatch ? publicIdMatch[2] : '';
}