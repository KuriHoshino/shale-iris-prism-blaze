import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { previewPathRewrite } from "@/lib/preview-path-prefix";
import { routeTree } from "./routeTree.gen";

const baseUrl = import.meta.env.BASE_URL
const basepath =
  !baseUrl || baseUrl === "/" || baseUrl === "./" ? undefined : baseUrl.replace(/\/$/, "")

export function getRouter() {
  return createRouter({
    routeTree,
    basepath,
    rewrite: previewPathRewrite(),
    defaultErrorComponent: AppErrorComponent,
  });
}
