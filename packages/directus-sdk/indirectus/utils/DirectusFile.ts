/**
 * The fit of the thumbnail while always preserving the aspect ratio.
 */
export enum Fit {
  /** Covers both width/height by cropping/clipping to fit */
  cover = "cover",
  /** Contain within both width/height using "letterboxing" as needed */
  contain = "contain",
  /** Resize to be as large as possible, ensuring dimensions are less than or equal to the requested width and height */
  inside = "inside",
  /** Resize to be as small as possible, ensuring dimensions are greater than or equal to the requested width and height */
  outside = "outside",
}

/**
 *  What file format to return the image in.
 */
export enum Format {
  /** Will try to format it in ´webp´ or ´avif´ if the browser supports it, otherwise it will fallback to ´jpg´. */
  auto = "auto",
  jpg = "jpg",
  png = "png",
  webp = "webp",
  tiff = "tiff",
}

/**
 * Represents the {@link https://docs.directus.io/reference/files.html#requesting-a-thumbnail | Custom Transformations} you can apply to an image.
 */
export interface TransformCustomProp {
  /** The width of the thumbnail in pixels.*/
  width: number;
  /** The height of the thumbnail in pixels. */
  height: number;
  /** The quality of the thumbnail (1 to 100). */
  quality: number;
  /** The fit of the thumbnail while always preserving the aspect ratio. */
  fit: Fit;
  /** The file format of the thumbnail. */
  format: Format;
  /** Disable image up-scaling. */
  withoutEnlargement: boolean;
  /** An array of sharp operations to apply to the image. {@link https://sharp.pixelplumbing.com/api-operation | Sharp API}*/
  transforms: [string, ...unknown[]][];
}

export interface Props {
  /** The current user's access token. */
  accessToken?: string | null;
  /** If the asset should be downloaded instead of rendered. */
  download?: boolean;
  /** Either a preset key or a custom transform object. */
  directusTransform?: Partial<TransformCustomProp> | string;
  /**
   * The filename of the image. If the filename is not provided, the image will be downloaded with the asset's id as filename.
   * {@link https://docs.directus.io/reference/files.html#accessing-a-file| SEO}
   */
  filename?: string;
}
