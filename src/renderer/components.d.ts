import MIcon from "@/components/MIcon/MIcon.vue";
import CommonHeader from "@/components/CommonHeader/CommonHeader.vue";


declare module "vue" {
  export interface GlobalComponents {
    MIcon: typeof MIcon;
    CommonHeader: typeof CommonHeader;
  }
}
