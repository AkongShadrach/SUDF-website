import GalleryManager from "./GalleryManager";
import { createAdminServiceClient } from "../../../utils/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleryPartnersAdminPage() {
  const supabase=createAdminServiceClient();
  const {data,error}=await supabase.from("gallery_items").select("id,title,caption,image_url,storage_path,category,status,display_order,created_at").order("display_order",{ascending:true}).order("created_at",{ascending:false});
  return <GalleryManager initialItems={data??[]} loadError={error?.message??null}/>;
}
