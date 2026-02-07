import cloudinary from "@/app/lib/cloudinary"

export const runtime = "nodejs"; 

export async function POST(req) {
  try {
    const { file, folderName } = await req.json();

    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: folderName, 
      resource_type: "image",
    });

    return new Response(
      JSON.stringify({ 
        url: uploadResponse.secure_url, 
        public_id: uploadResponse.public_id 
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
