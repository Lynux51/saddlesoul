import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://vtcrkyfcoxcyepejnzso.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0Y3JreWZjb3hjeWVwZWpuenNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMjA0MDUsImV4cCI6MjEwODY5NjQwNX0.hgUlwH4qltilCyqZ18rKsWXn221DkPMVFpzchNkM2aI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BUCKET = "images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function uploadPhotos(files) {
    const urls = [];

    for (const file of files) {
        if (!file.type.startsWith("image/")) {
            throw new Error(`${file.name} is not an image`);
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`${file.name} is bigger than 5 MB`);
        }

        const extension = file.name.split(".").pop();
        const path = `horses/${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage.from(BUCKET).upload(path, file);
        if (error) throw error;

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        urls.push(data.publicUrl);
    }

    return urls;
}

export async function addListing(listing, files) {
    const photoUrls = await uploadPhotos(files);

    const { error } = await supabase.from("listings").insert({
        name: listing.name,
        breed: listing.breed,
        age: Number(listing.age),
        height: Number(listing.height),
        weight: Number(listing.weight),
        sire: listing.sire,
        dam: listing.dam,
        photos: photoUrls
    });

    if (error) throw error;
}

export async function getListings() {
    const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}